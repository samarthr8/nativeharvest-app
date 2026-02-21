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

  const downloadInvoice = async (orderId) => {
    try {
      const res = await api.get(`/admin/orders/${orderId}/invoice`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${orderId}-invoice.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      alert("Invoice download failed ❌");
    }
  };

  return (
    <div className="container">

      <h1>Admin Dashboard</h1>

      <hr />

      <h2>Orders</h2>

      {orders.map(o => (
        <div
          key={o.order_id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            background: "#fff"
          }}
        >

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>{o.order_id}</strong>
              <div>{o.customer_name}</div>
              <div style={{ marginTop: "5px", color: "#555" }}>
                📍 {o.address}
              </div>
            </div>

            <div>
              <div>
                ₹{o.total_amount}
              </div>

              <div style={{
                color: o.payment_status === "PAID" ? "green" : "orange",
                fontWeight: "bold"
              }}>
                {o.payment_status}
              </div>

              <button
                style={{
                  marginTop: "8px",
                  background: "#2f6f4e",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={() => downloadInvoice(o.order_id)}
              >
                Download Invoice
              </button>
            </div>
          </div>

          <hr />

          <div>
            <strong>Items:</strong>

            {o.items.map((item, index) => (
              <div
                key={index}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  background: "#fafafa"
                }}
              >
                <div style={{ fontWeight: "bold" }}>
                  {item.product_name}
                </div>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: "5px",
                    background: "#2f6f4e",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                >
                  {item.variant_key || "Base Variant"}
                </span>

                <div style={{ marginTop: "5px" }}>
                  ₹{item.price} × {item.quantity}
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}