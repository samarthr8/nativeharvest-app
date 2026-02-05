import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderSuccess = () => {

  const { orderId } = useParams();

  const [status, setStatus] = useState("LOADING");
  const [paymentStarted, setPaymentStarted] = useState(false);

  /**
   * Poll payment status
   */
  useEffect(() => {

    const checkStatus = async () => {
      try {

        const res = await fetch(`/api/orders/${orderId}/status`);
        const data = await res.json();

        setStatus(data.payment_status);

        // Stop polling once paid
        if (data.payment_status === "PAID") {
          clearInterval(interval);
        }

      } catch (err) {
        console.error("Status fetch failed", err);
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);

  }, [orderId]);


  /**
   * Start Razorpay payment
   */
  const startPayment = async () => {

    try {

      setPaymentStarted(true);

      const payRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_id: orderId
        })
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

        handler: function () {
          // Do nothing
          // Webhook is the source of truth
        },

        modal: {
          ondismiss: function () {
            setPaymentStarted(false);
          }
        },

        theme: {
          color: "#2f6f4e"
        }
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
    <div style={{ padding: "40px" }}>

      <h2>Order Created 🎉</h2>
      <p>Your Order ID:</p>
      <h3>{orderId}</h3>

      {/* PAYMENT NOT STARTED */}
      {status === "PENDING" && !paymentStarted && (
        <button
          onClick={startPayment}
          style={{ marginTop: "20px" }}
        >
          Pay Now
        </button>
      )}

      {/* WAITING */}
      {paymentStarted && status !== "PAID" && (
        <p style={{ marginTop: "20px" }}>
          🔄 Waiting for payment confirmation...
        </p>
      )}

      {/* SUCCESS */}
      {status === "PAID" && (
        <div style={{ marginTop: "20px" }}>

          <p style={{
            color: "green",
            fontWeight: "bold",
            fontSize: "18px"
          }}>
            ✅ Payment Confirmed! Your order is being prepared.
          </p>

          {/* ⭐ TRACK BUTTON ADDED HERE */}
          <a href={`/order/${orderId}`}>
            <button style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer"
            }}>
              Track Your Order
            </button>
          </a>

        </div>
      )}

    </div>
  );
};

export default OrderSuccess;
