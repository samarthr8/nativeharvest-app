import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderSuccess = () => {
  const { orderId } = useParams();

  const [status, setStatus] = useState("CHECKING");

  useEffect(() => {

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        const data = await res.json();

        setStatus(data.payment_status);

        // stop polling if paid
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

  return (
    <div>
      <h2>Order Created 🎉</h2>
      <p>Your Order ID:</p>
      <h3>{orderId}</h3>

      {status === "CHECKING" && (
        <p>🔄 Checking payment status...</p>
      )}

      {status === "PENDING" && (
        <p>🕒 Waiting for payment confirmation...</p>
      )}

      {status === "PAID" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ Payment Confirmed! Your order is being prepared.
        </p>
      )}

    </div>
  );
};

export default OrderSuccess;
