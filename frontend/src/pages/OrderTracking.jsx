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
    return <h2 style={{ padding: "40px" }}>Loading order...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Order Tracking</h1>

      <hr />

      <p><strong>Order ID:</strong> {order.order_id}</p>
      <p><strong>Customer:</strong> {order.customer_name}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>

      <hr />

      <h3>
        Payment Status:
        <span style={{
          color: order.payment_status === "PAID" ? "green" : "orange",
          marginLeft: "10px"
        }}>
          {order.payment_status}
        </span>
      </h3>

      <h3>
        Order Status:
        <span style={{
          marginLeft: "10px",
          fontWeight: "bold"
        }}>
          {order.order_status}
        </span>
      </h3>

      <hr />

      <p>
        Ordered On:{" "}
        {new Date(order.created_at).toLocaleString()}
      </p>

    </div>
  );
}
