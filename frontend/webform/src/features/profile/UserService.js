import api from '../../services/api';
import store from '../../redux/store';

export const fetchProfileData = async () => {
    const state = store.getState();
    const token = state.auth.accessToken;

    console.log('Token for fetchProfileData: ', token)
  
    if (!token) {
      throw new Error('No access token found, please log in again.');
    }
  
    try {
        const response = await api.get('/users/profile', { 
          headers: { 
              Authorization: `Bearer ${token}` 
          },
        })
        console.log('Response Headers:', response.headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
  };

export const deleteAccount = async () => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (!token) {
        throw new Error('No token found, please log in again.');
    }

    try {
        console.log('Sending DELETE request...');
        const response = await api.delete('/users/delete', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Delete response:', response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};
