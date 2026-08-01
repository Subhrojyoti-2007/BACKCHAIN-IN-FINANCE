import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 right-0 left-0 flex justify-between items-center px-8 z-50 w-full h-16 border-b border-white/10 bg-surface/60 backdrop-blur-md"
    >
      {/* Brand */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <span className="font-headline-md text-headline-md font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary tracking-tight cursor-pointer">
            Blockchain Finance
          </span>
        </Link>
      </div>

      {/* Navigation Links - Hidden on Mobile */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps">Dashboard</Link>
        <Link to="/explorer" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps">Explorer</Link>
        <Link to="/analytics" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps">Analytics</Link>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-data-sm text-data-sm text-on-surface-variant">Gas: 12 Gwei</span>
        </div>
        
        {!isAuthPage && (
          <>
            <Link to="/register" className="btn-primary px-6 py-2 rounded-lg font-label-caps text-label-caps ml-2 hidden sm:block">Get Started</Link>
            <Link to="/login" className="btn-secondary px-6 py-2 rounded-lg font-label-caps text-label-caps ml-2 hidden sm:block">Login</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}