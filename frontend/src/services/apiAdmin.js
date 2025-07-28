import axios from 'axios';

const apiAdmin = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product Management API calls
export const adminProductAPI = {
  // Get all products with filtering and pagination
  getProducts: (params = {}) => {
    const { page = 0, size = 20, name, category, minPrice, maxPrice, sort } = params;
    return apiAdmin.get('/api/admin/products', {
      params: {
        page,
        size,
        name,
        category,
        minPrice,
        maxPrice,
        sort
      }
    });
  },

  // Get a single product by ID
  getProduct: (id) => {
    return apiAdmin.get(`/api/admin/products/${id}`);
  },

  // Create a new product
  createProduct: (productData) => {
    return apiAdmin.post('/api/admin/products', productData);
  },

  // Update an existing product
  updateProduct: (id, productData) => {
    return apiAdmin.put(`/api/admin/products/${id}`, productData);
  },

  // Delete a product
  deleteProduct: (id) => {
    return apiAdmin.delete(`/api/admin/products/${id}`);
  },

  // Bulk operations
  bulkDeleteProducts: (productIds) => {
    return apiAdmin.post('/api/admin/products/bulk-delete', { productIds });
  },

  bulkUpdateProducts: (productIds, updateData) => {
    return apiAdmin.put('/api/admin/products/bulk-update', { productIds, updateData });
  }
};

// User Management API calls (for admin user creation)
export const adminUserAPI = {
  // Create a new admin user
  createAdminUser: (userData) => {
    return apiAdmin.post('/api/admin/users', userData);
  },

  // Get all users
  getUsers: (params = {}) => {
    const { page = 0, size = 20, role } = params;
    return apiAdmin.get('/api/admin/users', {
      params: { page, size, role }
    });
  },

  // Update user role
  updateUserRole: (userId, role) => {
    return apiAdmin.put(`/api/admin/users/${userId}/role`, { role });
  },

  // Delete user
  deleteUser: (userId) => {
    return apiAdmin.delete(`/api/admin/users/${userId}`);
  }
};

// Order Management API calls
export const adminOrderAPI = {
  // Get all orders
  getOrders: (params = {}) => {
    const { page = 0, size = 20, status, dateFrom, dateTo } = params;
    return apiAdmin.get('/api/admin/orders', {
      params: { page, size, status, dateFrom, dateTo }
    });
  },

  // Get order details
  getOrder: (orderId) => {
    return apiAdmin.get(`/api/admin/orders/${orderId}`);
  },

  // Update order status
  updateOrderStatus: (orderId, status) => {
    return apiAdmin.put(`/api/admin/orders/${orderId}/status`, { status });
  },

  // Get order statistics
  getOrderStats: (params = {}) => {
    const { period = 'month' } = params;
    return apiAdmin.get('/api/admin/orders/stats', {
      params: { period }
    });
  }
};

// Analytics and Reports API calls
export const adminAnalyticsAPI = {
  // Get sales analytics
  getSalesAnalytics: (params = {}) => {
    const { period = 'month', groupBy = 'day' } = params;
    return apiAdmin.get('/api/admin/analytics/sales', {
      params: { period, groupBy }
    });
  },

  // Get product performance
  getProductPerformance: (params = {}) => {
    const { period = 'month', limit = 10 } = params;
    return apiAdmin.get('/api/admin/analytics/products', {
      params: { period, limit }
    });
  },

  // Get user analytics
  getUserAnalytics: (params = {}) => {
    const { period = 'month' } = params;
    return apiAdmin.get('/api/admin/analytics/users', {
      params: { period }
    });
  },

  // Generate reports
  generateReport: (reportType, params = {}) => {
    return apiAdmin.post('/api/admin/reports/generate', {
      reportType,
      params
    });
  }
};

export default apiAdmin; 