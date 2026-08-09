import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShaderBackground from '../components/landing/ShaderBackground';
import ThreeJSGlobe from '../components/landing/ThreeJSGlobe';
import Particles from '../components/landing/Particles';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import OrbitingCirclesGlobe from '../components/ui/orbiting-circles-02';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Activity, Lock, Globe, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [txCount, setTxCount] = useState(1849201);

  useEffect(() => {
    const interval = setInterval(() => {
      setTxCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Shader & Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShaderBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/75 to-slate-950 mix-blend-overlay" />
      </div>
      
      <Particles />
      <AnimatedNavFramer />
      
      {/* Hero Canvas */}
      <main className="relative z-20 container mx-auto px-6 lg:px-12 pt-32 pb-16 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-6 z-30">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold font-mono text-cyan-300 tracking-wider uppercase">Institutional Subnet Active</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              ChainVest <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Finance Platform
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Next-generation institutional DeFi. Secure, transparent, and ultra-scalable digital asset custody, real-time analytics, and cross-chain execution rails.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link 
                to="/dashboard" 
                className="btn-primary px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group shadow-[0_0_25px_rgba(37,99,235,0.4)]"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/register" 
                className="btn-secondary px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>Explore Platform</span>
                <ChevronRight className="h-4 w-4 text-cyan-400" />
              </Link>
            </div>
          </div>
          
          {/* Right 3D Globe Column */}
          <div className="col-span-1 lg:col-span-6 relative w-full flex items-center justify-center mt-8 lg:mt-0">
            <OrbitingCirclesGlobe>
              <ThreeJSGlobe />
            </OrbitingCirclesGlobe>

            {/* Floating Glass Cards */}
            <div className="absolute top-1/4 right-6 glass-card p-4 rounded-2xl shadow-2xl animate-bounce border border-cyan-500/30" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Consensus</p>
                  <p className="text-xs font-bold text-slate-100 font-mono">100% Secured</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/4 left-6 glass-card p-4 rounded-2xl shadow-2xl animate-bounce border border-indigo-500/30" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-indigo-300">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Latency</p>
                  <p className="text-xs font-bold text-slate-100 font-mono">1.2ms Settlement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Network Bento Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 z-30">
          <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Value Locked</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl font-extrabold text-white font-mono">$4,285,910,234</h3>
              <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +2.4%
              </span>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Transactions (24h)</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-extrabold text-white font-mono">{txCount.toLocaleString()}</h3>
              <span className="text-xs font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                TPS: ~21.4
              </span>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Network Status</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-extrabold text-white font-mono">99.999%</h3>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Optimal
              </div>
            </div>
          </div>
        </div>

        {/* 21st.dev Bento Grid Architecture Section */}
        <Features />

        {/* Call-to-Action Trust Banner */}
        <div className="mt-20 my-12 glass-card rounded-3xl p-10 lg:p-16 border border-cyan-500/30 relative overflow-hidden text-center bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 mb-6 text-cyan-400">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Ready to Upgrade Your Financial Infrastructure?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
              Join institutional traders and treasury managers leveraging ChainVest for secure cross-border settlement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2">
                <span>Create Institutional Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-4 rounded-xl font-bold text-sm">
                <span>Sign In to Terminal</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}