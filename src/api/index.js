/**
 * API Services Index
 * Export all API service modules
 */

export { default as apiClient } from './client';
export { default as authAPI } from './auth';
export { default as userAPI, getProfile, updateProfile, getDashboard } from './user';
export { default as applicationAPI, getApplications, getApplicationById, createApplication, updateApplication, submitApplication, getApplicationTracking, getCostEstimation } from './application';
export { default as documentAPI, getDocuments, getDocumentById, uploadDocument, updateDocument, deleteDocument, verifyDocument, getDocumentsByApplication, getRequiredDocuments, downloadDocument } from './document';
export { default as paymentAPI, getPayments, getPaymentById, createPayment, updatePaymentStatus, getAllPayments, getPaymentStats, getPaymentHistory, getPendingPayments, initializePayment, getPaymentReceipt } from './payment';
export { default as biometricAPI, getBiometricAppointments, getBiometricById, scheduleAppointment, updateAppointmentStatus, rescheduleAppointment, getAllAppointments, getBiometricStats, getAvailableSlots, getLocations, cancelAppointment, getUpcomingAppointments } from './biometric';
export { default as notificationAPI, getNotifications as getUserNotifications, getUnreadCount, markAsRead, markAllAsRead, archiveNotification, deleteNotification, getNotificationTypes, createBroadcast, getRecentNotifications, subscribePush, unsubscribePush, updatePreferences, getPreferences } from './notification';
export { default as adminAPI, getDashboardStats, getUsers, getUserById as getAdminUserById, updateUser, deactivateUser, activateUser, getApplications as getAdminApplications, getApplicationById as getAdminApplicationById, updateApplicationStatus, assignOfficer, getPayments as getAdminPayments, getBiometricAppointments as getAdminBiometrics, getReports, generateReport, getApplicationStats, getRevenueStats, getUserStats, getSystemHealth, getAuditLogs, exportData } from './admin';

