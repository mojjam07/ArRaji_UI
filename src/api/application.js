/**
 * Application API Service
 * Handles visa application-related API calls
 */

import api from './client';

const APPLICATION_ENDPOINT = '/applications';

/**
 * Get all applications (with filters for admin)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with applications and pagination
 */
export const getApplications = async (params = {}) => {
  const response = await api.get(APPLICATION_ENDPOINT, { params });
  return response.data;
};

/**
 * Get single application by ID
 * @param {number} id - Application ID
 * @returns {Promise} - Response with application
 */
export const getApplicationById = async (id) => {
  const response = await api.get(`${APPLICATION_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create new application
 * @param {Object} applicationData - Application data
 * @returns {Promise} - Response with created application
 */
export const createApplication = async (applicationData) => {
  const response = await api.post(APPLICATION_ENDPOINT, applicationData);
  return response.data;
};

/**
 * Update application
 * @param {number} id - Application ID
 * @param {Object} applicationData - Application data to update
 * @returns {Promise} - Response with updated application
 */
export const updateApplication = async (id, applicationData) => {
  const response = await api.put(`${APPLICATION_ENDPOINT}/${id}`, applicationData);
  return response.data;
};

/**
 * Delete application (if allowed)
 * @param {number} id - Application ID
 * @returns {Promise}
 */
export const deleteApplication = async (id) => {
  const response = await api.delete(`${APPLICATION_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Submit application (change status from draft to submitted)
 * @param {number} id - Application ID
 * @returns {Promise} - Response with updated application
 */
export const submitApplication = async (id) => {
  const response = await api.put(`${APPLICATION_ENDPOINT}/${id}/submit`);
  return response.data;
};

/**
 * Get application tracking info
 * @param {number} id - Application ID
 * @returns {Promise} - Response with tracking details
 */
export const getApplicationTracking = async (id) => {
  const response = await api.get(`${APPLICATION_ENDPOINT}/${id}/tracking`);
  return response.data;
};

/**
 * Get application status history
 * @param {number} id - Application ID
 * @returns {Promise} - Response with status history
 */
export const getStatusHistory = async (id) => {
  const response = await api.get(`${APPLICATION_ENDPOINT}/${id}/history`);
  return response.data;
};

/**
 * Upload document for application
 * @param {number} id - Application ID
 * @param {FormData} formData - Form data with file
 * @returns {Promise} - Response with uploaded document
 */
export const uploadApplicationDocument = async (id, formData) => {
  const response = await api.post(
    `${APPLICATION_ENDPOINT}/${id}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Get cost estimation for application type
 * @param {string} visaType - Visa type
 * @param {Object} params - Additional parameters
 * @returns {Promise} - Response with cost details
 */
export const getCostEstimation = async (visaType, params = {}) => {
  const response = await api.get(`${APPLICATION_ENDPOINT}/cost-estimation`, {
    params: { visaType, ...params },
  });
  return response.data;
};

/**
 * Get user's applications
 * Note: The backend /api/applications endpoint already filters by logged-in user
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with applications
 */
export const getMyApplications = async (params = {}) => {
  const response = await api.get(APPLICATION_ENDPOINT, { params });
  return response.data;
};

export default {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  submitApplication,
  getApplicationTracking,
  getStatusHistory,
  uploadApplicationDocument,
  getCostEstimation,
  getMyApplications,
};

