import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-12 pb-20 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-4xl text-center flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">Next-Gen Blockchain Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Institutional Grade <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Decentralized Finance
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-xl leading-relaxed text-slate-300">
          Build total trust in every transaction with audit-ready smart contracts, sub-second settlement, and real-time network analytics.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="btn-primary px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 group w-full sm:w-auto justify-center"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Eye className="h-4 w-4 text-cyan-400" />
            <span>Explore Live Dashboard</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
