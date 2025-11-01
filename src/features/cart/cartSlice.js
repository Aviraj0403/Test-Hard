// src/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    if (!cart) return [];
    const parsed = JSON.parse(cart);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: loadCartFromLocalStorage() },
  reducers: {
    addItem: (state, action) => {
      const existing = state.cart.find(i => i.fooditemId === action.payload.fooditemId);
      if (existing) {
        existing.quantity += 1;
        existing.totalPrice = existing.quantity * existing.price;
      } else {
        state.cart.push({ ...action.payload, totalPrice: action.payload.price });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter(i => i.fooditemId !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    increaseItem: (state, action) => {
      const item = state.cart.find(i => i.fooditemId === action.payload);
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.price;
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    decreaseItem: (state, action) => {
      const item = state.cart.find(i => i.fooditemId === action.payload);
      if (item && item.quantity > 0) {
        item.quantity--;
        item.totalPrice = item.quantity * item.price;
        if (item.quantity === 0) {
          state.cart = state.cart.filter(i => i.fooditemId !== action.payload);
        }
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
  },
});

export const { addItem, removeItem, increaseItem, decreaseItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// SAFE SELECTORS
export const getCart = (state) => state.cart?.cart || [];
export const getTotalCartQuantity = (state) => (state.cart?.cart || []).reduce((s, i) => s + i.quantity, 0);
export const getTotalCartPrice = (state) => (state.cart?.cart || []).reduce((s, i) => s + i.totalPrice, 0);
export const getCurrentQuantityById = (id) => (state) =>
  state.cart?.cart?.find(i => i.fooditemId === id)?.quantity ?? 0;