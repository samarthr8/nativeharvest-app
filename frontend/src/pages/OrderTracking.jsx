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

  /* --------------------------------
     ORDER STEP TRACKER LOGIC
  -------------------------------- */

  const steps = ["CREATED", "PACKED", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order.order_status);

  const estimatedDelivery = new Date(order.created_at);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div style={{ background: "#f5f7f6", minHeight: "100vh", padding: "60px 20px" }}>

      <div style={{
        maxWidth: "900px",
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

        {/* ORDER SUMMARY */}
        <div style={{ marginBottom: "25px" }}>
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Customer:</strong> {order.customer_name}</p>
          <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
        </div>

        <hr style={{ margin: "25px 0" }} />

        {/* STEP TRACKER */}
        <div style={{ marginBottom: "40px" }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            marginBottom: "30px"
          }}>

            {steps.map((step, index) => {

              const isActive = index <= currentStepIndex;

              return (
                <div key={step} style={{ textAlign: "center", flex: 1 }}>

                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    margin: "0 auto",
                    background: isActive ? "#2f6f4e" : "#ddd",
                    transition: "0.3s ease"
                  }} />

                  <div style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    fontWeight: isActive ? "600" : "400",
                    color: isActive ? "#2f6f4e" : "#999"
                  }}>
                    {step}
                  </div>

                </div>
              );
            })}

            {/* Progress Line */}
            <div style={{
              position: "absolute",
              top: "14px",
              left: "5%",
              width: `${(currentStepIndex / (steps.length - 1)) * 90}%`,
              height: "4px",
              background: "#2f6f4e",
              zIndex: "-1",
              transition: "0.3s ease"
            }} />
          </div>

        </div>

        {/* DELIVERY ETA */}
        <div style={{
          background: "#f0f4f2",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "30px"
        }}>
          <strong>Estimated Delivery:</strong>{" "}
          {estimatedDelivery.toDateString()}
        </div>

        {/* PAYMENT STATUS */}
        <div style={{ marginBottom: "25px" }}>
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

        {/* ITEMS LIST */}
        {order.items && order.items.length > 0 && (
          <>
            <h3 style={{ marginBottom: "15px" }}>Ordered Items</h3>

            {order.items.map((item, index) => (
              <div key={index} style={{
                padding: "12px",
                border: "1px solid #eee",
                borderRadius: "8px",
                marginBottom: "10px"
              }}>
                <strong>{item.product_name}</strong>
                {item.variant_key && (
                  <span style={{
                    marginLeft: "10px",
                    background: "#2f6f4e",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}>
                    {item.variant_key}
                  </span>
                )}
                <div style={{ marginTop: "5px", fontSize: "14px" }}>
                  ₹{item.price} × {item.quantity}
                </div>
              </div>
            ))}
          </>
        )}

        {/* SUCCESS CHECKMARK */}
        {order.order_status === "DELIVERED" && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>

            <div style={{
              fontSize: "50px",
              color: "#2f6f4e",
              animation: "pop 0.4s ease-out"
            }}>
              ✓
            </div>

            <p style={{ marginTop: "10px", fontWeight: "600" }}>
              Delivered Successfully 🎉
            </p>

          </div>
        )}

        {/* TRUST BADGES */}
        <div style={{
          marginTop: "50px",
          paddingTop: "30px",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "15px",
          fontSize: "13px",
          color: "#555"
        }}>
          <div>🌾 Small Batch Production</div>
          <div>🧴 No Artificial Preservatives</div>
          <div>🚚 Pan India Delivery</div>
          <div>❤️ Rural Producer Support</div>
        </div>

      </div>

      {/* Simple animation keyframe */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

    </div>
  );
}