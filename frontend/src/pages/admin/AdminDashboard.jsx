import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(15);

  const [editingSlug, setEditingSlug] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [extraImages, setExtraImages] = useState("");
  const [variantsInput, setVariantsInput] = useState("");

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  const loadOrders = () => {
    api.get("/admin/orders").then(res => setOrders(res.data));
  };

  const greenBtn = {
    background: "#2f6f4e",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.2s ease"
  };

  const glow = (e, on) => {
    e.target.style.boxShadow = on ? "0 0 10px #2f6f4e" : "none";
  };

  // ✅ RESTORED LOGOUT FUNCTION (unchanged logic)
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const uploadImage = async () => {
    if (!file) return alert("Select image");

    try {
      const formData = new FormData();
      formData.append("image", file);

      // ❌ DO NOT manually set Content-Type
      const res = await api.post("/admin/upload", formData);

      setImage(res.data.imageUrl);
      alert("Image uploaded ✅");

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(
        err.response?.data?.message ||
        "Image upload failed"
      );
    }
  };

  // --- 1. UPDATE handleEdit ---
  const handleEdit = (product) => {
    setEditingSlug(product.slug);
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setStock(product.stock);
    setDescription(product.description || "");
    setImage(product.image || "");
    setExtraImages(product.images ? product.images.join(",") : "");
    
    // Load existing variants with their stock (default to 0 if missing)
    setVariantsInput(
      product.variants
        ? product.variants.map(v => `${v.weight}:${v.price}:${v.stock || 0}`).join(", ")
        : ""
    );
  };

  // --- 2. UPDATE saveProduct ---
  const saveProduct = async () => {

    let variantsArray = null;
    if (variantsInput) {
      variantsArray = variantsInput.split(",").map(v => {
        const parts = v.split(":");
        return { 
          weight: parts[0]?.trim(), 
          price: Number(parts[1]?.trim() || 0),
          stock: Number(parts[2]?.trim() || 0) // Parse the 3rd value as stock
        };
      });
    }

    let imagesArray = null;
    if (extraImages) {
      imagesArray = extraImages.split(",").map(i => i.trim());
    }

    if (editingSlug) {

      await api.put(`/admin/products/${editingSlug}`, {
        name,
        price,
        stock: parseInt(stock || 0, 10),
        image,
        images: imagesArray,
        variants: variantsArray,
        description
      });

      alert("Product updated ✅");
      setEditingSlug(null);

    } else {

      await api.post("/admin/products", {
        name,
        slug,
        price,
        stock: parseInt(stock || 0, 10),
        image,
        images: imagesArray,
        variants: variantsArray,
        description
      });

      alert("Product added ✅");
    }

    setName("");
    setSlug("");
    setPrice("");
    setStock("");
    setDescription("");
    setImage("");
    setExtraImages("");
    setVariantsInput("");

    loadProducts();
  };

  const deleteProduct = async (slug) => {
    if (!window.confirm("Delete product?")) return;
    await api.delete(`/admin/products/${slug}`);
    loadProducts();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await api.patch(`/admin/orders/${orderId}/status`, {
      order_status: newStatus
    });
    loadOrders();
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    alert("Address copied ✅");
  };

  const downloadInvoice = async (orderId) => {
    const res = await api.get(`/admin/orders/${orderId}/invoice`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${orderId}-invoice.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7f6" }}>

      {/* ===== HEADER WITH TITLE + LOGOUT ===== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
      }}>
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "600",
              letterSpacing: "0.6px",
              marginBottom: "6px",
              color: "#1f2d2a"
            }}
          >
            Admin Dashboard
          </h1>
          <div
            style={{
              width: "70px",
              height: "3px",
              background: "#2f6f4e",
              borderRadius: "2px"
            }}
          />
        </div>

        <button
          style={greenBtn}
          onMouseOver={(e)=>glow(e,true)}
          onMouseOut={(e)=>glow(e,false)}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* ================= PRODUCTS SECTION ================= */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>

        <h3>{editingSlug ? "Edit Product" : "Add Product"}</h3>

        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button
          style={{ ...greenBtn, marginLeft: "10px" }}
          onMouseOver={(e)=>glow(e,true)}
          onMouseOut={(e)=>glow(e,false)}
          onClick={uploadImage}
        >
          Upload
        </button>

        {image && (
          <div>
            <img src={image} alt="" style={{ width: 100, marginTop: "10px" }} />
          </div>
        )}

        <hr />

        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>

        {!editingSlug && (
          <>
            <input
              placeholder="Slug"
              value={slug}
              onChange={e=>setSlug(e.target.value)}
            />
            <br/>
          </>
        )}

        <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} /><br/>
        <input placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} /><br/>

        <textarea
          placeholder="Description"
          value={description}
          onChange={e=>setDescription(e.target.value)}
        /><br/>

        <input
          placeholder="Extra Image URLs (comma separated)"
          value={extraImages}
          onChange={e=>setExtraImages(e.target.value)}
        /><br/>

        <input
          placeholder="Variants (e.g., 250gm:120:50, 500gm:220:10) -> weight:price:stock"
          value={variantsInput}
          onChange={e=>setVariantsInput(e.target.value)}
        /><br/>

        <button
          style={greenBtn}
          onMouseOver={(e)=>glow(e,true)}
          onMouseOut={(e)=>glow(e,false)}
          onClick={saveProduct}
        >
          {editingSlug ? "Update Product" : "Add Product"}
        </button>

        {editingSlug && (
          <button
            style={{ ...greenBtn, marginLeft: "10px", background: "#777" }}
            onClick={() => {
              setEditingSlug(null);
              setName("");
              setSlug("");
              setPrice("");
              setStock("");
              setDescription("");
              setImage("");
              setExtraImages("");
              setVariantsInput("");
            }}
          >
            Cancel
          </button>
        )}

        <hr />

        <h3>Existing Products</h3>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {products.map(p => (
            <div key={p.slug}
                 style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>

              <strong>{p.name}</strong> — ₹{p.price}

              {p.image && (
                <div>
                  <img src={p.image} alt="" style={{ width: 80, marginTop: "5px" }} />
                </div>
              )}

              <div>Stock: {p.stock}</div>

              <button
                style={{ ...greenBtn, marginTop: "5px", marginRight: "10px" }}
                onClick={()=>handleEdit(p)}
              >
                Edit
              </button>

              <button
                style={greenBtn}
                onClick={()=>deleteProduct(p.slug)}
              >
                Delete
              </button>

            </div>
          ))}
        </div>

      </div>

      {/* ================= ORDERS SECTION ================= */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>

        <h3>Orders</h3>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ background: "#f0f4f2" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>#</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Order</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Address</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Payment</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Order Items</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {orders.slice(0, visibleOrders).map((o, index) => (
              <tr key={o.order_id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{index + 1}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{o.order_id}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{o.customer_name}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>₹{o.total_amount}</td>

                <td
                  style={{ padding: "12px", verticalAlign: "middle" }}
                  title={`${o.full_address || o.address}
${o.city || ""}, ${o.state || ""} - ${o.pincode || ""}`}
                >
                  {o.city && o.state
                    ? `${o.city}, ${o.state}`
                    : o.address?.substring(0, 25)}

                  <span
                    style={{ cursor: "pointer", marginLeft: "6px" }}
                    onClick={() =>
                      copyAddress(
                        `${o.full_address || o.address}
${o.city || ""}, ${o.state || ""} - ${o.pincode || ""}`
                      )
                    }
                  >
                    📋
                  </span>
                </td>

                <td style={{
                  padding: "12px",
                  verticalAlign: "middle",
                  color: o.payment_status === "PAID" ? "green" : "orange",
                  fontWeight: "bold"
                }}>
                  {o.payment_status}
                </td>

                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <select
                    value={o.order_status}
                    onChange={(e)=>updateOrderStatus(o.order_id, e.target.value)}
                  >
                    <option>CREATED</option>
                    <option>PACKED</option>
                    <option>SHIPPED</option>
                    <option>DELIVERED</option>
                    <option>CANCELLED</option>
                  </select>
                </td>

                <td
                  style={{ padding: "12px", verticalAlign: "middle", cursor: "help", color: "#2f6f4e" }}
                  title={
                    o.items.map(item =>
                      `${item.product_name} ${
                        item.variant_key ? `(${item.variant_key})` : ""
                      } x ${item.quantity}`
                    ).join("\n")
                  }
                >
                  Order Items
                </td>

                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <button
                    style={greenBtn}
                    onMouseOver={(e)=>glow(e,true)}
                    onMouseOut={(e)=>glow(e,false)}
                    onClick={()=>downloadInvoice(o.order_id)}
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {visibleOrders < orders.length && (
            <button
              style={{ ...greenBtn, marginRight: "10px" }}
              onMouseOver={(e)=>glow(e,true)}
              onMouseOut={(e)=>glow(e,false)}
              onClick={() => setVisibleOrders(prev => prev + 15)}
            >
              Load 15 More
            </button>
          )}

          {visibleOrders > 15 && (
            <button
              style={{ ...greenBtn, background: "#777" }}
              onMouseOver={(e)=>glow(e,true)}
              onMouseOut={(e)=>glow(e,false)}
              onClick={() => setVisibleOrders(15)}
            >
              Show Less
            </button>
          )}
        </div>

      </div>

    </div>
  );
}