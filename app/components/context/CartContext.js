"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Initialize cart and orders from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setCart(savedCart);
    setOrders(savedOrders);
  }, []);

  // Sync cart and orders to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [cart, orders]);

  const addToCart = (item, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Update the quantity of the existing item
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Add a new item to the cart
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  const saveOrder = (orderItems, total) => {
    const newOrder = {
      id: Date.now(),
      items: orderItems,
      total: total,
      date: new Date().toISOString(),
      status: 'completed'
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, orders, saveOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
