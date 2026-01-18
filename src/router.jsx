import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
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
import Tracking from './pages/tracking/Tracking';
import Settings from './pages/settings/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationReview from './pages/admin/ApplicationReview';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';

/**
 * Application Router Configuration
 * 
 * Public routes (AuthLayout):
 * - /login - Login page
 * - /register - Registration page
 * - /forgot-password - Forgot password page
 * 
 * Protected routes (Main Layout):
 * - /user - User dashboard
 * - /user/applications - Application management
 * - /user/documents - Document upload & validation
 * - /user/payment - Payment processing
 * - /user/tracking - Status tracking
 * - /user/settings - User settings
 * 
 * Admin routes (Admin Layout):
 * - /admin - Admin dashboard (admin only)
 * - /admin/users - User management (admin only)
 * - /admin/review - Application review (admin/officer only)
 * - /admin/reports - Reporting & analytics (admin only)
 * - /admin/settings - Admin settings (admin only)
 */

const router = createBrowserRouter([
  // Public Authentication Routes
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },

  // Landing Page (Public)
  {
    path: '/',
    element: <Landing />,
  },

  // Protected User Routes (with main layout)
  {
    path: '/user',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'payment',
        element: <Payment />,
      },
      {
        path: 'tracking',
        element: <Tracking />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },

  // Admin Routes (with AdminLayout)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'review',
        element: <ApplicationReview />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
    ],
  },

  // 404 - Catch all undefined routes
  {
    path: '*',
    element: (
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
    ),
  },
]);

export default router;

