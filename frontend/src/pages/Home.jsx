import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

/* ----------------------------------
   HERO SLIDER
---------------------------------- */
const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2000&auto=format&fit=crop",
    heading: "Rooted in Indian Soil.",
    sub: "Crafted in small batches using traditional methods."
  },
  {
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=2000&auto=format&fit=crop",
    heading: "Pure Mustard Oil.",
    sub: "Cold pressed. Farm sourced. No shortcuts."
  },
  {
    image:
      "https://images.unsplash.com/photo-1604908177522-040c2b54c68d?q=80&w=2000&auto=format&fit=crop",
    heading: "Traditional Pickles.",
    sub: "Sun cured. Spice balanced. Authentic taste."
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
        height: "70vh",
        minHeight: "520px",
        background: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${slide.image})`,
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
            fontFamily: "Playfair Display, serif",
            fontSize: "56px",
            lineHeight: "1.1"
          }}
        >
          {slide.heading}
        </h1>

        <p
          style={{
            marginTop: "20px",
            maxWidth: "520px",
            fontSize: "18px",
            opacity: "0.9"
          }}
        >
          {slide.sub}
        </p>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            gap: "20px"
          }}
        >
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
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Learn More
          </Link>
        </div>

        {/* Dots */}
        <div style={{ marginTop: "50px", display: "flex", gap: "12px" }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: i === current ? "white" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "0.3s"
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
        fontSize: "16px",
        fontWeight: "500"
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
    <section className="section" style={{ background: "var(--beige-light)" }}>
      <div className="container">
        <h2
          style={{
            marginBottom: "50px",
            fontFamily: "Playfair Display, serif",
            fontSize: "36px"
          }}
        >
          Our Best Sellers
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
            gap: "32px"
          }}
        >
          {products.map((p) => (
            <div key={p.slug} className="card" style={{ padding: "24px" }}>
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
                    transition: "0.4s"
                  }}
                />
              </div>

              <h3 style={{ marginTop: "22px" }}>{p.name}</h3>
              <p style={{ fontSize: "14px", opacity: "0.7" }}>
                {p.description}
              </p>

              <strong style={{ fontSize: "18px" }}>₹{p.price}</strong>

              <br /><br />

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
   BRAND STORY
---------------------------------- */
const BrandStory = () => (
  <section className="section" style={{ background: "var(--beige-light)" }}>
    <div
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
        alignItems: "center",
        gap: "70px"
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop"
        alt="Farm"
        style={{
          width: "100%",
          borderRadius: "16px"
        }}
      />

      <div>
        <h2 style={{ fontFamily: "Playfair Display, serif" }}>
          Preserving Traditional Taste
        </h2>

        <p style={{ marginTop: "20px", lineHeight: "1.7" }}>
          Rooted in Indian soil. Crafted in small batches. NativeHarvest
          brings authentic rural flavors directly to urban homes.
        </p>

        <div style={{ marginTop: "35px" }}>
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
        gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
        alignItems: "center",
        gap: "40px"
      }}
    >
      <div>
        <h2 style={{ fontFamily: "Playfair Display, serif" }}>
          Stay Connected
        </h2>

        <p style={{ marginTop: "10px" }}>
          Get updates on new products and seasonal batches.
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
        <button className="btn">Subscribe</button>
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
