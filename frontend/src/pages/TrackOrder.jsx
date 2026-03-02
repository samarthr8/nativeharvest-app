import { useState } from "react";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setStatusData(null);

    try {
      // Re-using the endpoint from your OrderSuccess page
      const res = await fetch(`/api/orders/${orderId.trim().toUpperCase()}/status`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order not found. Please check your Order ID.");
      }

      setStatusData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          Enter your Order ID below to check the current status of your traditional pickles and preserves.
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
            disabled={loading || !orderId} 
            style={greenBtn}
            onMouseOver={(e) => e.target.style.boxShadow = "0 0 12px rgba(47,111,78,0.4)"}
            onMouseOut={(e) => e.target.style.boxShadow = "none"}
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div style={{
            marginTop: "20px",
            padding: "12px",
            background: "#fdf1f0",
            color: "#c0392b",
            borderRadius: "8px",
            fontSize: "14px",
            textAlign: "center",
            fontWeight: "500"
          }}>
            {error}
          </div>
        )}

        {/* --- SUCCESS STATUS CARD --- */}
        {statusData && (
          <div style={{
            marginTop: "30px",
            padding: "25px",
            border: "1px solid #eee",
            borderRadius: "12px",
            background: "#fafafa"
          }}>
            <h4 style={{ marginBottom: "20px", fontSize: "16px", color: "#333", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              Order Details
            </h4>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "14px" }}>
              <span style={{ opacity: 0.7 }}>Order ID:</span>
              <span style={{ 
                fontWeight: "700", 
                color: "#2f6f4e",
                fontFamily: "'Courier New', Courier, monospace",
                letterSpacing: "1px"
              }}>
                {orderId.toUpperCase()}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "14px" }}>
              <span style={{ opacity: 0.7 }}>Payment:</span>
              <span style={{ 
                fontWeight: "600", 
                color: statusData.payment_status === "PAID" ? "green" : "#e67e22" 
              }}>
                {statusData.payment_status || "PENDING"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ opacity: 0.7 }}>Status:</span>
              <span style={{ fontWeight: "600", color: "#2f6f4e" }}>
                {statusData.order_status || "Processing"}
              </span>
            </div>

            {/* Optional: If your backend eventually passes a tracking URL from your courier partner */}
            {statusData.tracking_link && (
              <a 
                href={statusData.tracking_link} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  display: "block", 
                  marginTop: "25px", 
                  textAlign: "center", 
                  color: "#2f6f4e", 
                  fontWeight: "600", 
                  textDecoration: "underline", 
                  fontSize: "14px" 
                }}
              >
                Track via Courier Partner ↗
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;