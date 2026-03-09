import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function DashboardHome() {
  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />
      
      <div style={{ background: "white", padding: "40px 20px", borderRadius: "12px", textAlign: "center", color: "#555" }}>
        <h2>Welcome to the NativeHarvest Admin Panel</h2>
        <p style={{ marginTop: "10px", fontSize: "16px" }}>Use the navigation menu above to manage your products, orders, and promotions.</p>
      </div>
    </div>
  );
}