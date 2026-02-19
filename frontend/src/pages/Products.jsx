import { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [addedSlug, setAddedSlug] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  /* READ MORE */
  const toggleReadMore = (slug) => {
    setExpanded(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  /* ADD TO CART */
  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedSlug(product.slug);

    setTimeout(() => {
      setAddedSlug(null);
    }, 1500);
  };

  return (
    <div className="container">

      <h1>Products</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
        gap: "24px"
      }}>

        {products.map(p => {

          /* STOCK LOGIC */
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

          /* MULTI IMAGE SUPPORT */
          const images =
            Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : p.image
              ? [p.image]
              : [];

          const currentIndex = activeImageIndex[p.slug] || 0;

          /* READ MORE LOGIC */
          const isExpanded = expanded[p.slug];
          const shortText =
            p.description && p.description.length > 120
              ? p.description.substring(0, 120) + "..."
              : p.description;

          return (

            <div key={p.slug}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}>

              {/* IMAGE BOX */}
              <div style={{
                width: "100%",
                height: "220px",
                overflow: "hidden",
                borderRadius: "6px",
                background: "#f7f7f7",
                position: "relative"
              }}>

                {images.length > 0 && (
                  <img
                    src={images[currentIndex]}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "0.4s ease"
                    }}
                  />
                )}

                {/* IMAGE TOGGLE DOTS */}
                {images.length > 1 && (
                  <div style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "6px"
                  }}>
                    {images.map((_, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setActiveImageIndex(prev => ({
                            ...prev,
                            [p.slug]: i
                          }))
                        }
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background:
                            i === currentIndex
                              ? "white"
                              : "rgba(255,255,255,0.6)",
                          cursor: "pointer"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <h3 style={{ marginTop: "12px" }}>{p.name}</h3>

              {/* DESCRIPTION WITH READ MORE */}
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

              <strong>₹{p.price}</strong>

              <p style={{
                marginTop: "6px",
                fontWeight: "bold",
                color: stockColor
              }}>
                {stockText}
              </p>

              <br />

              {p.stock === 0 ? (

                <button
                  disabled
                  style={{
                    background: "#ccc",
                    cursor: "not-allowed",
                    padding: "8px",
                    border: "none",
                    borderRadius: "4px"
                  }}>
                  Out of Stock
                </button>

              ) : (

                <div style={{ position: "relative" }}>

                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      padding: "8px",
                      background: "#2f6f4e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "0.3s ease",
                      boxShadow: "0 0 0 rgba(0,0,0,0)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 12px rgba(47,111,78,0.6)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Add to Cart
                  </button>

                  {/* CONFIRMATION TOOLTIP */}
                  {addedSlug === p.slug && (
                    <div style={{
                      position: "absolute",
                      top: "-30px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#2f6f4e",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      opacity: 0.95,
                      animation: "fadeIn 0.3s ease"
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

      {/* FADE ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(5px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}
      </style>

    </div>
  );
}
