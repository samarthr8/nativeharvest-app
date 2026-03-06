import React from "react";

const images = [
  "https://nativeharvest-images.s3.us-east-1.amazonaws.com/products/1.jpg",
  "https://nativeharvest-images.s3.us-east-1.amazonaws.com/products/2.jpg",
  "https://images.unsplash.com/photo-1596647285149-8c207d578b87?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=600&auto=format&fit=crop",
];

export default function Gallery() {
  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "40px", color: "#1e1e1e", marginBottom: "15px" }}>Our Gallery</h1>
        <p style={{ fontSize: "18px", color: "#555" }}>A glimpse into our traditional crafting process.</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {images.map((img, i) => (
          <div key={i} style={{ borderRadius: "16px", overflow: "hidden", height: "300px" }}>
            <img 
              src={img} 
              alt={`Gallery image ${i + 1}`} 
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}