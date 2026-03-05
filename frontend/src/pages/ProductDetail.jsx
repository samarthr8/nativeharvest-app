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

  const [shareText, setShareText] = useState("Share"); // For desktop fallback feedback

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

  // --- NEW: PREMIUM SKELETON LOADER ---
  if (!product) {
    return (
      <div className="container" style={{ padding: "50px 0" }}>
        <div className="skeleton-box" style={{ width: "200px", height: "20px", marginBottom: "25px" }}></div>
        <div className="skeleton-grid">
          {/* Left: Image Skeleton */}
          <div className="skeleton-box" style={{ height: "420px", borderRadius: "16px" }}></div>
          {/* Right: Details Skeleton */}
          <div>
            <div className="skeleton-box" style={{ height: "40px", width: "80%", marginBottom: "15px" }}></div>
            <div className="skeleton-box" style={{ height: "30px", width: "30%", marginBottom: "20px" }}></div>
            <div className="skeleton-box" style={{ height: "100px", width: "100%", marginBottom: "25px" }}></div>
            <div className="skeleton-box" style={{ height: "50px", width: "50%" }}></div>
          </div>
        </div>
      </div>
    );
  }

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

  // --- NEW: NATIVE WEB SHARE API ---
  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | NativeHarvest`,
      text: `Check out ${product.name} at NativeHarvest!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        // Opens the native iOS/Android sharing drawer
        await navigator.share(shareData);
      } else {
        // Fallback for older browsers / desktop: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareText("Copied!");
        setTimeout(() => setShareText("Share"), 2000);
      }
    } catch (err) {
      console.error("Error sharing product:", err);
    }
  };

  return (
    <div className="container" style={{ padding: "50px 0" }}>

      {/* The SEO component now wires up the Open Graph tags for WhatsApp! */}
      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={images[0]}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: "25px", fontSize: "14px", opacity: 0.7 }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link> {" > "}
        <Link to="/products" style={{ color: "inherit", textDecoration: "none" }}>Products</Link> {" > "}
        {product.name}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        alignItems: "start"
      }}>

        {/* ================= LEFT SIDE — IMAGES ================= */}
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
                loading="lazy" /* --- NEW: LAZY LOADING --- */
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
                  loading="lazy" /* --- NEW: LAZY LOADING --- */
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

        {/* ================= RIGHT SIDE — DETAILS ================= */}
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
                      cursor: "pointer",
                      transition: "0.2s ease"
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
                  border: "1px solid #ccc",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>

          {/* ACTION BUTTONS: Add to Cart & Share */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "14px 28px",
                background: "#2f6f4e",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "0.2s ease",
                boxShadow: "0 4px 12px rgba(47,111,78,0.2)"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Add to Cart
            </button>

            {/* --- THE NEW SHARE BUTTON --- */}
            <button
              onClick={handleShare}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 24px",
                background: "white",
                color: "#2f6f4e",
                border: "2px solid #2f6f4e",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#f0f8f5";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "white";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              {shareText}
            </button>
          </div>

          <p style={{
            marginTop: "25px",
            fontSize: "14px",
            opacity: 0.7,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "18px" }}>🚚</span> Expected delivery in 5–7 days
          </p>

        </div>

      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .container > div:nth-child(2) {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }
          }
        `}
      </style>

    </div>
  );
}

const arrowStyle = (side) => ({
  position: "absolute",
  top: "45%",
  [side]: "15px",
  background: "rgba(255,255,255,0.85)",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  cursor: "pointer",
  fontSize: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  transition: "0.2s ease"
});