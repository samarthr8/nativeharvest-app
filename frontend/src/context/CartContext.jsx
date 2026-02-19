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

  /* ADD TO CART WITH VARIANT SUPPORT */
  const addToCart = (product, selectedVariant = null) => {

    const variantKey = selectedVariant?.weight || null;
    const price = selectedVariant?.price || product.price;

    setCart((prev) => {

      const existing = prev.find(
        p => p.slug === product.slug && p.variantKey === variantKey
      );

      if (existing) {
        return prev.map(p =>
          p.slug === product.slug && p.variantKey === variantKey
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          ...product,
          price,
          variantKey,
          qty: 1
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
      prev.map(p =>
        p.slug === slug && p.variantKey === variantKey
          ? { ...p, qty }
          : p
      )
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
