import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Enforce KYC Verification Gate
  if (user && !user.is_kyc_verified && location.pathname !== '/kyc-verification') {
    return <Navigate to="/kyc-verification" replace />;
  }

  // If user is verified and tries to access KYC page, send them to dashboard
  if (user && user.is_kyc_verified && location.pathname === '/kyc-verification') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
