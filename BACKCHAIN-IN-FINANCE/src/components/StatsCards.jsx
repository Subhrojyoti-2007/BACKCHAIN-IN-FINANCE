import { motion } from 'framer-motion';
import { TrendingUp, Users, Cpu, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Live Transactions', value: '1,849,201+', trend: '+14.2% 24h', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  { label: 'Institutional Traders', value: '72,490', trend: '+8.1% MoM', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { label: 'Smart Contracts Executed', value: '8,510', trend: 'Verified 0x', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { label: 'Total Assets Secured', value: '$4.28B', trend: '100% Audited', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
];

export default function StatsCards() {
  return (
    <section className="mx-auto max-w-7xl pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.bg} border group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-white font-mono tracking-tight">{stat.value}</h3>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-400">
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
