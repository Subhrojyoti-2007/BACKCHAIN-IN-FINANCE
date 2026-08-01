"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Navigation, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./sheet";
import { PanelLeft } from "lucide-react";

const allNavItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard", authOnly: true },
  { name: "Explorer", href: "/explorer", dashboardOnly: true },
  { name: "Analytics", href: "/analytics", dashboardOnly: true },
  { name: "Payments", href: "/payments", dashboardOnly: true },
  { name: "Security", href: "/security", dashboardOnly: true },
  { name: "Profile", href: "/profile", dashboardOnly: true },
  { name: "Settings", href: "/settings", dashboardOnly: true },
  { name: "Login", href: "/login", unAuthOnly: true },
  { name: "Register", href: "/register", unAuthOnly: true },
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
    width: "3rem",
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
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
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
}

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isLandingPage = location.pathname === '/';

  const navItems = allNavItems.filter(item => {
    // Hide Login/Register if logged in
    if (user && item.unAuthOnly) return false;
    // Hide Dashboard if not logged in
    if (!user && item.authOnly) return false;
    // Hide dashboard-specific links on the landing page to avoid clutter
    if (isLandingPage && item.dashboardOnly) return false;
    return true;
  });
  
  // For the sidebar, we can show everything relevant to their auth state
  const sidebarItems = allNavItems.filter(item => {
    if (user && item.unAuthOnly) return false;
    if (!user && item.authOnly) return false;
    if (!user && item.dashboardOnly) return false;
    return true;
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    
    // Don't auto-collapse if the sidebar is open
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
    <div className="fixed top-6 right-6 lg:right-10 z-50 max-w-[90vw] lg:max-w-[70vw]">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.05 } : {}}
        whileTap={!isExpanded ? { scale: 0.98 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex items-center overflow-x-auto overflow-y-hidden rounded-full border border-white/10 bg-surface/80 shadow-lg backdrop-blur-md h-12 text-on-surface hide-scrollbar",
          !isExpanded && "cursor-pointer justify-center overflow-hidden"
        )}
      >
        <motion.div
          variants={logoVariants}
          className="flex-shrink-0 flex items-center font-semibold pl-2 pr-1 text-cyan-400"
        >
          <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(true);
                }}
                className={cn(
                  "p-2 rounded-full hover:bg-white/10 transition-colors mr-1",
                  !isExpanded && "pointer-events-none"
                )}
              >
                <PanelLeft className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-950/95 border-r border-white/10 text-white backdrop-blur-xl z-[100]">
              <SheetHeader>
                <SheetTitle className="text-cyan-400 text-left font-bold text-xl flex items-center gap-2">
                  <Navigation className="h-6 w-6" /> ChainVest
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                {sidebarItems.map(item => {
                  const isActive = location.pathname === item.href;
                  return (
                    <SheetClose asChild key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "px-4 py-3 rounded-xl font-medium transition-colors flex items-center",
                          isActive ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  );
                })}
                
                {user && (
                  <div className="mt-8 pt-4 border-t border-white/10 flex flex-col gap-4">
                    <div className="px-4 text-sm text-slate-400">
                      Logged in as: <span className="font-semibold text-cyan-400">{user.username}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Navigation className="h-5 w-5 hidden sm:block mr-2" />
        </motion.div>
        
        <motion.div
          className={cn(
            "flex items-center gap-0.5 sm:gap-1 pr-2",
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
                    "text-xs sm:text-sm font-medium transition-colors px-2 py-1.5 rounded-full hover:bg-white/10 whitespace-nowrap",
                    isActive ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
          
          {user && !isLandingPage && (
            <motion.div variants={itemVariants} className="flex-shrink-0 flex items-center ml-2 border-l border-white/20 pl-3 py-1">
              <span className="text-xs sm:text-sm font-semibold text-cyan-400 mr-3 whitespace-nowrap hidden md:inline">
                {user.username}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 px-2 py-1 rounded-full transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </motion.div>
          )}
        </motion.div>
        
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
