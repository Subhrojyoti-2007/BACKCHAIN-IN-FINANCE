import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Bell,
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { AnimatedCounter } from '../components/ui/animated-counter';
import DotField from '../components/ui/DotField';
import { fetchCryptoPrices, fetchHistoricalData } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const allocationData = [
  { name: 'Bitcoin', value: 42 },
  { name: 'Ethereum', value: 28 },
  { name: 'Solana', value: 16 },
  { name: 'USDC', value: 9 },
  { name: 'Others', value: 5 },
];

const allocationColors = ['#F7931A', '#627EEA', '#14F195', '#2775CA', '#8B5CF6'];

const transactions = [
  { id: 'TXN-5734', asset: 'ETH', amount: '+1.25', status: 'Completed', time: '2m ago' },
  { id: 'TXN-5735', asset: 'BTC', amount: '-0.08', status: 'Pending', time: '14m ago' },
  { id: 'TXN-5736', asset: 'USDC', amount: '+1,200', status: 'Completed', time: '45m ago' },
  { id: 'TXN-5737', asset: 'SOL', amount: '+18.5', status: 'Completed', time: '1h ago' },
];

const statusClasses = {
  Completed: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
  Pending: 'bg-amber-400/10 text-amber-300 border border-amber-500/30',
  Failed: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
};

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

export default function Dashboard() {
  const { t, formatCurrency, getExchangeRate, getCurrencySymbol } = useSettings();
  const [prices, setPrices] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const livePrices = await fetchCryptoPrices();
      setPrices(livePrices);
      
      const btcHistory = await fetchHistoricalData('bitcoin', 7);
      const formattedHistory = [];
      const step = Math.floor((btcHistory?.length || 7) / 7);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for(let i=0; i<7; i++) {
        if(btcHistory && btcHistory[i * step]) {
          formattedHistory.push({
            month: days[i], 
            value: btcHistory[i * step].value
          });
        }
      }
      setHistory(formattedHistory);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalValue = prices ? 
    (1.5 * (prices.bitcoin?.usd || 95000)) + (14 * (prices.ethereum?.usd || 3200)) + (250 * (prices.solana?.usd || 190)) : 
    742900;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[1700px] flex-col gap-6">
      <div className="w-full z-10 relative">
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">Institutional Terminal</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Portfolio <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Overview</span>
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={loadData}
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                  title="Refresh Market Prices"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button 
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                  onClick={() => alert("System Status: All services are running optimally. No new alerts.")}
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Metric Cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Total Balance */}
            <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("Portfolio Value")}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm sm:text-lg text-slate-400 font-semibold">{getCurrencySymbol()}</span>
                    {loading ? "..." : <AnimatedCounter value={totalValue * getExchangeRate()} prefix="" />}
                  </div>
                </div>
                <span className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Wallet className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-4 text-xs font-mono text-slate-400">Real-time valuation across 5 assets</p>
            </motion.div>

            {/* Bitcoin Price */}
            <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bitcoin (BTC)</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm sm:text-lg text-slate-400 font-semibold">{getCurrencySymbol()}</span>
                    {loading ? "..." : <AnimatedCounter value={(prices?.bitcoin?.usd || 95200) * getExchangeRate()} prefix="" />}
                  </div>
                </div>
                <span className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <TrendingUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-mono font-semibold">
                {(prices?.bitcoin?.usd_24h_change ?? 2.1) >= 0 ? 
                  <ArrowUpRight className="h-4 w-4 text-emerald-400"/> : 
                  <ArrowDownRight className="h-4 w-4 text-rose-400"/>
                }
                <span className={(prices?.bitcoin?.usd_24h_change ?? 2.1) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {(prices?.bitcoin?.usd_24h_change ?? 2.15).toFixed(2)}% (24h)
                </span>
              </div>
            </motion.div>

            {/* Ethereum Price */}
            <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ethereum (ETH)</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm sm:text-lg text-slate-400 font-semibold">{getCurrencySymbol()}</span>
                    {loading ? "..." : <AnimatedCounter value={(prices?.ethereum?.usd || 3350) * getExchangeRate()} prefix="" />}
                  </div>
                </div>
                <span className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Activity className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-mono font-semibold">
                {(prices?.ethereum?.usd_24h_change ?? 1.8) >= 0 ? 
                  <ArrowUpRight className="h-4 w-4 text-emerald-400"/> : 
                  <ArrowDownRight className="h-4 w-4 text-rose-400"/>
                }
                <span className={(prices?.ethereum?.usd_24h_change ?? 1.8) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {(prices?.ethereum?.usd_24h_change ?? 1.84).toFixed(2)}% (24h)
                </span>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={itemVariants}
              className="glass-card rounded-3xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-cyan-300">Market Dynamics</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-white">Bitcoin 7-Day Trend</h2>
                </div>
                <span className="rounded-full bg-slate-900 border border-white/10 px-3 py-1 text-xs font-mono text-slate-300">Live Feed</span>
              </div>
              <div className="mt-6 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#38bdf8" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2 }} 
                      activeDot={{ r: 7 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass-card rounded-3xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-cyan-300">Crypto Allocation</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-white">Portfolio Share</h2>
                </div>
                <span className="rounded-full bg-slate-900 border border-white/10 px-3 py-1 text-xs font-mono text-slate-300">Balanced</span>
              </div>
              <div className="mt-6 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={allocationData} 
                      dataKey="value" 
                      nameKey="name" 
                      innerRadius={65} 
                      outerRadius={100} 
                      paddingAngle={4}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={allocationColors[index % allocationColors.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 px-2 justify-center">
                {allocationData.map((asset, index) => (
                  <div key={asset.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: allocationColors[index] }} />
                    <span className="text-xs font-mono text-slate-300">{asset.name} ({asset.value}%)</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Transactions Table */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">{t("Recent Transactions")}</h2>
                <p className="text-xs text-slate-400">{t("Verifiable on-chain execution ledger")}</p>
              </div>
              <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                {t("View Ledger")} →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="text-slate-400 uppercase font-mono tracking-wider text-[11px] border-b border-white/10">
                  <tr>
                    <th className="pb-3 pr-4 font-semibold">TX Hash ID</th>
                    <th className="pb-3 pr-4 font-semibold">Asset</th>
                    <th className="pb-3 pr-4 font-semibold text-right">Amount</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 text-cyan-300 font-semibold">{txn.id}</td>
                      <td className="py-3.5 pr-4 font-bold text-white">{txn.asset}</td>
                      <td className={`py-3.5 pr-4 text-right font-bold ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {txn.amount}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[txn.status]}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-slate-400">{txn.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
