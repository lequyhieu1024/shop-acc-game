import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/',
    timeout: 300000, // 300 giây -> 5p
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Lỗi API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;