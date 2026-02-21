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
    address: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map(item => ({
            slug: item.slug,
            qty: item.qty,
            price: item.price,        // existing logic (variant price already handled)
            variantKey: item.variantKey || null   // ✅ NEW: send selected weight variant
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
      console.error(err);
      alert("Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>

      <input
        name="customer_name"
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Address"
        onChange={handleChange}
      />

      <button onClick={placeOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;