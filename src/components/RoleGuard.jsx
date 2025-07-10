import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const RoleGuard = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!allowedRoles.includes(user?.role)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default RoleGuard;
