import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import Footer from '../components/Footer';
import { Lock, User, ShieldCheck, ArrowRight, Hexagon, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative selection:bg-cyan-500 selection:text-slate-950">
      <AnimatedNavFramer />

      {/* Main Container with generous top padding to prevent navbar overlap */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-start p-4 sm:p-6 pt-36 sm:pt-40 pb-20">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2 sm:mt-4">
          
          {/* Left Visual Artwork Showcase Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[480px] bg-slate-900/60"
          >
            {/* Ambient Background Artwork Image */}
            <div className="absolute inset-0 z-0 opacity-45 mix-blend-screen pointer-events-none">
              <img 
                src="/auth_blockchain_security.png" 
                alt="Blockchain Security Vault" 
                className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-0 pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/20 backdrop-blur-md text-cyan-300 text-xs font-mono font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Institutional DeFi Gateway</span>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-8 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Secure Vault Access & <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Real-Time Settlement
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Experience multi-party computation security, instant ledger audits, and sub-second cross-border execution.
              </p>

              <div className="pt-2 flex flex-col gap-2 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>ERC-3643 Compliance Protocol Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Hardware Multi-Factor Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Zero-Knowledge Proof Solvency Solved</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Indicator */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Protocol Consensus 100% Active</span>
              </div>
              <span className="text-cyan-400 font-semibold">ChainVest v2.4</span>
            </div>
          </motion.div>

          {/* Right Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="text-center mb-8 flex flex-col items-center">
                <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <Hexagon className="h-7 w-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Sign in to access your institutional ledger</p>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl mb-6 text-xs font-semibold flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-all font-mono"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/15 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-all font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary font-bold text-sm py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                >
                  <span>{loading ? 'Authenticating...' : 'Secure Sign In'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Request Access
                </Link>
              </p>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
