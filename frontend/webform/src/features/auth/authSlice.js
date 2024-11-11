// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authLoginUser, registerUser } from './AuthService';

// Асинхронное действие для логина
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { id, email, token } = await authLoginUser(credentials);
      localStorage.setItem('token', token);
      return { id, email, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для регистрации
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { id, email, token } = await registerUser(userData);
      return { id, email, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Слайс для состояния аутентификации
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    //user: JSON.parse(localStorage.getItem('profileData'))?.user || null,
    token: localStorage.getItem('token') || null,
    profileData: JSON.parse(localStorage.getItem('profileData')) || null,
    isLoading: false,
    error: null,
    isAuthenticated: Boolean(localStorage.getItem('token')),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profileData = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('profileData');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.profileData = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.profileData = action.payload;
        state.isAuthenticated = true; // Устанавливаем isAuthenticated при успешном логине
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('profileData', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
