import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, Lock, Globe, LineChart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Institutional Grade Security',
    description: 'Multi-party computation (MPC) and automated smart contract auditing built directly into consensus layer.',
    icon: ShieldCheck,
    tag: 'Consensus Level',
    colSpan: 'md:col-span-2 lg:col-span-2',
    accent: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    stat: '99.999% Safe'
  },
  {
    title: 'Sub-second Finality',
    description: '1.2ms ultra-low latency settlement powered by custom subnet execution engines.',
    icon: Zap,
    tag: 'High Throughput',
    colSpan: 'md:col-span-1 lg:col-span-1',
    accent: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    stat: '1.2ms Latency'
  },
  {
    title: 'Automated Smart Contracts',
    description: 'Self-executing financial workflows with verifiable zero-knowledge proofs and zero slippage.',
    icon: Cpu,
    tag: 'EVM Compatible',
    colSpan: 'md:col-span-1 lg:col-span-1',
    accent: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    stat: '0x Verified'
  },
  {
    title: 'Borderless Liquidity Rails',
    description: 'Instant cross-chain liquidity transfers with algorithmic gas optimization and institutional compliance.',
    icon: Globe,
    tag: 'Global Settlement',
    colSpan: 'md:col-span-2 lg:col-span-2',
    accent: 'from-sky-500/20 via-emerald-500/10 to-transparent',
    borderColor: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    stat: '$4.2B TVL'
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 relative z-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-4xl text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">Protocol Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Engineered for <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Unrivaled Financial Efficiency</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Built from the ground up to support high-frequency trading, automated asset management, and compliant digital asset custody.
        </p>
      </motion.div>

      {/* 21st.dev Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bento-card ${feature.colSpan} p-8 flex flex-col justify-between relative overflow-hidden group border ${feature.borderColor}`}
            >
              {/* Background gradient splash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-cyan-300 font-semibold">{feature.stat}</span>
                <Link to="/explorer" className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
                  <span>Learn More</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
