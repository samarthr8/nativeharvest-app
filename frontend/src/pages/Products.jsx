import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.map(product => (
        <div key={product.slug} className="card">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><strong>₹{product.price}</strong></p>
          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;


