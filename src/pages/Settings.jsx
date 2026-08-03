import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Wallet,
  Globe,
  DollarSign,
  Lock,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, token, setUser, logout } = useAuth();
  
  const [language, setLanguage] = useState(user?.language || "English");
  const [currency, setCurrency] = useState(user?.currency || "USD");
  const [visibility, setVisibility] = useState(user?.profile_visibility || "Public");
  const [network, setNetwork] = useState(user?.network || "Ethereum Mainnet");
  const [walletConnection, setWalletConnection] = useState(user?.wallet_connection || "Auto Connect ON");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setLanguage(user.language || "English");
      setCurrency(user.currency || "USD");
      setVisibility(user.profile_visibility || "Public");
      setNetwork(user.network || "Ethereum Mainnet");
      setWalletConnection(user.wallet_connection || "Auto Connect ON");
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language,
          currency,
          profile_visibility: visibility,
          network,
          wallet_connection: walletConnection
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // Update context and localStorage
        setSaveStatus("Success");
      } else if (res.status === 401 || res.status === 422) {
        if (typeof logout === 'function') logout();
        setSaveStatus("Session Expired");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setSaveStatus("Error");
      }
    } catch(err) {
      console.error(err);
      setSaveStatus("Error");
    }
    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };
  
  // Cycle functions are removed as we will use proper select dropdowns.

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{opacity:0, y:-30}}
        animate={{opacity:1, y:0}}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="text-cyan-400"/>
          Settings
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your account, wallet and security preferences
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Account Settings */}
        <SettingCard 
          title="Account Settings"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 70 }}
        >
          <SettingItem
            icon={<Globe/>}
            title="Language"
            value={language}
            options={["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Korean", "Hindi", "Arabic", "Portuguese", "Russian", "Italian"]}
            onChange={setLanguage}
          />
          <SettingItem
            icon={<DollarSign/>}
            title="Currency"
            value={currency}
            options={["USD", "EUR", "GBP", "JPY", "ETH", "BTC", "USDC", "USDT", "AUD", "CAD", "CHF", "CNY", "INR"]}
            onChange={setCurrency}
          />
          <SettingItem
            icon={<Shield/>}
            title="Profile Visibility"
            value={visibility}
            options={["Public", "Private", "Friends Only"]}
            onChange={setVisibility}
          />
        </SettingCard>

        {/* Wallet Settings */}
        <SettingCard 
          title="Wallet Settings"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 70 }}
        >
          <SettingItem
            icon={<Wallet/>}
            title="Network"
            value={network}
            options={["Ethereum Mainnet", "Polygon", "Arbitrum", "Optimism", "Solana", "Binance Smart Chain"]}
            onChange={setNetwork}
          />
          <SettingItem
            icon={<CheckCircle/>}
            title="Wallet Connection"
            value={walletConnection}
            options={["Auto Connect ON", "Auto Connect OFF", "Manual Proxy"]}
            onChange={setWalletConnection}
          />
        </SettingCard>

        {/* Notification Settings */}
        <SettingCard 
          title="Notification Settings"
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 70 }}
        >
          <ToggleItem
            icon={<Bell/>}
            title="Transaction Alerts"
            status="ON"
          />
          <ToggleItem
            icon={<Shield/>}
            title="Security Alerts"
            status="ON"
          />
          <ToggleItem
            icon={<Bell/>}
            title="Market Updates"
            status="OFF"
          />
        </SettingCard>

        {/* Security Preferences */}
        <SettingCard 
          title="Security Preferences"
          initial={{ opacity: 0, x: 50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 70 }}
        >
          <SettingItem
            icon={<Lock/>}
            title="Two Factor Authentication"
            value="Enabled"
          />
          <SettingItem
            icon={<Smartphone/>}
            title="Biometric Login"
            value="Enabled"
          />
        </SettingCard>

      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4 mt-8">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{scale:1.05}}
          whileTap={{scale:0.95}}
          className="bg-cyan-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <span className="animate-spin border-2 border-t-transparent border-black rounded-full w-5 h-5"></span>
          ) : "Save Changes"}
        </motion.button>
        {saveStatus === "Success" && (
          <span className="text-green-400 font-medium animate-pulse">Changes saved!</span>
        )}
        {saveStatus === "Error" && (
          <span className="text-red-400 font-medium">Failed to save changes.</span>
        )}
      </div>
    </div>
  );
}

function SettingCard({title, children, initial, animate, transition}){
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={{scale:1.02}}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold mb-5">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function SettingItem({icon, title, value, options, onChange}){
  return (
    <div
      className="flex justify-between items-center bg-black/20 rounded-xl p-4 mb-3 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-cyan-400">
          {icon}
        </div>
        <span>
          {title}
        </span>
      </div>
      {options ? (
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-900 text-green-400 font-medium px-3 py-1.5 rounded-lg border border-white/10 outline-none focus:border-cyan-400 cursor-pointer"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <span className="text-green-400 font-medium">
          {value}
        </span>
      )}
    </div>
  );
}

function ToggleItem({icon, title, status}){
  return (
    <motion.div
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.1)" }}
      className="flex justify-between items-center bg-black/20 rounded-xl p-4 mb-3 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="text-cyan-400">
          {icon}
        </div>
        <span>
          {title}
        </span>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === "ON"
            ? "bg-green-400/20 text-green-400"
            : "bg-gray-400/20 text-gray-400"
        }`}
      >
        {status}
      </div>
    </motion.div>
  );
}

export default Settings;