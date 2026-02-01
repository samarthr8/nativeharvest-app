import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.map(item => (
        <div key={item.slug}>
          <h4>{item.name}</h4>
          <p>₹{item.price}</p>

          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) =>
              updateQty(item.slug, Number(e.target.value))
            }
          />

          <button onClick={() => removeFromCart(item.slug)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
};

export default Cart;

