import React from "react";

export default function Refund() {
  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "60vh", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", color: "#1e1e1e", marginBottom: "40px", textAlign: "center" }}>Refund Policy</h1>
      
      <div style={{ lineHeight: "1.8", color: "#444", fontSize: "16px" }}>
        <h3 style={{ fontSize: "22px", color: "#2f6f4e", marginTop: "30px", marginBottom: "15px" }}>Our Guarantee</h3>
        <p>Because NativeHarvest deals in premium food products, we do not accept general returns for opened items. However, your satisfaction is our priority.</p>

        <h3 style={{ fontSize: "22px", color: "#2f6f4e", marginTop: "30px", marginBottom: "15px" }}>Damaged or Incorrect Items</h3>
        <p>If your order arrives damaged, leaking, or you receive the incorrect item, please contact us at <strong>nativeharvestindia@gmail.com</strong> within 48 hours of delivery. Please include your order number and clear photos of the damaged item. We will arrange a free replacement or issue a full refund immediately.</p>

        <h3 style={{ fontSize: "22px", color: "#2f6f4e", marginTop: "30px", marginBottom: "15px" }}>Refund Processing</h3>
        <p>Approved refunds will be processed automatically to your original method of payment via Razorpay. Please allow 5-7 business days for the credit to appear in your account.</p>
      </div>
    </div>
  );
}