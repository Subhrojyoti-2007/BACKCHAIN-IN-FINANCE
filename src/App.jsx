import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Explorer from './pages/Explorer'
import Payments from './pages/Payments'
import Analytics from './pages/Analytics'
import Security from './pages/Security'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import BrandLogo from './components/BrandLogo'
import AdminTerminal from './pages/AdminTerminal'
import KYCVerification from './pages/KYCVerification'
import AuditLogs from './pages/AuditLogs'
import { AuthProvider } from './context/AuthContext'
import { GlobalBackground } from './components/ui/background-snippets'
import Chatbot from './components/Chatbot/Chatbot';
function AppContent() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <div className="min-h-screen text-slate-100 relative">
      <GlobalBackground />
      <div className={!isLandingPage ? "min-h-screen w-full relative z-10" : "min-h-screen w-full relative z-10"}>
        <AuthProvider>
          <BrandLogo />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Layout wrapper for all internal pages */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/explorer" element={<Explorer />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/security" element={<Security />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
              </Route>
              {/* Terminal is full-screen, so outside Layout but still Protected */}
              <Route path="/terminal" element={<AdminTerminal />} />
              <Route path="/kyc-verification" element={<KYCVerification />} />
            </Route>
          </Routes>
          <Chatbot />
        </AuthProvider>
      </div>
    </div>
  )
}

export default function App() {
  return <AppContent />
}