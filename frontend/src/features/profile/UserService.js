import apiUser from '../../services/apiUser';
// import store from '../../redux/store';

export const fetchProfileData = async () => {
    try {
        const response = await apiUser.get('/users/profile');
        console.log('Response Headers:', response.headers);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile data');
    }
  };

export const updateProfileData = async (profileData) => {
    // Sanitize input data to prevent XSS
    const sanitizedData = {
        name: profileData.name?.trim().replace(/<script.*?>.*?<\/script>/gi, ''),
        surname: profileData.surname?.trim().replace(/<script.*?>.*?<\/script>/gi, ''),
        phone: profileData.phone?.trim().replace(/[^+\d\s()-]/g, ''),
        // Email should be handled carefully and validated on backend
        email: profileData.email?.trim().toLowerCase()
    };

    try {
        const response = await apiUser.put('/users/profile', sanitizedData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
};

export const fetchDeletionInfo = async () => {
  try {
    const res = await apiUser.get('/users/deletion-info');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to load deletion info');
  }
};

export const deleteAccount = async () => {
  try {
    const res = await apiUser.post('/users/initiate-deletion');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};
