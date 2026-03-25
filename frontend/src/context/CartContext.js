import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item or increase quantity
  const addToCart = (foodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === foodItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...foodItem, quantity: 1 }];
    });
  };

  // Remove one unit or remove item if quantity = 1
  const removeFromCart = (foodItemId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === foodItemId);
      if (existing?.quantity === 1) {
        return prev.filter((item) => item.id !== foodItemId);
      }
      return prev.map((item) =>
        item.id === foodItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  // Completely remove item
  const deleteFromCart = (foodItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== foodItemId));
  };

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // Computed values
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
