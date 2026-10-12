import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const RoleGuard = ({ allowedRoles, children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a href="/dashboard" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export const OnboardingGuard = ({ children, requireCompleted = true }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Only PARENT role goes through onboarding for now
  if (currentUser?.role === 'PARENT') {
    const status = currentUser?.onboardingStatus || 'NOT_STARTED';
    const isCompleted = status === 'COMPLETED';

    // If we require onboarding to be completed but it's not -> redirect to onboarding
    if (requireCompleted && !isCompleted) {
      return <Navigate to="/onboarding" replace />;
    }

    // If we are ON the onboarding page but it IS completed -> redirect to dashboard
    if (!requireCompleted && isCompleted) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};
