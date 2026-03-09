import { useState } from "react";

export default function Newsletter() {
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
        padding: "80px 0" 
      }}
    >
      <div 
        className="container" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          alignItems: "center", 
          gap: "40px" 
        }}
      >
        <div>
          <h2 style={{ fontSize: "36px", marginBottom: "15px" }}>
            Stay Connected
          </h2>
          <p style={{ fontSize: "18px", opacity: "0.9", lineHeight: "1.6" }}>
            Get updates on new products and seasonal batches.
          </p>
        </div>

        <div>
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
                marginTop: "15px", 
                fontSize: "15px", 
                fontWeight: "600", 
                color: "#a5d6a7" 
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}