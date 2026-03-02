import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

/* ----------------------------------
   HERO SLIDER (REFINED PROPORTIONS)
---------------------------------- */

// --- FIXED: Removed the 3rd Unsplash image ---
const slides = [
  {
    image:
      "https://nativeharvest-images.s3.us-east-1.amazonaws.com/products/2.jpg",
    heading: "Rooted in Indian Soil.",
    sub: "Crafted in small batches using traditional methods."
  },
  {
    image:
      "https://nativeharvest-images.s3.us-east-1.amazonaws.com/products/1.jpg",
    heading: "Authentic Traditional Pickles.",
    sub: "Sun cured. Spice balanced. Naturally preserved."
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
    <>
      <style>
        {`
          .hero-content h1 { 
            font-size: 52px; 
          }
          .hero-content p { 
            font-size: 18px; 
          }
          
          .hero-section { 
            background-size: cover !important; 
            background-position: center center !important; 
            min-height: 85vh; 
            padding: 100px 0; 
          }
          
          @media (max-width: 768px) {
            .hero-section { 
              min-height: 55vh !important; 
              padding: 50px 0 !important;
            } 
            
            .hero-content h1 { 
              font-size: 36px !important; 
              margin-bottom: 5px !important;
            }
            
            .hero-content p { 
              font-size: 15px !important; 
              margin-top: 0 !important; 
              line-height: 1.4 !important; 
            }
            
            .hero-buttons {
              margin-top: 20px !important; 
              gap: 12px !important; 
            }
            
            .hero-buttons a {
              padding: 10px 20px !important; 
              font-size: 14px !important;
            }
            
            .hero-dots {
              margin-top: 25px !important; 
            }
          }
        `}
      </style>

      <section
        className="hero hero-section"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(0,0,0,0.65),
              rgba(0,0,0,0.2)
            ),
            url(${slide.image})
          `,
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          transition: "background-image 0.6s ease",
          color: "white"
        }}
      >
        <div
          className="hero-content"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            width: "100%"
          }}
        >
          <h1
            style={{
              maxWidth: "650px",
              lineHeight: "1.2"
            }}
          >
            {slide.heading}
          </h1>

          <p
            style={{
              marginTop: "18px",
              maxWidth: "520px",
              lineHeight: "1.6"
            }}
          >
            {slide.sub}
          </p>

          <div
            className="hero-buttons"
            style={{
              marginTop: "35px",
              display: "flex",
              gap: "18px",
              flexWrap: "wrap"
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
                textDecoration: "none"
              }}
            >
              Learn More
            </Link>
          </div>

          <div
            className="hero-dots"
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "10px"
            }}
          >
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background:
                    i === current
                      ? "white"
                      : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
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
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px,1fr))",
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
                    objectFit: "cover"
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

              <strong style={{ fontSize: "18px" }}>
                ₹{p.price}
              </strong>

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

const Newsletter = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("✓ Thank you for subscribing!");
    setEmail("");

    setTimeout(() => setMessage(""), 3000);
  };

  return (
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

        <div>
          <form
            onSubmit={handleSubscribe}
            style={{ display: "flex", gap: "15px" }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                borderRadius: "30px",
                padding: "12px 18px",
                border: "none",
                flex: 1
              }}
            />
            <button type="submit" className="btn">
              Subscribe
            </button>
          </form>

          {message && (
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              {message}
            </p>
          )}
        </div>

      </div>
    </section>
  );
};

/* ----------------------------------
   EXPORT
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