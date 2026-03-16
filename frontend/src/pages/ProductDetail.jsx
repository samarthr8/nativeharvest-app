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

  const [shareText, setShareText] = useState("Share");

  useEffect(() => {
    api.get(`/products/${slug}`).then(res => {
      const data = res.data;
      let normalizedVariants = [];

      if (Array.isArray(data.variants)) {
        normalizedVariants = data.variants;
      } else if (data.variants && typeof data.variants === "object") {
        normalizedVariants = Object.entries(data.variants).map(
          ([weight, price]) => ({ weight, price })
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
        <Link to="/products" style={{ color: "#2f6f4e", textDecoration: "underline" }}>Back to Products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: "50px 0" }}>
        <div className="skeleton-box" style={{ width: "200px", height: "20px", marginBottom: "25px" }}></div>
        <div className="skeleton-grid">
          <div className="skeleton-box" style={{ height: "420px", borderRadius: "16px" }}></div>
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

  const images = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
  const price = selectedVariant?.price || product.price;

  const nextImage = () => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, qty);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | NativeHarvest`,
      text: `Check out ${product.name} at NativeHarvest!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
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

      <SEO
        title={`${product.name} | NativeHarvest`}
        description={product.description}
        image={images[0]}
      />

      {/* Breadcrumb */}
      <div style={{ marginBottom: "25px", fontSize: "14px", color: "#666" }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link> <span style={{ margin: "0 8px" }}>›</span>
        <Link to="/products" style={{ color: "inherit", textDecoration: "none" }}>Products</Link> <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#1f2d2a", fontWeight: "500" }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

        {/* ================= LEFT SIDE — IMAGES ================= */}
        <div>
          <div style={{ position: "relative", background: "#f7f7f7", borderRadius: "16px", overflow: "hidden", height: "420px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            {images.length > 0 && (
              <img
                src={images[activeImage]}
                alt={product.name}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
            <div style={{ display: "flex", gap: "12px", marginTop: "18px", overflowX: "auto", paddingBottom: "10px" }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  loading="lazy"
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "70px", height: "70px", objectFit: "cover", borderRadius: "10px", cursor: "pointer", transition: "0.2s",
                    border: i === activeImage ? "2px solid #2f6f4e" : "2px solid transparent",
                    boxShadow: i === activeImage ? "0 4px 10px rgba(47,111,78,0.2)" : "none",
                    opacity: i === activeImage ? 1 : 0.7
                  }}
                  onMouseOver={(e) => { if (i !== activeImage) e.target.style.opacity = 1; }}
                  onMouseOut={(e) => { if (i !== activeImage) e.target.style.opacity = 0.7; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE — DETAILS ================= */}
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "10px", color: "#1f2d2a" }}>
            {product.name}
          </h1>

          <p style={{ fontSize: "24px", color: "#2f6f4e", fontWeight: "700", marginBottom: "20px" }}>
            ₹{price}
          </p>

          {product.description && (
            <p style={{ lineHeight: "1.7", marginBottom: "30px", color: "#555", fontSize: "16px" }}>
              {product.description}
            </p>
          )}

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <strong style={{ display: "block", marginBottom: "10px", color: "#333" }}>Select Size:</strong>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {product.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
                      border: selectedVariant?.weight === variant.weight ? "2px solid #2f6f4e" : "1px solid #ddd",
                      background: selectedVariant?.weight === variant.weight ? "#f0f8f5" : "white",
                      color: selectedVariant?.weight === variant.weight ? "#2f6f4e" : "#555",
                      cursor: "pointer", transition: "all 0.2s ease"
                    }}
                  >
                    {variant.weight}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- NEW: CUSTOM QUANTITY STEPPER --- */}
          <div style={{ marginBottom: "30px" }}>
            <strong style={{ display: "block", marginBottom: "10px", color: "#333" }}>Quantity:</strong>
            <div style={{ 
              display: "flex", alignItems: "center", width: "130px", 
              border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "white" 
            }}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ flex: 1, padding: "12px", background: "#f9fcfb", border: "none", cursor: "pointer", fontSize: "18px", color: "#555", transition: "0.2s" }}
                onMouseOver={(e) => e.target.style.background = "#e8f3ee"}
                onMouseOut={(e) => e.target.style.background = "#f9fcfb"}
              >
                −
              </button>
              <div style={{ flex: 1, textAlign: "center", fontWeight: "600", fontSize: "16px", color: "#1f2d2a", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd", padding: "12px 0" }}>
                {qty}
              </div>
              <button 
                onClick={() => setQty(qty + 1)}
                style={{ flex: 1, padding: "12px", background: "#f9fcfb", border: "none", cursor: "pointer", fontSize: "18px", color: "#555", transition: "0.2s" }}
                onMouseOver={(e) => e.target.style.background = "#e8f3ee"}
                onMouseOut={(e) => e.target.style.background = "#f9fcfb"}
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS: Add to Cart & Share */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: "1", minWidth: "200px", padding: "16px 28px", background: "#2f6f4e", color: "white",
                border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold",
                transition: "all 0.2s ease", boxShadow: "0 4px 15px rgba(47,111,78,0.2)"
              }}
              onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.background = "#24563d"; }}
              onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.background = "#2f6f4e"; }}
            >
              Add to Cart — ₹{price * qty}
            </button>

            <button
              onClick={handleShare}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 24px",
                background: "white", color: "#2f6f4e", border: "2px solid #2f6f4e", borderRadius: "10px",
                cursor: "pointer", fontSize: "15px", fontWeight: "600", transition: "0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.background = "#f0f8f5"}
              onMouseOut={(e) => e.target.style.background = "white"}
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

          <div style={{ marginTop: "35px", padding: "20px", background: "#f9fcfb", borderRadius: "10px", border: "1px solid #e2eee8" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#444", display: "flex", alignItems: "center", gap: "10px", fontWeight: "500" }}>
              <span style={{ fontSize: "20px" }}>🚚</span> 
              Pan-India Delivery in 5–7 working days
            </p>
          </div>

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
  position: "absolute", top: "45%", [side]: "15px", background: "rgba(255,255,255,0.9)", border: "none",
  borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "24px", color: "#333",
  display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  transition: "0.2s ease"
});