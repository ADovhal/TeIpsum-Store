import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL_TEST;
const API_URL = 'http://localhost:9092/api/users'
export const registerUser = async (userData) => {
    try {
        const responsePost = await axios.post(`${API_URL}/register`, userData);

        return responsePost.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const authLoginUser = async (credentials) => {
    try {
        const responseLogin = await axios.post(`${API_URL}/login`, credentials);
        const { id, email, token } = responseLogin.data;

        console.log(responseLogin);

        if (!token) {
            throw new Error('No token returned from server');
        }

        return { id, email, token }; 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};