import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from '../context/SettingsContext';
import {
  Send,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock
} from "lucide-react";

const securityContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const securityItem = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 90 } }
};

const assetsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const assetItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Payments() {
  const { token, user } = useAuth();
  const { t, formatCurrency, getExchangeRate, getCurrencySymbol } = useSettings();
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("ETH");
  const [statusMsg, setStatusMsg] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (Array.isArray(data)) {
          const otherUsers = data.filter(u => u.address !== user?.address);
          setUsers(otherUsers);
          if (otherUsers.length > 0) {
            setReceiver(otherUsers[0].address);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    if (user?.address) {
      fetchUsers();
    }
  }, [user?.address]);

  const handleSendPayment = async () => {
    setIsSubmitting(true);
    setStatusMsg(null);
    setIsError(false);

    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver,
          amount,
          asset
        })
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMsg(result.message);
        setIsError(false);
        setAmount("");
      } else {
        setStatusMsg(result.error || "Transaction failed.");
        setIsError(true);
      }
    } catch (err) {
      setStatusMsg("Failed to connect to the network.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">{t("Cross-Border Settlement")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Send className="h-8 w-8 text-cyan-400" />
          <span>{t("Payments")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{t("Execute secure B2B transfers with instant finality.")}</p>
      </motion.div>

      {/* Main Payment & Security Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Payment Card */}
        <motion.div 
<<<<<<< HEAD
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 20 }}
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6"
=======
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t("Execute Transfer")}</h2>
              <p className="text-xs text-slate-400">{t("Zero-slippage on-chain transaction")}</p>
            </div>
          </div>

          {statusMsg && (
            <div className={`p-4 rounded-xl mb-5 flex items-center gap-3 text-xs font-semibold ${isError ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'}`}>
              {isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              <p>{statusMsg}</p>
            </div>
          )}

          <div className="mb-5 p-4 rounded-2xl bg-slate-900/90 border border-white/10">
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1">{t("Source Treasury Wallet")}</label>
            <p className="font-mono text-sm font-semibold text-cyan-300">{user?.username} ({user?.address})</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider block mb-2">{t("Recipient Verified Address")}</label>
              <select
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
              >
                {users.length === 0 ? (
                  <option value="" className="bg-slate-950 text-white">{t("Loading verified network participants...")}</option>
                ) : (
                  users.map(u => (
                    <option key={`receiver-${u.address}`} value={u.address} className="bg-slate-950 text-white">
                      {u.username} ({u.address}) {u.is_kyc_verified ? '✅ Verified' : '⚠️ Pending'}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider block mb-2">{t("Asset Rail")}</label>
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                >
                  <option value="ETH" className="bg-slate-950 text-white">Ethereum (ETH)</option>
                  <option value="BTC" className="bg-slate-950 text-white">Bitcoin (BTC)</option>
                  <option value="USDC" className="bg-slate-950 text-white">USDC</option>
                  <option value="AAVE" className="bg-slate-950 text-white">Aave (AAVE)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider block mb-2">{t("Transfer Amount")}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSendPayment}
              disabled={isSubmitting || !amount}
              className="w-full btn-primary font-bold text-sm py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <span>{isSubmitting ? t("Processing Settlement...") : t("Confirm & Broadcast Payment")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Security Checklist Card */}
        <motion.div 
          variants={securityContainer}
          initial="hidden"
          animate="visible"
<<<<<<< HEAD
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6"
=======
          className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t("Security & Audit Rails")}</h2>
                <p className="text-xs text-slate-400">{t("Enforced by smart contract consensus")}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <SecurityItem text={t("Address validated against backend compliance protocol")}/>
              <SecurityItem text={t("ERC-3643 Institutional Identity Verified")}/>
              <SecurityItem text={t("Algorithmic Gas Fee Optimization Enabled")}/>
              <SecurityItem text={t("Smart Contract Re-entrancy Guard Verified")}/>
              <SecurityItem text={t("Instant Settlement Finality Guaranteed")}/>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-3">
            <Lock className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <span>{t("All outgoing transactions require MPC multi-sig authorization before block commit.")}</span>
          </div>
        </motion.div>
      </div>

      {/* Supported Assets Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 mb-8"
=======
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
      >
        <h2 className="text-xl font-bold text-white mb-6">{t("Supported Settlement Assets")}</h2>
        <motion.div 
          variants={assetsContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AssetCard name="Ethereum" symbol="ETH" balance="12.45 ETH" color="text-blue-400" />
          <AssetCard name="Bitcoin" symbol="BTC" balance="2.18 BTC" color="text-amber-400" />
          <AssetCard name="USD Coin" symbol="USDC" balance="18,500 USDC" color="text-cyan-400" />
          <AssetCard name="Aave" symbol="AAVE" balance="85 AAVE" color="text-indigo-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function SecurityItem({ text }) {
  return (
    <motion.div 
      variants={securityItem}
<<<<<<< HEAD
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-4 mb-3 border border-white/5 cursor-default transition-colors hover:bg-black/40"
=======
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-semibold text-slate-200"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
    >
      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
      <span>{text}</span>
    </motion.div>
  );
}

function AssetCard({ name, symbol, balance, color }) {
  return (
    <motion.div 
      variants={assetItem}
<<<<<<< HEAD
      whileHover={{scale:1.05, boxShadow: "0px 10px 30px rgba(34,211,238,0.15)", y: -5}} 
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-5 border border-white/5 cursor-pointer transition-colors hover:bg-black/40"
=======
      whileHover={{ y: -3, borderColor: 'rgba(56,189,248,0.3)' }} 
      className="glass-card rounded-2xl p-5 border border-white/10 group transition-all"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
    >
      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit mb-3">
        <Wallet className={`h-5 w-5 ${color}`} />
      </div>
      <h3 className="font-bold text-white text-base">{name}</h3>
      <p className="text-xs font-mono text-slate-400">{symbol}</p>
      <p className="mt-3 font-mono font-bold text-cyan-300 text-sm">{balance}</p>
    </motion.div>
  );
}

export default Payments;