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
    </div>
  );
};

export default AdminTerminal;
