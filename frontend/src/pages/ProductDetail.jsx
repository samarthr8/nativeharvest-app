import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => {

      const data = res.data;

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
    }).catch(() => {
      setProduct("NOT_FOUND");
    });

  }, [slug]);

  if (product === "NOT_FOUND") {
    return (
      <div className="container" style={{ padding: "60px", textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  if (!product) return <p className="container">Loading...</p>;

  const images =
    product.images?.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const price = selectedVariant?.price || product.price;

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

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, qty);
  };

  return (
    <div className="container" style={{ padding: "50px 0" }}>

      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={images[0]}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: "25px", fontSize: "14px", opacity: 0.7 }}>
        <Link to="/">Home</Link> {" > "}
        <Link to="/products">Products</Link> {" > "}
        {product.name}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        alignItems: "start"
      }}>

        {/* LEFT SIDE — IMAGES */}
        <div>

          <div style={{
            position: "relative",
            background: "#f7f7f7",
            borderRadius: "16px",
            overflow: "hidden",
            height: "420px"
          }}>

            {images.length > 0 && (
              <img
                src={images[activeImage]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            )}

            {images.length > 1 && (
              <>
                <button onClick={prevImage} style={arrowStyle("left")}>‹</button>
                <button onClick={nextImage} style={arrowStyle("right")}>›</button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px"
            }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border:
                      i === activeImage
                        ? "2px solid #2f6f4e"
                        : "1px solid #ddd"
                  }}
                />
              ))}
            </div>
          )}

        </div>

        {/* RIGHT SIDE — DETAILS */}
        <div>

          <h1 style={{
            fontSize: "30px",
            fontWeight: "600",
            marginBottom: "15px"
          }}>
            {product.name}
          </h1>

          <p style={{
            fontSize: "22px",
            color: "#2f6f4e",
            fontWeight: "600",
            marginBottom: "20px"
          }}>
            ₹{price}
          </p>

          {product.description && (
            <p style={{
              lineHeight: "1.7",
              marginBottom: "25px",
              opacity: 0.85
            }}>
              {product.description}
            </p>
          )}

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <strong>Select Weight:</strong>
              <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                {product.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      padding: "8px 16px",
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

          {/* Quantity */}
          <div style={{ marginBottom: "25px" }}>
            <strong>Quantity:</strong>
            <div style={{ marginTop: "10px" }}>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{
                  width: "80px",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              padding: "14px 28px",
              background: "#2f6f4e",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Add to Cart
          </button>

          <p style={{
            marginTop: "18px",
            fontSize: "14px",
            opacity: 0.7
          }}>
            🚚 Expected delivery in 5–7 days
          </p>

        </div>

      </div>

    </div>
  );
}

const arrowStyle = (side) => ({
  position: "absolute",
  top: "45%",
  [side]: "15px",
  background: "rgba(255,255,255,0.7)",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  fontSize: "20px"
});