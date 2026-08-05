<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Users, TrendingUp, ShieldCheck, Activity, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react';
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
                  <Activity className="h-6 w-6 text-magenta-400" />
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
=======
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTerminal = () => {
  const [screen, setScreen] = useState('MAIN_MENU');
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [users, setUsers] = useState([]);
  const inputRef = useRef(null);

  // Focus the input when clicking anywhere on the terminal
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    setInput('');
    setErrorMsg('');

    if (screen === 'MAIN_MENU') {
      if (cmd === '1') setScreen('AUDIT_BLOCKCHAIN');
      else if (cmd === '2') setScreen('VIEW_ACCOUNTS');
      else if (cmd === '3') setScreen('AMM_LIVE_TICKER');
      else if (cmd === '4') window.location.href = '/dashboard';
      else {
        setErrorMsg('[Invalid Input] Please enter a numerical ID between 1 and 4.');
        setTimeout(() => setErrorMsg(''), 2000);
      }
    } else {
      // In other screens, pressing Enter goes back to Main Menu
      setScreen('MAIN_MENU');
    }
  };

  useEffect(() => {
    if (screen === 'AUDIT_BLOCKCHAIN') {
      fetch('/api/blocks')
        .then((res) => res.json())
        .then((data) => setBlocks(data.chain || []))
        .catch(() => setErrorMsg('[Error] Could not connect to API'));
    } else if (screen === 'VIEW_ACCOUNTS') {
      fetch('/api/users')
        .then((res) => res.json())
        .then((data) => setUsers(data || []))
        .catch(() => setErrorMsg('[Error] Could not connect to API'));
    }
  }, [screen]);

  // Render Functions
  const renderMainMenu = () => (
    <div className="flex flex-col gap-2">
      <div className="border border-blue-500 p-4 max-w-md mb-4 text-blue-400 font-bold">
        <p className="text-center mb-2">--- Backchain Admin Dashboard ---</p>
        <p>[1] Audit Blockchain</p>
        <p>[2] View All Accounts</p>
        <p>[3] Live AMM Ticker</p>
        <p>[4] Exit</p>
      </div>
      
      {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
      
      <div className="flex items-center gap-2 text-yellow-400">
        <span>Select an option (1-4): </span>
        <form onSubmit={handleInputSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-yellow-400 font-mono w-full"
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );

  const renderAuditBlockchain = () => {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="border border-cyan-500 p-2 inline-block text-cyan-400 font-bold w-max">
          Blockchain Audit Trail
        </div>
        
        {blocks.length === 0 ? (
          <p className="text-yellow-500">Fetching blocks...</p>
        ) : (
          <table className="w-full max-w-4xl text-left border-collapse">
            <thead>
              <tr className="border-b border-magenta-500 text-magenta-400">
                <th className="py-2 text-cyan-400 text-right pr-4">Index</th>
                <th className="py-2 text-yellow-400">Timestamp</th>
                <th className="py-2 text-right pr-4">Transactions</th>
                <th className="py-2 text-green-400">Hash</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.index} className="border-b border-gray-800">
                  <td className="py-2 text-right pr-4">{b.index}</td>
                  <td className="py-2">{String(b.timestamp).substring(0, 19)}</td>
                  <td className="py-2 text-right pr-4">{b.transactions?.length || 0}</td>
                  <td className="py-2 text-green-400">
                    {b.hash.length > 16 ? b.hash.substring(0, 16) + '...' : b.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form onSubmit={handleInputSubmit} className="mt-8">
          <input 
            ref={inputRef} 
            type="text" 
            className="opacity-0 absolute" 
            autoFocus 
          />
          <button type="submit" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            Press Enter to return to Main Menu...
          </button>
        </form>
      </div>
    );
  };

  const renderViewAccounts = () => {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="border border-cyan-500 p-2 inline-block text-cyan-400 font-bold w-max">
          Registered Accounts
        </div>
        
        {users.length === 0 ? (
          <p className="text-yellow-500">Fetching accounts...</p>
        ) : (
          <table className="w-full max-w-4xl text-left border-collapse">
            <thead>
              <tr className="border-b border-magenta-500 text-magenta-400">
                <th className="py-2 text-green-400">Address</th>
                <th className="py-2 text-cyan-400">Username</th>
                <th className="py-2 text-center text-yellow-400">KYC Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.address} className="border-b border-gray-800">
                  <td className="py-2">{u.address}</td>
                  <td className="py-2">{u.username}</td>
                  <td className="py-2 text-center">
                    {u.is_kyc_verified ? (
                      <span className="text-green-500 font-bold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-bold">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form onSubmit={handleInputSubmit} className="mt-8">
          <input ref={inputRef} type="text" className="opacity-0 absolute" autoFocus />
          <button type="submit" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            Press Enter to return to Main Menu...
          </button>
        </form>
      </div>
    );
  };

  const AMMLiveTicker = () => {
    const [stats, setStats] = useState({
      btc: 64500.00,
      eth: 3400.00,
      height: 1
    });

    useEffect(() => {
      // Initial fetch to get real block height if possible
      fetch('/api/blocks')
        .then(res => res.json())
        .then(data => {
          if (data.chain) setStats(s => ({ ...s, height: data.chain.length }));
        })
        .catch(console.error);

      const interval = setInterval(() => {
        setStats(prev => {
          const btcChange = (Math.random() - 0.5) * 200;
          const ethChange = (Math.random() - 0.5) * 30;
          const newHeight = Math.random() > 0.9 ? prev.height + 1 : prev.height;
          return {
            btc: prev.btc + btcChange,
            eth: prev.eth + ethChange,
            height: newHeight
          };
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="border border-cyan-500 p-2 inline-block text-cyan-400 font-bold w-max mb-2">
          Live AMM & Block Status
        </div>
        <p className="text-gray-500 mb-4">Press Enter to stop the live ticker.</p>

        <div className="border border-blue-500 p-4 inline-block w-max">
          <h3 className="text-blue-400 font-bold text-center mb-4">Live Market & Network Status</h3>
          <table className="w-full min-w-[300px] text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-cyan-400">Asset / Metric</th>
                <th className="py-2 text-green-400 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">BTC/USD</td>
                <td className="py-2 text-right">${stats.btc.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
              <tr>
                <td className="py-2">ETH/USD</td>
                <td className="py-2 text-right">${stats.eth.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
              <tr>
                <td className="py-2">Current Block Height</td>
                <td className="py-2 text-right">{stats.height}</td>
              </tr>
              <tr>
                <td className="py-2">Network Status</td>
                <td className="py-2 text-right text-green-500 font-bold">ONLINE & SYNCED</td>
              </tr>
            </tbody>
          </table>
        </div>

        <form onSubmit={handleInputSubmit} className="mt-8">
          <input ref={inputRef} type="text" className="opacity-0 absolute" autoFocus />
          <button type="submit" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            Press Enter to return to Main Menu...
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-12 font-mono text-gray-300 flex flex-col items-start w-full relative">
      
      {/* Background Grid Pattern (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Back Button */}
      <div className="relative z-10 w-full mb-8 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Exit Terminal
        </Link>
        <div className="text-xs text-gray-600">v1.0.0-rc2</div>
      </div>
      
      {/* Terminal Window */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-[#0a0a0a] rounded-lg border border-[#333] shadow-2xl overflow-hidden relative z-10 flex flex-col h-[70vh]"
        onClick={handleTerminalClick}
      >
        {/* Terminal Header */}
        <div className="h-8 bg-[#1a1a1a] border-b border-[#333] flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="flex-1 text-center text-xs text-gray-500 font-sans tracking-wider">admin@backchain:~</div>
        </div>
        
        {/* Terminal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {screen === 'MAIN_MENU' && renderMainMenu()}
          {screen === 'AUDIT_BLOCKCHAIN' && renderAuditBlockchain()}
          {screen === 'VIEW_ACCOUNTS' && renderViewAccounts()}
          {screen === 'AMM_LIVE_TICKER' && <AMMLiveTicker />}
        </div>
      </motion.div>
>>>>>>> 125501e2df51dfbc45ffea3796d9ba6444166be8
    </div>
  );
};

<<<<<<< HEAD
export default AdminDashboard;
=======
export default AdminTerminal;
>>>>>>> 125501e2df51dfbc45ffea3796d9ba6444166be8
