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
          address: combinedAddress, // backward compatibility
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

  return (
    <div>
      <h2>Checkout</h2>

      <input name="customer_name" placeholder="Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />

      <textarea
        name="full_address"
        placeholder="House No, Street, Area"
        onChange={handleChange}
      />

      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" onChange={handleChange} />

      <button onClick={placeOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;