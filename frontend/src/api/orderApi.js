import axiosInstance from './axiosConfig';

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post('/orders', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.get('/orders/myorders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.get('/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
