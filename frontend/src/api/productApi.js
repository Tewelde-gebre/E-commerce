import axiosInstance from './axiosConfig';

export const getProducts = async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (productData, token) => {
    const response = await axiosInstance.post('/products', productData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getMyProducts = async (token) => {
    const response = await axiosInstance.get('/products/myproducts', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const likeProduct = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post(`/products/${productId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
