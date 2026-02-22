import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function OrderTracking() {

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Order not found");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!order) {
    return (
      <div style={{ padding: "60px 20px" }}>
        <h2>Loading order...</h2>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f7f6", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        padding: "40px",
        borderRadius: "14px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
      }}>

        <h1 style={{
          color: "#2f6f4e",
          marginBottom: "30px",
          fontWeight: "600"
        }}>
          Order Tracking
        </h1>

        <div style={{ marginBottom: "25px" }}>
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Customer:</strong> {order.customer_name}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
        </div>

        <hr style={{ margin: "25px 0" }} />

        <div style={{ marginBottom: "20px" }}>
          <strong>Payment Status:</strong>
          <span style={{
            marginLeft: "10px",
            padding: "4px 10px",
            borderRadius: "20px",
            background: order.payment_status === "PAID" ? "#e6f4ec" : "#fff3cd",
            color: order.payment_status === "PAID" ? "green" : "#856404",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            {order.payment_status}
          </span>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong>Order Status:</strong>
          <span style={{
            marginLeft: "10px",
            fontWeight: "600"
          }}>
            {order.order_status}
          </span>
        </div>

        <hr style={{ margin: "25px 0" }} />

        <p style={{ opacity: 0.7 }}>
          Ordered On: {new Date(order.created_at).toLocaleString()}
        </p>

      </div>
    </div>
  );
}