import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  const [extraImages, setExtraImages] = useState("");
  const [variantsInput, setVariantsInput] = useState("");

  const loadProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  const loadOrders = async () => {
    const res = await api.get("/admin/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const updateStock = async (slug, newStock) => {
    if (newStock === "") return;

    try {
      await api.patch(`/admin/products/${slug}/stock`, {
        stock: parseInt(newStock, 10)
      });

      alert("Stock updated successfully ✅");
      loadProducts();

    } catch (err) {
      console.error(err);
      alert("Stock update failed ❌");
    }
  };

  const uploadImage = async () => {
    if (!file) return alert("Select image");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setImage(res.data.imageUrl);
      alert("Image uploaded successfully ✅");

    } catch (err) {
      console.error(err);
      alert("Image upload failed ❌");
    }
  };

  const addProduct = async () => {

    try {

      const imagesArray = extraImages
        ? extraImages.split(",").map(i => i.trim())
        : null;

      let variantsArray = null;

      if (variantsInput) {
        variantsArray = variantsInput.split(",").map(v => {
          const [weight, price] = v.split(":");
          return {
            weight: weight.trim(),
            price: Number(price.trim())
          };
        });
      }

      const res = await api.post("/admin/products", {
        name,
        slug,
        price,
        stock: parseInt(stock || 0, 10),
        image,
        images: imagesArray,
        variants: variantsArray,
        description
      });

      alert(res.data.message || "Product added successfully ✅");

      setName("");
      setSlug("");
      setPrice("");
      setStock("");
      setDescription("");
      setImage("");
      setExtraImages("");
      setVariantsInput("");

      loadProducts();

    } catch (err) {
      console.error(err);
      alert("Product creation failed ❌");
    }
  };

  const deleteProduct = async (slug) => {

    if (!window.confirm("Delete product?")) return;

    try {

      const res = await api.delete(`/admin/products/${slug}`);

      alert(res.data.message || "Product deleted successfully ✅");

      loadProducts();

    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {

    try {

      await api.patch(`/admin/orders/${orderId}/status`, {
        order_status: newStatus
      });

      alert("Order status updated ✅");
      loadOrders();

    } catch (err) {
      console.error(err);
      alert("Order update failed ❌");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="container">

      <h1>Admin Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Upload Product Image</h3>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>

      {image && <img src={image} alt="" style={{ width: 120 }} />}

      <hr />

      <h3>Add Product</h3>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /><br />
      <input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} /><br />
      <input placeholder="Base Price" value={price} onChange={e => setPrice(e.target.value)} /><br />
      <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      /><br />

      <input
        placeholder="Extra Image URLs (comma separated)"
        value={extraImages}
        onChange={e => setExtraImages(e.target.value)}
      /><br />

      <input
        placeholder="Variants (250gm:120,500gm:220,1kg:400)"
        value={variantsInput}
        onChange={e => setVariantsInput(e.target.value)}
      /><br />

      <button onClick={addProduct}>Add Product</button>

      <hr />

      <h3>Existing Products</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map(p => (
          <li key={p.slug}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "15px"
              }}>

            <strong>{p.name}</strong> – ₹{p.price}

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginTop: "8px"
            }}>

              {p.image && (
                <img src={p.image} alt="" style={{ width: 70 }} />
              )}

              <div>

                <div>
                  <strong>Available Stock:</strong>{" "}
                  <span style={{
                    color:
                      p.stock === 0
                        ? "red"
                        : p.stock < 5
                        ? "orange"
                        : "green",
                    fontWeight: "bold"
                  }}>
                    {p.stock}
                  </span>
                </div>

                <input
                  type="number"
                  defaultValue={p.stock}
                  style={{ width: "80px", marginTop: "5px" }}
                  onBlur={(e) => updateStock(p.slug, e.target.value)}
                />

              </div>

            </div>

            <button
              style={{ marginTop: "10px" }}
              onClick={() => deleteProduct(p.slug)}
            >
              Delete
            </button>

          </li>
        ))}
      </ul>

      <hr />

      <h2>Orders</h2>

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="10"
               style={{ width: "100%", borderCollapse: "collapse" }}>

          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <>
                <tr key={o.id}>
                  <td>{o.order_id}</td>
                  <td>{o.customer_name}</td>
                  <td>₹{o.total_amount}</td>

                  <td style={{
                    color: o.payment_status === "PAID"
                      ? "green"
                      : "orange",
                    fontWeight: "bold"
                  }}>
                    {o.payment_status}
                  </td>

                  <td>{o.order_status}</td>

                  <td>
                    <select
                      value={o.order_status}
                      onChange={(e) =>
                        updateOrderStatus(o.order_id, e.target.value)
                      }
                    >
                      <option>CREATED</option>
                      <option>PACKED</option>
                      <option>SHIPPED</option>
                      <option>DELIVERED</option>
                      <option>CANCELLED</option>
                    </select>
                  </td>
                </tr>

                {/* NEW: Order Items Display */}
                {o.items && o.items.length > 0 && (
                  <tr>
                    <td colSpan="6" style={{ background: "#f9f9f9" }}>
                      <strong>Items:</strong>
                      <ul style={{ marginTop: "8px" }}>
                        {o.items.map((item, index) => (
                          <li key={index}>
                            {item.product_name}
                            {item.variant_key && ` (${item.variant_key})`}
                            {" – "}₹{item.price} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}