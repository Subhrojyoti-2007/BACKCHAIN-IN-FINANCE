import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  History,
  ShieldAlert,
  Users,
  Network
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuditLogs() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Stats summary derived from current logs
  const [stats, setStats] = useState({
    total: 0,
    failed: 0,
    activeUsers: 0,
    activeIps: 0
  });

  const fetchAuditLogs = async () => {
    try {
      if (!refreshing) setLoading(true);
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
        
        // Calculate basic statistics from logs
        const uniqueUsers = new Set(data.map(log => log.user));
        const uniqueIps = new Set(data.map(log => log.ip_address));
        const failedLogs = data.filter(log => log.status === 'FAILED');
        
        setStats({
          total: data.length,
          failed: failedLogs.length,
          activeUsers: uniqueUsers.size,
          activeIps: uniqueIps.size
        });
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAuditLogs();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
            <History className="h-8 w-8 text-cyan-400" />
            <span>Audit Logs</span>
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Authorized Administrator Access only
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/terminal" className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all">
            Open Terminal Panel
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/25 rounded-xl">
            <History className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Total Events</p>
            <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Security Warnings</p>
            <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-xl">
            <Users className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Unique Users</p>
            <p className="text-2xl font-bold text-slate-100">{stats.activeUsers}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl">
            <Network className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium">Unique IPs</p>
            <p className="text-2xl font-bold text-slate-100">{stats.activeIps}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter and Search controls */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs by keyword, user, action, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all"
          />
        </form>

        {/* Dropdowns */}
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
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="FAILED_LOGIN">FAILED_LOGIN</option>
              <option value="REGISTER">REGISTER</option>
              <option value="KYC_VERIFICATION">KYC_VERIFICATION</option>
              <option value="SETTINGS_UPDATE">SETTINGS_UPDATE</option>
              <option value="TRANSACTION">TRANSACTION</option>
              <option value="ADD_BALANCE">ADD_BALANCE</option>
              <option value="ADMIN_ACTION">ADMIN_ACTION</option>
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
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="WARNING">WARNING</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => { setRefreshing(true); fetchAuditLogs(); }}
            disabled={refreshing}
            className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`h-4 w-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Clear all logs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Trail</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                      <span>Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
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
    </div>
  );
}
