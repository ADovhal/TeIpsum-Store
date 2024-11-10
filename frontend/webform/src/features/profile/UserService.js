// src/services/userService.js
import api from '../../services/api'; // Импортируем централизованный экземпляр api.js

// Получаем токен из localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Получаем данные профиля пользователя
export const fetchProfileData = async (token) => {
    //const token = getToken(); // Получаем токен
    if (!token) {
        throw new Error('No token found, please log in again.');
    }

    try {
        const response = await api.get('/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile data');
    }
};

// Удаляем аккаунт пользователя
export const deleteAccount = async () => {
    const token = getToken(); // Получаем токен
    if (!token) {
        throw new Error('No token found, please log in again.');
    }

    try {
        const response = await api.delete('/users/delete', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
};
