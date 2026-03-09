import { Link } from "react-router-dom";

export default function BrandStory() {
  return (
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
            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1000&auto=format&fit=crop"
            alt="NativeHarvest Preparation"
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
              Crafted with Care.
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
            Prepared with utmost care, love, and tradition.
          </h2>
          
          <p 
            style={{ 
              fontSize: "18px", 
              lineHeight: "1.8", 
              color: "#555", 
              marginBottom: "20px" 
            }}
          >
            Every NativeHarvest product is a labor of love, prepared by the skilled hands of rural women who have mastered these ancestral techniques over generations. We believe that true flavor cannot be rushed by machines.
          </p>

          <p 
            style={{ 
              fontSize: "18px", 
              lineHeight: "1.8", 
              color: "#555", 
              marginBottom: "35px" 
            }}
          >
            From our sun-cured Mango Pickle, meticulously marinated in cold-pressed oils and pure spices, to our authentic stone-ground Sattu, we rely entirely on farm-fresh raw materials and unhurried, traditional methods. No shortcuts, no artificial additives—just the honest taste of pure, rural tradition.
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
}