import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {

  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return <p className="container">Your cart is empty.</p>;
  }

  return (
    <div className="container">

      <h2>Your Cart</h2>

      {cart.map(item => (

        <div
          key={`${item.slug}-${item.variantKey || "base"}`}
          className="card"
          style={{ padding: "20px", marginBottom: "15px" }}
        >

          <h4>{item.name}</h4>

          {item.variantKey && (
            <p style={{ fontSize: "14px", opacity: 0.7 }}>
              Weight: {item.variantKey}
            </p>
          )}

          <p>₹{item.price}</p>

          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) =>
              updateQty(
                item.slug,
                item.variantKey,
                Number(e.target.value)
              )
            }
          />

          <button
            onClick={() =>
              removeFromCart(item.slug, item.variantKey)
            }
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>

        </div>
      ))}

      <div className="total" style={{ marginTop: "20px", fontWeight: "bold" }}>
        Total: ₹{total}
      </div>

      <Link to="/checkout">
        <button style={{ marginTop: "10px" }}>
          Proceed to Checkout
        </button>
      </Link>

    </div>
  );
};

export default Cart;
