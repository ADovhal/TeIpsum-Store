import axios from 'axios';

let appStore;

export const injectStore = (_store) => {
  appStore = _store;
};

const apiOrder = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiOrder.interceptors.request.use(
  (config) => {
    const token = appStore?.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiOrder.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const res = await apiOrder.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;
        appStore?.dispatch({ type: 'auth/setAccessToken', payload: newAccessToken });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiOrder(originalRequest);
      } catch (refreshError) {
        appStore?.dispatch({ type: 'auth/clearAuthState' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Order service functions
export const fetchUserOrders = async () => {
  try {
    const response = await apiOrder.get('/orders/my');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await apiOrder.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
};

export default apiOrder;