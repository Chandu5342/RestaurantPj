import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscriptions';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests for protected routes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('rb_token');
        if (token && config.url !== '/') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getPlans = async () => {
    try {
        const response = await api.get('/');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getPlanById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createPlan = async (planData) => {
    try {
        const response = await api.post('/', planData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePlan = async (id, planData) => {
    try {
        const response = await api.put(`/${id}`, planData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePlan = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};