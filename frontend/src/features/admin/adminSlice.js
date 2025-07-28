import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminProductAPI, adminUserAPI, adminOrderAPI, adminAnalyticsAPI } from '../../services/apiAdmin';

// Async thunks for admin operations
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminProductAPI.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminProductAPI.createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await adminProductAPI.updateProduct(id, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await adminProductAPI.deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const bulkDeleteAdminProducts = createAsyncThunk(
  'admin/bulkDeleteProducts',
  async (productIds, { rejectWithValue }) => {
    try {
      await adminProductAPI.bulkDeleteProducts(productIds);
      return productIds;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete products');
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminUserAPI.createAdminUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin user');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminUserAPI.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminOrderAPI.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (params, { rejectWithValue }) => {
    try {
      const [salesAnalytics, productPerformance, userAnalytics] = await Promise.all([
        adminAnalyticsAPI.getSalesAnalytics(params),
        adminAnalyticsAPI.getProductPerformance(params),
        adminAnalyticsAPI.getUserAnalytics(params)
      ]);
      
      return {
        sales: salesAnalytics.data,
        products: productPerformance.data,
        users: userAnalytics.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // Product management
    products: [],
    productsLoading: false,
    productsError: null,
    productsTotalPages: 0,
    productsTotalElements: 0,
    
    // User management
    users: [],
    usersLoading: false,
    usersError: null,
    usersTotalPages: 0,
    usersTotalElements: 0,
    
    // Order management
    orders: [],
    ordersLoading: false,
    ordersError: null,
    ordersTotalPages: 0,
    ordersTotalElements: 0,
    
    // Analytics
    analytics: {
      sales: null,
      products: null,
      users: null
    },
    analyticsLoading: false,
    analyticsError: null,
    
    // UI state
    selectedProducts: [],
    selectedUsers: [],
    selectedOrders: [],
    
    // Form states
    productForm: {
      isOpen: false,
      editingProduct: null
    },
    userForm: {
      isOpen: false,
      editingUser: null
    }
  },
  reducers: {
    // Product management
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
    },
    setProductFormOpen: (state, action) => {
      state.productForm.isOpen = action.payload;
      if (!action.payload) {
        state.productForm.editingProduct = null;
      }
    },
    setEditingProduct: (state, action) => {
      state.productForm.editingProduct = action.payload;
      state.productForm.isOpen = true;
    },
    
    // User management
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },
    setUserFormOpen: (state, action) => {
      state.userForm.isOpen = action.payload;
      if (!action.payload) {
        state.userForm.editingUser = null;
      }
    },
    setEditingUser: (state, action) => {
      state.userForm.editingUser = action.payload;
      state.userForm.isOpen = true;
    },
    
    // Order management
    setSelectedOrders: (state, action) => {
      state.selectedOrders = action.payload;
    },
    clearSelectedOrders: (state) => {
      state.selectedOrders = [];
    },
    
    // Clear errors
    clearProductsError: (state) => {
      state.productsError = null;
    },
    clearUsersError: (state) => {
      state.usersError = null;
    },
    clearOrdersError: (state) => {
      state.ordersError = null;
    },
    clearAnalyticsError: (state) => {
      state.analyticsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Product management
      .addCase(fetchAdminProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload.content || action.payload;
        state.productsTotalPages = action.payload.totalPages || 0;
        state.productsTotalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })
      
      .addCase(createAdminProduct.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products.unshift(action.payload);
        state.productForm.isOpen = false;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })
      
      .addCase(updateAdminProduct.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.productsLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.productForm.isOpen = false;
        state.productForm.editingProduct = null;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })
      
      .addCase(deleteAdminProduct.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })
      
      .addCase(bulkDeleteAdminProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(bulkDeleteAdminProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = state.products.filter(p => !action.payload.includes(p.id));
        state.selectedProducts = [];
      })
      .addCase(bulkDeleteAdminProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })
      
      // User management
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.content || action.payload;
        state.usersTotalPages = action.payload.totalPages || 0;
        state.usersTotalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      .addCase(createAdminUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users.unshift(action.payload);
        state.userForm.isOpen = false;
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      // Order management
      .addCase(fetchAdminOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.content || action.payload;
        state.ordersTotalPages = action.payload.totalPages || 0;
        state.ordersTotalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      })
      
      // Analytics
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload;
      });
  }
});

export const {
  setSelectedProducts,
  clearSelectedProducts,
  setProductFormOpen,
  setEditingProduct,
  setSelectedUsers,
  clearSelectedUsers,
  setUserFormOpen,
  setEditingUser,
  setSelectedOrders,
  clearSelectedOrders,
  clearProductsError,
  clearUsersError,
  clearOrdersError,
  clearAnalyticsError
} = adminSlice.actions;

// Selectors
export const selectAdminProducts = (state) => state.admin.products;
export const selectAdminProductsLoading = (state) => state.admin.productsLoading;
export const selectAdminProductsError = (state) => state.admin.productsError;
export const selectAdminProductsPagination = (state) => ({
  totalPages: state.admin.productsTotalPages,
  totalElements: state.admin.productsTotalElements
});

export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminUsersLoading = (state) => state.admin.usersLoading;
export const selectAdminUsersError = (state) => state.admin.usersError;
export const selectAdminUsersPagination = (state) => ({
  totalPages: state.admin.usersTotalPages,
  totalElements: state.admin.usersTotalElements
});

export const selectAdminOrders = (state) => state.admin.orders;
export const selectAdminOrdersLoading = (state) => state.admin.ordersLoading;
export const selectAdminOrdersError = (state) => state.admin.ordersError;
export const selectAdminOrdersPagination = (state) => ({
  totalPages: state.admin.ordersTotalPages,
  totalElements: state.admin.ordersTotalElements
});

export const selectAdminAnalytics = (state) => state.admin.analytics;
export const selectAdminAnalyticsLoading = (state) => state.admin.analyticsLoading;
export const selectAdminAnalyticsError = (state) => state.admin.analyticsError;

export const selectAdminUI = (state) => ({
  selectedProducts: state.admin.selectedProducts,
  selectedUsers: state.admin.selectedUsers,
  selectedOrders: state.admin.selectedOrders,
  productForm: state.admin.productForm,
  userForm: state.admin.userForm
});

export default adminSlice.reducer; 