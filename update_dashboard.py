import os

file_path = "src/pages/Dashboard.jsx"

new_content = """import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
} from 'recharts'
import {
  Bell,
  ChevronRight,
  Grid,
  LineChart as LineTrend,
  PieChart as PieTrend,
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { AnimatedCounter } from '../components/ui/animated-counter'
import { fetchCryptoPrices, fetchHistoricalData } from '../services/api'

const allocationData = [
  { name: 'Bitcoin', value: 42 },
  { name: 'Ethereum', value: 28 },
  { name: 'Solana', value: 16 },
  { name: 'USDC', value: 9 },
  { name: 'Others', value: 5 },
]

const allocationColors = ['#F7931A', '#627EEA', '#14F195', '#2775CA', '#8B5CF6']

const transactions = [
  { id: 'TXN-5734', asset: 'ETH', amount: '+1.25', status: 'Completed', time: '2m ago' },
  { id: 'TXN-5735', asset: 'BTC', amount: '-0.08', status: 'Pending', time: '14m ago' },
  { id: 'TXN-5736', asset: 'USDC', amount: '+1,200', status: 'Completed', time: '45m ago' },
  { id: 'TXN-5737', asset: 'SOL', amount: '+18.5', status: 'Completed', time: '1h ago' },
]

const statusClasses = {
  Completed: 'bg-emerald-500/10 text-emerald-300',
  Pending: 'bg-amber-400/10 text-amber-300',
  Failed: 'bg-rose-500/10 text-rose-300',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
}

export default function Dashboard() {
  const [prices, setPrices] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const livePrices = await fetchCryptoPrices();
        setPrices(livePrices);
        
        // Fetch 7-day history for Bitcoin for the chart
        const btcHistory = await fetchHistoricalData('bitcoin', 7);
        // Format for recharts, just take 7 points
        const formattedHistory = [];
        const step = Math.floor(btcHistory.length / 7);
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        for(let i=0; i<7; i++) {
            if(btcHistory[i * step]) {
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

    loadData();
    // Poll every 30s
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalValue = prices ? 
    (1.5 * prices.bitcoin?.usd) + (14 * prices.ethereum?.usd) + (250 * prices.solana?.usd) : 
    742900; // fallback

  return (
    <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full">
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Live Crypto Overview</p>
                  <h1 className="mt-3 text-3xl font-semibold text-white">Live Market Dashboard</h1>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  <Bell size={16} />
                  Notifications
                </button>
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Total Balance */}
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Est. Portfolio Value</p>
                        <p className="mt-4 text-4xl font-bold text-white">
                            {loading ? "..." : <AnimatedCounter value={totalValue} prefix="$" />}
                        </p>
                        </div>
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                        <Wallet size={24} />
                        </span>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-slate-400">Based on live market prices</p>
                </motion.div>

                {/* Bitcoin Price */}
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Bitcoin (BTC)</p>
                        <p className="mt-4 text-4xl font-bold text-white">
                            {loading ? "..." : <AnimatedCounter value={prices?.bitcoin?.usd || 0} prefix="$" />}
                        </p>
                        </div>
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-400">
                        <TrendingUp size={24} />
                        </span>
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-sm leading-6">
                        {prices?.bitcoin?.usd_24h_change >= 0 ? 
                            <ArrowUpRight size={16} className="text-emerald-400"/> : 
                            <ArrowDownRight size={16} className="text-rose-400"/>
                        }
                        <span className={prices?.bitcoin?.usd_24h_change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {prices?.bitcoin?.usd_24h_change?.toFixed(2)}% (24h)
                        </span>
                    </div>
                </motion.div>

                {/* Ethereum Price */}
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Ethereum (ETH)</p>
                        <p className="mt-4 text-4xl font-bold text-white">
                            {loading ? "..." : <AnimatedCounter value={prices?.ethereum?.usd || 0} prefix="$" />}
                        </p>
                        </div>
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-400">
                        <Activity size={24} />
                        </span>
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-sm leading-6">
                        {prices?.ethereum?.usd_24h_change >= 0 ? 
                            <ArrowUpRight size={16} className="text-emerald-400"/> : 
                            <ArrowDownRight size={16} className="text-rose-400"/>
                        }
                        <span className={prices?.ethereum?.usd_24h_change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {prices?.ethereum?.usd_24h_change?.toFixed(2)}% (24h)
                        </span>
                    </div>
                </motion.div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Bitcoin Market Trend</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Live 7-day trend</h2>
                  </div>
                  <span className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300">Live API</span>
                </div>
                <div className="mt-8 h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#F7931A" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#F7931A', strokeWidth: 2 }} 
                        activeDot={{ r: 6 }} 
                        isAnimationActive={true}
                        animationDuration={2500}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Crypto Allocation</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Portfolio distribution</h2>
                  </div>
                  <span className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300">Allocation</span>
                </div>
                <div className="mt-8 h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={allocationData} 
                        dataKey="value" 
                        nameKey="name" 
                        innerRadius={70} 
                        outerRadius={110} 
                        paddingAngle={4}
                        isAnimationActive={true}
                        animationDuration={2000}
                        animationEasing="ease-out"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={allocationColors[index % allocationColors.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4 px-2">
                  {allocationData.map((asset, index) => (
                    <div key={asset.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: allocationColors[index] }} />
                      <span className="text-sm text-slate-300">{asset.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                  <p className="mt-1 text-sm text-slate-400">Your latest portfolio movements</p>
                </div>
                <button className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300">
                  View all
                </button>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-4 pr-4 font-medium">Transaction ID</th>
                      <th className="pb-4 pr-4 font-medium">Asset</th>
                      <th className="pb-4 pr-4 font-medium text-right">Amount</th>
                      <th className="pb-4 pr-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="transition hover:bg-white/[0.02]">
                        <td className="py-4 pr-4 font-mono text-slate-300">{txn.id}</td>
                        <td className="py-4 pr-4 font-medium text-white">{txn.asset}</td>
                        <td className={`py-4 pr-4 text-right font-medium ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {txn.amount}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[txn.status]}`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-slate-400">{txn.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.main>
        </div>
    </div>
  )
}
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Dashboard.jsx updated successfully!")
