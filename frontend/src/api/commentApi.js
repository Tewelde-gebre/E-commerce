import axiosInstance from './axiosConfig';

export const addComment = async (productId, text) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post('/comments', { productId, text }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCommentsByProduct = async (productId) => {
  const response = await axiosInstance.get(`/comments/${productId}`);
  return response.data;
};

export const getSellerComments = async () => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/comments/seller', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const replyToComment = async (commentId, text) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.put(`/comments/${commentId}/reply`, { text }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
