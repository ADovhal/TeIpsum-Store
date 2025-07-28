import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedData = JSON.parse(cartData);
      // Always start with cart closed on page load/refresh
      return { ...parsedData, isOpen: false };
    }
    return { items: [], isOpen: false };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return { items: [], isOpen: false };
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    incrementQuantity(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    decrementQuantity(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== action.payload);
        }
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    setCartItems(state, action) {
      state.items = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  toggleCart,
  closeCart,
  clearCart,
  setCartItems
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
