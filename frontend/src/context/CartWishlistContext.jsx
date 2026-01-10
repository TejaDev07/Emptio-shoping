import React, { createContext, useContext, useState, useEffect } from 'react';

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  // Helper function to safely load from localStorage
  const loadFromStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (item && item !== 'undefined' && item !== 'null') {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      localStorage.removeItem(key);
      return [];
    }
  };

  // Helper function to safely save to localStorage
  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const [cart, setCart] = useState(() => loadFromStorage('cart'));
  const [wishlist, setWishlist] = useState(() => loadFromStorage('wishlist'));
  const [notification, setNotification] = useState(null);
  // Save to localStorage whenever cart/wishlist changes
  useEffect(() => {
    saveToStorage('cart', cart);
  }, [cart]);

  useEffect(() => {
    saveToStorage('wishlist', wishlist);
  }, [wishlist]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        showNotification('Item already in cart', 'warning');
        return prevCart;
      }
      showNotification('Item added to cart');
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
    showNotification('Item removed from cart');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addToWishlist = (product) => {
    setWishlist(prevWishlist => {
      const existingItem = prevWishlist.find(item => item._id === product._id);
      if (existingItem) {
        showNotification('Item already in wishlist', 'warning');
        return prevWishlist;
      }
      showNotification('Item added to wishlist');
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item._id !== productId));
    showNotification('Item removed from wishlist');
  };

  const clearCart = () => {
    setCart([]);
    showNotification('Cart cleared');
  };

  const clearWishlist = () => {
    setWishlist([]);
    showNotification('Wishlist cleared');
  };

  const value = {
    cart,
    wishlist,
    notification,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    clearCart,
    clearWishlist,
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};