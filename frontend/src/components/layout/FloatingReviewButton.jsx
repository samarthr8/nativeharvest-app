import React from "react";
import { Link } from "react-router-dom";

export default function FloatingReviewButton() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 0, // Permanently glued to the absolute right edge of the screen
        zIndex: 9998,
      }}
    >
      <Link
        to="/reviews"
        style={{
          position: "absolute",
          right: 0,
          
          // --- THE CSS MAGIC ---
          // This sets the pivot point to the bottom-right corner.
          // It translates the button UP, then swings it -90 degrees.
          // Result: The flat bottom is perfectly flush against the right screen edge.
          transformOrigin: "bottom right",
          transform: "translateY(-100%) rotate(-90deg)",
          
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#1e1e1e",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px 8px 0 0", // Flat on the bottom (which becomes the right edge)
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "15px",
          letterSpacing: "1px",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.15)",
          whiteSpace: "nowrap",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#2f6f4e";
          // Expanding the bottom padding on hover creates a smooth "pull out" slide effect
          e.currentTarget.style.paddingBottom = "18px"; 
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#1e1e1e";
          e.currentTarget.style.paddingBottom = "12px";
        }}
      >
        {/* The star is counter-rotated 90deg so it points perfectly UP for the reader */}
        <span style={{ color: "#FFD700", fontSize: "18px", transform: "rotate(90deg)" }}>★</span>
        Reviews
      </Link>
    </div>
  );
}