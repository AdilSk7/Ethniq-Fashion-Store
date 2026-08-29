import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);

import { useAuth } from './AuthContext';

export const WishlistProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (loading) return;

    const userKey = user ? `dakshayani_wishlist_${user.uid}` : 'dakshayani_wishlist_guest';
    const guestKey = 'dakshayani_wishlist_guest';
    
    let loadedItems = [];
    
    if (user) {
      const guestSaved = localStorage.getItem(guestKey);
      const guestItems = guestSaved ? JSON.parse(guestSaved) : [];
      
      const userSaved = localStorage.getItem(userKey);
      const userItems = userSaved ? JSON.parse(userSaved) : [];

      if (guestItems.length > 0) {
        const merged = [...userItems];
        guestItems.forEach(gi => {
          if (!merged.find(i => i.id === gi.id)) {
            merged.push(gi);
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

    setWishlistItems(loadedItems);
    setInitialized(true);
  }, [user, loading]);

  useEffect(() => {
    if (!initialized) return;
    const key = user ? `dakshayani_wishlist_${user.uid}` : 'dakshayani_wishlist_guest';
    localStorage.setItem(key, JSON.stringify(wishlistItems));
  }, [wishlistItems, user, initialized]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId) => wishlistItems.some((p) => p.id === productId);

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount: wishlistItems.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
