import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function DashboardHome() {
  const today = new Date();
  const monthOptions = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return {
      label: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      value: `${d.getMonth() + 1}-${d.getFullYear()}`,
      monthLabel: d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    };
  });

  const [timeframe, setTimeframe] = useState("month"); // 'month', 'quarter', 'year'
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  
  const [stats, setStats] = useState({ 
    lifetime: { totalOrders: 0, totalRevenue: 0 }, 
    selected: { orders: 0, revenue: 0, shipping: 0, discounts: 0, productSales: 0 }, 
    dailyTrend: [] 
  });
  const [gstFilings, setGstFilings] = useState([]);

  useEffect(() => {
    const [m, y] = selectedMonth.split('-');
    const yearArg = timeframe === "year" ? today.getFullYear() : y;
    
    api.get(`/admin/dashboard-stats?timeframe=${timeframe}&month=${m}&year=${yearArg}`)
       .then(res => setStats(res.data))
       .catch(console.error);
       
    api.get("/admin/gst-status").then(res => setGstFilings(res.data)).catch(console.error);
  }, [selectedMonth, timeframe]);

  const { lifetime, selected, dailyTrend } = stats;

  const averageOrderValue = selected.orders > 0 ? (selected.revenue / selected.orders) : 0;
  const maxTrendOrders = Math.max(...(dailyTrend.map(d => d.orders)), 1);
  
  const taxableValue = selected.revenue / 1.05;
  const outputGst = selected.revenue - taxableValue;

  const handleGstToggle = async (monthYear, currentStatus) => {
    const newStatus = !currentStatus;
    setGstFilings(prev => {
      const exists = prev.find(f => f.month_year === monthYear);
      if (exists) return prev.map(f => f.month_year === monthYear ? { ...f, is_filed: newStatus } : f);
      return [...prev, { month_year: monthYear, is_filed: newStatus }];
    });
    await api.post("/admin/gst-status", { month_year: monthYear, is_filed: newStatus }).catch(console.error);
  };

  const cardStyle = { background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", flex: 1 };
  const titleStyle = { fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" };
  const valueStyle = { fontSize: "28px", color: "#2f6f4e", fontWeight: "bold" };
  const subTextStyle = { fontSize: "13px", color: "#888", marginTop: "8px", fontWeight: "500" };

  const timeBtn = (active) => ({
    background: active ? "#2f6f4e" : "#e8f3ee", color: active ? "white" : "#2f6f4e", 
    border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "13px"
  });

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />

      {/* --- GLOBAL TIMEFRAME FILTER --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <h1 style={{ fontSize: "24px", color: "#1f2d2a", margin: 0 }}>Business Analytics</h1>
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Restored Toggle Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={timeBtn(timeframe === "month")} onClick={() => setTimeframe("month")}>Month</button>
            <button style={timeBtn(timeframe === "quarter")} onClick={() => setTimeframe("quarter")}>Last 3 Months</button>
            <button style={timeBtn(timeframe === "year")} onClick={() => setTimeframe("year")}>This Year</button>
          </div>

          {/* Month Dropdown (Disabled if not in 'month' view) */}
          <select 
            value={selectedMonth} 
            onChange={(e) => { setTimeframe("month"); setSelectedMonth(e.target.value); }}
            disabled={timeframe !== "month"}
            style={{ 
              padding: "10px 16px", fontSize: "15px", borderRadius: "8px", 
              border: "1px solid #ccc", background: timeframe !== "month" ? "#f0f0f0" : "white", 
              fontWeight: "600", color: timeframe !== "month" ? "#999" : "#2f6f4e", cursor: timeframe !== "month" ? "not-allowed" : "pointer",
              minWidth: "160px"
            }}
          >
            {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      
      {/* ======================================= */}
      {/* 1. ORDERS DASHBOARD                     */}
      {/* ======================================= */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", color: "#444", marginBottom: "15px" }}>Orders Overview</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "stretch" }}>
          
          <div style={{ ...cardStyle, maxWidth: "250px" }}>
            <div style={titleStyle}>Total Lifetime Orders</div>
            <div style={valueStyle}>{lifetime.totalOrders}</div>
            <div style={subTextStyle}>All-time record</div>
          </div>

          <div style={{ ...cardStyle, maxWidth: "250px" }}>
            <div style={titleStyle}>Orders ({timeframe})</div>
            <div style={valueStyle}>{selected.orders}</div>
            <div style={subTextStyle}>Selected timeframe</div>
          </div>

          <div style={{ ...cardStyle, maxWidth: "250px" }}>
            <div style={titleStyle}>Avg. Order Value</div>
            <div style={valueStyle}>₹{averageOrderValue.toFixed(0)}</div>
            <div style={subTextStyle}>Per order average</div>
          </div>

          {/* Daily Trend Graph */}
          <div style={{ ...cardStyle, flex: "2 1 300px" }}>
            <div style={titleStyle}>Order Trend</div>
            <div style={{ height: "60px", display: "flex", alignItems: "flex-end", gap: "6px", marginTop: "15px" }}>
              {dailyTrend.length === 0 ? <div style={{ color: "#aaa", fontSize: "14px" }}>No orders yet.</div> : 
                dailyTrend.map(d => (
                  <div key={d.date} title={`${d.date}: ${d.orders} orders`} 
                       style={{ flex: 1, background: "#2f6f4e", borderRadius: "3px 3px 0 0", minHeight: "4px", height: `${(d.orders / maxTrendOrders) * 100}%`, transition: "height 0.3s" }} 
                  />
                ))
              }
            </div>
          </div>

        </div>
      </div>

      {/* ======================================= */}
      {/* 2. REVENUE DASHBOARD                    */}
      {/* ======================================= */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", color: "#444", marginBottom: "15px" }}>Revenue Breakdown</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          <div style={{ ...cardStyle, background: "#1f2d2a", color: "white" }}>
            <div style={{ ...titleStyle, color: "#a5d6a7" }}>Total Lifetime Revenue</div>
            <div style={{ ...valueStyle, color: "white" }}>₹{lifetime.totalRevenue.toLocaleString()}</div>
          </div>

          <div style={{ ...cardStyle, background: "#e8f3ee" }}>
            <div style={{ ...titleStyle, color: "#1f2d2a" }}>Net Revenue ({timeframe})</div>
            <div style={{ ...valueStyle, color: "#1f2d2a" }}>₹{selected.revenue.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "15px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Product Sales:</span> <strong>₹{selected.productSales.toLocaleString()}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Shipping Fees:</span> <strong>+ ₹{selected.shipping.toLocaleString()}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#c53030" }}><span>Coupons/Discounts:</span> <strong>- ₹{selected.discounts.toLocaleString()}</strong></div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================= */}
      {/* 3. GST & TAX DASHBOARD                  */}
      {/* ======================================= */}
      <div>
        <h2 style={{ fontSize: "18px", color: "#444", marginBottom: "15px" }}>GST & Compliance (5% Inclusive)</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          <div style={{ flex: "2 1 400px", background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
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
            
            <div style={{ fontSize: "13px", color: "#666", fontWeight: "600", marginBottom: "8px" }}>Sales vs Tax Proportion</div>
            <div style={{ width: "100%", height: "20px", display: "flex", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ width: `${(taxableValue / (selected.revenue || 1)) * 100}%`, background: "#2f6f4e" }} title="Taxable Sales" />
              <div style={{ width: `${(outputGst / (selected.revenue || 1)) * 100}%`, background: "#e53e3e" }} title="GST Collected" />
            </div>
          </div>

          <div style={{ flex: "1 1 300px", background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#444", fontSize: "15px" }}>GSTR-1 & 3B Filing Tracker</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {monthOptions.slice(0, 4).map((opt) => {
                const isFiled = gstFilings.find(f => f.month_year === opt.monthLabel)?.is_filed || false;
                return (
                  <div key={opt.monthLabel} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid #eee", borderRadius: "8px", background: isFiled ? "#f0fdf4" : "white" }}>
                    <span style={{ fontWeight: "600", fontSize: "14px", color: isFiled ? "#166534" : "#444" }}>{opt.monthLabel}</span>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: isFiled ? "#166534" : "#888" }}>
                      <input 
                        type="checkbox" checked={isFiled} onChange={() => handleGstToggle(opt.monthLabel, isFiled)}
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