import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Products() {

  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const [expanded, setExpanded] = useState({});
  const [addedSlug, setAddedSlug] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

  const { addToCart } = useCart();

  /* ---------------- CATEGORY REFS FOR SCROLL ---------------- */
  const categoryRefs = useRef({});

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(res.data);
      const defaults = {};
      res.data.forEach(p => {
        if (p.variants && p.variants.length > 0) {
          defaults[p.slug] = p.variants[0];
        }
      });
      setSelectedVariants(defaults);
    });
  }, []);

  /* ---------------- HASH SCROLL LOGIC (FIXED) ---------------- */
  // Maps the URL hashes from Header.jsx to the actual Database Categories
  const hashToCategoryMap = {
    royal: "Pickles",
    orchard: "Preserves",
    cold: "Oils & Essentials",
    heritage: "Heritage Staples",
    indulgence: "Healthy Snacks"
  };

  useEffect(() => {
    if (!products.length || !location.hash) return;

    // Decode and remove "#"
    const id = decodeURIComponent(location.hash.replace("#", ""));
    
    // Look up real category name (fallback to exact id if no map exists)
    const targetCategory = hashToCategoryMap[id] || id;
    
    const targetRef = categoryRefs.current[targetCategory];

    if (targetRef) {
      setTimeout(() => {
        targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [location.hash, products]);

  /* ---------------- UI HELPERS ---------------- */
  const toggleReadMore = (slug) => {
    setExpanded(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleAddToCart = (product) => {
    const selectedVariant = selectedVariants[product.slug] || null;
    addToCart(product, selectedVariant);
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1500);
  };

  /* ---------------- SEARCH & CATEGORY LOGIC (FIXED) ---------------- */
  
  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
  });

  const groupedProducts = {};
  
  filteredProducts.forEach(p => {
    const cat = p.category || "Uncategorized";
    if (!groupedProducts[cat]) groupedProducts[cat] = [];
    groupedProducts[cat].push(p);
  });

  // Base order for known categories
  const baseCategoryOrder = ["Pickles", "Preserves", "Oils & Essentials", "Heritage Staples", "Healthy Snacks", "Uncategorized"];
  
  // Find any new/custom categories from the DB that aren't in the base list
  const extraCategories = Object.keys(groupedProducts).filter(cat => !baseCategoryOrder.includes(cat));
  
  // Combine them so nothing ever gets hidden!
  const finalCategoryOrder = [...baseCategoryOrder, ...extraCategories];

  /* ---------------- GRID STYLE (RESPONSIVE FIX) ---------------- */
  const gridStyle = {
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
    gap: "28px", 
    alignItems: "stretch"
  };

  const renderGrid = (list) => (
    <div>
      <div style={gridStyle}>
        {list.map(p => {
          const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
          const currentIndex = activeImageIndex[p.slug] || 0;
          const isExpanded = expanded[p.slug];
          const shortText = p.description && p.description.length > 120 ? p.description.substring(0, 120) + "..." : p.description;

          // --- DYNAMIC STOCK & PRICE LOGIC ---
          const selectedVariant = selectedVariants[p.slug];
          const displayPrice = selectedVariant?.price || p.price;
          const displayStock = selectedVariant && selectedVariant.stock !== undefined ? selectedVariant.stock : p.stock;

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
            <div key={p.slug} style={{ border: "1px solid #eaeaea", padding: "18px", borderRadius: "12px", background: "white", display: "flex", flexDirection: "column", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", transition: "all 0.25s ease" }}>
              <div style={{ height: "220px", overflow: "hidden", borderRadius: "10px", position: "relative", background: "#f7f7f7" }}>
                {images.length > 0 && (
                  <Link to={`/products/${p.slug}`}>
                    <img src={images[currentIndex]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Link>
                )}
                {images.length > 1 && (
                  <>
                    <div onClick={() => setActiveImageIndex(prev => ({ ...prev, [p.slug]: currentIndex === 0 ? images.length - 1 : currentIndex - 1 }))} style={arrowStyle("left")}>‹</div>
                    <div onClick={() => setActiveImageIndex(prev => ({ ...prev, [p.slug]: currentIndex === images.length - 1 ? 0 : currentIndex + 1 }))} style={arrowStyle("right")}>›</div>
                  </>
                )}
              </div>

              <Link to={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <h3 style={{ marginTop: "14px" }}>{p.name}</h3>
              </Link>

              <p style={{ flexGrow: 1 }}>
                {isExpanded ? p.description : shortText}
                {p.description && p.description.length > 120 && (
                  <span onClick={() => toggleReadMore(p.slug)} style={{ color: "#2f6f4e", fontWeight: "bold", cursor: "pointer", marginLeft: "6px" }}>
                    {isExpanded ? "Read Less" : "Read More"}
                  </span>
                )}
              </p>

              {p.variants && p.variants.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {p.variants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [p.slug]: variant }))}
                        style={{ padding: "5px 10px", borderRadius: "20px", border: selectedVariant?.weight === variant.weight ? "2px solid #2f6f4e" : "1px solid #ccc", background: selectedVariant?.weight === variant.weight ? "#f0f8f5" : "white", cursor: "pointer", fontSize: "12px" }}
                      >
                        {variant.weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <strong>₹{displayPrice}</strong>
              <p style={{ marginTop: "6px", fontWeight: "bold", color: stockColor }}>{stockText}</p>

              {displayStock === 0 ? (
                <button disabled style={{ marginTop: "10px", background: "#ccc", padding: "8px", border: "none", borderRadius: "6px" }}>Out of Stock</button>
              ) : (
                <div style={{ position: "relative", marginTop: "10px" }}>
                  <button onClick={() => handleAddToCart(p)} style={{ padding: "8px", background: "#2f6f4e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}>
                    Add to Cart
                  </button>
                  {addedSlug === p.slug && (
                    <div style={{ position: "absolute", top: "-28px", left: "50%", transform: "translateX(-50%)", background: "#2f6f4e", color: "white", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", whiteSpace: "nowrap" }}>
                      Added to cart ✓
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="container">

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
        <h1 style={{ margin: 0 }}>Products</h1>
        
        <div style={{ position: "relative", width: "300px" }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: "100%", padding: "12px 18px", paddingLeft: "40px",
              borderRadius: "30px", border: "1px solid #ddd", fontSize: "15px",
              outline: "none", transition: "0.2s"
            }}
          />
          <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }}>
            🔍
          </span>
        </div>
      </div>

      {searchQuery && Object.keys(groupedProducts).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>
          <h2>No products found for "{searchQuery}"</h2>
        </div>
      ) : (
        finalCategoryOrder.map(cat => {
          if (!groupedProducts[cat] || groupedProducts[cat].length === 0) return null;
          
          return (
            <div key={cat} ref={el => categoryRefs.current[cat] = el}>
              <h2 style={{ margin: "60px 0 20px", color: "#2f6f4e" }}>
                {cat === "Pickles" ? "The Royal Achaar Collection" : cat}
              </h2>
              {renderGrid(groupedProducts[cat])}
            </div>
          );
        })
      )}

    </div>
  );
}

const arrowStyle = (side) => ({
  position: "absolute", top: "50%", [side]: "10px", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", color: "white", padding: "4px 8px", borderRadius: "50%", cursor: "pointer"
});