import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    // --- FIXED: Instantly redirects the user to the detailed order tracking page ---
    navigate(`/order/${orderId.trim().toUpperCase()}`);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "20px",
    fontSize: "15px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', Courier, monospace",
    letterSpacing: "1px"
  };

  const greenBtn = {
    background: "#2f6f4e",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    width: "100%",
    transition: "0.2s ease"
  };

  return (
    <div style={{ background: "#f5f7f6", minHeight: "80vh", padding: "60px 20px" }}>
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        background: "white",
        padding: "40px",
        borderRadius: "14px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
      }}>
        
        <h2 style={{ color: "#2f6f4e", marginBottom: "10px", textAlign: "center" }}>
          Track Your Order
        </h2>
        
        <p style={{ textAlign: "center", opacity: 0.7, marginBottom: "30px", fontSize: "15px", lineHeight: "1.5" }}>
          Enter your Order ID below to view your full order summary, timeline, and current status.
        </p>

        <form onSubmit={handleTrack}>
          <input
            type="text"
            placeholder="e.g. NH-7E1657C2"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={inputStyle}
          />
          <button 
            type="submit" 
            disabled={!orderId} 
            style={greenBtn}
            onMouseOver={(e) => e.target.style.boxShadow = "0 0 12px rgba(47,111,78,0.4)"}
            onMouseOut={(e) => e.target.style.boxShadow = "none"}
          >
            Track Order
          </button>
        </form>

      </div>
    </div>
  );
};

export default TrackOrder;