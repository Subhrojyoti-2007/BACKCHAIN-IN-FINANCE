import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Send, CheckCircle2, Globe, MessageSquare, Code2, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative border-t border-white/10 bg-slate-950/90 text-slate-400 pt-16 pb-12 overflow-hidden z-20"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Identity Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Hexagon className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                ChainVest
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              Next-generation decentralized finance infrastructure. Institution-grade security, automated smart contract execution, and real-time network analytics.
            </p>

            {/* Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 w-fit text-xs font-mono text-emerald-400 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mainnet Active • 99.99% Operational</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">Platform</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li><Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Dashboard</Link></li>
              <li><Link to="/explorer" className="hover:text-cyan-300 transition-colors">Subnet Explorer</Link></li>
              <li><Link to="/analytics" className="hover:text-cyan-300 transition-colors">Analytics Engine</Link></li>
              <li><Link to="/payments" className="hover:text-cyan-300 transition-colors">Cross-Chain Payments</Link></li>
              <li><Link to="/security" className="hover:text-cyan-300 transition-colors">Security Vaults</Link></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">Ecosystem</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li><Link to="/terminal" className="hover:text-cyan-300 transition-colors">Admin Terminal</Link></li>
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">Smart Contracts</a></li>
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">Validator Nodes</a></li>
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">Audit Reports</a></li>
              <li><a href="#features" className="hover:text-cyan-300 transition-colors">API & SDKs</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">Stay Informed</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe for institutional market updates, security advisories, and protocol upgrades.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter.your@email.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all pr-9 font-mono"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono animate-fadeIn">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} ChainVest Finance Protocol. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all border border-white/10" aria-label="Global Network" title="Global Network">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all border border-white/10" aria-label="Code Repository" title="Developer Code">
              <Code2 className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all border border-white/10" aria-label="Community Chat" title="Community Channel">
              <MessageSquare className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-all border border-white/10" aria-label="Share Protocol" title="Share Protocol">
              <Share2 className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Security Disclosure</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
