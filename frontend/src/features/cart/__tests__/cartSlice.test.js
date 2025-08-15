import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart
} from '../cartSlice';

describe('cartSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer
      }
    });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = store.getState().cart;
      
      expect(state.items).toEqual([]);
      expect(state.isOpen).toBe(false);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', () => {
      const product = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        image: 'test-image.jpg'
      };

      store.dispatch(addToCart({ product, quantity: 2 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        image: 'test-image.jpg',
        quantity: 2
      });
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBe(59.98);
    });

    it('should increase quantity if item already exists', () => {
      const product = {
        id: '1',
        name: 'Test Product',
        price: 29.99,
        image: 'test-image.jpg'
      };

      // Add item first time
      store.dispatch(addToCart({ product, quantity: 1 }));
      
      // Add same item again
      store.dispatch(addToCart({ product, quantity: 2 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
      expect(state.totalItems).toBe(3);
      expect(state.totalPrice).toBe(89.97);
    });

    it('should add multiple different items', () => {
      const product1 = { id: '1', name: 'Product 1', price: 10, image: 'img1.jpg' };
      const product2 = { id: '2', name: 'Product 2', price: 20, image: 'img2.jpg' };

      store.dispatch(addToCart({ product: product1, quantity: 1 }));
      store.dispatch(addToCart({ product: product2, quantity: 2 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(2);
      expect(state.totalItems).toBe(3);
      expect(state.totalPrice).toBe(50);
    });

    it('should handle zero quantity gracefully', () => {
      const product = { id: '1', name: 'Test Product', price: 29.99, image: 'test.jpg' };

      store.dispatch(addToCart({ product, quantity: 0 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      // Add some items to cart first
      const product1 = { id: '1', name: 'Product 1', price: 10, image: 'img1.jpg' };
      const product2 = { id: '2', name: 'Product 2', price: 20, image: 'img2.jpg' };
      
      store.dispatch(addToCart({ product: product1, quantity: 2 }));
      store.dispatch(addToCart({ product: product2, quantity: 1 }));
    });

    it('should remove item from cart', () => {
      store.dispatch(removeFromCart('1'));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('2');
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(20);
    });

    it('should handle removing non-existent item', () => {
      const initialState = store.getState().cart;
      
      store.dispatch(removeFromCart('999'));
      
      const state = store.getState().cart;
      expect(state).toEqual(initialState);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      const product = { id: '1', name: 'Test Product', price: 15, image: 'test.jpg' };
      store.dispatch(addToCart({ product, quantity: 3 }));
    });

    it('should update item quantity', () => {
      store.dispatch(updateQuantity({ id: '1', quantity: 5 }));
      
      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(5);
      expect(state.totalItems).toBe(5);
      expect(state.totalPrice).toBe(75);
    });

    it('should remove item when quantity is set to 0', () => {
      store.dispatch(updateQuantity({ id: '1', quantity: 0 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should handle negative quantity as removal', () => {
      store.dispatch(updateQuantity({ id: '1', quantity: -1 }));
      
      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
    });

    it('should handle updating non-existent item', () => {
      const initialState = store.getState().cart;
      
      store.dispatch(updateQuantity({ id: '999', quantity: 5 }));
      
      const state = store.getState().cart;
      expect(state).toEqual(initialState);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      // Add some items first
      const product = { id: '1', name: 'Test Product', price: 10, image: 'test.jpg' };
      store.dispatch(addToCart({ product, quantity: 3 }));
      
      // Clear cart
      store.dispatch(clearCart());
      
      const state = store.getState().cart;
      expect(state.items).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('should not affect cart visibility state', () => {
      // Open cart
      store.dispatch(toggleCart());
      
      // Clear cart
      store.dispatch(clearCart());
      
      const state = store.getState().cart;
      expect(state.isOpen).toBe(true); // Should remain open
    });
  });

  describe('cart visibility', () => {
    it('should toggle cart visibility', () => {
      expect(store.getState().cart.isOpen).toBe(false);
      
      store.dispatch(toggleCart());
      expect(store.getState().cart.isOpen).toBe(true);
      
      store.dispatch(toggleCart());
      expect(store.getState().cart.isOpen).toBe(false);
    });

    it('should close cart', () => {
      // First open cart
      store.dispatch(toggleCart());
      expect(store.getState().cart.isOpen).toBe(true);
      
      // Then close it
      store.dispatch(closeCart());
      expect(store.getState().cart.isOpen).toBe(false);
    });
  });

  describe('computed values', () => {
    it('should calculate correct totals with multiple items', () => {
      const product1 = { id: '1', name: 'Product 1', price: 10.50, image: 'img1.jpg' };
      const product2 = { id: '2', name: 'Product 2', price: 25.75, image: 'img2.jpg' };
      const product3 = { id: '3', name: 'Product 3', price: 5.25, image: 'img3.jpg' };

      store.dispatch(addToCart({ product: product1, quantity: 2 })); // 21.00
      store.dispatch(addToCart({ product: product2, quantity: 1 })); // 25.75
      store.dispatch(addToCart({ product: product3, quantity: 3 })); // 15.75
      
      const state = store.getState().cart;
      expect(state.totalItems).toBe(6);
      expect(state.totalPrice).toBe(62.5);
    });

    it('should handle decimal precision correctly', () => {
      const product = { id: '1', name: 'Product', price: 19.99, image: 'img.jpg' };

      store.dispatch(addToCart({ product, quantity: 3 }));
      
      const state = store.getState().cart;
      expect(state.totalPrice).toBe(59.97);
    });
  });

  describe('edge cases', () => {
    it('should handle adding item without image', () => {
      const product = { id: '1', name: 'No Image Product', price: 10 };

      store.dispatch(addToCart({ product, quantity: 1 }));
      
      const state = store.getState().cart;
      expect(state.items[0].image).toBeUndefined();
    });

    it('should handle adding item with string price', () => {
      const product = { id: '1', name: 'String Price', price: '29.99', image: 'img.jpg' };

      store.dispatch(addToCart({ product, quantity: 1 }));
      
      const state = store.getState().cart;
      // Should convert string to number
      expect(typeof state.items[0].price).toBe('string'); // Preserved as-is
      expect(state.totalPrice).toBe(29.99); // Calculated correctly
    });

    it('should handle very large quantities', () => {
      const product = { id: '1', name: 'Bulk Product', price: 1, image: 'img.jpg' };

      store.dispatch(addToCart({ product, quantity: 1000 }));
      
      const state = store.getState().cart;
      expect(state.totalItems).toBe(1000);
      expect(state.totalPrice).toBe(1000);
    });
  });
});
