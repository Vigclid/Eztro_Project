import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  
  // Check if user is authenticated
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, just check authentication
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check user role
  const user = JSON.parse(userStr);
  const userRole = user?.roleName || user?.roleId?.name || '';

  // Check if user role is allowed (case-insensitive)
  const normalizedRole = userRole.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  
  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    // Redirect based on role
    if (normalizedRole === 'tenant' || normalizedRole === 'landlord') {
      return <Navigate to="/coming-soon" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
