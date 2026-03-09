import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function AdminPromotions() {
  const [coupons, setCoupons] = useState([]);
  const [cCode, setCCode] = useState("");
  const [cType, setCType] = useState("PERCENT");
  const [cValue, setCValue] = useState("");
  const [cMinCart, setCMinCart] = useState("0");

  const greenBtn = { background: "#2f6f4e", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.2s ease" };

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = () => api.get("/admin/coupons").then(res => setCoupons(res.data));

  const createCoupon = async () => {
    if (!cCode || !cValue) return alert("Please provide code and discount value");
    try {
      await api.post("/admin/coupons", { code: cCode, discount_type: cType, discount_value: parseInt(cValue, 10), min_cart_value: parseInt(cMinCart, 10) });
      alert("Coupon created! 🎉");
      setCCode(""); setCValue(""); setCMinCart("0");
      loadCoupons();
    } catch (err) { alert("Failed to create coupon. Code might already exist."); }
  };

  const toggleCoupon = async (id) => {
    await api.patch(`/admin/coupons/${id}/toggle`);
    loadCoupons();
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    await api.delete(`/admin/coupons/${id}`);
    loadCoupons();
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
        <h3>Promotions & Coupons</h3>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input placeholder="Promo Code (e.g. DIWALI20)" value={cCode} onChange={e => setCCode(e.target.value.toUpperCase())} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
          
          <select value={cType} onChange={e => setCType(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", background: "white" }}>
            <option value="PERCENT">% Percent Off</option>
            <option value="FLAT">₹ Flat Off</option>
          </select>
          
          <input type="number" placeholder="Discount Value" value={cValue} onChange={e => setCValue(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", width: "140px" }} />
          
          <input type="number" placeholder="Min Cart ₹ (Optional)" value={cMinCart} onChange={e => setCMinCart(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", width: "160px" }} />
          
          <button style={greenBtn} onClick={createCoupon}>Create Code</button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f0f4f2" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Code</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Discount</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Min Cart</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #eee", opacity: c.is_active ? 1 : 0.6 }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{c.code}</td>
                <td style={{ padding: "12px" }}>{c.discount_type === 'PERCENT' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                <td style={{ padding: "12px" }}>₹{c.min_cart_value}</td>
                <td style={{ padding: "12px", color: c.is_active ? "green" : "red", fontWeight: "bold" }}>
                  {c.is_active ? "Active" : "Disabled"}
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "10px" }}>
                  <button onClick={() => toggleCoupon(c.id)} style={{ padding: "4px 10px", background: "#f0f0f0", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}>
                    {c.is_active ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => deleteCoupon(c.id)} style={{ padding: "4px 10px", background: "#d9534f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan="5" style={{ padding: "15px", textAlign: "center", color: "#888" }}>No coupons created yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}