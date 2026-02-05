import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {

  /* ---------------- PRODUCTS ---------------- */

  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  const loadProducts = () => {
    api.get("/products").then(res => setProducts(res.data));
  };

  useEffect(() => {
    loadProducts();
    loadOrders(); // ⭐ load orders too
  }, []);

  /* ---------------- ORDERS ---------------- */

  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  /* IMAGE UPLOAD */
  const uploadImage = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setImage(res.data.imageUrl);
      alert("Image uploaded successfully");

    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    }
  };

  /* ADD PRODUCT */
  const addProduct = async () => {
    try {
      await api.post("/admin/products", {
        name,
        slug,
        price,
        image,
        description
      });

      setName("");
      setSlug("");
      setPrice("");
      setDescription("");
      setFile(null);
      setImage("");

      loadProducts();
      alert("Product added successfully");

    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    }
  };

  /* DELETE PRODUCT */
  const deleteProduct = async (slug) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/products/${slug}`);
      loadProducts();
      alert("Product deleted");

    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  /* LOGOUT */
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      {/* ---------------- PRODUCTS UI ---------------- */}

      <h3>Upload Product Image</h3>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>

      {image && (
        <p>
          Image uploaded:
          <br />
          <img
            src={image}
            alt="Uploaded"
            style={{ width: "120px", marginTop: "10px" }}
          />
        </p>
      )}

      <hr />

      <h3>Add Product</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      /><br />

      <input
        placeholder="Slug"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      /><br />

      <button onClick={addProduct}>Add Product</button>

      <hr />

      <h3>Existing Products</h3>

      <ul>
        {products.map(p => (
          <li key={p.slug} style={{ marginBottom: "10px" }}>
            <strong>{p.name}</strong> – ₹{p.price}
            <br />
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "80px", marginTop: "5px" }}
              />
            )}
            <br />
            <button
              style={{ marginTop: "5px" }}
              onClick={() => deleteProduct(p.slug)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ---------------- ORDERS UI ---------------- */}

      <hr />

      <h2>Orders</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}
      >
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>{order.phone}</td>
              <td>₹{order.total_amount}</td>

              <td
                style={{
                  color:
                    order.payment_status === "PAID"
                      ? "green"
                      : "orange",
                  fontWeight: "bold"
                }}
              >
                {order.payment_status}
              </td>

              <td>
                {new Date(order.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
