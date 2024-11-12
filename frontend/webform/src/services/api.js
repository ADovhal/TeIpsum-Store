// src/services/api.js
import axios from 'axios';
import store from '../redux/store';
import { refreshToken, logoutAsync } from '../features/auth/authSlice';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL_TEST, // Устанавливаем базовый URL для всех запросов
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерсептор для добавления токена авторизации (если нужно)
api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const state = store.getState();
      const refresh = state.auth.refreshToken;
      
      if (error.response?.status === 401 && refresh) {
        try {
          // Попытка обновить accessToken с помощью refreshToken
          const refreshResponse = await store.dispatch(refreshToken(refresh)).unwrap();
          const newToken = refreshResponse.accessToken;
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          // Повторный запрос с новым токеном
          return api(error.config);
        } catch (refreshError) {
          // В случае ошибки обновления токена, разлогиниваем пользователя
          store.dispatch(logoutAsync());
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

export default api;
