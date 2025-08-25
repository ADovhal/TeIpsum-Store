import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfileData, deleteAccount, updateProfileData } from '../profile/UserService';


export const loadProfile = createAsyncThunk(
  'profile/loadProfile',
  async (_, thunkAPI ) => {
    try {
      const profileData = await fetchProfileData();
      console.log(profileData)
      return profileData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const updatedData = await updateProfileData(profileData);
      return updatedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDeletionInfo = createAsyncThunk(
  'profile/fetchDeletionInfo',
  async (_, thunkAPI) => {
    try {
      const res = await fetchDeletionInfo();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'profile/deleteUserAccount',
  async (_, thunkAPI ) => {
    try {
      await deleteAccount();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileData: JSON.parse(localStorage.getItem('profileData')) || null,
    isLoading: false,
    deletionInfo: null,
    isLoadingDeletionInfo: false,
    error: null,
    isDeleted: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(loadProfile.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loadProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profileData = action.payload;
      localStorage.setItem('profileData', JSON.stringify(action.payload));
    })
    .addCase(loadProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(deleteUserAccount.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteUserAccount.fulfilled, (state) => {
      state.isLoading = false;
      state.isDeleted = true;
      state.profileData = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('profileData');
    })
    .addCase(deleteUserAccount.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(fetchDeletionInfo.pending, (state) => {
      state.isLoadingDeletionInfo = true;
    })
    .addCase(fetchDeletionInfo.fulfilled, (state, action) => {
      state.deletionInfo = action.payload;
      state.isLoadingDeletionInfo = false;
    })
    .addCase(fetchDeletionInfo.rejected, (state, action) => {
      state.isLoadingDeletionInfo = false;
      state.error = action.payload;
    })
    .addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profileData = action.payload;
      localStorage.setItem('profileData', JSON.stringify(action.payload));
    })
    .addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default profileSlice.reducer;
