import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/* ----------------------------------
   HERO SLIDER
---------------------------------- */

const slides = [
  {
    image: "https://nativeharvest-images.s3.us-east-1.amazonaws.com/products/2.jpg",
    heading: "Ancient Recipes, Modern Flavors.",
    sub: "Crafted in small batches using traditional methods from rural India."
  },
  {
    image: "https://nativeharvest-images.s3.us-east-1.amazonaws.com/products/1.jpg",
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
            font-size: 56px; 
            font-weight: 700; 
            letter-spacing: -1px; 
          }
          .hero-content p { 
            font-size: 20px; 
            opacity: 0.9; 
          }
          
          .hero-section { 
            background-size: cover !important; 
            background-position: center center !important; 
            min-height: 85vh; 
            padding: 100px 0; 
          }
          
          @media (max-width: 768px) {
            .hero-section { 
              min-height: 60vh !important; 
              padding: 60px 0 !important; 
            } 
            .hero-content h1 { 
              font-size: 38px !important; 
              margin-bottom: 10px !important; 
            }
            .hero-content p { 
              font-size: 16px !important; 
              margin-top: 0 !important; 
              line-height: 1.5 !important; 
            }
            .hero-buttons { 
              margin-top: 25px !important; 
              gap: 12px !important; 
            }
            .hero-buttons a { 
              padding: 12px 24px !important; 
              font-size: 15px !important; 
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
              rgba(0,0,0,0.8), 
              rgba(0,0,0,0.3)
            ),
            url(${slide.image})
          `,
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          transition: "background-image 0.8s ease-in-out",
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
              maxWidth: "700px", 
              lineHeight: "1.15" 
            }}
          >
            {slide.heading}
          </h1>
          
          <p 
            style={{ 
              marginTop: "20px", 
              maxWidth: "550px", 
              lineHeight: "1.6" 
            }}
          >
            {slide.sub}
          </p>

          <div 
            className="hero-buttons" 
            style={{ 
              marginTop: "40px", 
              display: "flex", 
              gap: "20px", 
              flexWrap: "wrap" 
            }}
          >
            <Link 
              to="/products" 
              style={{
                background: "#25D366", 
                color: "white", 
                padding: "14px 32px", 
                borderRadius: "30px",
                textDecoration: "none", 
                fontWeight: "600", 
                fontSize: "16px", 
                transition: "0.3s",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)"
              }}
            >
              Shop Now
            </Link>
            
            <Link 
              to="/about" 
              style={{
                border: "2px solid white", 
                padding: "14px 32px", 
                borderRadius: "30px", 
                color: "white",
                textDecoration: "none", 
                fontWeight: "600", 
                fontSize: "16px", 
                transition: "0.3s"
              }} 
              onMouseOver={(e) => { 
                e.target.style.background = "white"; 
                e.target.style.color = "#1e1e1e"; 
              }}
              onMouseOut={(e) => { 
                e.target.style.background = "transparent"; 
                e.target.style.color = "white"; 
              }}
            >
              Learn More
            </Link>
          </div>

          <div 
            className="hero-dots" 
            style={{ 
              marginTop: "50px", 
              display: "flex", 
              gap: "12px" 
            }}
          >
            {slides.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? "30px" : "10px", 
                  height: "10px", 
                  borderRadius: "10px",
                  background: i === current ? "white" : "rgba(255,255,255,0.4)", 
                  cursor: "pointer", 
                  transition: "all 0.4s ease"
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
   PREMIUM TRUST STRIP
---------------------------------- */

const TrustHighlights = () => (
  <section 
    style={{ 
      background: "#f0f8f5", 
      padding: "40px 0", 
      borderBottom: "1px solid #e2eee8" 
    }}
  >
    <div 
      className="container" 
      style={{
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
        textAlign: "center", 
        gap: "30px", 
        fontSize: "16px", 
        fontWeight: "600", 
        color: "#2f6f4e"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Fair to Farmers
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9"/></svg>
        100% Preservative Free
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Traditional Sun-Cured
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        Pan India Delivery
      </div>
    </div>
  </section>
);

/* ----------------------------------
   FEATURED PRODUCTS
---------------------------------- */

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.slice(0, 3));
    });
  }, []);

  return (
    <section 
      className="section" 
      style={{ 
        background: "white", 
        padding: "80px 0" 
      }}
    >
      <div className="container">
        <h2 
          style={{ 
            marginBottom: "50px", 
            fontSize: "36px", 
            textAlign: "center", 
            color: "#1e1e1e" 
          }}
        >
          Our Best Sellers
        </h2>

        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", 
            gap: "40px" 
          }}
        >
          {products.map((p) => {
             let defaultPrice = p.price;
             let defaultVariant = null;
             
             if (p.variants && p.variants.length > 0) {
               defaultVariant = p.variants[0];
               defaultPrice = defaultVariant.price;
             }

            return (
              <div 
                key={p.slug} 
                className="card product-card" 
                style={{
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  border: "1px solid #eee",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease", 
                  background: "white"
                }}
                onMouseOver={(e) => { 
                  e.currentTarget.style.transform = "translateY(-5px)"; 
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.08)"; 
                }}
                onMouseOut={(e) => { 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "none"; 
                }}
              >
                
                <Link 
                  to={`/products/${p.slug}`} 
                  style={{ 
                    display: "block", 
                    height: "280px", 
                    overflow: "hidden" 
                  }}
                >
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    loading="lazy" 
                    style={{
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover", 
                      transition: "transform 0.5s ease"
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                </Link>

                <div style={{ padding: "25px" }}>
                  <Link 
                    to={`/products/${p.slug}`} 
                    style={{ 
                      textDecoration: "none", 
                      color: "inherit" 
                    }}
                  >
                    <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>
                      {p.name}
                    </h3>
                  </Link>
                  
                  <p 
                    style={{ 
                      fontSize: "15px", 
                      opacity: "0.7", 
                      lineHeight: "1.5", 
                      marginBottom: "15px", 
                      minHeight: "45px" 
                    }}
                  >
                    {p.description ? (p.description.length > 80 ? p.description.substring(0, 80) + "..." : p.description) : ""}
                  </p>
                  
                  <div 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center" 
                    }}
                  >
                    <strong 
                      style={{ 
                        fontSize: "20px", 
                        color: "#2f6f4e" 
                      }}
                    >
                      ₹{defaultPrice}
                    </strong>
                    
                    <button 
                      onClick={() => addToCart(p, defaultVariant, 1)}
                      style={{
                        background: "#2f6f4e", 
                        color: "white", 
                        border: "none", 
                        padding: "10px 18px", 
                        borderRadius: "8px", 
                        cursor: "pointer", 
                        fontWeight: "600", 
                        fontSize: "14px",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#1b5e20"}
                      onMouseOut={(e) => e.target.style.background = "#2f6f4e"}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Link 
            to="/products" 
            style={{ 
              color: "#2f6f4e", 
              fontWeight: "600", 
              fontSize: "18px", 
              textDecoration: "underline" 
            }}
          >
            View All Products →
          </Link>
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
    style={{ 
      background: "#faf9f6", 
      padding: "100px 0" 
    }}
  >
    <div 
      className="container" 
      style={{
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px,1fr))",
        alignItems: "center", 
        gap: "80px"
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src="https://images.unsplash.com/photo-1596647285149-8c207d578b87?q=80&w=1000&auto=format&fit=crop"
          alt="NativeHarvest Origins"
          loading="lazy"
          style={{ 
            width: "100%", 
            borderRadius: "20px", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)" 
          }}
        />
        <div 
          style={{
            position: "absolute", 
            bottom: "-20px", 
            right: "-20px", 
            background: "white", 
            padding: "20px", 
            borderRadius: "12px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}
        >
          <p 
            style={{ 
              margin: 0, 
              fontWeight: "bold", 
              color: "#2f6f4e", 
              fontSize: "18px" 
            }}
          >
            Est. 2025
          </p>
        </div>
      </div>

      <div>
        <h2 
          style={{ 
            fontSize: "40px", 
            lineHeight: "1.2", 
            marginBottom: "25px", 
            color: "#1e1e1e" 
          }}
        >
          Rooted in Madhya Pradesh. Brought to your table.
        </h2>
        
        <p 
          style={{ 
            fontSize: "18px", 
            lineHeight: "1.8", 
            color: "#555", 
            marginBottom: "20px" 
          }}
        >
          From the heart of Chhatarpur, NativeHarvest was born out of a shared vision between two friends to rescue ancient recipes and uncompromising quality from the past.
        </p>

        <p 
          style={{ 
            fontSize: "18px", 
            lineHeight: "1.8", 
            color: "#555", 
            marginBottom: "35px" 
          }}
        >
          We partner directly with rural farmers to source the finest mustard seeds and sun-ripened mangoes, pressing and curing them in small batches. The result? Traditional food that tastes exactly how your grandparents remember it, crafted for the modern pantry.
        </p>

        <Link 
          to="/about" 
          style={{
            display: "inline-block", 
            background: "transparent", 
            color: "#2f6f4e", 
            border: "2px solid #2f6f4e",
            padding: "14px 32px", 
            borderRadius: "30px", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "16px", 
            transition: "all 0.3s ease"
          }} 
          onMouseOver={(e) => { 
            e.target.style.background = "#2f6f4e"; 
            e.target.style.color = "white"; 
          }}
          onMouseOut={(e) => { 
            e.target.style.background = "transparent"; 
            e.target.style.color = "#2f6f4e"; 
          }}
        >
          Discover Our Full Story
        </Link>
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
    
    setMessage("✓ Welcome to the NativeHarvest family!");
    setEmail("");
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <section 
      style={{ 
        background: "#2f6f4e", 
        color: "white", 
        padding: "80px 0", 
        textAlign: "center" 
      }}
    >
      <div 
        className="container" 
        style={{ 
          maxWidth: "700px", 
          margin: "0 auto" 
        }}
      >
        <h2 style={{ fontSize: "36px", marginBottom: "15px" }}>
          Join the Harvest
        </h2>
        
        <p 
          style={{ 
            fontSize: "18px", 
            opacity: "0.9", 
            marginBottom: "40px", 
            lineHeight: "1.6" 
          }}
        >
          Subscribe to get exclusive access to limited seasonal batches, new traditional recipes, and stories from our farms.
        </p>

        <form 
          onSubmit={handleSubscribe} 
          style={{ 
            display: "flex", 
            gap: "10px", 
            background: "rgba(255,255,255,0.1)", 
            padding: "8px", 
            borderRadius: "40px", 
            border: "1px solid rgba(255,255,255,0.2)" 
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            style={{
              background: "transparent", 
              border: "none", 
              outline: "none", 
              color: "white",
              padding: "15px 25px", 
              flex: 1, 
              fontSize: "16px"
            }}
          />
          <style>
            {`input::placeholder { color: rgba(255,255,255,0.6); }`}
          </style>
          
          <button 
            type="submit" 
            style={{
              background: "white", 
              color: "#2f6f4e", 
              border: "none", 
              padding: "15px 35px",
              borderRadius: "30px", 
              cursor: "pointer", 
              fontWeight: "bold", 
              fontSize: "16px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }} 
            onMouseOver={(e) => { 
              e.target.style.transform = "scale(1.05)"; 
              e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)"; 
            }}
            onMouseOut={(e) => { 
              e.target.style.transform = "scale(1)"; 
              e.target.style.boxShadow = "none"; 
            }}
          >
            Subscribe
          </button>
        </form>

        {message && (
          <p 
            style={{ 
              marginTop: "20px", 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "#a5d6a7" 
            }}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

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