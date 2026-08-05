import os

file_path = "src/pages/Explorer.jsx"

new_content = """import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  Blocks,
  Activity,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Database,
  Globe,
  BarChart2,
  PieChart
} from "lucide-react";
import { AnimatedCounter } from "../components/ui/animated-counter";
import { fetchGlobalStats } from "../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
};

function BlockchainExplorer() {
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
          // Sort blocks so newest is first
          const sortedChain = [...data.chain].sort((a, b) => b.index - a.index);
          setChainData(sortedChain);
          
          // Extract all transactions from the chain
          const allTxs = [];
          sortedChain.forEach(block => {
            if (Array.isArray(block.transactions)) {
              block.transactions.forEach(tx => {
                // If it's a genesis block transaction (string), skip or format differently
                if (typeof tx === 'string') return;
                
                allTxs.push({
                  hash: block.hash.substring(0, 10) + '...', // using block hash as tx hash for display
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
    }, 15000); // Poll every 15s for new blocks

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white p-6">
      {/* Header */}
      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
        <p className="text-gray-400 mt-2">Monitor local blockchain activity and live global crypto markets</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{opacity:0, scale: 0.95}}
        animate={{opacity:1, scale: 1}}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{scale:1.01}}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 mb-8"
      >
        <Search className="text-cyan-400"/>
        <input
          placeholder="Search transaction hash or wallet address..."
          className="bg-transparent outline-none w-full text-white placeholder-gray-400"
        />
      </motion.div>

      {/* Network Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-4 gap-6 mb-8"
      >
        <InfoCard 
          icon={<Blocks/>} 
          title="Local Block Height" 
          value={chainData.length > 0 ? chainData[0].index : 0} 
          isNumeric={true} 
        />
        <InfoCard 
          icon={<Globe/>} 
          title="Global Market Cap" 
          value={globalStats ? `$${(globalStats.total_market_cap.usd / 1e12).toFixed(2)}T` : "Loading..."} 
        />
        <InfoCard 
          icon={<BarChart2/>} 
          title="24h Volume" 
          value={globalStats ? `$${(globalStats.total_volume.usd / 1e9).toFixed(1)}B` : "Loading..."} 
        />
        <InfoCard 
          icon={<PieChart/>} 
          title="BTC Dominance" 
          value={globalStats ? `${globalStats.market_cap_percentage.btc.toFixed(1)}%` : "Loading..."} 
        />
      </motion.div>

      {/* Transactions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <Database className="text-cyan-400"/>
          <h2 className="text-xl font-semibold">Latest Local Transactions</h2>
        </div>
        
        {loading ? (
          <p className="text-gray-400">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400">No transactions found in local chain.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="p-3">Block Hash</th>
                  <th className="p-3">From</th>
                  <th className="p-3">To</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
              {transactions.map((tx, index) => (
                <motion.tr 
                  variants={itemVariants}
                  key={index} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 font-mono text-cyan-400 cursor-pointer hover:underline">{tx.hash}</td>
                  <td className="p-3 font-mono text-sm text-gray-400">{tx.from}</td>
                  <td className="p-3 font-mono text-sm text-gray-400">{tx.to}</td>
                  <td className="p-3 font-semibold">{tx.amount}</td>
                  <td className="p-3">
                    <span className="text-green-400">{tx.status}</span>
                  </td>
                  <td className="p-3 text-gray-400">{tx.time}</td>
                </motion.tr>
              ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Latest Blocks */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-5">Latest Local Blocks</h2>
        
        {loading ? (
          <p className="text-gray-400">Loading blocks...</p>
        ) : (
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
              className="bg-black/20 rounded-xl p-5 border border-white/5 cursor-pointer transition-colors"
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
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({icon, title, value, isNumeric = false, suffix = ""}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale:1.05, y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 flex items-center gap-4 cursor-pointer"
    >
      <div className="text-cyan-400">{icon}</div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">
          {isNumeric && typeof value === 'number' ? <AnimatedCounter value={value} /> : value}{suffix}
        </p>
      </div>
    </motion.div>
  );
}

export default BlockchainExplorer;
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Explorer.jsx updated successfully!")
