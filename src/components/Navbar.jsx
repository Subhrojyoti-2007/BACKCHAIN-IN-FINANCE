import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, ArrowRight, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 right-0 left-0 flex justify-between items-center px-6 lg:px-12 z-50 w-full h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-lg"
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group" title="Home">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Hexagon className="h-5 w-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link 
          to="/dashboard" 
          className={`text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${location.pathname === '/dashboard' ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/explorer" 
          className={`text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${location.pathname === '/explorer' ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
        >
          Explorer
        </Link>
        <Link 
          to="/analytics" 
          className={`text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${location.pathname === '/analytics' ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
        >
          Analytics
        </Link>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono">12 Gwei</span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl hidden sm:inline">
              {user.username}
            </span>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : !isAuthPage && (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold hidden sm:block">
              Log In
            </Link>
            <Link to="/register" className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}