import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

import { useAuth } from './AuthContext';

export const CartProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (loading) return;

    const userKey = user ? `dakshayani_cart_${user.uid}` : 'dakshayani_cart_guest';
    const guestKey = 'dakshayani_cart_guest';
    
    let loadedItems = [];
    
    if (user) {
      const guestSaved = localStorage.getItem(guestKey);
      const guestItems = guestSaved ? JSON.parse(guestSaved) : [];
      
      const userSaved = localStorage.getItem(userKey);
      const userItems = userSaved ? JSON.parse(userSaved) : [];

      if (guestItems.length > 0) {
        const merged = [...userItems];
        guestItems.forEach(gi => {
          const existing = merged.find(i => i.key === gi.key);
          if (!existing) {
            merged.push(gi);
          } else {
            existing.quantity += gi.quantity;
          }
        });
        loadedItems = merged;
        localStorage.removeItem(guestKey);
      } else {
        loadedItems = userItems;
      }
    } else {
       const guestSaved = localStorage.getItem(guestKey);
       loadedItems = guestSaved ? JSON.parse(guestSaved) : [];
    }

    setCartItems(loadedItems);
    setInitialized(true);
  }, [user, loading]);

  useEffect(() => {
    if (!initialized) return;
    const key = user ? `dakshayani_cart_${user.uid}` : 'dakshayani_cart_guest';
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user, initialized]);

  const addToCart = (product, size, color, quantity = 1) => {
    const key = `${product.id}_${size}_${color}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { key, product, size, color, quantity }];
    });
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) removeFromCart(key);
    else setCartItems((prev) => prev.map((i) => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce(
    (sum, i) => sum + (i.product.salePrice || i.product.originalPrice) * i.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const generateWhatsAppMessage = () => {
    const lines = cartItems.map((item, idx) => 
      `${idx + 1}. *${item.product.name}*\n   Size: ${item.size}\n   Color: ${item.color}\n   Qty: ${item.quantity}\n   Price: ₹${item.product.salePrice || item.product.originalPrice}`
    ).join('\n\n');
    return `Hello Dakshayani Shopping Mall! 🛍️\n\nI would like to enquire about the following products:\n\n${lines}\n\n*Total: ₹${cartTotal}*\n\nPlease confirm availability and further details. Thank you!`;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      generateWhatsAppMessage,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
