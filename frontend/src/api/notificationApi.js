import axiosInstance from './axiosConfig';

export const getNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/notifications', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.put(`/notifications/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
