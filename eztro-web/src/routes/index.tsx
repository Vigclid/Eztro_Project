import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public pages
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ComingSoon from "../pages/comingSoon/ComingSoon";

// Staff/Admin pages
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import StaffSupportScreen from "../pages/support/StaffSupportScreen";
import ReportDetailScreen from "../pages/support/ReportDetailScreen";
import UsersPage from "../pages/users/UsersPage";
import WebLogPage from "../pages/admin/WebLogPage";
import StaffManagementPage from "../pages/admin/StaffManagementPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/coming-soon" element={<ComingSoon />} />

      {/* Protected Routes - Staff & Admin Only */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
            <StaffSupportScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/:reportId"
        element={
          <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
            <ReportDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["Staff", "Admin"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <WebLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <StaffManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
