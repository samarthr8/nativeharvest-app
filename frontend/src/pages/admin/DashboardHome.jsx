import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  
  // Bug Fix States: True lifetime numbers from DB
  const [trueStats, setTrueStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  
  // GST Feature States
  const [timeframe, setTimeframe] = useState("month"); // 'month', 'quarter', 'year'
  const [gstFilings, setGstFilings] = useState([]);

  useEffect(() => {
    api.get("/admin/orders").then(res => setOrders(res.data)).catch(console.error);
    api.get("/admin/dashboard-stats").then(res => setTrueStats(res.data)).catch(console.error);
    api.get("/admin/gst-status").then(res => setGstFilings(res.data)).catch(console.error);
  }, []);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  // Daily & Monthly Stats (Using recent orders array)
  const dailyOrders = orders.filter(o => o.created_at && new Date(o.created_at).toISOString().split('T')[0] === todayStr);
  const dailyRevenue = dailyOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const monthlyOrders = orders.filter(o => o.created_at && new Date(o.created_at).getMonth() === thisMonth && new Date(o.created_at).getFullYear() === thisYear);
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // --- GST CALCULATIONS ---
  const getFilteredGstOrders = () => {
    return orders.filter(o => {
      if (!o.created_at) return false;
      const d = new Date(o.created_at);
      if (timeframe === "month") return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      if (timeframe === "quarter") return (today - d) <= (90 * 24 * 60 * 60 * 1000); // Last 90 days
      if (timeframe === "year") return d.getFullYear() === thisYear;
      return true;
    });
  };

  const gstOrders = getFilteredGstOrders();
  
  // Base Subtotal (Total minus shipping plus discounts to find the exact taxable base)
  let totalBaseForGst = 0;
  gstOrders.forEach(o => {
    totalBaseForGst += (Number(o.total_amount) - Number(o.shipping_fee || 0) + Number(o.discount_amount || 0));
  });

  // 5% Inclusive Math
  const taxableValue = totalBaseForGst / 1.05;
  const outputGst = totalBaseForGst - taxableValue;

  // --- GST CHECKLIST LOGIC ---
  // Generate last 4 months dynamically
  const recentMonths = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  });

  const handleGstToggle = async (monthYear, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setGstFilings(prev => {
      const exists = prev.find(f => f.month_year === monthYear);
      if (exists) return prev.map(f => f.month_year === monthYear ? { ...f, is_filed: newStatus } : f);
      return [...prev, { month_year: monthYear, is_filed: newStatus }];
    });
    // Send to DB
    await api.post("/admin/gst-status", { month_year: monthYear, is_filed: newStatus }).catch(console.error);
  };

  // --- STYLING ---
  const cardStyle = { background: "white", padding: "24px", borderRadius: "12px", flex: "1 1 200px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" };
  const titleStyle = { fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };
  const valueStyle = { fontSize: "32px", color: "#2f6f4e", fontWeight: "bold" };
  const subTextStyle = { fontSize: "13px", color: "#888", marginTop: "8px", fontWeight: "500" };

  const timeBtn = (active) => ({
    background: active ? "#2f6f4e" : "#e8f3ee", color: active ? "white" : "#2f6f4e", 
    border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "13px"
  });

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />
      
      {/* --- STORE OVERVIEW (Bug Fixed) --- */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", color: "#1f2d2a", marginBottom: "20px" }}>Store Overview</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={cardStyle}>
            <div style={titleStyle}>Total Revenue</div>
            <div style={valueStyle}>₹{trueStats.totalRevenue.toLocaleString()}</div>
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
            <div style={valueStyle}>{trueStats.totalOrders}</div>
            <div style={subTextStyle}>Lifetime orders</div>
          </div>
        </div>
      </div>

      {/* --- NEW: GST & TAX ANALYTICS --- */}
      <div>
        <h2 style={{ fontSize: "22px", color: "#1f2d2a", marginBottom: "20px" }}>GST & Tax Analytics</h2>
        
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* Main Analytics Panel */}
          <div style={{ flex: "1 1 500px", background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#444" }}>Output Tax Breakdown</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={timeBtn(timeframe === "month")} onClick={() => setTimeframe("month")}>This Month</button>
                <button style={timeBtn(timeframe === "quarter")} onClick={() => setTimeframe("quarter")}>Last 3 Months</button>
                <button style={timeBtn(timeframe === "year")} onClick={() => setTimeframe("year")}>This Year</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
              <div style={{ flex: 1, background: "#f9fcfb", padding: "15px", borderRadius: "8px", border: "1px solid #e2eee8" }}>
                <div style={{ fontSize: "13px", color: "#666", fontWeight: "600", textTransform: "uppercase" }}>Taxable Sales</div>
                <div style={{ fontSize: "24px", color: "#1f2d2a", fontWeight: "bold", marginTop: "5px" }}>₹{taxableValue.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, background: "#fff5f5", padding: "15px", borderRadius: "8px", border: "1px solid #fee2e2" }}>
                <div style={{ fontSize: "13px", color: "#c53030", fontWeight: "600", textTransform: "uppercase" }}>Output GST (5%)</div>
                <div style={{ fontSize: "24px", color: "#c53030", fontWeight: "bold", marginTop: "5px" }}>₹{outputGst.toFixed(2)}</div>
                <div style={{ fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>*Before Input Tax Credit (ITC)</div>
              </div>
            </div>

            {/* Native CSS Visual Bar */}
            <div>
              <div style={{ fontSize: "13px", color: "#666", fontWeight: "600", marginBottom: "10px" }}>Sales vs Tax Proportion</div>
              <div style={{ width: "100%", height: "24px", display: "flex", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ width: `${(taxableValue / (totalBaseForGst || 1)) * 100}%`, background: "#2f6f4e", transition: "width 0.5s" }} title="Taxable Sales" />
                <div style={{ width: `${(outputGst / (totalBaseForGst || 1)) * 100}%`, background: "#e53e3e", transition: "width 0.5s" }} title="GST Collected" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#888", fontWeight: "500" }}>
                <span>■ Taxable (95.2%)</span>
                <span>■ GST (4.8%)</span>
              </div>
            </div>
          </div>

          {/* Compliance Checklist Panel */}
          <div style={{ flex: "1 1 300px", background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#444" }}>GSTR-1 & 3B Filing Tracker</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {recentMonths.map((month) => {
                const isFiled = gstFilings.find(f => f.month_year === month)?.is_filed || false;
                return (
                  <div key={month} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #eee", borderRadius: "8px", background: isFiled ? "#f0fdf4" : "white" }}>
                    <span style={{ fontWeight: "600", color: isFiled ? "#166534" : "#444" }}>{month}</span>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: isFiled ? "#166534" : "#888" }}>
                      <input 
                        type="checkbox" 
                        checked={isFiled} 
                        onChange={() => handleGstToggle(month, isFiled)}
                        style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2f6f4e" }}
                      />
                      {isFiled ? "Filed ✅" : "Pending"}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}