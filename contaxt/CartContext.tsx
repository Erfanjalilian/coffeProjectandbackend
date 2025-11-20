"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartProduct {
  id: string; // Changed from number to string to match backend _id
  name: string;
  price: number; // Changed from string to number to match backend price
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: Omit<CartProduct, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void; // Changed from number to string
  updateQuantity: (id: string, quantity: number) => void; // Changed from number to string
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Omit<CartProduct, "quantity">, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        // Update quantity if product already exists
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      } else {
        // Add new product
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      // If quantity becomes 0, remove the item from cart
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(p => (p.id === id ? { ...p, quantity } : p)));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};