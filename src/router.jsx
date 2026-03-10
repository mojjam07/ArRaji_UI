// src/router/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import AuthLayout from "./components/layout/AuthLayout";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User Pages
import Landing from "./pages/Landing";
import UserDashboard from "./pages/user/UserDashboard";
import Applications from "./pages/applications/Applications";
import Documents from "./pages/documents/Documents";
import Payment from "./pages/payment/Payment";
import CostEstimation from "./pages/payment/CostEstimation";
import Tracking from "./pages/tracking/Tracking";
import Settings from "./pages/settings/Settings";
import Biometrics from "./pages/biometrics/Biometrics";
import Notifications from "./pages/notifications/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicationReview from "./pages/admin/ApplicationReview";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/AdminSettings";
import PassportManagement from "./pages/admin/PassportManagement";
import DocumentManagement from "./pages/admin/DocumentManagement";

const AppRouter = () => (
  <Routes>
    {/* Public Auth Routes */}
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

    {/* Landing Page */}
    <Route path="/" element={<Landing />} />

    {/* Protected User Routes */}
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

    {/* Admin Routes */}
    <Route
      path="/admin"
      element={
        <PrivateRoute roles={["admin", "officer"]}>
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

    {/* 404 Catch-all */}
    <Route
      path="*"
      element={
        <AuthLayout>
          <div className="min-h-screen flex items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
            <p className="text-lg text-neutral-600 mb-2">
              Page Not Found
            </p>
          </div>
        </AuthLayout>
      }
    />
  </Routes>
);

export default AppRouter;