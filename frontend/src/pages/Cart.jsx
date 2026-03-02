import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {

  const { cart, removeFromCart, updateQty } = useCart();
  const [stockWarning, setStockWarning] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // --- STALE CART VALIDATION LOGIC ---
  useEffect(() => {
    if (cart.length === 0) return;

    const validateStock = async () => {
      try {
        const res = await fetch("/api/products");
        const dbProducts = await res.json();
        let cartChanged = false;

        cart.forEach(cartItem => {
          // Find the live product from the DB
          const liveProduct = dbProducts.find(p => p.slug === cartItem.slug);
          
          if (!liveProduct) {
            // Product was deleted entirely
            removeFromCart(cartItem.slug, cartItem.variantKey);
            cartChanged = true;
            return;
          }

          // Find live variant stock
          let liveStock = liveProduct.stock;
          if (cartItem.variantKey && liveProduct.variants) {
            const liveVariant = liveProduct.variants.find(v => v.weight === cartItem.variantKey);
            if (liveVariant && liveVariant.stock !== undefined) {
              liveStock = liveVariant.stock;
            }
          }

          // If cart quantity exceeds live stock, adjust it
          if (liveStock === 0) {
            removeFromCart(cartItem.slug, cartItem.variantKey);
            cartChanged = true;
          } else if (cartItem.qty > liveStock) {
            updateQty(cartItem.slug, cartItem.variantKey, liveStock);
            cartChanged = true;
          }
        });

        if (cartChanged) {
          setStockWarning("Some items in your cart were updated because they sold out or their available stock changed.");
          // Clear the warning after 8 seconds
          setTimeout(() => setStockWarning(""), 8000);
        }
      } catch (err) {
        console.error("Failed to validate cart stock", err);
      }
    };

    // Run this validation once when the cart page opens
    validateStock();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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

      {/* --- STOCK WARNING BANNER --- */}
      {stockWarning && (
        <div style={{
          background: "#fef3c7",
          color: "#92400e",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #fcd34d",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          ⚠️ {stockWarning}
        </div>
      )}

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

          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{item.name}</h4>

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

              <div style={{ marginTop: "5px", fontWeight: "600", color: "#444" }}>
                ₹{item.price} each
              </div>
            </div>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ marginBottom: "12px", fontWeight: "700", fontSize: "16px" }}>
                Subtotal: ₹{item.price * item.qty}
              </div>

              {/* QUANTITY STEPPER & REMOVE BUTTON */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                
                {/* Stepper Container */}
                <div style={{ 
                  display: "flex", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px", 
                  overflow: "hidden" 
                }}>
                  <button 
                    onClick={() => updateQty(item.slug, item.variantKey, item.qty - 1)}
                    disabled={item.qty <= 1}
                    style={{ 
                      padding: "8px 14px", background: "#f9f9f9", border: "none", 
                      cursor: item.qty <= 1 ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "bold", color: "#333" 
                    }}
                  >
                    −
                  </button>
                  
                  <div style={{ 
                    padding: "8px 12px", background: "white", minWidth: "35px", 
                    textAlign: "center", fontSize: "15px", fontWeight: "600", 
                    borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {item.qty}
                  </div>
                  
                  <button 
                    onClick={() => updateQty(item.slug, item.variantKey, item.qty + 1)}
                    disabled={item.qty >= item.maxStock}
                    style={{ 
                      padding: "8px 14px", background: "#f9f9f9", border: "none", 
                      cursor: item.qty >= item.maxStock ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "bold", color: "#333" 
                    }}
                  >
                    +
                  </button>
                </div>

                {/* --- FIXED: Subtle text link for Remove --- */}
                <button
                  onClick={() => removeFromCart(item.slug, item.variantKey)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#999", /* Subtle grey */
                    padding: "8px 0",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "underline",
                    transition: "0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.color = "#d9534f"} /* Turns red only on hover */
                  onMouseOut={(e) => e.target.style.color = "#999"}
                >
                  Remove
                </button>
              </div>
              
              {/* MAX STOCK WARNING UI */}
              {item.qty >= item.maxStock && (
                <div style={{ 
                  fontSize: "12px", 
                  color: "#d9534f", 
                  marginTop: "8px",
                  fontWeight: "600",
                  background: "#fdf1f0",
                  padding: "4px 8px",
                  borderRadius: "4px"
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