import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchHistoricalData } from '../services/api';
import { TrendingUp, BarChart2, Activity, ShieldCheck, Zap } from 'lucide-react';

const COLORS = ["#38bdf8", "#6366f1", "#10b981", "#a855f7", "#ec4899"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 90, damping: 20 }
  }
};

function Analytics() {
  const [btcHistory, setBtcHistory] = useState([]);
  const [ethHistory, setEthHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const btc = await fetchHistoricalData('bitcoin', 30);
        const eth = await fetchHistoricalData('ethereum', 30);
        
        const formatHistory = (historyData, stepSize) => {
          const formatted = [];
          const step = Math.floor((historyData?.length || 30) / stepSize);
          for(let i=0; i<stepSize; i++) {
            if(historyData && historyData[i * step]) {
              formatted.push({
                time: `Day ${i+1}`, 
                value: historyData[i * step].value
              });
            }
          }
          return formatted;
        };

        setBtcHistory(formatHistory(btc, 15));
        setEthHistory(formatHistory(eth, 15));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const assetData = [
    { name: "Bitcoin", value: 42 },
    { name: "Ethereum", value: 28 },
    { name: "Solana", value: 16 },
    { name: "USDC", value: 9 },
    { name: "Others", value: 5 },
  ];

  return (
    <div className="min-h-screen text-slate-100 space-y-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">Institutional Metrics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analytics & <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Market Intelligence</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Deep-dive market performance, liquidity pools, and network volume metrics.</p>
      </motion.div>

      {/* Top 2 Main Charts */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-6"
      >
<<<<<<< HEAD
        {/* Market Cap Trend (Area Chart) */}
        <motion.div variants={itemVariants} className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Bitcoin 30-Day Trend (Live)</h2>
=======
        {/* Bitcoin 30-Day Area Chart */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">Market Dynamics</p>
              <h2 className="text-xl font-bold text-white mt-1">Bitcoin 30-Day Trend</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              Live Feed
            </span>
          </div>

>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-400 font-mono text-sm">Querying market API...</div>
              ) : (
                <AreaChart data={btcHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F7931A" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#F7931A' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F7931A" fillOpacity={1} fill="url(#colorBtc)" strokeWidth={3} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

<<<<<<< HEAD
        {/* Network Volume (Bar Chart) */}
        <motion.div variants={itemVariants} className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Ethereum 30-Day Trend (Live)</h2>
=======
        {/* Ethereum 30-Day Bar Chart */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">Smart Contract Settlement</p>
              <h2 className="text-xl font-bold text-white mt-1">Ethereum 30-Day Trend</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
              EVM Feed
            </span>
          </div>

>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-400 font-mono text-sm">Querying market API...</div>
              ) : (
                <BarChart data={ethHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#627EEA' }}
                  />
                  <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Allocation & Metrics Table */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-3 gap-6"
      >
<<<<<<< HEAD
        {/* Asset Distribution (Pie Chart) */}
        <motion.div variants={itemVariants} className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-6">Global Allocation</h2>
          <div className="h-64">
=======
        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4">Market Share Allocation</h2>
          <div className="h-60">
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', border: 'none', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Metrics Table */}
<<<<<<< HEAD
        <motion.div variants={itemVariants} className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 lg:col-span-2 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <table className="w-full text-left border-collapse min-w-[500px]">
=======
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 lg:col-span-2 overflow-x-auto">
          <h2 className="text-xl font-bold text-white mb-6">Protocol Performance Benchmarks</h2>
          <table className="w-full text-left text-xs sm:text-sm font-mono">
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">Metric Parameter</th>
                <th className="pb-3 font-semibold">Current Value</th>
                <th className="pb-3 font-semibold">24h Variance</th>
                <th className="pb-3 font-semibold">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 text-white font-semibold">Network Total Value Locked</td>
                <td className="py-3.5 font-bold text-cyan-300">$4.28B</td>
                <td className="py-3.5 text-emerald-400">+2.4%</td>
                <td className="py-3.5">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 text-white font-semibold">Active Vault Addresses</td>
                <td className="py-3.5 font-bold text-cyan-300">142,593</td>
                <td className="py-3.5 text-emerald-400">+5.1%</td>
                <td className="py-3.5">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    Expanding
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 text-white font-semibold">Average Gas Fee</td>
                <td className="py-3.5 font-bold text-cyan-300">12 Gwei</td>
                <td className="py-3.5 text-emerald-400">-12.5%</td>
                <td className="py-3.5">
                  <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    Low Fee Rail
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 text-white font-semibold">Verified Smart Contracts</td>
                <td className="py-3.5 font-bold text-cyan-300">8,510</td>
                <td className="py-3.5 text-emerald-400">+1.2%</td>
                <td className="py-3.5">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                    Audited 0x
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Analytics;
