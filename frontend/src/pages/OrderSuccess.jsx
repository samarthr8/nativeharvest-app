import { useParams } from "react-router-dom";
import { useState } from "react";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const startPayment = async () => {
    try {
      setPaymentStarted(true);

      const payRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      });

      const payData = await payRes.json();

      const options = {
        key: payData.key,
        amount: payData.amount_paise,
        currency: payData.currency,
        name: "NativeHarvest",
        description: "Farm Fresh Products",
        order_id: payData.razorpay_order_id,

        handler: function () {
          // ⚠️ DO NOT mark paid here
          setPaymentDone(true);
        },

        modal: {
          ondismiss: function () {
            // User closed popup manually
            console.log("Razorpay popup closed");
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
    <div>
      <h2>Order Placed Successfully 🎉</h2>
      <p>Your Order ID:</p>
      <h3>{orderId}</h3>

      {!paymentStarted && (
        <button onClick={startPayment} style={{ marginTop: "20px" }}>
          Pay Now
        </button>
      )}

      {paymentStarted && !paymentDone && (
        <p style={{ marginTop: "20px" }}>
          🔄 Payment in progress… Please complete payment in the popup.
        </p>
      )}

      {paymentDone && (
        <p style={{ marginTop: "20px", color: "green" }}>
          ✅ Payment successful. We are verifying your payment.
        </p>
      )}
    </div>
  );
};

export default OrderSuccess;
