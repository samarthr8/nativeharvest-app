import React from "react";
import { Link } from "react-router-dom";

export default function FloatingReviewButton() {
  return (
    <Link
      to="/reviews"
      style={{
        position: "fixed",
        top: "50%",
        right: "-40px",
        transform: "translateY(-50%) rotate(-90deg)",
        transformOrigin: "bottom center",
        background: "#1e1e1e", // High contrast dark color
        color: "white",
        padding: "10px 24px",
        borderRadius: "8px 8px 0 0",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "14px",
        letterSpacing: "1px",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
        zIndex: 9998, // Just under the WhatsApp widget
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "#2f6f4e"; // Turns brand green on hover
        e.currentTarget.style.paddingBottom = "15px"; // Slight "pull out" effect
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "#1e1e1e";
        e.currentTarget.style.paddingBottom = "10px";
      }}
    >
      <span style={{ color: "#FFD700", fontSize: "16px" }}>★</span>
      Reviews
    </Link>
  );
}