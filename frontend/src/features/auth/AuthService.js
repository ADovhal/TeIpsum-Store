import apiAuth from '../../services/apiAuth';

export const registerUser = async (userData) => {
    try {
        const response = await apiAuth.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

export const authLoginUser = async (credentials) => {
    try {
        const response = await apiAuth.post('/auth/login', credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { id, email, accessToken } = response.data;
        if (!accessToken) {
            throw new Error('No access token returned from server');
        }
        return { id, email, accessToken };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const refreshAccessToken = async () => {
    try {
        const response = await apiAuth.post(
            '/auth/refresh',
            null,
            {
                withCredentials: true,
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