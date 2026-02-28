import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {

  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const greenBtn = {
    background: "#2f6f4e",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.2s ease"
  };

  const glow = (e, on) => {
    e.target.style.boxShadow = on ? "0 0 12px rgba(47,111,78,0.4)" : "none";
  };

  if (cart.length === 0) {
    return (
      <div
        className="container"
        style={{
          padding: "60px 20px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Your Cart is Empty</h2>
        <p style={{ opacity: 0.6, marginBottom: "20px" }}>
          Looks like you haven’t added anything yet.
        </p>

        <Link to="/products">
          <button
            style={greenBtn}
            onMouseOver={(e)=>glow(e,true)}
            onMouseOut={(e)=>glow(e,false)}
          >
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >

      <h2 style={{
        marginBottom: "30px",
        fontWeight: "600",
        letterSpacing: "0.5px"
      }}>
        Your Cart
      </h2>

      {/* CART ITEMS */}
      {cart.map(item => (

        <div
          key={`${item.slug}-${item.variantKey || "base"}`}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >

          <div style={{ display: "flex", justifyContent: "space-between" }}>

            <div>
              <h4 style={{ margin: "0 0 8px 0" }}>{item.name}</h4>

              {item.variantKey && (
                <span
                  style={{
                    display: "inline-block",
                    background: "#2f6f4e",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    marginBottom: "8px"
                  }}
                >
                  {item.variantKey}
                </span>
              )}

              <div style={{ marginTop: "5px", fontWeight: "500" }}>
                ₹{item.price} each
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: "8px" }}>
                Subtotal: ₹{item.price * item.qty}
              </div>

              <div>
                <input
                  type="number"
                  min="1"
                  max={item.maxStock} // Enforce HTML limit
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(
                      item.slug,
                      item.variantKey,
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: "70px",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    marginRight: "10px"
                  }}
                />

                <button
                  onClick={() =>
                    removeFromCart(item.slug, item.variantKey)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#c0392b",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Remove
                </button>
              </div>
              
              {/* MAX STOCK WARNING UI */}
              {item.qty >= item.maxStock && (
                <div style={{ 
                  fontSize: "12px", 
                  color: "#d9534f", 
                  marginTop: "6px",
                  fontWeight: "500" 
                }}>
                  Limit reached ({item.maxStock} available)
                </div>
              )}

            </div>

          </div>

        </div>
      ))}

      {/* ORDER SUMMARY */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginTop: "30px"
        }}
      >

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "16px",
          marginBottom: "10px"
        }}>
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          opacity: 0.7,
          marginBottom: "20px"
        }}>
          <span>Shipping</span>
          <span>{total >= 999 ? "FREE" : "₹80 (Calculated at checkout)"}</span>
        </div>

        <hr style={{ marginBottom: "20px", borderColor: "#eee" }} />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "20px"
        }}>
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <Link to="/checkout">
          <button
            style={{ ...greenBtn, width: "100%" }}
            onMouseOver={(e)=>glow(e,true)}
            onMouseOut={(e)=>glow(e,false)}
          >
            Proceed to Checkout
          </button>
        </Link>

      </div>

    </div>
  );
};

export default Cart;