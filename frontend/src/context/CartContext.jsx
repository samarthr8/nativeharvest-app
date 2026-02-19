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

  /* ADD TO CART (WITH VARIANT SUPPORT) */
  const addToCart = (product, selectedVariant = null) => {
    setCart((prev) => {

      const uniqueKey = selectedVariant
        ? `${product.slug}-${selectedVariant.weight}`
        : product.slug;

      const existing = prev.find(p => p.key === uniqueKey);

      if (existing) {
        return prev.map(p =>
          p.key === uniqueKey
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          ...product,
          key: uniqueKey,
          weight: selectedVariant?.weight || null,
          price: selectedVariant?.price || product.price,
          qty: 1
        }
      ];
    });
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(p => p.key !== key));
  };

  const updateQty = (key, qty) => {
    setCart(prev =>
      prev.map(p =>
        p.key === key ? { ...p, qty } : p
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
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
