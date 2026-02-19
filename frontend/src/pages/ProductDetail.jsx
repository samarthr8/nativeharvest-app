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
      setProduct(res.data);

      if (res.data.variants && res.data.variants.length > 0) {
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

  const price = selectedVariant?.price || product.price;

  return (
    <div className="container">

      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={images[0]}
      />

      {/* IMAGE GALLERY */}
      {images.length > 0 && (
        <>
          <img
            src={images[activeImage]}
            alt={product.name}
            style={detailImage}
          />

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
        </>
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
