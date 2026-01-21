/**
 * Admin API Service
 * Handles all admin management API calls
 */

import api from './client';

const ADMIN_ENDPOINT = '/admin';

/**
 * Get admin dashboard statistics
 * @returns {Promise} - Response with dashboard data
 */
export const getDashboardStats = async () => {
  const response = await api.get(`${ADMIN_ENDPOINT}/dashboard`);
  return response.data;
};

/**
 * Get all users with pagination and filtering (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with users and pagination
 */
export const getUsers = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/users`, { params });
  return response.data;
};

/**
 * Get user by ID (admin only)
 * @param {number} id - User ID
 * @returns {Promise} - Response with user data
 */
export const getUserById = async (id) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/users/${id}`);
  return response.data;
};

/**
 * Update user (admin only)
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Response with updated user
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/users/${id}`, userData);
  return response.data;
};

/**
 * Deactivate user (admin only)
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const deactivateUser = async (id) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/users/${id}/deactivate`);
  return response.data;
};

/**
 * Activate user (admin only)
 * @param {number} id - User ID
 * @returns {Promise}
 */
export const activateUser = async (id) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/users/${id}/activate`);
  return response.data;
};

/**
 * Get all applications with filtering (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with applications and pagination
 */
export const getApplications = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/applications`, { params });
  return response.data;
};

/**
 * Get application by ID (admin only)
 * @param {number} id - Application ID
 * @returns {Promise} - Response with application
 */
export const getApplicationById = async (id) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/applications/${id}`);
  return response.data;
};

/**
 * Update application status (admin only)
 * @param {number} id - Application ID
 * @param {Object} statusData - Status data
 * @returns {Promise} - Response with updated application
 */
export const updateApplicationStatus = async (id, statusData) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/applications/${id}/status`, statusData);
  return response.data;
};

/**
 * Assign application to officer (admin only)
 * @param {number} id - Application ID
 * @param {number} officerId - Officer ID
 * @returns {Promise} - Response with updated application
 */
export const assignOfficer = async (id, officerId) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/applications/${id}/assign`, { officerId });
  return response.data;
};

/**
 * Add processing note to application (admin only)
 * @param {number} id - Application ID
 * @param {string} note - Processing note
 * @returns {Promise} - Response with updated application
 */
export const addProcessingNote = async (id, note) => {
  const response = await api.post(`${ADMIN_ENDPOINT}/applications/${id}/notes`, { note });
  return response.data;
};

/**
 * Get all payments (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with payments
 */
export const getPayments = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/payments`, { params });
  return response.data;
};

/**
 * Get all biometric appointments (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with appointments
 */
export const getBiometricAppointments = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/biometrics`, { params });
  return response.data;
};

/**
 * Get reports data (admin only)
 * @param {Object} params - Query parameters (date range, report type)
 * @returns {Promise} - Response with report data
 */
export const getReports = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/reports`, { params });
  return response.data;
};

/**
 * Generate custom report (admin only)
 * @param {Object} reportConfig - Report configuration
 * @returns {Promise} - Response with report (PDF/Excel)
 */
export const generateReport = async (reportConfig) => {
  const response = await api.post(`${ADMIN_ENDPOINT}/reports/generate`, reportConfig, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get application statistics (admin only)
 * @returns {Promise} - Response with statistics
 */
export const getApplicationStats = async () => {
  const response = await api.get(`${ADMIN_ENDPOINT}/reports/applications`);
  return response.data;
};

/**
 * Get revenue statistics (admin only)
 * @returns {Promise} - Response with revenue data
 */
export const getRevenueStats = async () => {
  const response = await api.get(`${ADMIN_ENDPOINT}/reports/revenue`);
  return response.data;
};

/**
 * Get user statistics (admin only)
 * @returns {Promise} - Response with user stats
 */
export const getUserStats = async () => {
  const response = await api.get(`${ADMIN_ENDPOINT}/reports/users`);
  return response.data;
};

/**
 * Get system health/status (admin only)
 * @returns {Promise} - Response with system status
 */
export const getSystemHealth = async () => {
  const response = await api.get(`${ADMIN_ENDPOINT}/system/health`);
  return response.data;
};

/**
 * Get audit logs (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with audit logs
 */
export const getAuditLogs = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/logs`, { params });
  return response.data;
};

/**
 * Export data (admin only)
 * @param {string} dataType - Type of data to export
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with exported data (CSV/Excel)
 */
export const exportData = async (dataType, params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/export/${dataType}`, {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get passport tracking data (admin only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with passport data
 */
export const getPassportTracking = async (params = {}) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/passport-tracking`, { params });
  return response.data;
};

/**
 * Update passport status (admin only)
 * @param {string} id - Passport ID
 * @param {Object} statusData - Status update data
 * @returns {Promise} - Response with updated passport
 */
export const updatePassportStatus = async (id, statusData) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/passport/${id}/status`, statusData);
  return response.data;
};

/**
 * Update courier information (admin only)
 * @param {string} id - Passport ID
 * @param {Object} courierData - Courier information
 * @returns {Promise} - Response with updated courier info
 */
export const updateCourierInfo = async (id, courierData) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/passport/${id}/courier`, courierData);
  return response.data;
};

/**
 * Get application by ID for admin review (admin only)
 * @param {number} id - Application ID
 * @returns {Promise} - Response with application details
 */
export const getApplicationDetail = async (id) => {
  const response = await api.get(`${ADMIN_ENDPOINT}/application/${id}`);
  return response.data;
};

/**
 * Add processing note to application (admin only)
 * @param {number} id - Application ID
 * @param {string} note - Processing note
 * @returns {Promise} - Response with added note
 */
export const addApplicationNote = async (id, note) => {
  const response = await api.post(`${ADMIN_ENDPOINT}/application/${id}/notes`, { note });
  return response.data;
};

/**
 * Assign application to officer (admin only)
 * @param {number} id - Application ID
 * @param {number} officerId - Officer ID
 * @returns {Promise} - Response with updated application
 */
export const assignApplicationOfficer = async (id, officerId) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/application/${id}/assign`, { officerId });
  return response.data;
};

/**
 * Get system settings (admin only)
 * @returns {Promise} - Response with system settings
 */
export const getSystemSettings = async () => {
  const response = await api.get(`${ADMIN_ENDPOINT}/system/settings`);
  return response.data;
};

/**
 * Update system settings (admin only)
 * @param {Object} settings - System settings to update
 * @returns {Promise} - Response with updated settings
 */
export const updateSystemSettings = async (settings) => {
  const response = await api.put(`${ADMIN_ENDPOINT}/system/settings`, settings);
  return response.data;
};

export default {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  activateUser,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  assignOfficer,
  addProcessingNote,
  getPayments,
  getBiometricAppointments,
  getReports,
  generateReport,
  getApplicationStats,
  getRevenueStats,
  getUserStats,
  getSystemHealth,
  getAuditLogs,
  exportData,
  getPassportTracking,
  updatePassportStatus,
  updateCourierInfo,
  getApplicationDetail,
  addApplicationNote,
  assignApplicationOfficer,
  getSystemSettings,
  updateSystemSettings,
};

