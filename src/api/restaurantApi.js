// src/api/restaurantApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Create the restaurantApi object with all methods
const restaurantApi = {
    getPendingRestaurants: async () => {
        try {
            const response = await api.get('/admin/restaurants/pending');
            return response.data;
        } catch (error) {
            console.error('Error fetching pending restaurants:', error);
            throw error;
        }
    },

    approveRestaurant: async (restaurantId) => {
        try {
            const response = await api.put(`/admin/restaurants/${restaurantId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving restaurant:', error);
            throw error;
        }
    },

    // Add other methods as needed
    getAllRestaurants: async () => {
        try {
            const response = await api.get('/admin/restaurants');
            return response.data;
        } catch (error) {
            console.error('Error fetching all restaurants:', error);
            throw error;
        }
    }
};

export default restaurantApi; // Make sure this is default export