// src/services/AuthService.js
import api from '../../services/api';


// Регистрация нового пользователя
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        // Логика обработки ошибок централизованная через api.js или специфичная для этого сервиса
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

// Авторизация пользователя
export const authLoginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        const { id, email, token } = response.data;

        if (!token) {
            throw new Error('No token returned from server');
        }

        // Сохраняем токен (например, в localStorage)
        localStorage.setItem('token', token);

        return { id, email, token };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Выход из системы, удаление токена
export const logoutUser = () => {
    localStorage.removeItem('token');
};
