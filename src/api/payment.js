/**
 * Payment API Service
 * Handles payment-related API calls
 */

import api from './client';

const PAYMENT_ENDPOINT = '/payments';

/**
 * Get all payments for current user
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with payments and pagination
 */
export const getPayments = async (params = {}) => {
  const response = await api.get(PAYMENT_ENDPOINT, { params });
  return response.data;
};

/**
 * Get payment by ID
 * @param {number} id - Payment ID
 * @returns {Promise} - Response with payment
 */
export const getPaymentById = async (id) => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create payment record
 * @param {Object} paymentData - Payment data
 * @returns {Promise} - Response with created payment
 */
export const createPayment = async (paymentData) => {
  const response = await api.post(PAYMENT_ENDPOINT, paymentData);
  return response.data;
};

/**
 * Update payment status (admin only)
 * @param {number} id - Payment ID
 * @param {Object} statusData - Status data
 * @returns {Promise} - Response with updated payment
 */
export const updatePaymentStatus = async (id, statusData) => {
  const response = await api.put(`${PAYMENT_ENDPOINT}/${id}/status`, statusData);
  return response.data;
};

/**
 * Process refund (admin only)
 * @param {number} id - Payment ID
 * @param {Object} refundData - Refund data
 * @returns {Promise} - Response with refund details
 */
export const processRefund = async (id, refundData) => {
  const response = await api.post(`${PAYMENT_ENDPOINT}/${id}/refund`, refundData);
  return response.data;
};

/**
 * Get all payments (admin only)
 * @param {Object} params - Query parameters (page, limit, status, etc.)
 * @returns {Promise} - Response with payments and statistics
 */
export const getAllPayments = async (params = {}) => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/admin/all`, { params });
  return response.data;
};

/**
 * Get payment statistics (admin only)
 * @returns {Promise} - Response with statistics
 */
export const getPaymentStats = async () => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/admin/stats`);
  return response.data;
};

/**
 * Get payment history for user
 * @returns {Promise} - Response with payment history
 */
export const getPaymentHistory = async () => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/history`);
  return response.data;
};

/**
 * Get pending payments for user
 * @returns {Promise} - Response with pending payments
 */
export const getPendingPayments = async () => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/pending`);
  return response.data;
};

/**
 * Initialize payment gateway (e.g., Stripe)
 * @param {number} paymentId - Payment ID
 * @returns {Promise} - Response with payment gateway details
 */
export const initializePayment = async (paymentId) => {
  const response = await api.post(`${PAYMENT_ENDPOINT}/${paymentId}/initialize`);
  return response.data;
};

/**
 * Verify payment with gateway response
 * @param {number} paymentId - Payment ID
 * @param {Object} verificationData - Gateway verification data
 * @returns {Promise} - Response with verification result
 */
export const verifyPayment = async (paymentId, verificationData) => {
  const response = await api.post(`${PAYMENT_ENDPOINT}/${paymentId}/verify`, verificationData);
  return response.data;
};

/**
 * Get payment receipt
 * @param {number} id - Payment ID
 * @returns {Promise} - Blob response for receipt download
 */
export const getPaymentReceipt = async (id) => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/${id}/receipt`, {
    responseType: 'blob',
  });
  return response.data;
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  processRefund,
  getAllPayments,
  getPaymentStats,
  getPaymentHistory,
  getPendingPayments,
  initializePayment,
  verifyPayment,
  getPaymentReceipt,
};

