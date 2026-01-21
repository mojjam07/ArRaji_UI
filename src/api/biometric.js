/**
 * Biometric API Service
 * Handles biometrics appointment API calls
 */

import api from './client';

const BIOMETRIC_ENDPOINT = '/biometrics';

/**
 * Get user's biometric appointments
 * @returns {Promise} - Response with appointments
 */
export const getBiometricAppointments = async () => {
  const response = await api.get(BIOMETRIC_ENDPOINT);
  return response.data;
};

/**
 * Get biometric appointment by ID
 * @param {number} id - Appointment ID
 * @returns {Promise} - Response with appointment
 */
export const getBiometricById = async (id) => {
  const response = await api.get(`${BIOMETRIC_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Schedule biometric appointment (admin only in backend)
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise} - Response with created appointment
 */
export const scheduleAppointment = async (appointmentData) => {
  const response = await api.post(BIOMETRIC_ENDPOINT, appointmentData);
  return response.data;
};

/**
 * Update appointment status (admin only)
 * @param {number} id - Appointment ID
 * @param {Object} statusData - Status data
 * @returns {Promise} - Response with updated appointment
 */
export const updateAppointmentStatus = async (id, statusData) => {
  const response = await api.put(`${BIOMETRIC_ENDPOINT}/${id}/status`, statusData);
  return response.data;
};

/**
 * Reschedule appointment (admin only)
 * @param {number} id - Appointment ID
 * @param {Object} rescheduleData - Reschedule data
 * @returns {Promise} - Response with updated appointment
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  const response = await api.put(`${BIOMETRIC_ENDPOINT}/${id}/reschedule`, rescheduleData);
  return response.data;
};

/**
 * Get all appointments (admin/officer only)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Response with appointments and pagination
 */
export const getAllAppointments = async (params = {}) => {
  const response = await api.get(`${BIOMETRIC_ENDPOINT}/admin/all`, { params });
  return response.data;
};

/**
 * Get biometric statistics (admin/officer only)
 * @returns {Promise} - Response with statistics
 */
export const getBiometricStats = async () => {
  const response = await api.get(`${BIOMETRIC_ENDPOINT}/admin/stats`);
  return response.data;
};

/**
 * Get available time slots for a location
 * @param {string} location - Location code
 * @param {string} date - Date
 * @returns {Promise} - Response with available slots
 */
export const getAvailableSlots = async (location, date) => {
  const response = await api.get(`${BIOMETRIC_ENDPOINT}/slots`, {
    params: { location, date },
  });
  return response.data;
};

/**
 * Get biometric locations
 * @returns {Promise} - Response with locations
 */
export const getLocations = async () => {
  const response = await api.get(`${BIOMETRIC_ENDPOINT}/locations`);
  return response.data;
};

/**
 * Cancel appointment
 * @param {number} id - Appointment ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} - Response with updated appointment
 */
export const cancelAppointment = async (id, reason) => {
  const response = await api.put(`${BIOMETRIC_ENDPOINT}/${id}/cancel`, { reason });
  return response.data;
};

/**
 * Get upcoming appointments
 * @returns {Promise} - Response with upcoming appointments
 */
export const getUpcomingAppointments = async () => {
  const response = await api.get(`${BIOMETRIC_ENDPOINT}/upcoming`);
  return response.data;
};

export default {
  getBiometricAppointments,
  getBiometricById,
  scheduleAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAllAppointments,
  getBiometricStats,
  getAvailableSlots,
  getLocations,
  cancelAppointment,
  getUpcomingAppointments,
};

