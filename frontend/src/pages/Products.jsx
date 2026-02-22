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

  /* ------------------ CATEGORY GROUPING ------------------ */
  const groupedProducts = {
    royal: [],
    orchard: [],
    coldPressed: [],
    heritage: [],
    indulgence: []
  };

  products.forEach(p => {
    const slug = p.slug.toLowerCase();

    if (slug.includes("pickle") || slug.includes("achar")) {
      groupedProducts.royal.push(p);
    } else if (slug.includes("jam") || slug.includes("preserve")) {
      groupedProducts.orchard.push(p);
    } else if (slug.includes("oil") || slug.includes("extract")) {
      groupedProducts.coldPressed.push(p);
    } else if (slug.includes("sattu") || slug.includes("atta")) {
      groupedProducts.heritage.push(p);
    } else {
      groupedProducts.indulgence.push(p);
    }
  });

  const renderGrid = (list) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 280px))",
        justifyContent: "center",
        gap: "28px"
      }}
    >
      {list.map(p => {

        let stockText = "";
        let stockColor = "";

        if (p.stock === 0) {
          stockText = "Out of Stock";
          stockColor = "red";
        } else if (p.stock <= 10) {
          stockText = "Only Few Left";
          stockColor = "#ff9800";
        } else {
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
              width: "280px",
              border: "1px solid #eaeaea",
              padding: "18px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              background: "white",
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
              transition: "all 0.25s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >

            {/* IMAGE BOX */}
            <div
              style={{
                width: "100%",
                height: "220px",
                overflow: "hidden",
                borderRadius: "8px",
                background: "#f8f8f8",
                position: "relative"
              }}
            >
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
                    left: "8px",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "#fff",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.35)",
                    padding: "6px 10px",
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
                    right: "8px",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "#fff",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.35)",
                    padding: "6px 10px",
                    borderRadius: "50%"
                  }}
                >
                  ›
                </div>
              )}
            </div>

            <Link to={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <h3 style={{ marginTop: "14px", fontWeight: "600" }}>{p.name}</h3>
            </Link>

            <p style={{ flexGrow: 1, fontSize: "14px", opacity: 0.85 }}>
              {isExpanded ? p.description : shortText}
              {p.description && p.description.length > 120 && (
                <span
                  onClick={() => toggleReadMore(p.slug)}
                  style={{
                    color: "#2f6f4e",
                    fontWeight: "600",
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
                        padding: "5px 12px",
                        borderRadius: "20px",
                        border:
                          selectedVariant?.weight === variant.weight
                            ? "2px solid #2f6f4e"
                            : "1px solid #ddd",
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

            <strong style={{ fontSize: "16px" }}>₹{displayPrice}</strong>

            <p style={{
              marginTop: "6px",
              fontWeight: "600",
              fontSize: "13px",
              color: stockColor
            }}>
              {stockText}
            </p>

            <div style={{ marginTop: "12px", position: "relative" }}>
              {p.stock === 0 ? (
                <button disabled
                  style={{
                    background: "#ccc",
                    cursor: "not-allowed",
                    padding: "10px",
                    border: "none",
                    borderRadius: "6px",
                    width: "100%"
                  }}>
                  Out of Stock
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      padding: "10px",
                      background: "#2f6f4e",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "500",
                      width: "100%"
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
                      Added ✓
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );

  const renderSection = (title, subtitle, list, altBackground = false) => {
    if (list.length === 0) return null;

    return (
      <section style={{
        padding: "60px 0",
        background: altBackground ? "#fafcfb" : "transparent"
      }}>
        <div className="container">
          <h2 style={{ fontSize: "28px", marginBottom: "6px", fontWeight: "600" }}>
            {title}
          </h2>
          <p style={{ marginBottom: "30px", color: "#666", fontSize: "14px" }}>
            {subtitle}
          </p>
          {renderGrid(list)}
        </div>
      </section>
    );
  };

  return (
    <div>

      <div className="container" style={{ paddingTop: "40px" }}>
        <h1 style={{ fontSize: "34px", fontWeight: "600", marginBottom: "8px" }}>
          Our Collection
        </h1>
        <p style={{ color: "#666", marginBottom: "40px" }}>
          Crafted with tradition. Curated for modern homes.
        </p>
      </div>

      {renderSection("The Royal Achaar Collection",
        "Traditional pickles prepared using age-old family recipes.",
        groupedProducts.royal)}

      {renderSection("Orchard Preserves",
        "Fruits slow-cooked into rich, natural preserves.",
        groupedProducts.orchard, true)}

      {renderSection("Cold-Pressed & Pure Essentials",
        "Extracted naturally to retain purity and nutrition.",
        groupedProducts.coldPressed)}

      {renderSection("Heritage Staples",
        "Wholesome pantry essentials rooted in Indian tradition.",
        groupedProducts.heritage, true)}

      {renderSection("Wholesome Indulgence",
        "Healthy delights crafted for mindful enjoyment.",
        groupedProducts.indulgence)}

    </div>
  );
}