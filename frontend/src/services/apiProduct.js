import axios from 'axios';

/**
 * Product API service class for connecting to Spring Boot microservices
 * Handles both catalog service (public products) and admin service (product management)
 */
class ProductApi {
  constructor() {
    // Base URLs for different microservices
    this.catalogBaseURL = process.env.REACT_APP_API_URL;
    this.adminBaseURL = `${(process.env.REACT_APP_API_URL)}/admin`;
    
    // Create axios instances for different services
    this.catalogApi = this.createCatalogInstance();
    this.adminApi = this.createAdminInstance();
  }

  /**
   * Create axios instance for catalog service (public products)
   */
  createCatalogInstance() {
    const instance = axios.create({
      baseURL: this.catalogBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor for catalog service
    instance.interceptors.request.use(
      (config) => {
        console.log(`📡 Catalog API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Catalog API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for catalog service
    instance.interceptors.response.use(
      (response) => {
        console.log(`✅ Catalog API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Catalog API Response Error:', error);
        if (error.response?.status === 404) {
          throw new Error('Products not found');
        }
        if (error.response?.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        }
        throw error;
      }
    );

    return instance;
  }

  /**
   * Create axios instance for admin service (product management)
   */
  createAdminInstance() {
    const instance = axios.create({
      baseURL: this.adminBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // Request interceptor for admin service
    instance.interceptors.request.use(
      (config) => {
        // Add auth token for admin operations
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🔐 Admin API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Admin API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for admin service
    instance.interceptors.response.use(
      (response) => {
        console.log(`✅ Admin API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Admin API Response Error:', error);
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return;
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        if (error.response?.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        }
        throw error;
      }
    );

    return instance;
  }

  // ==================== PUBLIC CATALOG METHODS ====================

  /**
   * Get filtered products from catalog service
   * @param {Object} params - Filter parameters
   * @returns {Promise} - Promise resolving to products and pagination info
   */
  async getProducts(params = {}) {
    try {
      const response = await this.catalogApi.get('/products', { params });
      
      // Handle HATEOAS response structure
      const products = response.data._embedded?.productList || [];
      const page = response.data.page || {};
      
      return {
        products,
        totalPages: page.totalPages || 0,
        totalElements: page.totalElements || 0,
        currentPage: page.number || 0,
        size: page.size || 10
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw this.handleError(error, 'Failed to fetch products');
    }
  }

  /**
   * Get single product by ID from catalog service
   * @param {string} productId - Product ID
   * @returns {Promise} - Promise resolving to product data
   */
  async getProductById(productId) {
    try {
      const response = await this.catalogApi.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw this.handleError(error, 'Failed to fetch product details');
    }
  }

  /**
   * Search products by text query
   * @param {string} query - Search query
   * @param {Object} params - Additional filter parameters
   * @returns {Promise} - Promise resolving to search results
   */
  async searchProducts(query, params = {}) {
    try {
      const searchParams = {
        name: query,
        ...params
      };
      return await this.getProducts(searchParams);
    } catch (error) {
      console.error('Error searching products:', error);
      throw this.handleError(error, 'Failed to search products');
    }
  }

  // ==================== ADMIN PRODUCT METHODS ====================

  /**
   * Get all products for admin (with filters and pagination)
   * @param {Object} params - Filter and pagination parameters
   * @returns {Promise} - Promise resolving to admin product list
   */
  async getAdminProducts(params = {}) {
    try {
      const response = await this.adminApi.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw this.handleError(error, 'Failed to fetch products for admin');
    }
  }

  /**
   * Get single product for admin by ID
   * @param {string} productId - Product ID
   * @returns {Promise} - Promise resolving to admin product data
   */
  async getAdminProductById(productId) {
    try {
      const response = await this.adminApi.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin product ${productId}:`, error);
      throw this.handleError(error, 'Failed to fetch product for admin');
    }
  }

  /**
   * Create new product (admin only)
   * @param {Object|FormData} productData - Product data (can be FormData for file uploads)
   * @returns {Promise} - Promise resolving to created product
   */
  async createProduct(productData) {
    try {
      const config = {
        headers: {}
      };

      // If productData is FormData (contains files), set appropriate headers
      if (productData instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await this.adminApi.post('/products', productData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw this.handleError(error, 'Failed to create product');
    }
  }

  /**
   * Update existing product (admin only)
   * @param {string} productId - Product ID
   * @param {Object|FormData} productData - Updated product data (can be FormData for file uploads)
   * @returns {Promise} - Promise resolving to updated product
   */
  async updateProduct(productId, productData) {
    try {
      const config = {
        headers: {}
      };

      // If productData is FormData (contains files), set appropriate headers
      if (productData instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await this.adminApi.put(`/products/${productId}`, productData, config);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw this.handleError(error, 'Failed to update product');
    }
  }

  /**
   * Delete product (admin only)
   * @param {string} productId - Product ID
   * @returns {Promise} - Promise resolving when deleted
   */
  async deleteProduct(productId) {
    try {
      await this.adminApi.delete(`/products/${productId}`);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw this.handleError(error, 'Failed to delete product');
    }
  }

  /**
   * Bulk delete products (admin only)
   * @param {Array} productIds - Array of product IDs
   * @returns {Promise} - Promise resolving when deleted
   */
  async bulkDeleteProducts(productIds) {
    try {
      await this.adminApi.post('/products/bulk-delete', { productIds });
      return { success: true, message: `${productIds.length} products deleted successfully` };
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw this.handleError(error, 'Failed to delete products');
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Handle API errors consistently
   * @param {Error} error - Original error
   * @param {string} defaultMessage - Default error message
   * @returns {Error} - Formatted error
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || defaultMessage;
      const status = error.response.status;
      return new Error(`${message} (Status: ${status})`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      return new Error(error.message || defaultMessage);
    }
  }

  /**
   * Check if the API services are healthy
   * @returns {Promise} - Promise resolving to health status
   */
  async healthCheck() {
    try {
      const [catalogHealth, adminHealth] = await Promise.allSettled([
        this.catalogApi.get('/actuator/health').catch(() => ({ status: 'unhealthy' })),
        this.adminApi.get('/actuator/health').catch(() => ({ status: 'unhealthy' }))
      ]);

      return {
        catalog: catalogHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        admin: adminHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        catalog: 'unhealthy',
        admin: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create and export singleton instance
const productApi = new ProductApi();

export default productApi;

// Export class for testing or multiple instances if needed
export { ProductApi };

