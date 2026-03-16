import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import ProductCard from "./ProductCard"; 

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  const categoryRefs = useRef({});

  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(Array.isArray(res.data) ? res.data : []);
    }).catch(() => setProducts([]));
  }, []);

  const hashToCategoryMap = {
    royal: "Pickles",
    orchard: "Preserves",
    cold: "Oils & Essentials",
    heritage: "Heritage Staples",
    indulgence: "Healthy Snacks"
  };

  useEffect(() => {
    if (!products.length || !location.hash) return;
    const id = decodeURIComponent(location.hash.replace("#", ""));
    const targetCategory = hashToCategoryMap[id] || id;
    const targetRef = categoryRefs.current[targetCategory];

    if (targetRef) {
      setTimeout(() => {
        targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [location.hash, products]);

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

  const baseCategoryOrder = ["Pickles", "Preserves", "Oils & Essentials", "Heritage Staples", "Healthy Snacks", "Uncategorized"];
  const extraCategories = Object.keys(groupedProducts).filter(cat => !baseCategoryOrder.includes(cat));
  const finalCategoryOrder = [...baseCategoryOrder, ...extraCategories];

  const gridStyle = {
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
    gap: "28px", 
    alignItems: "stretch"
  };

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "40px 0", flexWrap: "wrap", gap: "20px" }}>
        <h1 style={{ margin: 0, color: "#1f2d2a" }}>Products</h1>
        
        <div style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
          <input 
            type="text" 
            placeholder="Search fresh farm goods..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: "100%", padding: "14px 20px", paddingLeft: "45px",
              borderRadius: "30px", border: "1px solid #e0e0e0", fontSize: "15px",
              outline: "none", transition: "box-shadow 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
            }}
            onFocus={(e) => e.target.style.boxShadow = "0 4px 12px rgba(47,111,78,0.15)"}
            onBlur={(e) => e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"}
          />
          <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", opacity: 0.5 }}>
            🔍
          </span>
        </div>
      </div>

      {searchQuery && Object.keys(groupedProducts).length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#666" }}>
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>🌾</div>
          <h2 style={{ margin: 0 }}>No products found for "{searchQuery}"</h2>
          <p style={{ marginTop: "10px" }}>Try searching for "Pickle", "Sattu", or "Oil"</p>
        </div>
      ) : (
        finalCategoryOrder.map(cat => {
          if (!groupedProducts[cat] || groupedProducts[cat].length === 0) return null;
          
          return (
            <div key={cat} ref={el => categoryRefs.current[cat] = el}>
              {/* --- UPDATED: Increased Font Size & Weight --- */}
              <h2 style={{ margin: "50px 0 25px", color: "#2f6f4e", fontSize: "32px", fontWeight: "700", borderBottom: "2px solid #e8f3ee", paddingBottom: "12px" }}>
                {cat === "Pickles" ? "The Royal Achaar Collection" : cat}
              </h2>
              <div style={gridStyle}>
                {groupedProducts[cat].map(p => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          );
        })
      )}

    </div>
  );
}