import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* --- UPDATED: Now accepts an inputQty parameter (defaults to 1 for backward compatibility) --- */
  const addToCart = (product, selectedVariant = null, inputQty = 1) => {

    const variantKey = selectedVariant?.weight || null;
    const price = selectedVariant?.price || product.price;
    
    // Determine the true stock limit for this specific item/variant
    const maxStock = selectedVariant && selectedVariant.stock !== undefined 
      ? selectedVariant.stock 
      : product.stock;

    setCart((prev) => {

      const existing = prev.find(
        p => p.slug === product.slug && p.variantKey === variantKey
      );

      if (existing) {
        return prev.map(p => {
          if (p.slug === product.slug && p.variantKey === variantKey) {
            // Cap the combined quantity at maxStock
            const newQty = p.qty + inputQty > maxStock ? maxStock : p.qty + inputQty;
            return { ...p, qty: newQty, maxStock }; 
          }
          return p;
        });
      }

      // Ensure a user can't add more than maxStock on their very first click
      const startingQty = inputQty > maxStock ? maxStock : inputQty;

      return [
        ...prev,
        {
          ...product,
          price,
          variantKey,
          qty: startingQty,
          maxStock // Save the limit in the cart item
        }
      ];
    });
  };

  const removeFromCart = (slug, variantKey = null) => {
    setCart(prev =>
      prev.filter(p => !(p.slug === slug && p.variantKey === variantKey))
    );
  };

  const updateQty = (slug, variantKey, qty) => {
    setCart(prev =>
      prev.map(p => {
        if (p.slug === slug && p.variantKey === variantKey) {
          // Enforce bounds: no less than 1, no more than maxStock
          const validQty = qty > p.maxStock ? p.maxStock : (qty < 1 ? 1 : qty);
          return { ...p, qty: validQty };
        }
        return p;
      })
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};