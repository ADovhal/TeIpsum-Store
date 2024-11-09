// src/services/AuthService.js
import api from '../../services/api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const authLoginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        const { id, email, token } = response.data;
        if (!token) {
            throw new Error('No token returned from server');
        }
        return { id, email, token };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};
