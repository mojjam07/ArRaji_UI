/**
 * API Client Configuration
 * Axios instance with request/response interceptors for JWT authentication
 */

import axios from 'axios';

// API base URL - should match backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to generate request ID
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to clear auth state
const clearAuthState = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Helper function to redirect to login
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    // Clear auth state first
    clearAuthState();
    // Redirect to login page
    window.location.href = '/login';
  }
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage with proper validation
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // Debug logging for token
    const tokenExists = !!token;
    const tokenType = typeof token;
    const tokenLength = token ? token.length : 0;
    
    console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📡 API: Token exists:', tokenExists, '| Type:', tokenType, '| Length:', tokenLength);
    
    // Only add authorization header if token exists and is a valid string
    if (token && typeof token === 'string' && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📡 API: ✅ Authorization header added');
    } else {
      console.log('📡 API: ⚠️ No valid token - Authorization header NOT added');
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => {
    console.error('📡 API Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('📡 API Response:', response.config.method?.toUpperCase(), response.config.url, '✅', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log the error for debugging
    console.error('📡 API Error:', error.config?.method?.toUpperCase(), error.config?.url, '❌', error.response?.status);
    console.error('📡 API Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes('/auth/')) {
        console.log('📡 API: 401 on auth endpoint - redirecting to login');
        redirectToLogin();
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          console.log('📡 API: Attempting to refresh token...');
          const response = await axios.post(`${API_BASE_URL.replace('/api', '')}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { token } = response.data.data;
          
          // Store new token
          localStorage.setItem('authToken', token);
          console.log('📡 API: ✅ Token refreshed successfully');
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('📡 API: Token refresh failed:', refreshError);
        // Refresh failed - logout user and redirect to login
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }
    
    // Format error response
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    const errors = error.response?.data?.errors;
    
    return Promise.reject({
      message: errorMessage,
      errors: errors || [],
      status: error.response?.status || 500,
      data: error.response?.data,
    });
  }
);

// API helper functions
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export default apiClient;

