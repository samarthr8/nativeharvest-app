import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/images/hero-farm-table.png",
    heading: "From Our Farms to Your Home.",
    sub: "Premium rural delicacies, crafted in small batches using traditional methods."
  },
  {
    image: "/images/hero-harvest.png",
    heading: "Handpicked with Love.",
    sub: "Fresh mangoes and amla harvested straight from our orchards."
  },
  {
    image: "/images/hero-pickle-making.png",
    heading: "Ancient Recipes, Modern Flavors.",
    sub: "Sun cured. Spice balanced. Naturally preserved."
  }
];

export default function HeroSection() {
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
}