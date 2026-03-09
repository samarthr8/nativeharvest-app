import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(15);
  
  // --- NEW: FILTER STATES ---
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const greenBtn = { background: "#2f6f4e", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.2s ease" };

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = () => api.get("/admin/orders").then(res => setOrders(res.data));

  const updateOrderStatus = async (orderId, newStatus) => {
    await api.patch(`/admin/orders/${orderId}/status`, { order_status: newStatus });
    loadOrders();
  };

  const copyAddress = (address) => { navigator.clipboard.writeText(address); alert("Address copied ✅"); };

  const downloadInvoice = async (orderId) => {
    const res = await api.get(`/admin/orders/${orderId}/invoice`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url; link.setAttribute("download", `${orderId}-invoice.pdf`);
    document.body.appendChild(link); link.click(); link.remove();
  };

  // --- NEW: UI ONLY DELETE FUNCTION ---
  const removeOrderFromUI = (orderId) => {
    if (window.confirm("Hide this order? (This only removes it from this view, it does not delete it from the database)")) {
      setOrders(prev => prev.filter(o => o.order_id !== orderId));
    }
  };

  // --- NEW: FILTER LOGIC ---
  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === "ALL" || o.order_status === filterStatus;
    const matchesSearch = o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />

      <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Orders</h3>
          
          {/* --- FILTER CONTROLS --- */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              placeholder="Search ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", background: "white" }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CREATED">CREATED</option>
              <option value="PACKED">PACKED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f0f4f2" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>#</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th> {/* NEW COLUMN */}
              <th style={{ padding: "12px", textAlign: "left" }}>Order</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Address</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Payment</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Items</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Note: We now map over filteredOrders instead of orders */}
            {filteredOrders.slice(0, visibleOrders).map((o, index) => {
              // Safely format the date
              const orderDate = o.created_at ? new Date(o.created_at) : null;
              
              return (
                <tr key={o.order_id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  
                  {/* COMPACT DATE COLUMN WITH TOOLTIP */}
                  <td style={{ padding: "12px", whiteSpace: "nowrap", color: "#666" }}>
                    {orderDate ? (
                      <div title={orderDate.toLocaleString()}>
                        {orderDate.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    ) : "N/A"}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {o.order_id}
                    {o.coupon_code && <div style={{ fontSize: "11px", background: "#e8f3ee", display: "inline-block", padding: "2px 4px", borderRadius: "4px", marginTop: "4px" }}>🎟️ {o.coupon_code}</div>}
                  </td>
                  <td style={{ padding: "12px" }}>{o.customer_name}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>₹{o.total_amount}</td>
                  <td style={{ padding: "12px" }} title={`${o.full_address || o.address}\n${o.city || ""}, ${o.state || ""} - ${o.pincode || ""}`}>
                    {o.city && o.state ? `${o.city}, ${o.state}` : o.address?.substring(0, 20) + "..."}
                    <span style={{ cursor: "pointer", marginLeft: "6px" }} onClick={() => copyAddress(`${o.full_address || o.address}\n${o.city || ""}, ${o.state || ""} - ${o.pincode || ""}`)}>📋</span>
                  </td>
                  <td style={{ padding: "12px", color: o.payment_status === "PAID" ? "green" : "orange", fontWeight: "bold" }}>{o.payment_status}</td>
                  <td style={{ padding: "12px" }}>
                    <select value={o.order_status} onChange={(e)=>updateOrderStatus(o.order_id, e.target.value)} style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}>
                      <option>CREATED</option><option>PACKED</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option>
                    </select>
                  </td>
                  <td 
                    style={{ padding: "12px", cursor: "help", color: "#2f6f4e", fontWeight: "bold" }} 
                    title={o.items ? o.items.map(item => `${item.product_name} ${item.variant_key ? `(${item.variant_key})` : ""} x ${item.quantity}`).join("\n") : "No items"}
                  >
                    View
                  </td>
                  <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                    <button style={{ ...greenBtn, padding: "6px 10px", fontSize: "12px" }} onClick={()=>downloadInvoice(o.order_id)}>PDF</button>
                    {/* UI ONLY DELETE BUTTON */}
                    <button style={{ ...greenBtn, padding: "6px 10px", fontSize: "12px", background: "#d9534f" }} onClick={()=>removeOrderFromUI(o.order_id)}>Hide</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>No orders match your filter.</div>}

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {visibleOrders < filteredOrders.length && <button style={{ ...greenBtn, marginRight: "10px" }} onClick={() => setVisibleOrders(prev => prev + 15)}>Load 15 More</button>}
          {visibleOrders > 15 && <button style={{ ...greenBtn, background: "#777" }} onClick={() => setVisibleOrders(15)}>Show Less</button>}
        </div>
      </div>
    </div>
  );
}