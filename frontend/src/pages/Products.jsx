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
        gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
        gap: "20px"
      }}>

        {products.map(p => (

          <div key={p.slug}
               style={{
                 border: "1px solid #ddd",
                 padding: "15px"
               }}>

            <img
              src={p.image}
              alt={p.name}
              style={{ width: "100%" }}
            />

            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>₹{p.price}</strong>

            <br /><br />

            {p.stock === 0 ? (

              <button
                disabled
                style={{
                  background: "#ccc",
                  cursor: "not-allowed",
                  padding: "8px"
                }}>
                Out of Stock
              </button>

            ) : (

              <button
                onClick={() => addToCart(p)}
                style={{ padding: "8px" }}>
                Add to Cart
              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}
