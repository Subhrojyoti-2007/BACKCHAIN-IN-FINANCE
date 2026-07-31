import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  Blocks,
  Activity,
  Fuel,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Database,
} from "lucide-react";


function BlockchainExplorer() {
  const [chainData, setChainData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchain();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
        <p className="text-gray-400 mt-2">Monitor blockchain activity, transactions and network status</p>
      </motion.div>

      {/* Search */}
      <motion.div
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
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <InfoCard icon={<Blocks/>} title="Block Height" value={chainData.length > 0 ? chainData[0].index : 0} />
        <InfoCard icon={<Fuel/>} title="Gas Price" value="25 Gwei" />
        <InfoCard icon={<Activity/>} title="Network" value="Local Testnet" />
        <InfoCard icon={<CheckCircle/>} title="Status" value="Active" />
      </div>

      {/* Transactions */}
      <motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Database className="text-cyan-400"/>
          <h2 className="text-xl font-semibold">Latest Transactions</h2>
        </div>
        
        {loading ? (
          <p className="text-gray-400">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400">No transactions found.</p>
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
              <tbody>
              {transactions.map((tx, index) => (
                <motion.tr
                  key={index}
                  initial={{opacity:0}}
                  animate={{opacity:1}}
                  transition={{delay:index*0.1}}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-3 text-cyan-400">{tx.hash}</td>
                  <td className="p-3 font-mono text-sm">{tx.from}</td>
                  <td className="p-3 font-mono text-sm">{tx.to}</td>
                  <td className="p-3 font-semibold">{tx.amount}</td>
                  <td className="p-3">
                    <span className="text-green-400">{tx.status}</span>
                  </td>
                  <td className="p-3 text-gray-400">{tx.time}</td>
                </motion.tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Latest Blocks */}
      <motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-5">Latest Blocks</h2>
        
        {loading ? (
          <p className="text-gray-400">Loading blocks...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
          {chainData.map((block, index) => (
            <motion.div
              key={index}
              whileHover={{scale:1.03}}
              className="bg-black/20 rounded-xl p-5"
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
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({icon, title, value}) {
  return (
    <motion.div
      whileHover={{scale:1.05}}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 flex items-center gap-4"
    >
      <div className="text-cyan-400">{icon}</div>
      <div>
        <p className="text-gray-400">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </motion.div>
  );
}

export default BlockchainExplorer;