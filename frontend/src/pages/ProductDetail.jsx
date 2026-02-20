import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => {

      const data = res.data;

      /* ✅ NORMALIZE VARIANTS */
      let normalizedVariants = [];

      if (Array.isArray(data.variants)) {
        normalizedVariants = data.variants;
      } else if (data.variants && typeof data.variants === "object") {
        normalizedVariants = Object.entries(data.variants).map(
          ([weight, price]) => ({
            weight,
            price
          })
        );
      }

      data.variants = normalizedVariants;

      setProduct(data);

      if (normalizedVariants.length > 0) {
        setSelectedVariant(normalizedVariants[0]);
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

  const price = selectedVariant?.price || product.price;

  /* ✅ ARROW NAVIGATION */
  const nextImage = () => {
    setActiveImage(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImage(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="container">

      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={images[0]}
      />

      {/* IMAGE GALLERY */}
      {images.length > 0 && (
        <div style={{ position: "relative", maxWidth: "400px" }}>

          <img
            src={images[activeImage]}
            alt={product.name}
            style={detailImage}
          />

          {/* ✅ OVERLAY ARROWS */}
          {images.length > 1 && (
            <>
              <button onClick={prevImage} style={arrowStyle("left")}>‹</button>
              <button onClick={nextImage} style={arrowStyle("right")}>›</button>
            </>
          )}

          {/* THUMBNAILS (kept unchanged) */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      i === activeImage
                        ? "2px solid #2f6f4e"
                        : "1px solid #ddd",
                    borderRadius: "6px"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* VARIANT SELECTOR */}
      {product.variants && product.variants.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <strong>Select Weight:</strong>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {product.variants.map((variant, i) => (
              <button
                key={i}
                onClick={() => setSelectedVariant(variant)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border:
                    selectedVariant?.weight === variant.weight
                      ? "2px solid #2f6f4e"
                      : "1px solid #ccc",
                  background:
                    selectedVariant?.weight === variant.weight
                      ? "#f0f8f5"
                      : "white",
                  cursor: "pointer"
                }}
              >
                {variant.weight}
              </button>
            ))}
          </div>
        </div>
      )}

      <h3 style={{ marginTop: "20px" }}>₹{price}</h3>

      <p style={{ marginTop: "8px", fontSize: "14px", opacity: 0.7 }}>
        Expected delivery in 7–8 days
      </p>

      <button
        className="btn"
        style={{ marginTop: "15px" }}
        onClick={() => addToCart(product, selectedVariant)}
      >
        Add to Cart
      </button>

    </div>
  );
}

const detailImage = {
  width: "100%",
  maxWidth: "400px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const arrowStyle = (side) => ({
  position: "absolute",
  top: "40%",
  [side]: "10px",
  background: "rgba(255,255,255,0.6)",
  border: "none",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  fontSize: "20px"
});
