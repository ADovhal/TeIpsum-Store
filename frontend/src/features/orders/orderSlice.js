import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchUserOrders, fetchOrderById } from '../../services/apiOrder';
import { getMyOrders, getOrderById } from '../../services/OrderService';

export const loadUserOrders = createAsyncThunk(
  'orders/loadUserOrders',
  async (_, thunkAPI) => {
    try {
      const orders = await getMyOrders();
      return orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loadOrderDetails = createAsyncThunk(
  'orders/loadOrderDetails',
  async (orderId, thunkAPI) => {
    try {
      const orderDetails = await getOrderById(orderId);
      return orderDetails;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderDetails: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = {};
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load user orders
      .addCase(loadUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(loadUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Load order details
      .addCase(loadOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails[action.payload.id] = action.payload;
      })
      .addCase(loadOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderDetails, clearError } = orderSlice.actions;
export default orderSlice.reducer;