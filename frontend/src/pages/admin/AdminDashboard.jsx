import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

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

  /* UPDATE ORDER STATUS */
  const updateOrderStatus = async (orderId, newStatus) => {

    try {

      await api.patch(`/admin/orders/${orderId}/status`, {
        order_status: newStatus
      });

      loadOrders();

    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    }
  };

  /* IMAGE UPLOAD */
  const uploadImage = async () => {

    if (!file) return alert("Select an image");

    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post("/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setImage(res.data.imageUrl);
  };

  const addProduct = async () => {

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
    setImage("");

    loadProducts();
  };

  const deleteProduct = async (slug) => {

    if (!window.confirm("Delete product?")) return;

    await api.delete(`/admin/products/${slug}`);
    loadProducts();
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
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} /><br />

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
          <li key={p.slug}>
            <strong>{p.name}</strong> – ₹{p.price}
            <br />
            {p.image && <img src={p.image} alt="" style={{ width: 80 }} />}
            <br />
            <button onClick={() => deleteProduct(p.slug)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <hr />

      {/* ⭐ ORDERS SECTION */}

      <h2>Orders</h2>

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
            <tr key={o.id}>
              <td>{o.order_id}</td>
              <td>{o.customer_name}</td>
              <td>₹{o.total_amount}</td>

              <td style={{
                color: o.payment_status === "PAID" ? "green" : "orange",
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
          ))}
        </tbody>
      </table>

    </div>
  );
}
