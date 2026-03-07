import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";

const OrderSuccess = () => {

  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const showToast = useToast();

  const [status, setStatus] = useState("LOADING");
  const [paymentStarted, setPaymentStarted] = useState(false);

  useEffect(() => {

    let interval;
    let cancelled = false;

    const checkStatus = async () => {
      try {

        const res = await fetch(`/api/orders/${orderId}/status?email=${encodeURIComponent(email || "")}`);
        const data = await res.json();

        if (cancelled) return;

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

    return () => {
      cancelled = true;
      clearInterval(interval);
    };

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
        showToast("Failed to initiate payment");
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
      showToast("Payment initiation failed");
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

        <h2 style={{ 
          color: status === "PAID" ? "#2f6f4e" : "#e67e22", 
          marginBottom: "10px" 
        }}>
          {status === "PAID" ? "Order Confirmed 🎉" : "Almost There! 💳"}
        </h2>

        <p style={{ opacity: 0.7, marginBottom: "8px" }}>Your Order ID</p>
        
        {/* --- FIXED: Classy, uniform Monospace styling for Order ID --- */}
        <div style={{ marginBottom: "30px" }}>
          <span style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "2px",
            background: "#f0f8f5",
            color: "#2f6f4e",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px dashed #2f6f4e",
            display: "inline-block"
          }}>
            {orderId}
          </span>
        </div>

        {status === "PENDING" && !paymentStarted && (
          <div style={{ 
            background: "#fff3cd", 
            color: "#856404", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "25px", 
            fontSize: "14px", 
            fontWeight: "500",
            border: "1px solid #ffeeba"
          }}>
            Your items are reserved. Please complete your payment to finalize your order.
          </div>
        )}

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
              fontWeight: "500",
              fontSize: "16px",
              width: "100%",
              boxShadow: "0 4px 12px rgba(47,111,78,0.3)"
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

            <Link to={`/order/${orderId}?email=${encodeURIComponent(email || "")}`}>
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