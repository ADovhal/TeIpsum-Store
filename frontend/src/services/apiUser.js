import axios from 'axios';
import apiAuth from './apiAuth';
// import store from '../redux/store';
import { setAccessToken, logoutAsync } from '../features/auth/authSlice';

let appStore;

export const injectStore = (_store) => {
  appStore = _store;
};

const apiUser = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiUser.interceptors.request.use(
  (config) => {
    // const store = require('../redux/store').default;
    const token = appStore?.getState().auth.accessToken;
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
        appStore?.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiUser(originalRequest);
      } catch (refreshError) {
        // const store = require('../redux/store').default;
        // store.dispatch(require('../features/auth/authSlice').logoutAsync());
        appStore?.dispatch(logoutAsync());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// // ============== USER ACCOUNT DELETION FUNCTIONALITY ==============

// /**
//  * Gets account deletion information including order history
//  */
// export const getDeletionInfo = async () => {
//   try {
//     const response = await apiUser.get('/api/users/deletion-info');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// /**
//  * Initiates the account deletion process
//  */
// export const initiateAccountDeletion = async () => {
//   try {
//     const response = await apiUser.post('/api/users/initiate-deletion');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// /**
//  * Legacy deletion endpoint (deprecated - use initiateAccountDeletion instead)
//  */
// export const deleteAccount = async () => {
//   try {
//     const response = await apiUser.delete('/api/users/delete');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// /**
//  * Gets user profile information
//  */
// export const getUserProfile = async () => {
//   try {
//     const response = await apiUser.get('/api/users/profile');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// /**
//  * Updates user profile information
//  */
// export const updateUserProfile = async (profileData) => {
//   try {
//     const response = await apiUser.put('/api/users/profile', profileData);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

/**
 * Get user body parameters for fit service
 */
export const getBodyParameters = async () => {
  try {
    const response = await apiUser.get('/api/users/body-parameters');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Save user body parameters for fit service
 */
export const saveBodyParameters = async (bodyParams) => {
  try {
    const response = await apiUser.post('/api/users/body-parameters', bodyParams);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default apiUser;
