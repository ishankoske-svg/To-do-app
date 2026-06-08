// d:\projects\personal-projects\to-do-list\client\src\components\layout\ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../common/Spinner';

// A wrapper that protects private routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  // While we are checking localStorage on app load, show a spinner
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }

  // If not logged in, redirect to login page immediately
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the requested page (e.g. DashboardPage)
  return children;
};

export default ProtectedRoute;

// ✅ DONE
