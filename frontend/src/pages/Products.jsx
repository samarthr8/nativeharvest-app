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

      /* auto select first variant if exists */
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

            <div key={p.slug}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative"
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

                {/* LEFT ARROW */}
                {images.length > 1 && (
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
                      fontSize: "22px",
                      color: "white",
                      cursor: "pointer",
                      background: "rgba(0,0,0,0.3)",
                      padding: "4px 8px",
                      borderRadius: "50%"
                    }}
                  >
                    ‹
                  </div>
                )}

                {/* RIGHT ARROW */}
                {images.length > 1 && (
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
                      fontSize: "22px",
                      color: "white",
                      cursor: "pointer",
                      background: "rgba(0,0,0,0.3)",
                      padding: "4px 8px",
                      borderRadius: "50%"
                    }}
                  >
                    ›
                  </div>
                )}

              </div>

              <Link to={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <h3 style={{ marginTop: "12px" }}>{p.name}</h3>
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

              {/* VARIANT SELECTOR */}
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

              <br />

              {p.stock === 0 ? (

                <button disabled
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
                      transition: "0.3s ease"
                    }}
                  >
                    Add to Cart
                  </button>

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
}
