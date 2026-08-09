"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { 
  Navigation, 
  Menu, 
  PanelLeft, 
  Hexagon, 
  Sparkles, 
  Activity, 
  LayoutDashboard, 
  BarChart3, 
  Blocks, 
  CreditCard, 
  Shield, 
  User, 
  Settings, 
  TerminalSquare,
  LogOut,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./sheet";

const allNavItems = [
  { name: "Home", href: "/", icon: Navigation },
  { name: "Dashboard", href: "/dashboard", authOnly: true, icon: LayoutDashboard },
  { name: "Explorer", href: "/explorer", dashboardOnly: true, icon: Blocks },
  { name: "Analytics", href: "/analytics", dashboardOnly: true, icon: BarChart3 },
  { name: "Payments", href: "/payments", dashboardOnly: true, icon: CreditCard },
  { name: "Security", href: "/security", dashboardOnly: true, icon: Shield },
  { name: "Terminal", href: "/terminal", dashboardOnly: true, icon: TerminalSquare },
  { name: "Profile", href: "/profile", dashboardOnly: true, icon: User },
  { name: "Settings", href: "/settings", dashboardOnly: true, icon: Settings },
  { name: "Login", href: "/login", unAuthOnly: true, icon: User },
  { name: "Register", href: "/register", unAuthOnly: true, icon: Sparkles },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3.5rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, scale: 0.8, transition: { duration: 0.3 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    }
  },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useSettings();
  
  const isLandingPage = location.pathname === '/';

  const isKycVerified = user?.is_kyc_verified || user?.kyc_verified;

  const navItems = allNavItems.filter(item => {
    if (item.unAuthOnly) return false; // Login & Register are rendered as action buttons on the right
    if (user && item.unAuthOnly) return false;
    if (!user && item.authOnly) return false;
    if (isLandingPage && item.dashboardOnly) return false;
    // Hide dashboard links if user is not KYC verified
    if (user && !isKycVerified && item.dashboardOnly) return false;
    return true;
  });
  
  const sidebarItems = allNavItems.filter(item => {
    if (user && item.unAuthOnly) return false;
    if (!user && item.authOnly) return false;
    if (!user && item.dashboardOnly) return false;
    if (user && !isKycVerified && item.dashboardOnly) return false;
    return true;
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (isSidebarOpen) return;
    
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest; 
    } 
    else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }
    
    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    navigate('/');
    setSidebarOpen(false);
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] lg:max-w-6xl w-full flex justify-center px-4">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.05 } : {}}
        whileTap={!isExpanded ? { scale: 0.98 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex items-center justify-between overflow-x-auto overflow-y-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl h-14 text-slate-100 hide-scrollbar px-3 py-1.5 transition-all duration-300",
          !isExpanded && "cursor-pointer justify-center overflow-hidden w-14 px-0"
        )}
      >
        {/* Brand & Mobile Menu Trigger */}
        <motion.div
          variants={logoVariants}
          className="flex-shrink-0 flex items-center font-semibold gap-3"
        >
          <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(true);
                }}
                className={cn(
                  "p-2 rounded-xl hover:bg-white/10 transition-colors text-cyan-400 border border-cyan-500/20 bg-cyan-500/10",
                  !isExpanded && "pointer-events-none"
                )}
                aria-label="Open Navigation Menu"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-950/95 border-r border-white/10 text-white backdrop-blur-2xl z-[100] w-80 p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="mb-6 pb-4 border-b border-white/10">
                  <SheetTitle className="text-cyan-400 text-left font-bold text-xl flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40">
                      <Hexagon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                      ChainVest
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1.5">
                  {sidebarItems.map(item => {
                    const isActive = location.pathname === item.href;
                    const ItemIcon = item.icon;
                    return (
                      <SheetClose asChild key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            "px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group",
                            isActive 
                              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30" 
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <ItemIcon className={cn("h-4 w-4", isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                            <span>{t(item.name)}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>
              
              <div>
                {user ? (
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm">
                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-slate-400">{t("Authenticated User")}</p>
                        <p className="font-semibold text-cyan-400 text-sm truncate">{user.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t("Log Out")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link
                        to="/login"
                        className="w-full btn-secondary text-center py-2.5 rounded-xl font-semibold text-sm block"
                      >
                        {t("Sign In")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/register"
                        className="w-full btn-primary text-center py-2.5 rounded-xl font-semibold text-sm block"
                      >
                        {t("Get Started")}
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="hidden sm:flex items-center gap-2 group cursor-pointer" title="ChainVest Home">
            <div className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-all">
              <Hexagon className="h-5 w-5 text-cyan-400 group-hover:scale-105 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Center Nav Items */}
        <motion.div
          className={cn(
            "hidden md:flex items-center gap-1 px-2",
            !isExpanded && "pointer-events-none"
          )}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div key={item.name} variants={itemVariants} className="flex-shrink-0">
                <Link
                  to={item.href}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isExpanded) {
                      e.preventDefault();
                    }
                  }}
                  className={cn(
                    "text-xs font-semibold transition-all px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5",
                    isActive 
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span>{t(item.name)}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Right Trailing Status & Action Buttons */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          {/* Gas Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono">12 Gwei</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline">{user.username}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
              >
                {t("Log In")}
              </Link>
              <Link 
                to="/register"
                className="btn-primary text-xs font-semibold px-4 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <span>{t("Get Started")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* Collapsed Mobile Menu Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
            className="text-cyan-400"
          >
            <Menu className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
