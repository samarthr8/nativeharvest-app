import { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Products() {

  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div className="container">

      <h1>Products</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
        gap: "24px"
      }}>

        {products.map(p => {

          /* PROFESSIONAL STOCK LOGIC */
          let stockText = "";
          let stockColor = "";

          if (p.stock === 0) {
            stockText = "Out of Stock";
            stockColor = "red";
          } 
          else if (p.stock <= 10) {
            stockText = "Only Few Left";
            stockColor = "#ff9800"; // orange
          } 
          else {
            stockText = "In Stock";
            stockColor = "green";
          }

          return (

            <div key={p.slug}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}>

              {/* FIXED IMAGE BOX — ensures uniform tiles */}
              <div style={{
                width: "100%",
                height: "220px",
                overflow: "hidden",
                borderRadius: "6px",
                background: "#f7f7f7"
              }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              <h3 style={{ marginTop: "12px" }}>{p.name}</h3>

              <p style={{ flexGrow: 1 }}>
                {p.description}
              </p>

              <strong>₹{p.price}</strong>

              {/* CUSTOMER SAFE STOCK DISPLAY */}
              <p style={{
                marginTop: "6px",
                fontWeight: "bold",
                color: stockColor
              }}>
                {stockText}
              </p>

              <br />

              {p.stock === 0 ? (

                <button
                  disabled
                  style={{
                    background: "#ccc",
                    cursor: "not-allowed",
                    padding: "8px",
                    border: "none",
                    borderRadius: "4px"
                  }}>
                  Out of Stock
                </button>

              ) : (

                <button
                  onClick={() => addToCart(p)}
                  style={{
                    padding: "8px",
                    background: "#2f6f4e",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}>
                  Add to Cart
                </button>

              )}

            </div>

          );
        })}

      </div>

    </div>
  );
}
