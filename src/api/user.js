/**
 * User API Service
 * Handles user-related API calls
 */

import api from './client';

const USER_ENDPOINT = '/users';

/**
 * Get current user profile
 * @returns {Promise} - Response with user data
 */
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} - Response with updated user
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

/**
 * Get user dashboard data
 * @returns {Promise} - Response with dashboard statistics
 */
export const getDashboard = async () => {
  const response = await api.get('/users/dashboard');
  return response.data;
};

/**
 * Get user by ID (admin or self)
 * @param {number} id - User ID
 * @returns {Promise} - Response with user data
 */
export const getUserById = async (id) => {
  const response = await api.get(`${USER_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Update user by ID (admin only)
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Response with updated user
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`${USER_ENDPOINT}/${id}`, userData);
  return response.data;
};

/**
 * Deactivate user account (admin only)
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const deactivateUser = async (id) => {
  const response = await api.put(`${USER_ENDPOINT}/${id}/deactivate`);
  return response.data;
};

/**
 * Activate user account (admin only)
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const activateUser = async (id) => {
  const response = await api.put(`${USER_ENDPOINT}/${id}/activate`);
  return response.data;
};

/**
 * Get user's applications
 * @returns {Promise} - Response with applications
 */
export const getMyApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

/**
 * Get user's notifications
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} - Response with notifications
 */
export const getNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

/**
 * Get unread notification count
 * @returns {Promise} - Response with count
 */
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

/**
 * Mark notification as read
 * @param {number} id - Notification ID
 * @returns {Promise}
 */
export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise}
 */
export const markAllNotificationsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};

/**
 * Delete notification
 * @param {number} id - Notification ID
 * @returns {Promise}
 */
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

/**
 * Get user notification preferences
 * @returns {Promise} - Response with notification preferences
 */
export const getNotificationPreferences = async () => {
  const response = await api.get(`${USER_ENDPOINT}/settings/notifications`);
  return response.data;
};

/**
 * Update user notification preferences
 * @param {Object} preferences - Notification preferences to update
 * @returns {Promise} - Response with updated preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  const response = await api.put(`${USER_ENDPOINT}/settings/notifications`, preferences);
  return response.data;
};

/**
 * Get user account settings
 * @returns {Promise} - Response with account settings
 */
export const getAccountSettings = async () => {
  const response = await api.get(`${USER_ENDPOINT}/settings/account`);
  return response.data;
};

/**
 * Update user account settings
 * @param {Object} settings - Account settings to update
 * @returns {Promise} - Response with updated settings
 */
export const updateAccountSettings = async (settings) => {
  const response = await api.put(`${USER_ENDPOINT}/settings/account`, settings);
  return response.data;
};

/**
 * Get user security settings
 * @returns {Promise} - Response with security settings
 */
export const getSecuritySettings = async () => {
  const response = await api.get(`${USER_ENDPOINT}/settings/security`);
  return response.data;
};

/**
 * Update user security settings
 * @param {Object} settings - Security settings to update
 * @returns {Promise} - Response with updated settings
 */
export const updateSecuritySettings = async (settings) => {
  const response = await api.put(`${USER_ENDPOINT}/settings/security`, settings);
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  getDashboard,
  getUserById,
  updateUser,
  deactivateUser,
  activateUser,
  getMyApplications,
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  getAccountSettings,
  updateAccountSettings,
  getSecuritySettings,
  updateSecuritySettings,
};

