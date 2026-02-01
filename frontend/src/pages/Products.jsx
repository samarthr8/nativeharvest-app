import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("Products API response:", data); // TEMP debug
        setProducts(data);
      });
  }, []);

  return (
    <div>
      <h2>Products</h2>

      <div className="products-grid">
        {products.map(product => {
          const image =
            product.image_url || product.imageUrl || product.image || null;

          return (
            <div key={product.slug} className="product-card">
              {image && (
                <img
                  src={image}
                  alt={product.name}
                  className="product-image"
                />
              )}

              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>₹{product.price}</strong></p>

              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;

