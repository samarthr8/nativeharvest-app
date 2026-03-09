import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function AdminAddProduct() {
  const location = useLocation();
  const navigate = useNavigate();

  const [editingSlug, setEditingSlug] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [variantsInput, setVariantsInput] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [extraFiles, setExtraFiles] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);

  const greenBtn = { background: "#2f6f4e", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", transition: "0.2s ease" };
  const glow = (e, on) => e.target.style.boxShadow = on ? "0 0 10px #2f6f4e" : "none";

  // Check if we navigated here from the "Edit" button on the Products page
  useEffect(() => {
    if (location.state?.product) {
      const p = location.state.product;
      setEditingSlug(p.slug); setName(p.name); setSlug(p.slug);
      setPrice(p.price); setStock(p.stock); setDescription(p.description || "");
      setCategory(p.category || ""); setImage(p.image || ""); setExtraImages(p.images || []);
      setVariantsInput(p.variants ? p.variants.map(v => `${v.weight}:${v.price}:${v.stock || 0}`).join(", ") : "");
    }
  }, [location.state]);

  const uploadImage = async () => {
    if (!file) return alert("Select image");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/admin/upload", formData);
      setImage(res.data.imageUrl);
      alert("Main image uploaded ✅");
    } catch (err) { alert("Image upload failed"); }
  };

  const uploadExtraImages = async () => {
    if (!extraFiles || extraFiles.length === 0) return alert("Select extra images first");
    setIsUploadingExtra(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < extraFiles.length; i++) {
        const formData = new FormData();
        formData.append("image", extraFiles[i]);
        const res = await api.post("/admin/upload", formData);
        uploadedUrls.push(res.data.imageUrl);
      }
      setExtraImages(prev => [...prev, ...uploadedUrls]);
      setExtraFiles(null);
      alert("Extra images uploaded ✅");
    } catch (err) { alert("Failed to upload some extra images"); } 
    finally { setIsUploadingExtra(false); }
  };

  const removeExtraImage = (indexToRemove) => setExtraImages(prev => prev.filter((_, index) => index !== indexToRemove));

  const saveProduct = async () => {
    if (!category) return alert("Please choose a category!");
    let variantsArray = null;
    if (variantsInput) {
      variantsArray = variantsInput.split(",").map(v => {
        const parts = v.split(":");
        return { weight: parts[0]?.trim(), price: Number(parts[1]?.trim() || 0), stock: Number(parts[2]?.trim() || 0) };
      });
    }
    let imagesArray = extraImages.length > 0 ? extraImages : null;

    if (editingSlug) {
      await api.put(`/admin/products/${editingSlug}`, { name, price, stock: parseInt(stock || 0, 10), image, images: imagesArray, variants: variantsArray, description, category });
      alert("Product updated ✅");
      navigate("/admin/products"); // Redirect back to products list after editing
    } else {
      await api.post("/admin/products", { name, slug, price, stock: parseInt(stock || 0, 10), image, images: imagesArray, variants: variantsArray, description, category });
      alert("Product added ✅");
      setName(""); setSlug(""); setPrice(""); setStock(""); setDescription(""); setCategory("");
      setImage(""); setExtraImages([]); setVariantsInput(""); setFile(null); setExtraFiles(null);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7f6", minHeight: "100vh" }}>
      <AdminNavbar />

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
        <h3>{editingSlug ? "Edit Product" : "Add Product"}</h3>

        <div style={{ marginBottom: "15px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
          <h4>Main Thumbnail Image</h4>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button style={{ ...greenBtn, marginLeft: "10px" }} onClick={uploadImage}>Upload</button>
          {image && <div style={{ marginTop: "10px" }}><img src={image} alt="" style={{ width: "80px", borderRadius: "6px" }} /></div>}
        </div>

        <div style={{ marginBottom: "20px", padding: "15px", border: "1px dashed #ccc", borderRadius: "8px", background: "#fafafa" }}>
          <h4>Extra Images (Gallery)</h4>
          <input type="file" multiple onChange={e => setExtraFiles(e.target.files)} />
          <button style={{ ...greenBtn, marginLeft: "10px", background: isUploadingExtra ? "#777" : "#2f6f4e" }} onClick={uploadExtraImages} disabled={isUploadingExtra}>
            {isUploadingExtra ? "Uploading..." : "Upload Extra Images"}
          </button>
          {extraImages.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
              {extraImages.map((imgUrl, idx) => (
                <div key={idx} style={{ position: "relative", width: "70px", height: "70px" }}>
                  <img src={imgUrl} alt="extra" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} />
                  <button onClick={() => removeExtraImage(idx)} style={{ position: "absolute", top: "-6px", right: "-6px", background: "#e74c3c", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        {!editingSlug && <input placeholder="Slug" value={slug} onChange={e=>setSlug(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />}
        <input placeholder="Base Price" value={price} onChange={e=>setPrice(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        <input placeholder="Base Stock" value={stock} onChange={e=>setStock(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "10px", height: "80px" }} />

        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "white" }}>
          <option value="" disabled>Choose Category</option>
          <option value="Pickles">Pickles</option>
          <option value="Preserves">Preserves & Jams</option>
          <option value="Oils & Essentials">Oils & Essentials</option>
          <option value="Heritage Staples">Heritage Staples</option>
          <option value="Healthy Snacks">Healthy Snacks</option>
        </select>

        <input placeholder="Variants (e.g., 250gm:120:50, 500gm:220:10) -> weight:price:stock" value={variantsInput} onChange={e=>setVariantsInput(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "15px" }} />

        <button style={greenBtn} onMouseOver={(e)=>glow(e,true)} onMouseOut={(e)=>glow(e,false)} onClick={saveProduct}>
          {editingSlug ? "Update Product" : "Add Product"}
        </button>

        {editingSlug && (
          <button style={{ ...greenBtn, marginLeft: "10px", background: "#777" }} onClick={() => navigate("/admin/products")}>Cancel</button>
        )}
      </div>
    </div>
  );
}