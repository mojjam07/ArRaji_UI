/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import api from './client';

const AUTH_ENDPOINT = '/auth';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response with user and token
 */
export const register = async (userData) => {
  const response = await api.post(`${AUTH_ENDPOINT}/register`, userData);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} - Response with user and token
 */
export const login = async (credentials) => {
  const response = await api.post(`${AUTH_ENDPOINT}/login`, credentials);
  return response.data;
};

/**
 * Logout user
 * @returns {Promise}
 */
export const logout = async () => {
  const response = await api.post(`${AUTH_ENDPOINT}/logout`);
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} - Response with user data
 */
export const getCurrentUser = async () => {
  const response = await api.get(`${AUTH_ENDPOINT}/me`);
  return response.data;
};

/**
 * Change password
 * @param {Object} passwordData - Current and new password
 * @returns {Promise}
 */
export const changePassword = async (passwordData) => {
  const response = await api.post(`${AUTH_ENDPOINT}/change-password`, passwordData);
  return response.data;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise}
 */
export const forgotPassword = async (email) => {
  const response = await api.post(`${AUTH_ENDPOINT}/forgot-password`, { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} password - New password
 * @returns {Promise}
 */
export const resetPassword = async (token, password) => {
  const response = await api.post(`${AUTH_ENDPOINT}/reset-password`, { token, password });
  return response.data;
};

/**
 * Verify email with token
 * @param {string} token - Email verification token
 * @returns {Promise}
 */
export const verifyEmail = async (token) => {
  const response = await api.post(`${AUTH_ENDPOINT}/verify-email`, { token });
  return response.data;
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise}
 */
export const resendVerificationEmail = async (email) => {
  const response = await api.post(`${AUTH_ENDPOINT}/resend-verification`, { email });
  return response.data;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};

