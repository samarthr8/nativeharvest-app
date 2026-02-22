import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderSuccess = () => {

  const { orderId } = useParams();

  const [status, setStatus] = useState("LOADING");
  const [paymentStarted, setPaymentStarted] = useState(false);

  useEffect(() => {

    let interval;

    const checkStatus = async () => {
      try {

        const res = await fetch(`/api/orders/${orderId}/status`);
        const data = await res.json();

        setStatus(data.payment_status);

        if (data.payment_status === "PAID") {
          clearInterval(interval);
        }

      } catch (err) {
        console.error("Status fetch failed", err);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);

  }, [orderId]);

  const startPayment = async () => {

    try {

      setPaymentStarted(true);

      const payRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });

      const payData = await payRes.json();

      if (!payData.razorpay_order_id) {
        alert("Failed to initiate payment");
        setPaymentStarted(false);
        return;
      }

      const options = {
        key: payData.key,
        amount: payData.amount_paise,
        currency: payData.currency,
        name: "NativeHarvest",
        description: "Farm Fresh Products",
        order_id: payData.razorpay_order_id,
        handler: function () {},
        modal: {
          ondismiss: function () {
            setPaymentStarted(false);
          }
        },
        theme: { color: "#2f6f4e" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
      setPaymentStarted(false);
    }
  };

  return (
    <div style={{ background: "#f5f7f6", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        background: "white",
        padding: "40px",
        borderRadius: "14px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        textAlign: "center"
      }}>

        <h2 style={{ color: "#2f6f4e", marginBottom: "10px" }}>
          Order Created 🎉
        </h2>

        <p style={{ opacity: 0.7 }}>Your Order ID</p>
        <h3 style={{ marginBottom: "25px" }}>{orderId}</h3>

        {status === "PENDING" && !paymentStarted && (
          <button
            onClick={startPayment}
            style={{
              background: "#2f6f4e",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Complete Payment
          </button>
        )}

        {paymentStarted && status !== "PAID" && (
          <p style={{ marginTop: "20px" }}>
            🔄 Waiting for payment confirmation...
          </p>
        )}

        {status === "PAID" && (
          <div style={{ marginTop: "20px" }}>
            <p style={{
              color: "green",
              fontWeight: "600",
              fontSize: "18px"
            }}>
              ✅ Payment Confirmed!
            </p>

            <p style={{ marginTop: "10px", opacity: 0.7 }}>
              Your order is now being prepared in small batches.
            </p>

            <Link to={`/order/${orderId}`}>
              <button style={{
                marginTop: "20px",
                padding: "12px 24px",
                background: "#2f6f4e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}>
                Track Your Order
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderSuccess;
