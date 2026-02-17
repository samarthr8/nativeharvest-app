import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

/* ----------------------------------
   HERO SLIDER (REFINED HEIGHT)
---------------------------------- */
const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1625944525533-473f1a3d54d3",
    heading: "Rooted in Indian Soil.",
    sub: "Crafted in small batches using traditional methods."
  },
  {
    image:
      "https://images.unsplash.com/photo-1589308078055-eb6a4d16b6f2",
    heading: "Authentic Traditional Pickles.",
    sub: "Sun cured. Spice balanced. Naturally preserved."
  },
  {
    image:
      "https://images.unsplash.com/photo-1590080875515-8d3a8d47baf1",
    heading: "Pure Cold Pressed Oils.",
    sub: "Farm sourced. Traditional extraction. No shortcuts."
  }
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section
      style={{
        height: "65vh",
        minHeight: "480px",
        background: `linear-gradient(
          to right,
          rgba(0,0,0,0.45),
          rgba(0,0,0,0.15)
        ), url(${slide.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        color: "white",
        transition: "0.6s ease"
      }}
    >
      <div className="container">
        <h1
          style={{
            maxWidth: "650px",
            fontSize: "48px",
            lineHeight: "1.2"
          }}
        >
          {slide.heading}
        </h1>

        <p
          style={{
            marginTop: "18px",
            maxWidth: "500px",
            fontSize: "18px",
            lineHeight: "1.6"
          }}
        >
          {slide.sub}
        </p>

        <div style={{ marginTop: "28px", display: "flex", gap: "18px" }}>
          <Link to="/products" className="btn">
            Shop Now
          </Link>

          <Link
            to="/about"
            style={{
              border: "1px solid white",
              padding: "12px 26px",
              borderRadius: "30px",
              color: "white",
              textDecoration: "none"
            }}
          >
            Learn More
          </Link>
        </div>

        {/* Dots */}
        <div style={{ marginTop: "32px", display: "flex", gap: "10px" }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background:
                  i === current
                    ? "white"
                    : "rgba(255,255,255,0.5)",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ----------------------------------
   TRUST STRIP
---------------------------------- */
const TrustHighlights = () => (
  <section className="section">
    <div
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
        textAlign: "center",
        gap: "40px",
        fontSize: "15px"
      }}
    >
      <div>🌾 Farm Fresh</div>
      <div>🌿 No Preservatives</div>
      <div>🥭 Traditional Methods</div>
      <div>🚚 Pan India Delivery</div>
    </div>
  </section>
);

/* ----------------------------------
   FEATURED PRODUCTS
---------------------------------- */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.slice(0, 3));
    });
  }, []);

  return (
    <section
      className="section"
      style={{ background: "var(--beige-light)" }}
    >
      <div className="container">
        <h2 style={{ marginBottom: "40px" }}>
          Our Best Sellers
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px,1fr))",
            gap: "30px"
          }}
        >
          {products.map((p) => (
            <div
              key={p.slug}
              className="card"
              style={{
                padding: "20px",
                borderRadius: "16px"
              }}
            >
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
                    transition: "transform 0.4s ease"
                  }}
                />
              </div>

              <h3 style={{ marginTop: "20px" }}>
                {p.name}
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  opacity: "0.7",
                  lineHeight: "1.6"
                }}
              >
                {p.description}
              </p>

              <strong
                style={{
                  fontSize: "18px"
                }}
              >
                ₹{p.price}
              </strong>

              <br />
              <br />

              <Link
                to="/products"
                className="btn"
              >
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
   BRAND STORY
---------------------------------- */
const BrandStory = () => (
  <section
    className="section"
    style={{ background: "var(--beige-light)" }}
  >
    <div
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px,1fr))",
        alignItems: "center",
        gap: "60px"
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1506806732259-39c2d0268443"
        alt="Farm"
        style={{
          width: "100%",
          borderRadius: "16px"
        }}
      />

      <div>
        <h2>Preserving Traditional Taste</h2>

        <p style={{ marginTop: "20px" }}>
          Rooted in Indian soil. Crafted in small
          batches. NativeHarvest brings authentic
          rural flavors directly to urban homes.
        </p>

        <div style={{ marginTop: "30px" }}>
          <Link to="/about" className="btn">
            Discover Our Story
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ----------------------------------
   NEWSLETTER
---------------------------------- */
const Newsletter = () => (
  <section
    className="section"
    style={{
      background: "var(--green-main)",
      color: "white"
    }}
  >
    <div
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px,1fr))",
        alignItems: "center",
        gap: "40px"
      }}
    >
      <div>
        <h2>Stay Connected</h2>
        <p style={{ marginTop: "10px" }}>
          Get updates on new products and
          seasonal batches.
        </p>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <input
          placeholder="Enter your email"
          style={{
            borderRadius: "30px",
            padding: "12px 18px",
            border: "none",
            flex: 1
          }}
        />

        <button className="btn">
          Subscribe
        </button>
      </div>
    </div>
  </section>
);

/* ----------------------------------
   HOME EXPORT
---------------------------------- */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustHighlights />
      <FeaturedProducts />
      <BrandStory />
      <Newsletter />
    </>
  );
}
