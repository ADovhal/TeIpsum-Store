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
        const { id, email, accessToken, refreshToken } = response.data;
        if (!accessToken) {
            throw new Error('No access token returned from server');
        }
        localStorage.setItem('refreshToken', refreshToken); // Сохраняем только refreshToken
        return { id, email, accessToken };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Новый метод для получения нового accessToken
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token found, please log in again.');
    }
    try {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data.accessToken;
    } catch (error) {
        throw new Error('Failed to refresh access token');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('refreshToken'); // Удаляем только refreshToken
};
