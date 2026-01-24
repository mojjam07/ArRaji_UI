import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthLayout from './components/layout/AuthLayout';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Landing from './pages/Landing';
import UserDashboard from './pages/user/UserDashboard';
import Applications from './pages/applications/Applications';
import Documents from './pages/documents/Documents';
import Payment from './pages/payment/Payment';
import CostEstimation from './pages/payment/CostEstimation';
import Tracking from './pages/tracking/Tracking';
import Settings from './pages/settings/Settings';
import Biometrics from './pages/biometrics/Biometrics';
import Notifications from './pages/notifications/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';
import PassportManagement from './pages/admin/PassportManagement';

/**
 * Application Router Configuration
 *
 * Route Protection:
 * - Public routes: Landing, Login, Register, ForgotPassword (no auth required)
 * - Protected routes: User dashboard, applications, documents, etc. (auth required)
 * - Admin routes: Admin dashboard, user management, etc. (admin role required)
 */

const AppRouter = () => (
  <Routes>
    {/* Public Authentication Routes */}
    <Route
      path="/login"
      element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      }
    />
    <Route
      path="/register"
      element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
      }
    />

    {/* Landing Page (Public) */}
    <Route path="/" element={<Landing />} />

    {/* Protected User Routes (with main layout) */}
    <Route
      path="/user"
      element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }
    >
      <Route index element={<UserDashboard />} />
      <Route path="applications" element={<Applications />} />
      <Route path="documents" element={<Documents />} />
      <Route path="biometrics" element={<Biometrics />} />
      <Route path="cost-estimation" element={<CostEstimation />} />
      <Route path="payment" element={<Payment />} />
      <Route path="tracking" element={<Tracking />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    {/* Admin Routes (with AdminLayout - admin only) */}
    <Route
      path="/admin"
      element={
        <PrivateRoute roles={['admin', 'officer']}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="review" element={<ApplicationReview />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="passport" element={<PassportManagement />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>

    {/* 404 - Catch all undefined routes */}
    <Route
      path="*"
      element={
        <AuthLayout>
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-100 mb-4">
              <svg className="h-8 w-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">404</h1>
            <p className="text-neutral-500 mb-6">Page not found</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        </AuthLayout>
      }
    />
  </Routes>
);

export default AppRouter;

