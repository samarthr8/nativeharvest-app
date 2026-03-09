import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(15); // <-- NEW: Start with 15 products
  const navigate = useNavigate();

  const greenBtn = { background: "#2f6f4e", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.2s ease" };

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => api.get("/products").then(res => setProducts(res.data));

  const deleteProduct = async (slug) => {
    if (!window.confirm("Delete product?")) return;
    await api.delete(`/admin/products/${slug}`);
    loadProducts();
  };

  const handleEdit = (product) => {
    navigate("/admin/add-product", { state: { product } });
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
        <h3>Existing Products</h3>
        
        {/* --- RESTORED SCROLL WITH 15 ITEM LIMIT --- */}
        <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "10px" }}>
          {products.slice(0, visibleProducts).map(p => (
            <div key={p.slug} style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {p.image ? <img src={p.image} alt="" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} /> : <div style={{ width: "50px", height: "50px", background: "#eee", borderRadius: "6px" }} />}
                <div>
                  <strong>{p.name}</strong> <span style={{fontSize: "12px", background: "#e8f3ee", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px"}}>{p.category || "Uncategorized"}</span><br/>
                  <span style={{ fontSize: "13px", color: "#666" }}>₹{p.price} | Stock: {p.stock}</span>
                </div>
              </div>
              <div>
                <button style={{ ...greenBtn, marginRight: "10px" }} onClick={()=>handleEdit(p)}>Edit</button>
                <button style={{ ...greenBtn, background: "#d9534f" }} onClick={()=>deleteProduct(p.slug)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* --- NEW: LOAD MORE CONTROLS --- */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {visibleProducts < products.length && <button style={{ ...greenBtn, marginRight: "10px" }} onClick={() => setVisibleProducts(prev => prev + 15)}>Load 15 More</button>}
          {visibleProducts > 15 && <button style={{ ...greenBtn, background: "#777" }} onClick={() => setVisibleProducts(15)}>Show Less</button>}
        </div>

      </div>
    </div>
  );
}