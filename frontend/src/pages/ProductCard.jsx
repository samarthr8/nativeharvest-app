import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // Normalize images array
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : [];
    
  // Card-level state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [added, setAdded] = useState(false);

  // Cart handler
  const handleAddToCart = () => {
    addToCart(product, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Pricing & Stock
  const displayPrice = selectedVariant?.price || product.price;
  const displayStock = selectedVariant && selectedVariant.stock !== undefined ? selectedVariant.stock : product.stock;

  let stockText = "";
  let stockColor = "";
  if (displayStock === 0) {
    stockText = "Out of Stock";
    stockColor = "red";
  } else if (displayStock <= 10) {
    stockText = "Only Few Left";
    stockColor = "#ff9800";
  } else {
    stockText = "In Stock";
    stockColor = "green";
  }

  return (
    <div style={{ border: "1px solid #eaeaea", padding: "18px", borderRadius: "12px", background: "white", display: "flex", flexDirection: "column", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", transition: "all 0.25s ease", height: "100%" }}>
      
      {/* --- IMAGE CONTAINER --- */}
      <div style={{ height: "220px", overflow: "hidden", borderRadius: "10px", position: "relative", background: "#f7f7f7", flexShrink: 0 }}>
        {images.length > 0 && (
          <Link to={`/products/${product.slug}`}>
            <img 
              src={images[currentIndex]} 
              alt={product.name} 
              loading="lazy" /* NEW: Boosts page load speed */
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </Link>
        )}
        {images.length > 1 && (
          <>
            <div onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)} style={arrowStyle("left")}>‹</div>
            <div onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)} style={arrowStyle("right")}>›</div>
          </>
        )}
      </div>

      {/* --- PRODUCT DETAILS --- */}
      <Link to={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h3 style={{ marginTop: "14px", marginBottom: "8px", fontSize: "18px", color: "#1f2d2a" }}>{product.name}</h3>
      </Link>

      {/* NEW: CSS Line Clamping ensures text never breaks grid height */}
      <p style={{ 
        flexGrow: 1, 
        fontSize: "14px", 
        color: "#666", 
        margin: "0 0 12px 0",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>
        {product.description}
      </p>

      {/* --- VARIANTS --- */}
      {product.variants && product.variants.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {product.variants.map((variant, i) => (
              <button
                key={i}
                onClick={() => setSelectedVariant(variant)}
                style={{ 
                  padding: "5px 10px", borderRadius: "20px", 
                  border: selectedVariant?.weight === variant.weight ? "2px solid #2f6f4e" : "1px solid #ccc", 
                  background: selectedVariant?.weight === variant.weight ? "#f0f8f5" : "white", 
                  cursor: "pointer", fontSize: "12px", transition: "0.2s" 
                }}
              >
                {variant.weight}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- PRICING & ACTION --- */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2d2a" }}>₹{displayPrice}</div>
        <div style={{ marginTop: "4px", fontSize: "12px", fontWeight: "bold", color: stockColor }}>{stockText}</div>

        {displayStock === 0 ? (
          <button disabled style={{ marginTop: "12px", background: "#e0e0e0", color: "#888", padding: "10px", border: "none", borderRadius: "8px", width: "100%", fontWeight: "bold", cursor: "not-allowed" }}>
            Out of Stock
          </button>
        ) : (
          <div style={{ position: "relative", marginTop: "12px" }}>
            <button 
              onClick={handleAddToCart} 
              style={{ padding: "10px", background: "#2f6f4e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", width: "100%", fontWeight: "bold", transition: "0.2s" }}
              onMouseOver={(e) => e.target.style.background = "#24563d"}
              onMouseOut={(e) => e.target.style.background = "#2f6f4e"}
            >
              Add to Cart
            </button>
            {added && (
              <div style={{ position: "absolute", top: "-32px", left: "50%", transform: "translateX(-50%)", background: "#1f2d2a", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 10 }}>
                Added to cart ✓
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const arrowStyle = (side) => ({
  position: "absolute", top: "50%", [side]: "10px", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", color: "white", padding: "4px 8px", borderRadius: "50%", cursor: "pointer", zIndex: 2
});