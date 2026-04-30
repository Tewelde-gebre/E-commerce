import axiosInstance from './axiosConfig';

export const submitContactMessage = async (data) => {
    const response = await axiosInstance.post('/contact', data);
    return response.data;
};
