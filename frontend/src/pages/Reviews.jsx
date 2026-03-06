import React from "react";

const dummyReviews = [
  {
    name: "Aarti S.",
    date: "March 2, 2026",
    rating: 5,
    title: "Exactly like my grandmother's!",
    text: "I have been searching for an authentic, sun-dried mango pickle for years. The spices are perfectly balanced, and the cold-pressed mustard oil gives it that genuine traditional kick. Will definitely reorder."
  },
  {
    name: "Vikram R.",
    date: "February 24, 2026",
    rating: 5,
    title: "Premium Quality Sattu",
    text: "You can actually taste the difference the stone-grinding makes. It has a wonderful roasted aroma that you just don't get from factory-made brands. High quality packaging too."
  },
  {
    name: "Priya M.",
    date: "February 15, 2026",
    rating: 5,
    title: "The real deal",
    text: "Absolutely love the fact that there are no preservatives. It feels good knowing exactly what I'm feeding my family. Shipping was fast to Bangalore."
  },
  {
    name: "Rahul T.",
    date: "January 30, 2026",
    rating: 4,
    title: "Great taste, fast delivery",
    text: "The flavor of the pickles is fantastic. It arrived well-packaged so there were no leaks from the oil. Highly recommend the Mango and Garlic variants."
  }
];

export default function Reviews() {
  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "70vh" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "40px", color: "#1e1e1e", marginBottom: "15px" }}>Customer Reviews</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", fontSize: "24px", color: "#FFD700" }}>
          ★★★★★
        </div>
        <p style={{ marginTop: "15px", fontSize: "18px", color: "#555" }}>
          Based on verified purchases from our NativeHarvest family.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "30px" 
      }}>
        {dummyReviews.map((review, i) => (
          <div key={i} style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #eee"
          }}>
            <div style={{ display: "flex", color: "#FFD700", fontSize: "18px", marginBottom: "15px" }}>
              {"★".repeat(review.rating)}
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#2f6f4e" }}>"{review.title}"</h3>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#444", marginBottom: "20px" }}>
              {review.text}
            </p>
            <div style={{ borderTop: "1px solid #eee", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "15px" }}>{review.name}</strong>
              <span style={{ fontSize: "13px", color: "#888" }}>{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}