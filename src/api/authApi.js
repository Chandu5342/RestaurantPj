const API_URL = 'http://localhost:5000/api';

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🔗 Testing backend connection...');

    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();

    console.log('✅ Backend connection test:', data);
    return data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    throw error;
  }
};

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    console.log('🔗 Testing database connection...');

    const response = await fetch(`${API_URL}/test-db`);
    const data = await response.json();

    console.log('✅ Database connection test:', data);
    return data;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Register function
export const register = async (formData) => {
  try {
    console.log('📤 Sending registration request...', formData);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const responseData = await response.json();
    console.log('📥 Registration response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Registration failed');
    }

    return responseData;
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};

// Login function
export const login = async (credentials) => {
  try {
    console.log('📤 Sending login request...', {
      email: credentials.email,
      // Don't log password
      passwordLength: credentials.password?.length
    });

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('📥 Login response:', {
      success: data.success,
      message: data.message,
      hasToken: !!data.token
    });

    if (!response.ok) {
      throw new Error(data.message || `Login failed (${response.status})`);
    }

    // Save token and user data
    if (data.token) {
      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.data?.user || {}));
      console.log('✅ Token saved to localStorage');
    }

    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

// Forgot password function (if your backend has this endpoint)
export const forgotPassword = async (email) => {
  try {
    console.log('📤 Sending forgot password request...', { email });

    const response = await fetch(`${API_URL}/auth/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    console.log('📥 Forgot password response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset instructions');
    }

    return data;
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    throw error;
  }
};

// Super Admin APIs
export const getPendingRestaurants = async () => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    console.log('📤 Fetching pending restaurants...');

    const response = await fetch(`${API_URL}/super-admin/restaurants/pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Pending restaurants response:', {
      success: data.success,
      count: data.count || data.data?.length || 0
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('rb_token');
        localStorage.removeItem('rb_user');
      }
      throw new Error(data.message || `Failed to fetch (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching pending restaurants:', error);
    throw error;
  }
};

export const getAllRestaurants = async (queryParams = {}) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Fetching all restaurants...');

    // Build query string
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${API_URL}/super-admin/restaurants${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 All restaurants response:', {
      success: data.success,
      count: data.count || 0
    });

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching all restaurants:', error);
    throw error;
  }
};

export const getRestaurantById = async (restaurantId) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Fetching restaurant by ID:', restaurantId);

    const response = await fetch(`${API_URL}/super-admin/restaurants/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Restaurant by ID response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching restaurant:', error);
    throw error;
  }
};

export const apiApproveRestaurant = async (restaurantId) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Approving restaurant:', restaurantId);

    const response = await fetch(`${API_URL}/super-admin/restaurants/${restaurantId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Approve restaurant response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to approve (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error approving restaurant:', error);
    throw error;
  }
};

export const rejectRestaurant = async (restaurantId, reason) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Rejecting restaurant:', restaurantId);

    const response = await fetch(`${API_URL}/super-admin/restaurants/${restaurantId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });

    const data = await response.json();
    console.log('📥 Reject restaurant response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to reject (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error rejecting restaurant:', error);
    throw error;
  }
};

export const createRestaurant = async (restaurantData) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Creating restaurant:', restaurantData);

    const response = await fetch(`${API_URL}/super-admin/restaurants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(restaurantData)
    });

    const data = await response.json();
    console.log('📥 Create restaurant response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to create (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error creating restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (restaurantId, updateData) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Updating restaurant:', restaurantId, updateData);

    const response = await fetch(`${API_URL}/super-admin/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    console.log('📥 Update restaurant response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to update (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error updating restaurant:', error);
    throw error;
  }
};

export const deleteRestaurant = async (restaurantId) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Deleting restaurant:', restaurantId);

    const response = await fetch(`${API_URL}/super-admin/restaurants/${restaurantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Delete restaurant response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error deleting restaurant:', error);
    throw error;
  }
};

export const toggleRestaurantStatus = async (restaurantId) => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Toggling restaurant status:', restaurantId);

    const response = await fetch(`${API_URL}/super-admin/restaurants/${restaurantId}/toggle-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Toggle status response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to toggle status (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error toggling restaurant status:', error);
    throw error;
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    console.log('📤 Fetching dashboard stats...');

    const response = await fetch(`${API_URL}/super-admin/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Dashboard stats response:', data);

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('rb_token');
        localStorage.removeItem('rb_user');
      }
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('rb_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Fetching current user...');

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📥 Current user response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch user (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching current user:', error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('rb_token');
  localStorage.removeItem('rb_user');
  console.log('✅ Logged out successfully');
  return { success: true, message: 'Logged out successfully' };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('rb_token');
  return !!token;
};

// Get current user from localStorage
export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem('rb_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('rb_token');
};