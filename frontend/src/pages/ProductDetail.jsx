import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import SEO from "../components/SEO";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => setProduct(res.data));
  }, [slug]);

  if (!product) return <p className="container">Loading...</p>;

  return (
    <div className="container">
      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={product.image}
      />

      <img
        src={product.image}
        alt={product.name}
        style={detailImage}
      />

      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>

      <a
        className="btn"
        href="https://wa.me/9194070XXXXX"
        target="_blank"
        rel="noreferrer"
      >
        Order on WhatsApp
      </a>
    </div>
  );
}

const detailImage = {
  width: "100%",
  maxWidth: "400px",
  borderRadius: "12px",
  marginBottom: "20px"
};

