import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Explorer from './pages/Explorer'
import Payments from './pages/Payments'
import Analytics from './pages/Analytics'
import Security from './pages/Security'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/explorer" element={<Explorer />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/security" element={<Security />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}