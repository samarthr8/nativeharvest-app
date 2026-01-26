import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div className="container">
      <SEO
        title="Our Products | NativeHarvest"
        description="Explore farm-fresh pickles, sattu, and cold-pressed mustard oil made using traditional rural methods."
      />

      <h1>Our Products</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map(p => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

