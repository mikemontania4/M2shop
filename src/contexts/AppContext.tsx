import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '../services/authService';
import cartService, { CartItem } from '../services/cartService';
import { Product } from '../services/productService';

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [cart, setCart] = useState<CartItem[]>(cartService.getCart());
  const [cartCount, setCartCount] = useState(cartService.getCartCount());
  const [cartTotal, setCartTotal] = useState(cartService.getCartTotal());

  const updateCartState = () => {
    setCart(cartService.getCart());
    setCartCount(cartService.getCartCount());
    setCartTotal(cartService.getCartTotal());
  };

  const login = (email: string, password: string) => {
    const result = authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    cartService.addToCart(product, quantity, size, color);
    updateCartState();
  };

  const removeFromCart = (productId: number, size: string, color: string) => {
    cartService.removeFromCart(productId, size, color);
    updateCartState();
  };

  const updateQuantity = (productId: number, size: string, color: string, quantity: number) => {
    cartService.updateQuantity(productId, size, color, quantity);
    updateCartState();
  };

  const clearCart = () => {
    cartService.clearCart();
    updateCartState();
  };

  useEffect(() => {
    updateCartState();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        cartCount,
        cartTotal,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
