import axios from 'axios';

const baseURL = import.meta.env.MODE === 'development' 
  ? 'http://127.0.0.1:5000/api' 
  : 'https://fashion-9hk0.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
  },
});

export default axiosInstance;
