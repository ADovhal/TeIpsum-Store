// AuthService.js
import api from '../../services/api';
import axios from 'axios';

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false, // отключаем куки
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

// Функция для логина
export const authLoginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { id, email, accessToken } = response.data;
        if (!accessToken) {
            throw new Error('No access token returned from server');
        }
        return { id, email, accessToken }; // возвращаем refreshToken в состояние
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};


// Функция для получения нового accessToken
export const refreshAccessToken = async () => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL_TEST}/auth/refresh`,
            null,
            {
                withCredentials: true, // Отправляем куки вместе с запросом
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.accessToken;
    } catch (error) {
        throw new Error('Failed to refresh access token');
    }
};