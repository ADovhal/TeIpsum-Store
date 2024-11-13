// src/services/api.js
import axios from 'axios';
import store from '../redux/store';
import { refreshToken, logoutAsync } from '../features/auth/authSlice';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL_TEST,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

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
      const originalRequest = error.config;

      // Проверка, что ошибка 401 (Unauthorized) и запрос еще не повторялся
      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
              // Запрашиваем новый accessToken, используя refreshToken, хранящийся в куках
              const newAccessToken = await store.dispatch(refreshToken()).unwrap();

              // Обновляем заголовок Authorization для оригинального запроса
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return api(originalRequest); // Повторный запрос с новым accessToken
          } catch (refreshError) {
              // Ошибка при обновлении токенов — вызываем логаут
              store.dispatch(logoutAsync());
              return Promise.reject(refreshError);
          }
      }
      return Promise.reject(error);
  }
);

export default api;
