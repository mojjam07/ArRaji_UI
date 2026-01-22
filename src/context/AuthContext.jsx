/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  OFFICER: 'officer',
  USER: 'user',
};

// Initial user state
const initialUser = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  role: null,
  phoneNumber: null,
  isActive: true,
};

/**
 * AuthProvider component that wraps the application
 * Provides authentication state and methods to all child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs to prevent multiple rapid auth checks
  const authCheckInProgress = useRef(false);
  const authCheckTimeout = useRef(null);

  // Check if user is logged in on mount
  useEffect(() => {
    // Debounce the initial auth check to prevent rapid calls in Strict Mode
    const timer = setTimeout(() => {
      if (!authCheckInProgress.current) {
        checkAuth();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    // Prevent multiple concurrent auth checks
    if (authCheckInProgress.current) {
      console.log('🔐 AuthContext: Auth check already in progress, skipping...');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    
    // Debug: Log token presence and format
    console.log('🔐 AuthContext: Checking auth...');
    console.log('🔐 AuthContext: Token exists:', !!token);
    console.log('🔐 AuthContext: Token type:', typeof token);
    console.log('🔐 AuthContext: Token length:', token ? token.length : 0);
    
    if (!token) {
      console.log('🔐 AuthContext: No token found - user not authenticated');
      setIsLoading(false);
      return;
    }

    // Validate token format
    if (typeof token !== 'string' || token.length < 10) {
      console.log('🔐 AuthContext: Invalid token format - clearing auth state');
      clearAuthState();
      setIsLoading(false);
      return;
    }

    // Set flag to prevent concurrent calls
    authCheckInProgress.current = true;

    try {
      console.log('🔐 AuthContext: Calling /api/auth/me to verify token...');
      const response = await authAPI.getCurrentUser();
      console.log('🔐 AuthContext: Auth check response:', response);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('🔐 AuthContext: ✅ User authenticated:', response.data.user.email, 'Role:', response.data.user.role);
        
        // Also sync user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        // Token might be invalid or expired - clear auth state
        console.log('🔐 AuthContext: ❌ Auth check failed - invalid response');
        console.log('🔐 AuthContext: Response:', response);
        clearAuthState();
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('🔐 AuthContext: ❌ Auth check failed:', err);
      console.error('🔐 AuthContext: Error details:', {
        message: err.message,
        status: err.status,
        responseStatus: err.response?.status,
        responseData: err.response?.data
      });
      
      // Only logout/clear if it's a 401 error
      // Handle both err.status and err.response?.status for different error formats
      const errorStatus = err.status || err.response?.status;
      
      // Check if it's a rate limit error (429)
      if (errorStatus === 429) {
        console.log('🔐 AuthContext: 429 Rate Limited - will retry later');
        // Don't clear auth state on rate limit - just keep current state
      } else if (errorStatus === 401) {
        console.log('🔐 AuthContext: 401 Unauthorized - token invalid/expired - clearing auth state');
        // Token is invalid or expired - clear auth state
        clearAuthState();
        setIsAuthenticated(false);
      }
      // For other errors, keep the current state (might be network issues)
    } finally {
      authCheckInProgress.current = false;
      setIsLoading(false);
      console.log('🔐 AuthContext: Auth check complete. isLoading=false, isAuthenticated=', isAuthenticated);
    }
  };

  // Helper to clear auth state
  const clearAuthState = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Login user
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true, user: newUser };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = useCallback(async () => {
    try {
      // Call logout API (optional - can be called without waiting)
      if (isAuthenticated) {
        await authAPI.logout().catch(() => {
          // Ignore logout API errors - we still want to clear local state
        });
      }
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, [isAuthenticated]);

  // Update user profile
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (err) {
      const message = err.message || 'Failed to update profile.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.changePassword(passwordData);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (err) {
      const message = err.message || 'Failed to change password.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Failed to send reset email.');
      }
    } catch (err) {
      const message = err.message || 'Failed to send reset email.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.resetPassword(token, password);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Failed to reset password.');
      }
    } catch (err) {
      const message = err.message || 'Failed to reset password.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return false;
  };

  // Check if user is admin
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  // Check if user is officer
  const isOfficer = user?.role === USER_ROLES.OFFICER || user?.role === USER_ROLES.ADMIN;

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    checkAuth,
    hasRole,
    isAdmin,
    isOfficer,
    // Helper to get user full name
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    // Helper to get user initials
    initials: user 
      ? `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() 
      : '',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;

