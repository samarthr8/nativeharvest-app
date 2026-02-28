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
  const [category, setCategory] = useState("Pickles"); // <--- NEW STATE
  const [variantsInput, setVariantsInput] = useState("");
  
  // --- MAIN IMAGE STATES ---
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  // --- NEW: EXTRA IMAGES STATES ---
  const [extraFiles, setExtraFiles] = useState(null);
  const [extraImages, setExtraImages] = useState([]); // Now an array instead of a string
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);

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

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  // --- UPLOAD MAIN IMAGE ---
  const uploadImage = async () => {
    if (!file) return alert("Select image");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/admin/upload", formData);

      setImage(res.data.imageUrl);
      alert("Main image uploaded ✅");

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.response?.data?.message || "Image upload failed");
    }
  };

  // --- NEW: UPLOAD MULTIPLE EXTRA IMAGES ---
  const uploadExtraImages = async () => {
    if (!extraFiles || extraFiles.length === 0) return alert("Select extra images first");
    
    setIsUploadingExtra(true);
    try {
      const uploadedUrls = [];
      
      // Loop through selected files and upload them one by one
      for (let i = 0; i < extraFiles.length; i++) {
        const formData = new FormData();
        formData.append("image", extraFiles[i]);
        
        const res = await api.post("/admin/upload", formData);
        uploadedUrls.push(res.data.imageUrl);
      }

      // Add new URLs to the existing array of extra images
      setExtraImages(prev => [...prev, ...uploadedUrls]);
      setExtraFiles(null);
      alert("Extra images uploaded ✅");

    } catch (err) {
      console.error("UPLOAD EXTRA ERROR:", err);
      alert("Failed to upload some extra images");
    } finally {
      setIsUploadingExtra(false);
    }
  };

  // --- NEW: REMOVE EXTRA IMAGE THUMBNAIL ---
  const removeExtraImage = (indexToRemove) => {
    setExtraImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleEdit = (product) => {
    setEditingSlug(product.slug);
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setStock(product.stock);
    setDescription(product.description || "");
    setImage(product.image || "");
    setCategory(product.category || "Pickles"); // <--- ADD THIS
    
    // Set extra images array
    setExtraImages(product.images || []);
    
    // Set variants
    setVariantsInput(
      product.variants
        ? product.variants.map(v => `${v.weight}:${v.price}:${v.stock || 0}`).join(", ")
        : ""
    );
  };

  const saveProduct = async () => {

    let variantsArray = null;
    if (variantsInput) {
      variantsArray = variantsInput.split(",").map(v => {
        const parts = v.split(":");
        return { 
          weight: parts[0]?.trim(), 
          price: Number(parts[1]?.trim() || 0),
          stock: Number(parts[2]?.trim() || 0)
        };
      });
    }

    // Use the extraImages array directly
    let imagesArray = extraImages.length > 0 ? extraImages : null;

    if (editingSlug) {
      await api.put(`/admin/products/${editingSlug}`, {
        name,
        price,
        stock: parseInt(stock || 0, 10),
        image,
        images: imagesArray,
        variants: variantsArray,
        description,
        category // <--- ADD THIS
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
        description,
        category  // <--- ADD THIS
      });
      alert("Product added ✅");
    }

    // Reset Form
    setName("");
    setSlug("");
    setPrice("");
    setStock("");
    setDescription("");
    setImage("");
    setExtraImages([]); // Reset array
    setCategory("Pickles");
    setVariantsInput("");
    setFile(null);
    setExtraFiles(null);

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
          <h1 style={{ fontSize: "30px", fontWeight: "600", letterSpacing: "0.6px", marginBottom: "6px", color: "#1f2d2a" }}>
            Admin Dashboard
          </h1>
          <div style={{ width: "70px", height: "3px", background: "#2f6f4e", borderRadius: "2px" }} />
        </div>

        <button style={greenBtn} onMouseOver={(e)=>glow(e,true)} onMouseOut={(e)=>glow(e,false)} onClick={logout}>
          Logout
        </button>
      </div>

      {/* ================= PRODUCTS SECTION ================= */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>

        <h3>{editingSlug ? "Edit Product" : "Add Product"}</h3>

        {/* MAIN IMAGE UPLOAD */}
        <div style={{ marginBottom: "15px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
          <h4>Main Thumbnail Image</h4>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button style={{ ...greenBtn, marginLeft: "10px" }} onClick={uploadImage}>
            Upload Main Image
          </button>
          {image && (
            <div style={{ marginTop: "10px" }}>
              <img src={image} alt="" style={{ width: "80px", borderRadius: "6px" }} />
            </div>
          )}
        </div>

        {/* EXTRA IMAGES UPLOAD (THUMBNAIL GRID) */}
        <div style={{ marginBottom: "20px", padding: "15px", border: "1px dashed #ccc", borderRadius: "8px", background: "#fafafa" }}>
          <h4>Extra Images (Gallery)</h4>
          <input 
            type="file" 
            multiple 
            onChange={e => setExtraFiles(e.target.files)} 
          />
          <button
            style={{ ...greenBtn, marginLeft: "10px", background: isUploadingExtra ? "#777" : "#2f6f4e" }}
            onClick={uploadExtraImages}
            disabled={isUploadingExtra}
          >
            {isUploadingExtra ? "Uploading..." : "Upload Extra Images"}
          </button>
          
          {/* Thumbnails Grid */}
          {extraImages.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
              {extraImages.map((imgUrl, idx) => (
                <div key={idx} style={{ position: "relative", width: "70px", height: "70px" }}>
                  <img 
                    src={imgUrl} 
                    alt="extra" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} 
                  />
                  <button 
                    onClick={() => removeExtraImage(idx)}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      background: "#e74c3c", color: "white", border: "none",
                      borderRadius: "50%", width: "22px", height: "22px",
                      cursor: "pointer", fontSize: "14px", display: "flex", 
                      alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        {!editingSlug && (
          <input placeholder="Slug" value={slug} onChange={e=>setSlug(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        )}

        <input placeholder="Base Price" value={price} onChange={e=>setPrice(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        <input placeholder="Base Stock" value={stock} onChange={e=>setStock(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e=>setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", height: "80px" }}
        />

        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
        >
          <option value="Pickles">Pickles</option>
          <option value="Preserves">Preserves & Jams</option>
          <option value="Oils & Essentials">Oils & Essentials</option>
          <option value="Heritage Staples">Heritage Staples</option>
          <option value="Healthy Snacks">Healthy Snacks</option>
          <option value="Uncategorized">Uncategorized</option>
        </select>        

        <input
          placeholder="Variants (e.g., 250gm:120:50, 500gm:220:10) -> weight:price:stock"
          value={variantsInput}
          onChange={e=>setVariantsInput(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        />

        <button style={greenBtn} onMouseOver={(e)=>glow(e,true)} onMouseOut={(e)=>glow(e,false)} onClick={saveProduct}>
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
              setExtraImages([]);
              setVariantsInput("");
              setFile(null);
              setExtraFiles(null);
            }}
          >
            Cancel
          </button>
        )}

        <hr style={{ margin: "30px 0" }} />

        <h3>Existing Products</h3>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {products.map(p => (
            <div key={p.slug} style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {p.image ? (
                  <img src={p.image} alt="" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                ) : (
                  <div style={{ width: "50px", height: "50px", background: "#eee", borderRadius: "6px" }} />
                )}
                <div>
                  <strong>{p.name}</strong> <br/>
                  <span style={{ fontSize: "13px", color: "#666" }}>₹{p.price} | Stock: {p.stock}</span>
                </div>
              </div>

              <div>
                <button style={{ ...greenBtn, marginRight: "10px" }} onClick={()=>handleEdit(p)}>
                  Edit
                </button>
                <button style={{ ...greenBtn, background: "#d9534f" }} onClick={()=>deleteProduct(p.slug)}>
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ================= ORDERS SECTION ================= */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>

        <h3>Orders</h3>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", fontSize: "14px" }}>
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
                <td style={{ padding: "12px" }}>{index + 1}</td>
                <td style={{ padding: "12px" }}>{o.order_id}</td>
                <td style={{ padding: "12px" }}>{o.customer_name}</td>
                <td style={{ padding: "12px" }}>₹{o.total_amount}</td>

                <td
                  style={{ padding: "12px" }}
                  title={`${o.full_address || o.address}\n${o.city || ""}, ${o.state || ""} - ${o.pincode || ""}`}
                >
                  {o.city && o.state
                    ? `${o.city}, ${o.state}`
                    : o.address?.substring(0, 25)}

                  <span
                    style={{ cursor: "pointer", marginLeft: "6px" }}
                    onClick={() =>
                      copyAddress(
                        `${o.full_address || o.address}\n${o.city || ""}, ${o.state || ""} - ${o.pincode || ""}`
                      )
                    }
                  >
                    📋
                  </span>
                </td>

                <td style={{
                  padding: "12px",
                  color: o.payment_status === "PAID" ? "green" : "orange",
                  fontWeight: "bold"
                }}>
                  {o.payment_status}
                </td>

                <td style={{ padding: "12px" }}>
                  <select
                    value={o.order_status}
                    onChange={(e)=>updateOrderStatus(o.order_id, e.target.value)}
                    style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option>CREATED</option>
                    <option>PACKED</option>
                    <option>SHIPPED</option>
                    <option>DELIVERED</option>
                    <option>CANCELLED</option>
                  </select>
                </td>

                <td
                  style={{ padding: "12px", cursor: "help", color: "#2f6f4e", fontWeight: "bold" }}
                  title={
                    o.items.map(item =>
                      `${item.product_name} ${
                        item.variant_key ? `(${item.variant_key})` : ""
                      } x ${item.quantity}`
                    ).join("\n")
                  }
                >
                  View Items
                </td>

                <td style={{ padding: "12px" }}>
                  <button
                    style={{ ...greenBtn, padding: "6px 10px", fontSize: "12px" }}
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
            <button style={{ ...greenBtn, marginRight: "10px" }} onClick={() => setVisibleOrders(prev => prev + 15)}>
              Load 15 More
            </button>
          )}

          {visibleOrders > 15 && (
            <button style={{ ...greenBtn, background: "#777" }} onClick={() => setVisibleOrders(15)}>
              Show Less
            </button>
          )}
        </div>

      </div>

    </div>
  );
}