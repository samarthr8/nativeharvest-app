import React from "react";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "The Art of Sun-Drying: Why Patience Matters",
    date: "March 1, 2026",
    excerpt: "Discover how traditional sun-curing naturally preserves flavor without the need for artificial chemicals..."
  },
  {
    title: "Cold-Pressed vs Refined Oil: The Honest Truth",
    date: "February 12, 2026",
    excerpt: "What exactly happens to your mustard oil when it goes through a modern factory? We break it down."
  }
];

export default function Blogs() {
  return (
    <div className="container" style={{ padding: "80px 0", minHeight: "60vh", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", color: "#1e1e1e", marginBottom: "50px", textAlign: "center" }}>Stories from the Harvest</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {posts.map((post, i) => (
          <div key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: "30px" }}>
            <p style={{ color: "#2f6f4e", fontWeight: "600", marginBottom: "10px", fontSize: "14px" }}>{post.date}</p>
            <h2 style={{ fontSize: "28px", marginBottom: "15px", color: "#1e1e1e" }}>{post.title}</h2>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6", marginBottom: "20px" }}>{post.excerpt}</p>
            <Link to="#" style={{ color: "#2f6f4e", textDecoration: "none", fontWeight: "600" }}>Read More →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}