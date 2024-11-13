// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authLoginUser, registerUser, refreshAccessToken } from './AuthService';

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
            const { id, email, accessToken, refreshToken } = await authLoginUser(credentials);

            // Сохраняем токены в localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            return { id, email, accessToken, refreshToken };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронное действие для обновления токена
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (refreshToken, { rejectWithValue }) => {
        try {
            const accessToken = await refreshAccessToken(refreshToken);

            console.log('New Access token from api.interceptor: ', accessToken);

            // Сохраняем новый accessToken
            localStorage.setItem('accessToken', accessToken);
            return accessToken;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Асинхронное действие для выхода
export const logoutAsync = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    //await logoutUser();
    dispatch(clearAuthState()); // Очистка состояния аутентификации
});

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
        clearAuthState: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.profileData = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('profileData');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.user = { id: action.payload.id, email: action.payload.email };
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
                localStorage.setItem('accessToken', action.payload);
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.accessToken = null;
                state.refreshToken = null;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isAuthenticated = false;
            });
    },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
