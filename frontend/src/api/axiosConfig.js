import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fashion-9hk0.onrender.com/api',
  headers: {
  },
});

export default axiosInstance;
