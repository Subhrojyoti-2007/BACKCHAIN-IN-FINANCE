import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Users, ShieldCheck, Activity, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [blocks, setBlocks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [ammTicker, setAmmTicker] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blocksRes, accountsRes, ammRes] = await Promise.all([
          fetch('/api/audit-trail'),
          fetch('/api/accounts'),
          fetch('/api/amm-ticker')
        ]);
        
        const blocksData = await blocksRes.json();
        const accountsData = await accountsRes.json();
        const ammData = await ammRes.json();

        setBlocks(blocksData.chain || []);
        setAccounts(accountsData || []);
        setAmmTicker(ammData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Poll AMM data every 5 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/amm-ticker');
        const data = await res.json();
        setAmmTicker(data);
      } catch (err) {}
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 pt-24 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-cyan-400" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> System Level Access Granted
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="flex flex-col gap-8"
          >
            {/* AMM Ticker Marquee */}
            {ammTicker && (
              <motion.div variants={itemVariants} className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <Activity className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-slate-200">Live AMM Ticker</h2>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm text-emerald-400 font-medium">{ammTicker.status}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1 font-medium">BTC / USD</p>
                    <p className="text-2xl font-bold text-yellow-400">${ammTicker.btc_price.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1 font-medium">ETH / USD</p>
                    <p className="text-2xl font-bold text-indigo-400">${ammTicker.eth_price.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1 font-medium">SOL / USD</p>
                    <p className="text-2xl font-bold text-emerald-400">${ammTicker.sol_price.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-slate-400 text-sm mb-1 font-medium">24H Volume</p>
                    <p className="text-2xl font-bold text-cyan-400">{ammTicker.volume_24h}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Accounts Grid */}
            <motion.div variants={itemVariants} className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-slate-200">Registered Accounts ({accounts.length})</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((acc, idx) => (
                  <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-slate-100">{acc.username}</span>
                        <span className="text-xs text-slate-400 font-mono mt-1 break-all bg-black/30 px-2 py-1 rounded">
                          {acc.address}
                        </span>
                      </div>
                      {acc.is_kyc_verified ? (
                        <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> KYC
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-semibold">
                          <XCircle className="h-3 w-3" /> UNVERIFIED
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-2 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Balance</p>
                        <p className="text-xl font-bold text-cyan-400">${acc.balance?.toLocaleString() ?? '0.00'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Network</p>
                        <p className="text-sm font-medium text-slate-300">{acc.network || 'Ethereum'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Audit Trail Table */}
            <motion.div variants={itemVariants} className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-slate-200">Blockchain Audit Trail</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm">
                      <th className="py-3 px-4 font-medium">Index</th>
                      <th className="py-3 px-4 font-medium">Timestamp</th>
                      <th className="py-3 px-4 font-medium">Transactions</th>
                      <th className="py-3 px-4 font-medium">Block Hash</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {blocks.map((block) => (
                      <tr key={block.index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-cyan-400 font-mono font-medium">#{block.index}</td>
                        <td className="py-4 px-4 text-slate-300">
                          {new Date(block.timestamp * 1000).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                            {block.transactions.length} Txns
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-3 w-3 text-slate-500" />
                            {block.hash.substring(0, 16)}...
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
