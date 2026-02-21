import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(15);

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
    api.get("/products").then(res => setProducts(res.data));
    api.get("/admin/orders").then(res => setOrders(res.data));
  }, []);

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
    e.target.style.boxShadow = on ? "0 0 12px #2f6f4e" : "none";
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

      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      {/* PRODUCTS SECTION */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "30px"
      }}>
        <h3>Existing Products</h3>

        <div style={{
          maxHeight: "350px",
          overflowY: "auto",
          marginTop: "15px"
        }}>
          {products.slice(0, 5).map(p => (
            <div key={p.slug}
                 style={{
                   padding: "10px",
                   borderBottom: "1px solid #eee"
                 }}>
              <strong>{p.name}</strong> — ₹{p.price}
              <div style={{ fontSize: "13px", color: "#777" }}>
                Stock: {p.stock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS SECTION */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}>

        <h3>Orders</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px"
          }}
        >
          <thead>
            <tr style={{ background: "#f0f4f2" }}>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Items</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {orders.slice(0, visibleOrders).map(o => (
              <tr key={o.order_id} style={{ borderBottom: "1px solid #eee" }}>

                <td>{o.order_id}</td>
                <td>{o.customer_name}</td>
                <td>₹{o.total_amount}</td>

                <td title={o.address}>
                  {o.address.length > 25
                    ? o.address.substring(0, 25) + "..."
                    : o.address}
                  <span
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                    onClick={() => copyAddress(o.address)}
                  >
                    📋
                  </span>
                </td>

                <td style={{
                  color: o.payment_status === "PAID" ? "green" : "orange",
                  fontWeight: "bold"
                }}>
                  {o.payment_status}
                </td>

                <td>{o.order_status}</td>

                <td
                  title={
                    o.items.map(item =>
                      `${item.product_name} ${
                        item.variant_key ? `(${item.variant_key})` : ""
                      } x ${item.quantity}`
                    ).join("\n")
                  }
                  style={{ cursor: "help", color: "#2f6f4e" }}
                >
                  Hover
                </td>

                <td>
                  <button
                    style={greenBtn}
                    onMouseOver={(e)=>glow(e,true)}
                    onMouseOut={(e)=>glow(e,false)}
                    onClick={() => downloadInvoice(o.order_id)}
                  >
                    PDF
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {visibleOrders < orders.length && (
          <button
            style={{ ...greenBtn, marginTop: "20px" }}
            onMouseOver={(e)=>glow(e,true)}
            onMouseOut={(e)=>glow(e,false)}
            onClick={() => setVisibleOrders(prev => prev + 15)}
          >
            Load 15 More Orders
          </button>
        )}

      </div>

    </div>
  );
}