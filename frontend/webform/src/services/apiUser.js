import axios from 'axios';
import apiAuth from './apiAuth';
import store from '../redux/store';
import { setAccessToken, logoutAsync } from '../features/auth/authSlice';

const apiUser = axios.create({
  // baseURL: 'http://localhost:22080/api',
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiUser.interceptors.request.use(
  (config) => {
    // const store = require('../redux/store').default;
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiUser.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await apiAuth.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;
        // const store = require('../redux/store').default;
        // store.dispatch({ type: 'auth/setAccessToken', payload: newAccessToken });
        store.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiUser(originalRequest);
      } catch (refreshError) {
        // const store = require('../redux/store').default;
        // store.dispatch(require('../features/auth/authSlice').logoutAsync());
        store.dispatch(logoutAsync());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiUser;
