import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => {
      setProduct(res.data);
      if (res.data.variants?.length > 0) {
        setSelectedVariant(res.data.variants[0]);
      }
    });
  }, [slug]);

  if (!product) return <p className="container">Loading...</p>;

  const images =
    product.images?.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="container">

      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={images[0]}
      />

      {/* IMAGE GALLERY */}
      <div style={{ maxWidth: "400px" }}>
        {images.length > 0 && (
          <img
            src={images[activeIndex]}
            alt={product.name}
            style={detailImage}
          />
        )}

        {images.length > 1 && (
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveIndex(i)}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: i === activeIndex
                    ? "2px solid #2f6f4e"
                    : "1px solid #ddd",
                  borderRadius: "6px"
                }}
              />
            ))}
          </div>
        )}
      </div>

      <h1>{product.name}</h1>

      <p>{product.description}</p>

      {/* VARIANT SELECTOR */}
      {product.variants?.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <label><strong>Select Weight:</strong></label>
          <select
            value={selectedVariant?.weight}
            onChange={(e) =>
              setSelectedVariant(
                product.variants.find(
                  v => v.weight === e.target.value
                )
              )
            }
            style={{
              marginLeft: "10px",
              padding: "6px",
              borderRadius: "6px"
            }}
          >
            {product.variants.map((v, i) => (
              <option key={i} value={v.weight}>
                {v.weight} – ₹{v.price}
              </option>
            ))}
          </select>
        </div>
      )}

      <h3>
        ₹{selectedVariant?.price || product.price}
      </h3>

      <p style={{ fontSize: "14px", opacity: 0.7 }}>
        Expected Delivery: 7–8 days
      </p>

      <button
        className="btn"
        onClick={() => addToCart(product, selectedVariant)}
        style={{
          marginTop: "10px",
          transition: "0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 12px rgba(47,111,78,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Add to Cart
      </button>

    </div>
  );
}

const detailImage = {
  width: "100%",
  borderRadius: "12px",
  marginBottom: "20px"
};