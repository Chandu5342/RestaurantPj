// src/services/api.js
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem("rb_token");
};

// Helper function to get headers
const getHeaders = (contentType = "application/json") => {
    const headers = {};

    if (contentType) {
        headers["Content-Type"] = contentType;
    }

    const token = getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password })
        });
        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getHeaders()
        });
        return response.json();
    },

    logout: () => {
        localStorage.removeItem("rb_token");
        localStorage.removeItem("rb_user");
    }
};

// Admin API calls
export const adminAPI = {
    getPendingAdmins: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/pending`, {
            headers: getHeaders()
        });
        return response.json();
    },

    getAllAdmins: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/admin/admins?${queryParams}`, {
            headers: getHeaders()
        });
        return response.json();
    },

    approveAdmin: async (adminId, data = {}) => {
        const response = await fetch(`${API_BASE_URL}/admin/${adminId}/approve`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return response.json();
    },

    rejectAdmin: async (adminId, reason = "") => {
        const response = await fetch(`${API_BASE_URL}/admin/${adminId}/reject`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        });
        return response.json();
    },

    toggleAdminStatus: async (adminId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/${adminId}/toggle-status`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return response.json();
    }
};

// Restaurant API calls
export const restaurantAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/restaurants?${queryParams}`, {
            headers: getHeaders()
        });
        return response.json();
    },

    create: async (restaurantData) => {
        const response = await fetch(`${API_BASE_URL}/restaurants`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(restaurantData)
        });
        return response.json();
    },

    update: async (id, restaurantData) => {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(restaurantData)
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return response.json();
    },

    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/restaurants/stats`, {
            headers: getHeaders()
        });
        return response.json();
    },

    updateStatus: async (id, status) => {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}/status`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return response.json();
    }
};

// Plan API calls
export const planAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/plans`, {
            headers: getHeaders()
        });
        return response.json();
    },

    create: async (planData) => {
        const response = await fetch(`${API_BASE_URL}/plans`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(planData)
        });
        return response.json();
    },

    update: async (id, planData) => {
        const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(planData)
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return response.json();
    }
};

// Dashboard API calls
export const dashboardAPI = {
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
            headers: getHeaders()
        });
        return response.json();
    }
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
    const token = getAuthToken();
    if (!token) return false;

    // Optional: You could also verify token expiration here
    return true;
};

// Utility function to get user role
export const getUserRole = () => {
    const userStr = localStorage.getItem("rb_user");
    if (!userStr) return null;

    try {
        const user = JSON.parse(userStr);
        return user.role;
    } catch {
        return null;
    }
};

// Utility function to get user data
export const getUserData = () => {
    const userStr = localStorage.getItem("rb_user");
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};