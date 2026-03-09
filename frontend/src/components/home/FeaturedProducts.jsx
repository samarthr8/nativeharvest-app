import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // Updated relative path
import { useCart } from "../../context/CartContext"; // Updated relative path

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/products").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data.slice(0, 3));
    }).catch(() => setProducts([]));
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
}