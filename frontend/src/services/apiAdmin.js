import axios from 'axios';
import apiAuth from './apiAuth';
import { setAccessToken, logoutAsync } from '../features/auth/authSlice';

let appStore;

export const injectStore = (_store) => {
  appStore = _store;
};

const apiAdmin = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiAdmin.interceptors.request.use(
  (config) => {
    const token = appStore?.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await apiAuth.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;
        appStore?.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiAdmin(originalRequest);
      } catch (refreshError) {
        appStore?.dispatch(logoutAsync());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============== ADMIN USER MANAGEMENT FUNCTIONALITY ==============

/**
 * Registers a new admin user
 */
export const registerAdmin = async (adminData) => {
  try {
    const response = await apiAdmin.post('/auth/register_admin', adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Gets list of all admin users (future feature)
 */
export const getAdminUsers = async () => {
  try {
    const response = await apiAdmin.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Updates admin user permissions (future feature)
 */
export const updateAdminPermissions = async (userId, permissions) => {
  try {
    const response = await apiAdmin.put(`/admin/users/${userId}/permissions`, permissions);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivates an admin user (future feature)
 */
export const deactivateAdmin = async (userId) => {
  try {
    const response = await apiAdmin.put(`/admin/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============== ADMIN PRODUCT MANAGEMENT FUNCTIONALITY ==============

/**
 * Product Management API calls for admin operations
 */
export const adminProductAPI = {
  // Get all products with filtering and pagination
  getProducts: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await apiAdmin.post('/admin/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update an existing product
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiAdmin.put(`/admin/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a product
  deleteProduct: async (productId) => {
    try {
      const response = await apiAdmin.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get product by ID for editing
  getProductById: async (productId) => {
    try {
      const response = await apiAdmin.get(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload product images
  uploadProductImages: async (productId, images) => {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await apiAdmin.post(`/admin/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update product status (active/inactive)
  updateProductStatus: async (productId, status) => {
    try {
      const response = await apiAdmin.patch(`/admin/products/${productId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ============== ADMIN USER MANAGEMENT API ==============

/**
 * User Management API calls for admin operations
 */
export const adminUserAPI = {
  // Get all users with filtering and pagination
  getUsers: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new user (admin creation)
  createUser: async (userData) => {
    try {
      const response = await apiAdmin.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user details
  updateUser: async (userId, userData) => {
    try {
      const response = await apiAdmin.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete/deactivate user
  deleteUser: async (userId) => {
    try {
      const response = await apiAdmin.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiAdmin.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user roles
  updateUserRoles: async (userId, roles) => {
    try {
      const response = await apiAdmin.put(`/admin/users/${userId}/roles`, { roles });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ============== ADMIN ORDER MANAGEMENT API ==============

/**
 * Order Management API calls for admin operations
 */
export const adminOrderAPI = {
  // Get all orders with filtering and pagination
  getOrders: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiAdmin.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiAdmin.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await apiAdmin.patch(`/admin/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process refund
  processRefund: async (orderId, refundData) => {
    try {
      const response = await apiAdmin.post(`/admin/orders/${orderId}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ============== ADMIN ANALYTICS API ==============

/**
 * Analytics API calls for admin operations
 */
export const adminAnalyticsAPI = {
  // Get sales analytics
  getSalesAnalytics: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/analytics/sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get product performance analytics
  getProductPerformance: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/analytics/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user analytics
  getUserAnalytics: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/analytics/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await apiAdmin.get('/admin/analytics/revenue', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get dashboard overview
  getDashboardOverview: async () => {
    try {
      const response = await apiAdmin.get('/admin/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default apiAdmin;