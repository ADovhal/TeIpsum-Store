// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:9092/api', // Устанавливаем базовый URL для всех запросов
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерсептор для добавления токена авторизации (если нужно)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Обработка ответа и ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Здесь можно добавить глобальную обработку ошибок
        console.error('API error:', error);
        return Promise.reject(error);
    }
);

export default api;
