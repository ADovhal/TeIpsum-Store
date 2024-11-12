// src/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfileData, deleteAccount } from '../profile/UserService';

export const loadProfile = createAsyncThunk(
  'profile/loadProfile',
  async (token, { rejectWithValue }) => {
    try {
      const profileData = await fetchProfileData(token);
      localStorage.setItem('profileData', JSON.stringify(profileData)); // Сохраняем профиль в localStorage
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'profile/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      await deleteAccount();
      return true; // Возвращаем true для успешного удаления
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateProfile = createAsyncThunk(
//   'profile/updateProfile',
//   async (profileData, { rejectWithValue }) => {
//     try {
//       const updatedData = await updateProfileData(profileData);
//       return updatedData;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileData: null,
    isLoading: false,
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
    })
    .addCase(deleteUserAccount.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
      // .addCase(updateProfile.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(updateProfile.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.profileData = action.payload;
      // })
      // .addCase(updateProfile.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      // });
  },
});

export default profileSlice.reducer;
