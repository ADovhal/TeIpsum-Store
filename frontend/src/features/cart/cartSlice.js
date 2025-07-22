import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isOpen: false, // Для отображения всплывающей корзины
  },
  reducers: {
    addToCart(state, action) {
      state.items.push(action.payload);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    clearCart(state) {
      state.items = [];
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  toggleCart,
  closeCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
