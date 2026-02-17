import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

/* ----------------------------------
   Hero Section
---------------------------------- */
const HeroSection = () => {
  return (
    <section
      style={{
        height: "85vh",
        background:
          "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        color: "white"
      }}
    >
      <div className="container">
        <h1 style={{ maxWidth: "600px" }}>
          Rooted in Indian Soil. Crafted in Small Batches.
        </h1>

        <p style={{ marginTop: "20px", maxWidth: "500px" }}>
          Premium rural delicacies made with traditional methods and delivered
          fresh to your home.
        </p>

        <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
          <Link to="/products" className="btn">
            Shop Now
          </Link>
          <Link
            to="/about"
            style={{
              border: "1px solid white",
              padding: "12px 24px",
              borderRadius: "30px",
              color: "white",
              textDecoration: "none"
            }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ----------------------------------
   Trust Highlights
---------------------------------- */
const TrustHighlights = () => {
  return (
    <section className="section">
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          textAlign: "center",
          gap: "40px"
        }}
      >
        <div>🌾 Farm Fresh</div>
        <div>🌿 No Preservatives</div>
        <div>🥭 Traditional Methods</div>
        <div>🚚 Pan India Delivery</div>
      </div>
    </section>
  );
};

/* ----------------------------------
   Featured Products
---------------------------------- */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.slice(0, 3));
    });
  }, []);

  return (
    <section className="section" style={{ background: "var(--beige-light)" }}>
      <div className="container">
        <h2 style={{ marginBottom: "40px" }}>Our Best Sellers</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
            gap: "30px"
          }}
        >
          {products.map((p) => (
            <div key={p.slug} className="card" style={{ padding: "20px" }}>
              <div
                style={{
                  height: "240px",
                  overflow: "hidden",
                  borderRadius: "16px"
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "0.4s ease"
                  }}
                />
              </div>

              <h3 style={{ marginTop: "20px" }}>{p.name}</h3>
              <p style={{ fontSize: "14px", opacity: "0.7" }}>
                {p.description}
              </p>

              <strong style={{ fontSize: "18px" }}>₹{p.price}</strong>

              <br />
              <br />

              <Link to="/products" className="btn">
                View Product
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ----------------------------------
   Why Section
---------------------------------- */
const WhySection = () => {
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ marginBottom: "40px" }}>Why NativeHarvest?</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
            gap: "30px"
          }}
        >
          <div className="card" style={{ padding: "30px" }}>
            🌾 <strong>Farm Fresh</strong>
            <p style={{ marginTop: "10px" }}>
              Made directly on farms in small batches.
            </p>
          </div>

          <div className="card" style={{ padding: "30px" }}>
            🥭 <strong>Traditional Recipes</strong>
            <p style={{ marginTop: "10px" }}>
              Age-old methods preserved with care.
            </p>
          </div>

          <div className="card" style={{ padding: "30px" }}>
            🧡 <strong>Premium Quality</strong>
            <p style={{ marginTop: "10px" }}>
              No shortcuts. No mass production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ----------------------------------
   Home Page Export
---------------------------------- */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustHighlights />
      <FeaturedProducts />
      <WhySection />
    </>
  );
}