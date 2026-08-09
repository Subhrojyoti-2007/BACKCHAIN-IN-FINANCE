import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  Blocks,
  Globe,
  BarChart2,
  PieChart,
  Database,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { AnimatedCounter } from "../components/ui/animated-counter";
import { fetchGlobalStats } from "../services/api";
import { useSettings } from '../context/SettingsContext';

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

function BlockchainExplorer() {
  const { t, formatCurrency, getExchangeRate, getCurrencySymbol } = useSettings();
  const [chainData, setChainData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState(null);

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await fetch('/api/blocks');
        const data = await response.json();
        
        if (data.chain) {
          const sortedChain = [...data.chain].sort((a, b) => b.index - a.index);
          setChainData(sortedChain);
          
          const allTxs = [];
          sortedChain.forEach(block => {
            if (Array.isArray(block.transactions)) {
              block.transactions.forEach(tx => {
                if (typeof tx === 'string') return;
                
                allTxs.push({
                  hash: block.hash.substring(0, 12) + '...',
                  from: tx.sender,
                  to: tx.receiver,
                  amount: `${tx.amount} ${tx.asset || 'ETH'}`,
                  status: "Success",
                  time: new Date(tx.time * 1000).toLocaleTimeString()
                });
              });
            }
          });
          setTransactions(allTxs);
        }
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    };

    const loadGlobalStats = async () => {
      try {
        const stats = await fetchGlobalStats();
        setGlobalStats(stats);
      } catch(err) {
        console.error(err);
      }
    };

    Promise.all([fetchBlockchain(), loadGlobalStats()]).finally(() => {
      setLoading(false);
    });
    
    const interval = setInterval(() => {
      fetchBlockchain();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

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
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">{t("Network Stats")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Blocks className="h-8 w-8 text-cyan-400" />
          <span>{t("Explorer")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{t("Monitor on-chain blocks, verifications, and global crypto metric consensus.")}</p>
      </motion.div>

      {/* Search Input */}
      <motion.div
<<<<<<< HEAD
        initial={{opacity:0, scale: 0.95}}
        animate={{opacity:1, scale: 1}}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{scale:1.01}}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-4 flex items-center gap-3 mb-8"
=======
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-white/10 focus-within:border-cyan-500/50 shadow-lg"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
      >
        <Search className="text-cyan-400 h-5 w-5 ml-2" />
        <input
          placeholder="Search transaction hash, block index, or wallet address..."
          className="bg-transparent outline-none w-full text-sm text-white placeholder-slate-500 font-mono"
        />
      </motion.div>

      {/* Network Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <InfoCard 
          icon={<Blocks className="h-5 w-5 text-cyan-400" />} 
          title={t("Local Block Height")} 
          value={chainData.length > 0 ? chainData[0].index : 0} 
          isNumeric={true} 
        />
        <InfoCard 
          icon={<Globe className="h-5 w-5 text-blue-400" />} 
          title={t("Global Market Cap")} 
          value={globalStats ? `${getCurrencySymbol()}${((globalStats.total_market_cap.usd * getExchangeRate()) / 1e12).toFixed(2)}T` : `${getCurrencySymbol()}3.42T`} 
        />
        <InfoCard 
          icon={<BarChart2 className="h-5 w-5 text-indigo-400" />} 
          title={t("24h Global Volume")} 
          value={globalStats ? `${getCurrencySymbol()}${((globalStats.total_volume.usd * getExchangeRate()) / 1e9).toFixed(1)}B` : `${getCurrencySymbol()}148.5B`} 
        />
        <InfoCard 
          icon={<PieChart className="h-5 w-5 text-emerald-400" />} 
          title="BTC Dominance" 
          value={globalStats ? `${globalStats.market_cap_percentage.btc.toFixed(1)}%` : "56.4%"} 
        />
      </motion.div>

      {/* Latest Transactions Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 mb-8"
=======
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t("Latest Subnet Transactions")}</h2>
            <p className="text-xs text-slate-400">{t("Real-time ledger events confirmed by validators")}</p>
          </div>
        </div>
        
        {loading ? (
          <p className="text-sm font-mono text-slate-400">Querying ledger blocks...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm font-mono text-slate-400">No transactions recorded in this subnet block space.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pr-4 font-semibold">{t("Block Hash")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("From")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("To")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("Amount")}</th>
                  <th className="pb-3 pr-4 font-semibold">{t("Status")}</th>
                  <th className="pb-3 font-semibold text-right">{t("Time")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4 text-cyan-400 font-bold hover:underline cursor-pointer">{tx.hash}</td>
                    <td className="py-3.5 pr-4 text-slate-300 truncate max-w-[120px]">{tx.from}</td>
                    <td className="py-3.5 pr-4 text-slate-300 truncate max-w-[120px]">{tx.to}</td>
                    <td className="py-3.5 pr-4 font-bold text-white">{tx.amount}</td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        <ShieldCheck className="h-3 w-3" /> {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Latest Blocks Grid */}
      <motion.div 
<<<<<<< HEAD
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6"
=======
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
      >
        <h2 className="text-xl font-bold text-white mb-6">{t("Recent Validated Blocks")}</h2>
        
        {loading ? (
          <p className="text-sm font-mono text-slate-400">Loading blocks...</p>
        ) : (
<<<<<<< HEAD
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-5"
          >
          {chainData.map((block, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.03, 
                boxShadow: "0px 10px 30px rgba(34,211,238,0.15)",
                y: -5
              }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-5 border border-white/5 cursor-pointer transition-colors"
            >
              <div className="flex justify-between">
                <Blocks className="text-cyan-400"/>
                <ArrowUpRight className="text-gray-400"/>
              </div>
              <h3 className="text-xl font-bold mt-4">Block #{block.index}</h3>
              <p className="text-gray-400 mt-2 truncate">Hash: {block.hash}</p>
              <p className="text-gray-400 mt-1">Tx Count: {Array.isArray(block.transactions) ? block.transactions.length : 1}</p>
              
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                <Clock size={15}/>
                {new Date(block.timestamp * 1000).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
          </motion.div>
=======
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {chainData.map((block, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, borderColor: 'rgba(56,189,248,0.4)' }}
                className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Blocks className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">Block #{block.index}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-2 truncate">Hash: {block.hash}</p>
                  <p className="text-xs font-mono text-slate-400 mt-1">Tx Count: {Array.isArray(block.transactions) ? block.transactions.length : 1}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{new Date(block.timestamp * 1000).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({ icon, title, value, isNumeric = false }) {
  return (
    <motion.div
      variants={itemVariants}
<<<<<<< HEAD
      whileHover={{ scale:1.05, y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-5 flex items-center gap-4 cursor-pointer"
=======
      className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 flex items-center gap-4"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
    >
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="text-2xl font-extrabold text-white font-mono mt-1">
          {isNumeric && typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
        </div>
      </div>
    </motion.div>
  );
}

export default BlockchainExplorer;
