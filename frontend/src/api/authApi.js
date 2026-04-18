import axiosInstance from './axiosConfig';

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};export const getUsers = async () => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.get('/auth', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.put('/auth/profile', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
