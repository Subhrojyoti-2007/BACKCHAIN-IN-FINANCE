import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Database, 
  Users, 
  ShieldCheck, 
  Activity, 
  Link as LinkIcon, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  FileText, 
  LayoutGrid, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminTerminal = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('GUI'); // 'GUI' | 'CLI' | 'LOGS'
  const [loading, setLoading] = useState(true);
  
  // CLI States
  const [cliScreen, setCliScreen] = useState('MAIN_MENU');
  const [cliInput, setCliInput] = useState('');
  const [cliErrorMsg, setCliErrorMsg] = useState('');
  const cliInputRef = useRef(null);

  // GUI Data States
  const [blocks, setBlocks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [ammTicker, setAmmTicker] = useState(null);
  
  // Audit Logs States
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [blocksRes, accountsRes, ammRes, logsRes] = await Promise.all([
        fetch('/api/audit-trail'),
        fetch('/api/accounts'),
        fetch('/api/amm-ticker'),
        fetch('/api/audit-logs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      
      const blocksData = await blocksRes.json();
      const accountsData = await accountsRes.json();
      const ammData = await ammRes.json();
      const logsData = await logsRes.json();

      setBlocks(blocksData.chain || []);
      setAccounts(accountsData || []);
      setAmmTicker(ammData);
      setAuditLogs(logsData || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Fetch Audit Logs when activeTab changes to LOGS
  useEffect(() => {
    if (activeTab === 'LOGS') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const fetchAuditLogs = async () => {
    try {
      setRefreshing(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (actionFilter) queryParams.append('action', actionFilter);
      if (statusFilter) queryParams.append('status', statusFilter);
      
      const res = await fetch(`/api/audit-logs?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data || []);
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to clear all system audit logs?")) {
      try {
        const res = await fetch('/api/audit-logs/clear', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          fetchAuditLogs();
        }
      } catch (err) {
        console.error("Error clearing logs:", err);
      }
    }
  };

  // Focus CLI input when clicking on CLI console
  const handleTerminalClick = () => {
    if (cliInputRef.current) {
      cliInputRef.current.focus();
    }
  };

  const handleCliInputSubmit = (e) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    setCliInput('');
    setCliErrorMsg('');

    if (cliScreen === 'MAIN_MENU') {
      if (cmd === '1') setCliScreen('AUDIT_BLOCKCHAIN');
      else if (cmd === '2') setCliScreen('VIEW_ACCOUNTS');
      else if (cmd === '3') setCliScreen('AMM_LIVE_TICKER');
      else if (cmd === '4') window.location.href = '/dashboard';
      else {
        setCliErrorMsg('[Invalid Input] Please enter a numerical ID between 1 and 4.');
        setTimeout(() => setCliErrorMsg(''), 2000);
      }
    } else {
      setCliScreen('MAIN_MENU');
    }
  };

  // CLI Renderers
  const renderCliMainMenu = () => (
    <div className="flex flex-col gap-2 font-mono">
      <div className="border border-blue-500/30 bg-blue-500/5 p-4 max-w-md mb-4 text-blue-400 font-bold rounded-lg">
        <p className="text-center mb-2">--- Backchain Admin Console ---</p>
        <p>[1] Audit Blockchain</p>
        <p>[2] View All Accounts</p>
        <p>[3] Live AMM Ticker</p>
        <p>[4] Exit Terminal</p>
      </div>
      
      {cliErrorMsg && <div className="text-red-500 mb-2">{cliErrorMsg}</div>}
      
      <div className="flex items-center gap-2 text-yellow-400">
        <span>Select an option (1-4): </span>
        <form onSubmit={handleCliInputSubmit} className="flex-1">
          <input
            ref={cliInputRef}
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            className="bg-transparent border-none outline-none text-yellow-400 font-mono w-full"
            autoFocus
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );

  const renderCliAuditBlockchain = () => (
    <div className="flex flex-col gap-4 w-full font-mono">
      <div className="border border-cyan-500/30 bg-cyan-500/5 p-2 inline-block text-cyan-400 font-bold w-max rounded">
        Blockchain Audit Trail
      </div>
      
      {blocks.length === 0 ? (
        <p className="text-yellow-500">Fetching blocks...</p>
      ) : (
        <table className="w-full max-w-4xl text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 text-cyan-400 text-right pr-4">Index</th>
              <th className="py-2 text-yellow-400">Timestamp</th>
              <th className="py-2 text-right pr-4">Transactions</th>
              <th className="py-2 text-green-400">Hash</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.index} className="border-b border-slate-900 hover:bg-white/5">
                <td className="py-2 text-right pr-4">{b.index}</td>
                <td className="py-2">{new Date(b.timestamp * 1000).toLocaleString()}</td>
                <td className="py-2 text-right pr-4">{b.transactions?.length || 0}</td>
                <td className="py-2 text-green-400">
                  {b.hash.length > 16 ? b.hash.substring(0, 16) + '...' : b.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={handleCliInputSubmit} className="mt-8">
        <input ref={cliInputRef} type="text" className="opacity-0 absolute" autoFocus />
        <button type="submit" className="text-slate-500 hover:text-white transition-colors cursor-pointer text-xs">
          Press Enter to return to Main Menu...
        </button>
      </form>
    </div>
  );

  const renderCliViewAccounts = () => (
    <div className="flex flex-col gap-4 w-full font-mono">
      <div className="border border-cyan-500/30 bg-cyan-500/5 p-2 inline-block text-cyan-400 font-bold w-max rounded">
        Registered Accounts
      </div>
      
      {accounts.length === 0 ? (
        <p className="text-yellow-500">Fetching accounts...</p>
      ) : (
        <table className="w-full max-w-4xl text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 text-green-400">Address</th>
              <th className="py-2 text-cyan-400">Username</th>
              <th className="py-2 text-center text-yellow-400">KYC Verified</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((u) => (
              <tr key={u.address} className="border-b border-slate-900 hover:bg-white/5">
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

      <form onSubmit={handleCliInputSubmit} className="mt-8">
        <input ref={cliInputRef} type="text" className="opacity-0 absolute" autoFocus />
        <button type="submit" className="text-slate-500 hover:text-white transition-colors cursor-pointer text-xs">
          Press Enter to return to Main Menu...
        </button>
      </form>
    </div>
  );

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 pt-24 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
              <ArrowLeft className="h-5 w-5 text-cyan-400" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Admin Panel
              </h1>
              <p className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> System Level Access Granted
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-950/80 border border-white/10 p-1 rounded-xl self-start md:self-auto shadow-md">
            <button
              onClick={() => setActiveTab('GUI')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'GUI' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>GUI Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('CLI')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'CLI' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>CLI Console</span>
            </button>
            <button
              onClick={() => setActiveTab('LOGS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'LOGS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {loading && activeTab !== 'LOGS' ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* GUI DASHBOARD TAB */}
            {activeTab === 'GUI' && (
              <motion.div 
                key="gui"
                variants={containerVariants} 
                initial="hidden" 
                animate="visible"
                exit="hidden"
                className="flex flex-col gap-6"
              >
                {/* AMM Ticker Marquee */}
                {ammTicker && (
                  <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                      <Activity className="h-6 w-6 text-cyan-400" />
                      <h2 className="text-lg font-semibold text-slate-200">Live AMM Ticker</h2>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-400 font-medium">{ammTicker.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-slate-400 text-xs mb-1 font-medium">BTC / USD</p>
                        <p className="text-xl font-bold text-yellow-400">${ammTicker.btc_price?.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-slate-400 text-xs mb-1 font-medium">ETH / USD</p>
                        <p className="text-xl font-bold text-indigo-400">${ammTicker.eth_price?.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-slate-400 text-xs mb-1 font-medium">SOL / USD</p>
                        <p className="text-xl font-bold text-emerald-400">${ammTicker.sol_price?.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-slate-400 text-xs mb-1 font-medium">24H Volume</p>
                        <p className="text-xl font-bold text-cyan-400">{ammTicker.volume_24h}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Accounts Grid */}
                  <motion.div variants={itemVariants} className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="h-5 w-5 text-blue-400" />
                      <h2 className="text-lg font-semibold text-slate-200">Accounts ({accounts.length})</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-thin">
                      {accounts.map((acc, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-slate-100">{acc.username}</span>
                            {acc.is_kyc_verified ? (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">KYC</span>
                            ) : (
                              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold font-mono">UNVERIFIED</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono break-all bg-black/40 px-2 py-1 rounded">
                            {acc.address}
                          </span>
                          <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5 text-xs">
                            <span className="text-slate-400">Bal: <strong className="text-cyan-400">${acc.balance?.toLocaleString()}</strong></span>
                            <span className="text-[10px] text-slate-500">{acc.network || 'Ethereum'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Audit Trail Table */}
                  <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 mb-6">
                      <Database className="h-5 w-5 text-cyan-400" />
                      <h2 className="text-lg font-semibold text-slate-200">Blockchain Audit Trail</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-thin">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 text-xs">
                            <th className="py-2.5 px-3 font-medium">Index</th>
                            <th className="py-2.5 px-3 font-medium">Timestamp</th>
                            <th className="py-2.5 px-3 font-medium">Txns</th>
                            <th className="py-2.5 px-3 font-medium">Block Hash</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          {blocks.map((block) => (
                            <tr key={block.index} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-3 text-cyan-400 font-mono font-semibold">#{block.index}</td>
                              <td className="py-3 px-3 text-slate-300">
                                {new Date(block.timestamp * 1000).toLocaleString()}
                              </td>
                              <td className="py-3 px-3">
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                  {block.transactions?.length || 0} Txns
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                                <div className="flex items-center gap-1">
                                  <LinkIcon className="h-3 w-3 text-slate-500" />
                                  {block.hash?.substring(0, 16)}...
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* CLI TERMINAL TAB */}
            {activeTab === 'CLI' && (
              <motion.div 
                key="cli"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full bg-black rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[65vh]"
                onClick={handleTerminalClick}
              >
                <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <div className="flex-1 text-center text-[10px] text-slate-500 font-mono tracking-wider">admin@backchain:~</div>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 font-mono text-slate-300">
                  {cliScreen === 'MAIN_MENU' && renderCliMainMenu()}
                  {cliScreen === 'AUDIT_BLOCKCHAIN' && renderCliAuditBlockchain()}
                  {cliScreen === 'VIEW_ACCOUNTS' && renderCliViewAccounts()}
                  {cliScreen === 'AMM_LIVE_TICKER' && (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="border border-cyan-500/30 bg-cyan-500/5 p-2 inline-block text-cyan-400 font-bold w-max rounded">
                        Live AMM Status
                      </div>
                      <p className="text-xs text-slate-500">Press Enter to return to main menu.</p>
                      
                      <div className="border border-blue-500/30 p-4 inline-block w-max rounded-lg">
                        <table className="text-left text-sm min-w-[280px]">
                          <tbody>
                            <tr>
                              <td className="py-1 text-cyan-400">BTC/USD</td>
                              <td className="py-1 text-right text-yellow-400 font-bold">${ammTicker?.btc_price?.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-1 text-cyan-400">ETH/USD</td>
                              <td className="py-1 text-right text-indigo-400 font-bold">${ammTicker?.eth_price?.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td className="py-1 text-cyan-400">Block Height</td>
                              <td className="py-1 text-right text-slate-100 font-bold">{blocks.length}</td>
                            </tr>
                            <tr>
                              <td className="py-1 text-cyan-400">Status</td>
                              <td className="py-1 text-right text-green-500 font-bold">ONLINE</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <form onSubmit={handleCliInputSubmit}>
                        <input ref={cliInputRef} type="text" className="opacity-0 absolute" autoFocus />
                      </form>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* AUDIT LOGS TAB */}
            {activeTab === 'LOGS' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
              >
                {/* Search and Filters Bar */}
                <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by user, action, details, or IP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchAuditLogs()}
                      className="w-full bg-slate-950 border border-white/10 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all"
                    />
                  </div>

                  {/* Dropdown Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Action Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-white/10 px-2 py-1 rounded-xl">
                      <Filter className="h-3.5 w-3.5 text-slate-400" />
                      <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="bg-transparent border-none text-slate-300 text-xs focus:outline-none pr-4 cursor-pointer py-1 font-semibold"
                      >
                        <option value="">All Actions</option>
                        <option value="LOGIN">Login</option>
                        <option value="LOGOUT">Logout</option>
                        <option value="FAILED_LOGIN">Failed Login</option>
                        <option value="REGISTER">Register</option>
                        <option value="KYC_VERIFICATION">KYC Verified</option>
                        <option value="SETTINGS_UPDATE">Profile Update</option>
                        <option value="TRANSACTION">Transaction</option>
                        <option value="ADD_BALANCE">Add Balance</option>
                        <option value="ADMIN_ACTION">Admin Actions</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-white/10 px-2 py-1 rounded-xl">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent border-none text-slate-300 text-xs focus:outline-none pr-4 cursor-pointer py-1 font-semibold"
                      >
                        <option value="">All Statuses</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                        <option value="WARNING">Warning</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={fetchAuditLogs}
                      disabled={refreshing}
                      className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                      title="Refresh logs"
                    >
                      <RefreshCw className={`h-4 w-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={handleClearLogs}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      title="Clear audit trail"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear Trail</span>
                    </button>
                  </div>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto max-h-[60vh] scrollbar-thin">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-950 z-20 border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Timestamp</th>
                          <th className="py-3 px-4 font-semibold">User</th>
                          <th className="py-3 px-4 font-semibold">Action</th>
                          <th className="py-3 px-4 font-semibold">Details</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-white/5 text-slate-300">
                        {auditLogs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-500">
                              No matching audit events found.
                            </td>
                          </tr>
                        ) : (
                          auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                                {new Date(log.timestamp * 1000).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-200">
                                {log.user}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full font-mono font-semibold bg-slate-950 border border-white/10 text-[10px] text-cyan-400">
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-300 max-w-sm truncate" title={log.details}>
                                {log.details}
                              </td>
                              <td className="py-3 px-4">
                                {log.status === 'SUCCESS' ? (
                                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Success</span>
                                  </span>
                                ) : log.status === 'FAILED' ? (
                                  <span className="flex items-center gap-1 text-red-400 font-semibold">
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span>Failed</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    <span>Warning</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-400">
                                {log.ip_address}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminTerminal;
