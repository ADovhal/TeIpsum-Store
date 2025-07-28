import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import adminReducer from '../features/admin/adminSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        products: productReducer,
        cart: cartReducer,
        admin: adminReducer,
    },
});

export default store;
