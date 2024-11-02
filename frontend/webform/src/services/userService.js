import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_TEST;

export const getToken = () => {
    return localStorage.getItem('token');
};


export const fetchProfileData = async (token) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteAccount = async () => {
    const token = getToken();
    console.log('Token Delete: ', token);
    if (!token) {
        throw new Error('No token found, please log in again.');
    }
    try {
        const response = await axios.delete(`${API_URL}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Failed to delete account');
    }
};
