import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [addedSlug, setAddedSlug] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

  const { addToCart } = useCart();

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

  const toggleReadMore = (slug) => {
    setExpanded(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const handleAddToCart = (product) => {
    const selectedVariant = selectedVariants[product.slug] || null;
    addToCart(product, selectedVariant);
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1500);
  };

  /* -------- CATEGORY GROUPING -------- */

  const categories = {
    royal: [],
    orchard: [],
    cold: [],
    heritage: [],
    indulgence: []
  };

  products.forEach(p => {
    const slug = p.slug.toLowerCase();

    if (slug.includes("pickle")) categories.royal.push(p);
    else if (slug.includes("jam")) categories.orchard.push(p);
    else if (slug.includes("oil")) categories.cold.push(p);
    else if (slug.includes("sattu")) categories.heritage.push(p);
    else categories.indulgence.push(p);
  });

  /* -------- GRID STYLE (FIXED 4 COLS) -------- */

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "28px",
    alignItems: "stretch"
  };

  const responsiveWrapper = {
    width: "100%"
  };

  const renderGrid = (list) => (
    <div style={responsiveWrapper}>
      <div style={gridStyle}>
        {list.map(p => {

          let stockText = "";
          let stockColor = "";

          if (p.stock === 0) {
            stockText = "Out of Stock";
            stockColor = "red";
          } 
          else if (p.stock <= 10) {
            stockText = "Only Few Left";
            stockColor = "#ff9800";
          } 
          else {
            stockText = "In Stock";
            stockColor = "green";
          }

          const images =
            Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : p.image
              ? [p.image]
              : [];

          const currentIndex = activeImageIndex[p.slug] || 0;

          const isExpanded = expanded[p.slug];
          const shortText =
            p.description && p.description.length > 120
              ? p.description.substring(0, 120) + "..."
              : p.description;

          const selectedVariant = selectedVariants[p.slug];
          const displayPrice = selectedVariant?.price || p.price;

          return (
            <div
              key={p.slug}
              style={{
                border: "1px solid #eaeaea",
                padding: "18px",
                borderRadius: "12px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                transition: "all 0.25s ease"
              }}
            >

              {/* IMAGE */}
              <div style={{
                height: "220px",
                overflow: "hidden",
                borderRadius: "10px",
                position: "relative",
                background: "#f7f7f7"
              }}>

                {images.length > 0 && (
                  <Link to={`/products/${p.slug}`}>
                    <img
                      src={images[currentIndex]}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </Link>
                )}

                {images.length > 1 && (
                  <>
                    <div
                      onClick={() =>
                        setActiveImageIndex(prev => ({
                          ...prev,
                          [p.slug]:
                            currentIndex === 0
                              ? images.length - 1
                              : currentIndex - 1
                        }))
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.4)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "50%",
                        cursor: "pointer"
                      }}
                    >
                      ‹
                    </div>

                    <div
                      onClick={() =>
                        setActiveImageIndex(prev => ({
                          ...prev,
                          [p.slug]:
                            currentIndex === images.length - 1
                              ? 0
                              : currentIndex + 1
                        }))
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        background: "rgba(0,0,0,0.4)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "50%",
                        cursor: "pointer"
                      }}
                    >
                      ›
                    </div>
                  </>
                )}
              </div>

              <Link to={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <h3 style={{ marginTop: "14px" }}>{p.name}</h3>
              </Link>

              <p style={{ flexGrow: 1 }}>
                {isExpanded ? p.description : shortText}

                {p.description && p.description.length > 120 && (
                  <span
                    onClick={() => toggleReadMore(p.slug)}
                    style={{
                      color: "#2f6f4e",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginLeft: "6px"
                    }}
                  >
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
                        onClick={() =>
                          setSelectedVariants(prev => ({
                            ...prev,
                            [p.slug]: variant
                          }))
                        }
                        style={{
                          padding: "5px 10px",
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
                          fontSize: "12px"
                        }}
                      >
                        {variant.weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <strong>₹{displayPrice}</strong>

              <p style={{
                marginTop: "6px",
                fontWeight: "bold",
                color: stockColor
              }}>
                {stockText}
              </p>

              {p.stock === 0 ? (
                <button disabled style={{
                  marginTop: "10px",
                  background: "#ccc",
                  padding: "8px",
                  border: "none",
                  borderRadius: "6px"
                }}>
                  Out of Stock
                </button>
              ) : (
                <div style={{ position: "relative", marginTop: "10px" }}>
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      padding: "8px",
                      background: "#2f6f4e",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Add to Cart
                  </button>

                  {addedSlug === p.slug && (
                    <div style={{
                      position: "absolute",
                      top: "-28px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#2f6f4e",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      fontSize: "12px"
                    }}>
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
      <h1 style={{ marginBottom: "40px" }}>Products</h1>

      {categories.royal.length > 0 && (
        <>
          <h2 style={{ marginBottom: "20px" }}>The Royal Achaar Collection</h2>
          {renderGrid(categories.royal)}
        </>
      )}

      {categories.orchard.length > 0 && (
        <>
          <h2 style={{ margin: "60px 0 20px" }}>Orchard Preserves</h2>
          {renderGrid(categories.orchard)}
        </>
      )}

      {categories.cold.length > 0 && (
        <>
          <h2 style={{ margin: "60px 0 20px" }}>Cold-Pressed & Pure Essentials</h2>
          {renderGrid(categories.cold)}
        </>
      )}

      {categories.heritage.length > 0 && (
        <>
          <h2 style={{ margin: "60px 0 20px" }}>Heritage Staples</h2>
          {renderGrid(categories.heritage)}
        </>
      )}

      {categories.indulgence.length > 0 && (
        <>
          <h2 style={{ margin: "60px 0 20px" }}>Wholesome Indulgence</h2>
          {renderGrid(categories.indulgence)}
        </>
      )}

    </div>
  );
}