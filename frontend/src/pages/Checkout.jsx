import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    full_address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.full_address || !form.city || !form.state || !form.pincode) {
      alert("Please fill all address fields");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      alert("Pincode must be 6 digits");
      return false;
    }

    return true;
  };

  const placeOrder = async () => {

    if (!validateForm()) return;

    try {

      setLoading(true);

      const combinedAddress = `
${form.full_address},
${form.city},
${form.state} - ${form.pincode}
      `.trim();

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          email: form.email,
          full_address: form.full_address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          address: combinedAddress,
          items: cart.map(item => ({
            slug: item.slug,
            qty: item.qty,
            price: item.price,
            variant_key: item.variantKey || null
          }))
        })
      });

      const data = await res.json();

      if (!data.order_id) {
        alert(data.message || "Order creation failed");
        setLoading(false);
        return;
      }

      clearCart();
      navigate(`/order-success/${data.order_id}`);

    } catch (err) {
      alert("Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    fontSize: "14px"
  };

  const greenBtn = {
    background: "#2f6f4e",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    width: "100%",
    transition: "0.2s ease"
  };

  const glow = (e, on) => {
    e.target.style.boxShadow = on ? "0 0 12px rgba(47,111,78,0.4)" : "none";
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f5f7f6",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "40px"
        }}
      >

        {/* LEFT SIDE — FORM */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >

          <h2 style={{ marginBottom: "25px" }}>
            Checkout
          </h2>

          <h4 style={{ marginBottom: "10px" }}>Contact Information</h4>

          <input
            name="customer_name"
            placeholder="Full Name"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleChange}
          />

          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Shipping Address
          </h4>

          <textarea
            name="full_address"
            placeholder="House No, Street, Area"
            style={{ ...inputStyle, height: "80px" }}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="state"
            placeholder="State"
            style={inputStyle}
            onChange={handleChange}
          />

          <input
            name="pincode"
            placeholder="Pincode"
            style={inputStyle}
            onChange={handleChange}
          />

          <button
            onClick={placeOrder}
            disabled={loading}
            style={greenBtn}
            onMouseOver={(e)=>glow(e,true)}
            onMouseOut={(e)=>glow(e,false)}
          >
            {loading ? "Placing Order..." : `Place Order • ₹${total}`}
          </button>

        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            height: "fit-content"
          }}
        >

          <h3 style={{ marginBottom: "20px" }}>
            Order Summary
          </h3>

          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "14px"
              }}
            >
              <div>
                {item.name}
                {item.variantKey && (
                  <div style={{ fontSize: "12px", opacity: 0.6 }}>
                    {item.variantKey}
                  </div>
                )}
                × {item.qty}
              </div>
              <div>₹{item.price * item.qty}</div>
            </div>
          ))}

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "16px"
            }}
          >
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <p style={{
            marginTop: "20px",
            fontSize: "12px",
            opacity: 0.6
          }}>
            Secure checkout powered by NativeHarvest.
          </p>

        </div>

      </div>
    </div>
  );
};

export default Checkout;