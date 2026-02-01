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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    const payload = {
      ...form,
      items: cart.map(item => ({
        slug: item.slug,
        qty: item.qty
      }))
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    clearCart();
    navigate(`/order/${data.order_id}`);
  };

  return (
    <div>
      <h2>Checkout</h2>

      <input name="customer_name" placeholder="Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <textarea name="address" placeholder="Address" />

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;

