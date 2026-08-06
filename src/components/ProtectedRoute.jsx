import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const isKycVerified = user?.is_kyc_verified || user?.kyc_verified;

  // If user is logged in but KYC is not verified, block all other routes and force them to /kyc-verification
  if (user && !isKycVerified) {
    if (location.pathname !== '/kyc-verification') {
      return <Navigate to="/kyc-verification" replace />;
    }
  } else {
    // If user is already KYC verified, prevent them from accessing /kyc-verification page
    if (location.pathname === '/kyc-verification') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
