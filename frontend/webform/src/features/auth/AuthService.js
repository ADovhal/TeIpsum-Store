// AuthService.js
import api from '../../services/api';
import axios from 'axios';

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

// Функция для логина
export const authLoginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        const { id, email, accessToken, refreshToken } = response.data;
        if (!accessToken) {
            throw new Error('No access token returned from server');
        }
        localStorage.setItem('refreshToken', refreshToken); // Сохраняем refreshToken в localStorage
        return { id, email, accessToken, refreshToken }; // возвращаем refreshToken в состояние
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};


// Функция для получения нового accessToken
export const refreshAccessToken = async (refreshToken) => {
    console.log('Refresh token in refreshAccessToken:', refreshToken);
    if (!refreshToken) {
        throw new Error('No refresh token found, please log in again.');
    }
    
    try {
        // Создаем новый экземпляр axios без перехватчиков
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL_TEST}/auth/refresh`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`, // Используем refreshToken
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.accessToken;
    } catch (error) {
        throw new Error('Failed to refresh access token');
    }
};

// // Функция для выхода из системы
// export const logoutUser = () => {
//     localStorage.removeItem('refreshToken'); // Удаляем только refreshToken
// };
