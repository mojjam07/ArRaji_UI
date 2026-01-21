/**
 * Notification API Service
 * Handles notification-related API calls
 */

import api from './client';

const NOTIFICATION_ENDPOINT = '/notifications';

/**
 * Get user notifications
 * @param {Object} params - Query parameters (page, limit, status, type)
 * @returns {Promise} - Response with notifications and pagination
 */
export const getNotifications = async (params = {}) => {
  const response = await api.get(NOTIFICATION_ENDPOINT, { params });
  return response.data;
};

/**
 * Get notification by ID
 * @param {number} id - Notification ID
 * @returns {Promise} - Response with notification
 */
export const getNotificationById = async (id) => {
  const response = await api.get(`${NOTIFICATION_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Get unread notification count
 * @returns {Promise} - Response with count
 */
export const getUnreadCount = async () => {
  const response = await api.get(`${NOTIFICATION_ENDPOINT}/unread-count`);
  return response.data;
};

/**
 * Mark notification as read
 * @param {number} id - Notification ID
 * @returns {Promise} - Response with updated notification
 */
export const markAsRead = async (id) => {
  const response = await api.put(`${NOTIFICATION_ENDPOINT}/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise}
 */
export const markAllAsRead = async () => {
  const response = await api.put(`${NOTIFICATION_ENDPOINT}/mark-all-read`);
  return response.data;
};

/**
 * Archive notification
 * @param {number} id - Notification ID
 * @returns {Promise}
 */
export const archiveNotification = async (id) => {
  const response = await api.put(`${NOTIFICATION_ENDPOINT}/${id}/archive`);
  return response.data;
};

/**
 * Delete notification
 * @param {number} id - Notification ID
 * @returns {Promise}
 */
export const deleteNotification = async (id) => {
  const response = await api.delete(`${NOTIFICATION_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Get notification types
 * @returns {Promise} - Response with notification types
 */
export const getNotificationTypes = async () => {
  const response = await api.get(`${NOTIFICATION_ENDPOINT}/types`);
  return response.data;
};

/**
 * Create broadcast notification (admin only)
 * @param {Object} notificationData - Notification data
 * @returns {Promise} - Response with created notifications
 */
export const createBroadcast = async (notificationData) => {
  const response = await api.post(`${NOTIFICATION_ENDPOINT}/broadcast`, notificationData);
  return response.data;
};

/**
 * Get recent notifications
 * @param {number} limit - Number of notifications to fetch
 * @returns {Promise} - Response with recent notifications
 */
export const getRecentNotifications = async (limit = 5) => {
  const response = await api.get(`${NOTIFICATION_ENDPOINT}/recent`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Subscribe to push notifications
 * @param {Object} subscriptionData - Push subscription data
 * @returns {Promise}
 */
export const subscribePush = async (subscriptionData) => {
  const response = await api.post(`${NOTIFICATION_ENDPOINT}/push/subscribe`, subscriptionData);
  return response.data;
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise}
 */
export const unsubscribePush = async () => {
  const response = await api.post(`${NOTIFICATION_ENDPOINT}/push/unsubscribe`);
  return response.data;
};

/**
 * Update notification preferences
 * @param {Object} preferences - Notification preferences
 * @returns {Promise}
 */
export const updatePreferences = async (preferences) => {
  const response = await api.put(`${NOTIFICATION_ENDPOINT}/preferences`, preferences);
  return response.data;
};

/**
 * Get notification preferences
 * @returns {Promise} - Response with preferences
 */
export const getPreferences = async () => {
  const response = await api.get(`${NOTIFICATION_ENDPOINT}/preferences`);
  return response.data;
};

export default {
  getNotifications,
  getNotificationById,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  getNotificationTypes,
  createBroadcast,
  getRecentNotifications,
  subscribePush,
  unsubscribePush,
  updatePreferences,
  getPreferences,
};

