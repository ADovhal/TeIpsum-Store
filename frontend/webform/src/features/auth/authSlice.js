// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authLoginUser, registerUser, logoutUser, refreshAccessToken } from './AuthService';

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

// Асинхронное действие для логина
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { id, email, accessToken } = await authLoginUser(credentials);
      localStorage.setItem('accessToken', accessToken);
      return { id, email, accessToken };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await refreshAccessToken();
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Переименовали асинхронное действие на logoutAsync
export const logoutAsync = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await logoutUser();
  dispatch(authSlice.actions.clearAuthState()); // Очищаем состояние локально
});

// Слайс для состояния аутентификации
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    profileData: JSON.parse(localStorage.getItem('profileData')) || null,
    isLoading: false,
    error: null,
    isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  },
  reducers: {
    // Переименовали logout в clearAuthState для локальной очистки
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.profileData = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
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
        state.accessToken = action.payload.accessToken;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.profileData = action.payload;
        state.isAuthenticated = true;
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
        state.accessToken = action.payload.accessToken;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.profileData = action.payload.profileData; // Сохраняем профиль
        state.isAuthenticated = true;
        
        // Сохраняем в localStorage
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('profileData', JSON.stringify(action.payload.profileData)); // Сохранение профиля в localStorage
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(logoutAsync.fulfilled, (state) => { // Используем logoutAsync
        state.isAuthenticated = false;
      });
  },
});

// Экспортируем clearAuthState, а не logout, чтобы избежать путаницы
export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;