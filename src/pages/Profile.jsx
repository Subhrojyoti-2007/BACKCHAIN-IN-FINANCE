import { motion } from "framer-motion";
import {
  User,
  Wallet,
  ShieldCheck,
  Copy,
  Mail,
  Bell,
  Moon,
  LinkIcon,
  Award,
  Activity,
  Coins,
  PlusCircle,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const slideUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90 } }
};

function Profile() {
  const { user, token } = useAuth();
  const { t, formatCurrency } = useSettings();
  
  const [txCount, setTxCount] = useState(0);
  const [rank, setRank] = useState('-');
  const [balance, setBalance] = useState('$0.00');
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddFunds = async () => {
    const amountStr = prompt(t("Enter amount to add to your treasury balance ($):"));
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return alert(t("Invalid amount"));
    
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert(t("Failed to load Razorpay SDK. Check your connection."));
        return;
      }

      // 1. Create Order on Backend
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      
      if (!res.ok) {
        alert(t("Failed to create order"));
        return;
      }
      
      const orderData = await res.json();
      
      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.razorpay_key_id, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: t("BLOCKCHAIN IN FINANCE"),
        description: t("Add Funds"),
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                amount: amount,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            if (verifyRes.ok) {
              alert(t("Successfully added funds to your Treasury Balance!"));
              window.location.reload();
            } else {
              alert(t("Payment verification failed."));
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert(t("Payment verification error."));
          }
        },
        prefill: {
          name: user?.username || "User",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#0b5c46"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(t("Payment Failed: ") + response.error.description);
      });
      rzp1.open();

    } catch (e) {
      console.error(e);
      alert(t("Error connecting to server"));
    }
  };

  const [preferences, setPreferences] = useState({
    email: localStorage.getItem('pref_email') !== 'false',
    security: localStorage.getItem('pref_security') !== 'false',
    theme: localStorage.getItem('pref_theme') !== 'false'
  });

  const togglePreference = (key) => {
    setPreferences(prev => {
      const newValue = !prev[key];
      localStorage.setItem(`pref_${key}`, newValue);
      return { ...prev, [key]: newValue };
    });
  };
  
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const blocksRes = await fetch('/api/blocks');
        if (blocksRes.ok) {
          const blocksData = await blocksRes.json();
          let count = 0;
          blocksData.chain.forEach(block => {
            block.transactions.forEach(tx => {
              if (tx.sender === user?.address || tx.receiver === user?.address) {
                count++;
              }
            });
          });
          setTxCount(count);
        }
        
        const accountsRes = await fetch('/api/accounts');
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json();
          const userAccount = accountsData.find(a => a.address === user?.address);
          if (userAccount) {
            setBalance(formatCurrency(userAccount.balance));
          }
          
          accountsData.sort((a, b) => b.balance - a.balance);
          const index = accountsData.findIndex(a => a.address === user?.address);
          if (index !== -1) {
            setRank(`#${index + 1} of ${accountsData.length}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch real data", err);
      }
    };
    
    if (user?.address) {
      fetchRealData();
    }
  }, [user?.address]);

  const displayAddress = user?.address 
    ? `${user.address.slice(0, 8)}...${user.address.slice(-6)}`
    : "0x0000...0000";

  const stats = [
    {
      title: t("Treasury Balance"),
      value: balance,
      icon: Coins,
      color: "text-cyan-400",
      action: <button title={t("Deposit Capital")} onClick={(e) => { e.stopPropagation(); handleAddFunds(); }} className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors"><PlusCircle size={20} /></button>
    },
    {
      title: t("Ledger Transactions"),
      value: txCount.toString(),
      icon: Activity,
      color: "text-blue-400"
    },
    {
      title: t("Identity Status"),
      value: user?.is_kyc_verified ? t("ERC-3643 Verified") : t("Unverified"),
      icon: Wallet,
      color: "text-emerald-400"
    },
    {
      title: t("Portfolio Rank"),
      value: rank,
      icon: Award,
      color: "text-indigo-400"
    },
  ];

  const wallets = [
    {
      name: t("Primary Institutional Vault"),
      address: displayAddress,
      status: t("Connected & Active"),
    },
    {
      name: t("Hardware Signer (Ledger)"),
      address: "0x71BC...44DA",
      status: t("Verified"),
    },
    {
      name: t("Coinbase Prime Custody"),
      address: "0x92CD...18FA",
      status: t("Connected"),
    },
  ];

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
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">{t("Account Identity")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <User className="h-8 w-8 text-cyan-400" />
          <span>{t("Profile")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{t("Manage institutional credentials, multi-sig signers, and notification settings.")}</p>
      </motion.div>

      {/* Profile Identity Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-2xl shadow-lg">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'G'}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.username || 'Institutional Trader'}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mt-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>ERC-3643 Institutional Identity Verified</span>
                </div>
              </div>

              <button 
                onClick={handleAddFunds}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 self-center sm:self-auto"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{t("Deposit Capital")}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs font-mono text-slate-300 justify-center sm:justify-start">
              <Wallet className="h-4 w-4 text-cyan-400" />
              <span>{user?.address || "0x000000000000000000000000"}</span>
              <button 
                onClick={handleCopyAddress}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Copy Address"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              {copied && <span className="text-emerald-400 text-[11px]">Copied!</span>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -3, borderColor: 'rgba(56,189,248,0.3)' }}
              className="glass-card rounded-2xl p-6 border border-white/10 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit mb-3">
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.title}</p>
              <div className="text-2xl font-extrabold text-white font-mono mt-2 flex items-center">
                <span>{item.value}</span>
                {item.action && item.action}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Connected Signers / Wallets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t("Authorized Multi-Sig Signers")}</h2>
            <p className="text-xs text-slate-400">{t("Connected hardware wallets & prime custody addresses")}</p>
          </div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {wallets.map((wallet, index) => (
            <motion.div
              key={index}
              variants={slideUpItem}
              whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center transition-all font-mono text-xs sm:text-sm"
            >
              <div>
                <h3 className="font-bold text-white">{wallet.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{wallet.address}</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {wallet.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
      >
        <h2 className="text-xl font-bold text-white mb-6">{t("Account Preferences")}</h2>

        <div className="space-y-3">
          <Preference 
            icon={<Mail className="h-4 w-4 text-cyan-400" />} 
            title={t("Institutional Email Alerts")} 
            value={preferences.email ? "ON" : "OFF"} 
            onClick={() => togglePreference('email')}
          />
          <Preference 
            icon={<Bell className="h-4 w-4 text-cyan-400" />} 
            title={t("Real-Time Security Advisories")} 
            value={preferences.security ? "ON" : "OFF"} 
            onClick={() => togglePreference('security')}
          />
          <Preference 
            icon={<Moon className="h-4 w-4 text-cyan-400" />} 
            title={t("Dark Mode UI Aesthetic")} 
            value={preferences.theme ? "ON" : "OFF"} 
            onClick={() => togglePreference('theme')}
          />
        </div>
      </motion.div>
    </div>
  );
}

function Preference({ icon, title, value, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer text-xs sm:text-sm font-semibold"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <p className="text-white">{title}</p>
      </div>

      <div className="flex items-center gap-3 font-mono">
        <span className={value === "ON" ? "text-emerald-400 font-bold" : "text-slate-500"}>
          {value}
        </span>
        <div className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors ${value === "ON" ? "bg-cyan-500/30 border border-cyan-500/50" : "bg-slate-800 border border-white/10"}`}>
          <motion.div 
            className={`w-4 h-4 rounded-full ${value === "ON" ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "bg-slate-500"}`}
            animate={{ x: value === "ON" ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;