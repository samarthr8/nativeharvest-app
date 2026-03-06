import React from "react";

export default function Shipping() {
  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "60vh", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", color: "#1e1e1e", marginBottom: "40px", textAlign: "center" }}>Shipping Policy</h1>
      
      <div style={{ lineHeight: "1.8", color: "#444", fontSize: "16px" }}>
        <h3 style={{ fontSize: "22px", color: "#2f6f4e", marginTop: "30px", marginBottom: "15px" }}>Processing Time</h3>
        <p>All orders are processed within 1 to 2 business days. Orders are not shipped or delivered on weekends or holidays.</p>

        <h3 style={{ fontSize: "22px", color: "#2f6f4e", marginTop: "30px", marginBottom: "15px" }}>Shipping Rates & Delivery Estimates</h3>
        <p>We offer Pan-India delivery. A flat shipping fee of ₹80 applies to orders below ₹999. Enjoy free shipping on all orders ₹999 and above. Expected delivery time is 5-7 business days depending on your location.</p>

        <h3 style={{ fontSize: "22px", color: "#2f6f4e", marginTop: "30px", marginBottom: "15px" }}>Order Tracking</h3>
        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). You can also use our Track Order page to check live status.</p>
      </div>
    </div>
  );
}