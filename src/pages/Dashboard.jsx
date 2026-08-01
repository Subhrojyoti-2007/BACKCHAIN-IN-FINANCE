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
} from 'lucide-react'
import { AnimatedCounter } from '../components/ui/animated-counter'

const portfolioStats = [
  {
    title: 'Wallet Balance',
    value: 128420,
    description: 'Available balance in secure wallets',
    icon: Wallet,
  },
  {
    title: 'Portfolio Value',
    value: 742900,
    description: 'Total market value of holdings',
    icon: TrendingUp,
  },
]

const allocationData = [
  { name: 'Bitcoin', value: 42 },
  { name: 'Ethereum', value: 28 },
  { name: 'Stablecoins', value: 16 },
  { name: 'DeFi', value: 9 },
  { name: 'NFTs', value: 5 },
]

const allocationColors = ['#22D3EE', '#38BDF8', '#8B5CF6', '#F472B6', '#FACC15']

const growthData = [
  { month: 'Jan', value: 320000 },
  { month: 'Feb', value: 345000 },
  { month: 'Mar', value: 380000 },
  { month: 'Apr', value: 415000 },
  { month: 'May', value: 480000 },
  { month: 'Jun', value: 560000 },
  { month: 'Jul', value: 742900 },
]

const transactions = [
  { id: 'TXN-5734', asset: 'ETH', amount: '+1.25', status: 'Completed', time: '2m ago' },
  { id: 'TXN-5735', asset: 'BTC', amount: '-0.08', status: 'Pending', time: '14m ago' },
  { id: 'TXN-5736', asset: 'USDC', amount: '+1,200', status: 'Completed', time: '45m ago' },
  { id: 'TXN-5737', asset: 'AAVE', amount: '+18.5', status: 'Completed', time: '1h ago' },
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
  return (
    <div className="min-h-screen bg-[#050610] text-slate-100">
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
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.8)] backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Finance Overview</p>
                  <h1 className="mt-3 text-3xl font-semibold text-white">Premium fintech dashboard</h1>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                  <Bell size={16} />
                  Notifications
                </button>
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              {portfolioStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.title}
                    variants={itemVariants}
                    className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{stat.title}</p>
                        <p className="mt-4 text-4xl font-bold text-white">
                            <AnimatedCounter value={stat.value} prefix="$" />
                        </p>
                      </div>
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                        <Icon size={24} />
                      </span>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-slate-400">{stat.description}</p>
                  </motion.div>
                )
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
              <motion.div
                variants={itemVariants}
                className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Portfolio Growth</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">7-month trend</h2>
                  </div>
                  <span className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300">Analysis</span>
                </div>
                <div className="mt-8 h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#22D3EE" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#22D3EE', strokeWidth: 2 }} 
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
                className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl"
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
                          <Cell key={entry.name} fill={allocationColors[index % allocationColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {allocationData.map((slice, index) => (
                    <div key={slice.name} className="rounded-3xl bg-slate-900/80 p-4 hover:bg-slate-800/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: allocationColors[index % allocationColors.length], color: allocationColors[index % allocationColors.length] }} />
                        <p className="font-semibold text-white">{slice.name}</p>
                      </div>
                      <p className="mt-3 text-sm text-slate-400">
                         <AnimatedCounter value={slice.value} suffix="% of portfolio" />
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl perspective-1000"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Recent Transactions</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Latest activity</h2>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-400">
                  <LineTrend size={16} />
                  View all
                </button>
              </div>
              <motion.div 
                animate={{
                  y: [0, -10, 0],
                  rotateX: [0, 2, -2, 0],
                  rotateY: [0, -1, 1, 0],
                  boxShadow: [
                    "0 10px 30px -10px rgba(0,0,0,0.5)",
                    "0 25px 50px -12px rgba(34,211,238,0.25)",
                    "0 10px 30px -10px rgba(0,0,0,0.5)"
                  ],
                }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="mt-6 overflow-visible rounded-[1.75rem] border border-white/10 bg-slate-900/80 transform-gpu"
              >
                <table className="min-w-full text-left text-sm text-slate-200">
                  <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
                    <tr>
                      <th className="px-5 py-4 first:rounded-tl-[1.75rem] last:rounded-tr-[1.75rem]">Transaction</th>
                      <th className="px-5 py-4">Asset</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Time</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.6 // Wait for main cards to load
                        }
                      }
                    }}
                    className="divide-y divide-slate-800"
                  >
                    {transactions.map((tx) => (
                      <motion.tr 
                        key={tx.id} 
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        whileHover={{ 
                          scale: 1.015, 
                          backgroundColor: "rgba(30,41,59,0.9)",
                          y: -2,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                          transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                        className="transition-colors cursor-pointer relative z-10"
                      >
                        <td className="px-5 py-4 font-medium text-white">{tx.id}</td>
                        <td className="px-5 py-4">{tx.asset}</td>
                        <td className="px-5 py-4">{tx.amount}</td>
                        <td className="px-5 py-4">
                          <motion.span 
                            animate={
                              tx.status === 'Pending' 
                                ? { boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 15px rgba(251,191,36,0.6)", "0 0 0px rgba(251,191,36,0)"] } 
                                : tx.status === 'Completed'
                                ? { boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 8px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] }
                                : {}
                            }
                            transition={{
                              duration: tx.status === 'Pending' ? 1.5 : 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[tx.status]}`}
                          >
                            {tx.status}
                          </motion.span>
                        </td>
                        <td className="px-5 py-4">{tx.time}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </motion.div>
            </motion.div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}
