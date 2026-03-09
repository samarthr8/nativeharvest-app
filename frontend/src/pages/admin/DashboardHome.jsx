import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders to calculate dashboard analytics
    api.get("/admin/orders").then(res => setOrders(res.data)).catch(console.error);
  }, []);

  // --- ANALYTICS CALCULATIONS ---
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  // Daily Stats
  const dailyOrders = orders.filter(o => o.created_at && new Date(o.created_at).toISOString().split('T')[0] === todayStr);
  const dailyRevenue = dailyOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // Monthly Stats
  const monthlyOrders = orders.filter(o => {
    if (!o.created_at) return false;
    const d = new Date(o.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // --- STYLING ---
  const cardStyle = { 
    background: "white", padding: "24px", borderRadius: "12px", 
    flex: "1 1 200px", border: "1px solid #eee",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)" 
  };
  const titleStyle = { fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };
  const valueStyle = { fontSize: "32px", color: "#2f6f4e", fontWeight: "bold" };
  const subTextStyle = { fontSize: "13px", color: "#888", marginTop: "8px", fontWeight: "500" };

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />
      
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "22px", color: "#1f2d2a", marginBottom: "20px" }}>Store Overview</h2>
        
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          <div style={cardStyle}>
            <div style={titleStyle}>Total Revenue</div>
            <div style={valueStyle}>₹{totalRevenue.toLocaleString()}</div>
            <div style={subTextStyle}>Lifetime earnings</div>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>This Month</div>
            <div style={valueStyle}>₹{monthlyRevenue.toLocaleString()}</div>
            <div style={subTextStyle}>{monthlyOrders.length} orders this month</div>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>Today's Revenue</div>
            <div style={valueStyle}>₹{dailyRevenue.toLocaleString()}</div>
            <div style={subTextStyle}>{dailyOrders.length} orders today</div>
          </div>

          <div style={cardStyle}>
            <div style={titleStyle}>Total Orders</div>
            <div style={valueStyle}>{totalOrders}</div>
            <div style={subTextStyle}>Lifetime orders</div>
          </div>

        </div>
      </div>
    </div>
  );
}