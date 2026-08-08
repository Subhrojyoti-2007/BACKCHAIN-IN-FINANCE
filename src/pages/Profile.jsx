import { motion } from "framer-motion";
import {
  User,
  Wallet,
  ShieldCheck,
  Copy,
  Mail,
  Bell,
  Moon,
  Link,
  Award,
  Activity,
  Coins,
} from "lucide-react";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';





const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.8 }
  }
};

const fadeDownItem = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const preferencesContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 1.2 }
  }
};

const slideUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

function Profile() {
  const { user } = useAuth();
  
  const [txCount, setTxCount] = useState(0);
  const [rank, setRank] = useState('-');
  const [balance, setBalance] = useState('$0.00');

  // Local state for UI preferences
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
        // Fetch blocks to count transactions
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
            setBalance(
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: user?.currency || 'USD',
                maximumFractionDigits: 2
              }).format(userAccount.balance)
            );
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
    ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
    : "0x0000...0000";

  const stats = [
    {
      title: "Wallet Balance",
      value: balance,
      icon: <Coins />,
      initial: { opacity: 0, y: -50 },
    },
    {
      title: "Total Transactions",
      value: txCount.toString(),
      icon: <Activity />,
      initial: { opacity: 0, x: -50 },
    },
    {
      title: "Wallet Status",
      value: user?.is_kyc_verified ? "Verified" : "Unverified",
      icon: <Wallet />,
      initial: { opacity: 0, y: 50 },
    },
    {
      title: "Portfolio Rank",
      value: rank,
      icon: <Award />,
      initial: { opacity: 0, x: 50 },
    },
  ];

  const wallets = [
    {
      name: "Primary Wallet",
      address: displayAddress,
      status: "Connected",
    },
    {
      name: "WalletConnect",
      address: "0x71BC...44DA",
      status: "Connected",
    },
    {
      name: "Coinbase Wallet",
      address: "0x92CD...18FA",
      status: "Connected",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white p-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{opacity:0, y:-30}}
        animate={{opacity:1, y:0}}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">
          User Profile
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your blockchain identity and account preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{opacity:0, y:-20}}
        animate={{opacity:1, y:0}}
        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        whileHover={{scale:1.01}}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <User size={50} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {user?.username || 'Guest'}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-green-400">
              <ShieldCheck size={20}/>
              Verified Wallet
            </div>
            <div className="flex items-center gap-2 mt-3 text-gray-300">
              <Wallet size={18}/>
              {displayAddress}
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Copy size={16} className="cursor-pointer hover:text-cyan-400 transition-colors" />
              </motion.div>
            </div>
            <p className="text-gray-400 mt-2">
              {user?.network || 'Ethereum Mainnet'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item,index)=>(
          <motion.div
            key={index}
            initial={item.initial}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + (index * 0.1), type: "spring", stiffness: 80 }}
            whileHover={{scale:1.05}}
            className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 cursor-pointer transition-colors hover:bg-white/15"
          >
            <div className="text-cyan-400">
              {item.icon}
            </div>
            <p className="text-gray-400 mt-4">
              {item.title}
            </p>
            <h3 className="text-2xl font-bold mt-2">
              {item.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Connected Wallets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <Link className="text-cyan-400"/>
          <h2 className="text-xl font-semibold">
            Connected Wallets
          </h2>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
        {wallets.map((wallet,index)=>(
            <motion.div
              key={index}
              variants={fadeDownItem}
              whileHover={{scale:1.01, backgroundColor: "rgba(255,255,255,0.1)"}}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-4 flex justify-between items-center transition-colors cursor-pointer"
            >
              <div>
                <h3 className="font-semibold">
                  {wallet.name}
                </h3>
                <p className="text-gray-400">
                  {wallet.address}
                </p>
              </div>
              <span className="text-green-400">
                {wallet.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-5">
          Account Preferences
        </h2>

        <motion.div
          variants={preferencesContainer}
          initial="hidden"
          animate="visible"
        >
          <Preference 
            icon={<Mail/>} 
            title="Email Notifications" 
            value={preferences.email ? "ON" : "OFF"} 
            onClick={() => togglePreference('email')}
          />
          <Preference 
            icon={<Bell/>} 
            title="Security Alerts" 
            value={preferences.security ? "ON" : "OFF"} 
            onClick={() => togglePreference('security')}
          />
          <Preference 
            icon={<Moon/>} 
            title="Dark Mode" 
            value={preferences.theme ? "ON" : "OFF"} 
            onClick={() => togglePreference('theme')}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Preference({icon, title, value, onClick}){
  return (
    <motion.div
      variants={slideUpItem}
      onClick={onClick}
      className="flex justify-between items-center rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-4 mb-3 transition-colors hover:bg-white/15 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="text-cyan-400">
          {icon}
        </div>
        <p>
          {title}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-medium ${value === "ON" ? "text-green-400" : "text-gray-400"}`}>
          {value}
        </span>
        <div className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors ${value === "ON" ? "bg-green-500/30" : "bg-gray-600/50"}`}>
          <motion.div 
            className={`w-4 h-4 rounded-full ${value === "ON" ? "bg-green-400" : "bg-gray-400"}`}
            animate={{ x: value === "ON" ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;