import { Routes, Route, Link } from 'react-router-dom';
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
import DocumentManagement from './pages/admin/DocumentManagement';
import Button from './components/ui/Button';

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
      <Route path="documents" element={<DocumentManagement />} />
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
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-neutral-100 mb-6">
                <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
              <p className="text-lg text-neutral-600 mb-2">Page Not Found</p>
              <p className="text-neutral-500 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={() => window.history.back()}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </Button>
                <Link to="/">
                  <Button variant="primary" className="w-full sm:w-auto">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go Home
                  </Button>
                </Link>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 mb-3">Quick Links:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/login" className="text-sm text-primary-900 hover:text-primary-700 hover:underline">
                    Login
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <Link to="/register" className="text-sm text-primary-900 hover:text-primary-700 hover:underline">
                    Register
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <Link to="/forgot-password" className="text-sm text-primary-900 hover:text-primary-700 hover:underline">
                    Forgot Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AuthLayout>
      }
    />
  </Routes>
);

export default AppRouter;
