import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div style={card}>
      <img
        src={product.image}
        alt={product.name}
        style={image}
      />

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
  borderRadius: "12px",
  padding: "16px",
  width: "240px",
  background: "white"
};

const image = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "12px"
};

