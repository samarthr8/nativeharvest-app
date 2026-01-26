import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div style={card}>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <Link className="btn" to={`/products/${product.slug}`}>
        View Details
      </Link>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  width: "220px"
};

