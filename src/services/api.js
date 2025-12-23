// src/services/api.js - UPDATED WITH AUTH
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('rb_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear invalid token
            localStorage.removeItem('rb_token');
            localStorage.removeItem('rb_user');

            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    register: (userData) =>
        api.post('/auth/register', userData),

    getProfile: () =>
        api.get('/profile'),
};

// Admin API (for super admin)
export const adminAPI = {
    getPendingRegistrations: () =>
        api.get('/admin/pending-registrations'),

    approveRegistration: (userId, data) =>
        api.post(`/admin/approve/${userId}`, data),

    rejectRegistration: (userId, data) =>
        api.post(`/admin/reject/${userId}`, data),

    getAllAdmins: () =>
        api.get('/admin/admins'),
};

// Restaurant API
export const restaurantAPI = {
    getAll: (params = {}) =>
        api.get('/restaurants', { params }),

    getStats: () =>
        api.get('/restaurants/stats'),

    getById: (id) =>
        api.get(`/restaurants/${id}`),

    create: (restaurantData) =>
        api.post('/restaurants', restaurantData),

    update: (id, restaurantData) =>
        api.put(`/restaurants/${id}`, restaurantData),

    delete: (id) =>
        api.delete(`/restaurants/${id}`),

    toggleStatus: (id, status) =>
        api.patch(`/restaurants/${id}/status`, { status }),
};

// Subscription API
export const subscriptionAPI = {
    getAllPlans: () =>
        api.get('/subscriptions/plans'),

    getPlanById: (id) =>
        api.get(`/subscriptions/plans/${id}`),

    createPlan: (planData) =>
        api.post('/subscriptions/plans', planData),

    updatePlan: (id, planData) =>
        api.put(`/subscriptions/plans/${id}`, planData),

    deletePlan: (id) =>
        api.delete(`/subscriptions/plans/${id}`),
};

export default api;