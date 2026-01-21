/**
 * Document API Service
 * Handles document upload and management API calls
 */

import api from './client';

const DOCUMENT_ENDPOINT = '/documents';

/**
 * Get all documents (with filters)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with documents and pagination
 */
export const getDocuments = async (params = {}) => {
  const response = await api.get(DOCUMENT_ENDPOINT, { params });
  return response.data;
};

/**
 * Get document by ID
 * @param {number} id - Document ID
 * @returns {Promise} - Response with document
 */
export const getDocumentById = async (id) => {
  const response = await api.get(`${DOCUMENT_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Upload document
 * @param {FormData} formData - Form data with file and metadata
 * @returns {Promise} - Response with uploaded document
 */
export const uploadDocument = async (formData) => {
  const response = await api.post(DOCUMENT_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update document metadata
 * @param {number} id - Document ID
 * @param {Object} documentData - Document data to update
 * @returns {Promise} - Response with updated document
 */
export const updateDocument = async (id, documentData) => {
  const response = await api.put(`${DOCUMENT_ENDPOINT}/${id}`, documentData);
  return response.data;
};

/**
 * Delete document
 * @param {number} id - Document ID
 * @returns {Promise}
 */
export const deleteDocument = async (id) => {
  const response = await api.delete(`${DOCUMENT_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Verify document (admin only)
 * @param {number} id - Document ID
 * @param {Object} verificationData - Verification status and notes
 * @returns {Promise} - Response with updated document
 */
export const verifyDocument = async (id, verificationData) => {
  const response = await api.put(`${DOCUMENT_ENDPOINT}/${id}/verify`, verificationData);
  return response.data;
};

/**
 * Reject document (admin only)
 * @param {number} id - Document ID
 * @param {Object} rejectionData - Rejection reason
 * @returns {Promise} - Response with updated document
 */
export const rejectDocument = async (id, rejectionData) => {
  const response = await api.put(`${DOCUMENT_ENDPOINT}/${id}/reject`, rejectionData);
  return response.data;
};

/**
 * Get documents by application
 * @param {number} applicationId - Application ID
 * @returns {Promise} - Response with documents
 */
export const getDocumentsByApplication = async (applicationId) => {
  const response = await api.get(`${DOCUMENT_ENDPOINT}/application/${applicationId}`);
  return response.data;
};

/**
 * Get required document types for a visa type
 * @param {string} visaType - Visa type
 * @returns {Promise} - Response with required document types
 */
export const getRequiredDocuments = async (visaType) => {
  const response = await api.get(`${DOCUMENT_ENDPOINT}/requirements`, {
    params: { visaType },
  });
  return response.data;
};

/**
 * Download document
 * @param {number} id - Document ID
 * @returns {Promise} - Blob response for download
 */
export const downloadDocument = async (id) => {
  const response = await api.get(`${DOCUMENT_ENDPOINT}/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get document verification status
 * @param {number} id - Document ID
 * @returns {Promise} - Response with verification details
 */
export const getVerificationStatus = async (id) => {
  const response = await api.get(`${DOCUMENT_ENDPOINT}/${id}/status`);
  return response.data;
};

export default {
  getDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  verifyDocument,
  rejectDocument,
  getDocumentsByApplication,
  getRequiredDocuments,
  downloadDocument,
  getVerificationStatus,
};

