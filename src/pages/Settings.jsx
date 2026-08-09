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
  CheckCircle2,
  Save,
  Check,
  Clock,
  SlidersHorizontal,
  Key
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from '../context/SettingsContext';

function Settings() {
  const { user, token, setUser, logout } = useAuth();
  const { t } = useSettings();
  
  // State for Account & Network Settings
  const [language, setLanguage] = useState(user?.language || "English");
  const [currency, setCurrency] = useState(user?.currency || "USD");
  const [visibility, setVisibility] = useState(user?.profile_visibility || "Public");
  const [network, setNetwork] = useState(user?.network || "Ethereum Mainnet");
  const [walletConnection, setWalletConnection] = useState(user?.wallet_connection || "Auto Connect ON");

  // State for Security Credentials
  const [hardwareMfa, setHardwareMfa] = useState(user?.hardware_mfa || "Enabled");
  const [passkeyBiometrics, setPasskeyBiometrics] = useState(user?.passkey_biometrics || "Enabled");
  const [sessionTimeout, setSessionTimeout] = useState(user?.session_timeout || "30 Minutes");
  const [txThreshold, setTxThreshold] = useState(user?.tx_threshold || "$1,000 Threshold");

  // State for Alert Channels Toggles
  const [settlementAlerts, setSettlementAlerts] = useState(user?.settlement_alerts || "ON");
  const [threatAdvisories, setThreatAdvisories] = useState(user?.threat_advisories || "ON");
  const [yieldUpdates, setYieldUpdates] = useState(user?.yield_updates || "OFF");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setLanguage(user.language || "English");
      setCurrency(user.currency || "USD");
      setVisibility(user.profile_visibility || "Public");
      setNetwork(user.network || "Ethereum Mainnet");
      setWalletConnection(user.wallet_connection || "Auto Connect ON");
      setHardwareMfa(user.hardware_mfa || "Enabled");
      setPasskeyBiometrics(user.passkey_biometrics || "Enabled");
      setSettlementAlerts(user.settlement_alerts || "ON");
      setThreatAdvisories(user.threat_advisories || "ON");
      setYieldUpdates(user.yield_updates || "OFF");
      setSessionTimeout(user.session_timeout || "30 Minutes");
      setTxThreshold(user.tx_threshold || "$1,000 Threshold");
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
          wallet_connection: walletConnection,
          hardware_mfa: hardwareMfa,
          passkey_biometrics: passkeyBiometrics,
          settlement_alerts: settlementAlerts,
          threat_advisories: threatAdvisories,
          yield_updates: yieldUpdates,
          session_timeout: sessionTimeout,
          tx_threshold: txThreshold
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
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
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <div className="min-h-screen text-slate-100 space-y-6 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">{t("System Configuration")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-cyan-400" />
              <span>{t("Settings")}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t("Manage global preferences and institutional security policies.")}</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Account Defaults */}
        <SettingCard title={t("Account Defaults")}>
          <SettingItem
            icon={<Globe className="h-4 w-4 text-cyan-400" />}
            title={t("Interface Language")}
            value={language}
            options={["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Korean", "Hindi", "Arabic", "Portuguese", "Russian", "Italian"]}
            onChange={setLanguage}
          />
          <SettingItem
            icon={<DollarSign className="h-4 w-4 text-cyan-400" />}
            title={t("Base Reporting Currency")}
            value={currency}
            options={["USD", "EUR", "GBP", "JPY", "ETH", "BTC", "USDC", "USDT", "AUD", "CAD", "CHF", "CNY", "INR"]}
            onChange={setCurrency}
          />
          <SettingItem
            icon={<Shield className="h-4 w-4 text-cyan-400" />}
            title={t("Identity Visibility")}
            value={visibility}
            options={["Public", "Private", "Institutional Verified Only"]}
            onChange={setVisibility}
          />
        </SettingCard>

        {/* Network & Wallet Settings */}
        <SettingCard title={t("Subnet & Multi-Sig Rails")}>
          <SettingItem
            icon={<Wallet className="h-4 w-4 text-cyan-400" />}
            title={t("Primary Subnet Network")}
            value={network}
            options={["Ethereum Mainnet", "Polygon", "Arbitrum", "Optimism", "Solana", "Binance Smart Chain"]}
            onChange={setNetwork}
          />
          <SettingItem
            icon={<CheckCircle2 className="h-4 w-4 text-cyan-400" />}
            title={t("Signer Handshake Mode")}
            value={walletConnection}
            options={["Auto Connect ON", "Auto Connect OFF", "Manual Proxy"]}
            onChange={setWalletConnection}
          />
        </SettingCard>

        {/* Alert Channels (Interactive Toggles) */}
        <SettingCard title={t("Alert Channels")}>
          <InteractiveToggleItem
            icon={<Bell className="h-4 w-4 text-cyan-400" />}
            title={t("On-Chain Settlement Broadcasts")}
            status={settlementAlerts}
            onToggle={() => setSettlementAlerts(prev => prev === "ON" ? "OFF" : "ON")}
          />
          <InteractiveToggleItem
            icon={<Shield className="h-4 w-4 text-cyan-400" />}
            title={t("Vault Threat & Risk Advisories")}
            status={threatAdvisories}
            onToggle={() => setThreatAdvisories(prev => prev === "ON" ? "OFF" : "ON")}
          />
          <InteractiveToggleItem
            icon={<Bell className="h-4 w-4 text-cyan-400" />}
            title={t("Liquidity Yield Updates")}
            status={yieldUpdates}
            onToggle={() => setYieldUpdates(prev => prev === "ON" ? "OFF" : "ON")}
          />
        </SettingCard>

        {/* Security Credentials & Options */}
        <SettingCard title={t("Security Credentials & Policy Options")}>
          <SettingItem
            icon={<Lock className="h-4 w-4 text-cyan-400" />}
            title={t("Hardware Multi-Factor Auth")}
            value={hardwareMfa}
            options={["Enabled", "Disabled", "Hardware Key Required", "Require PIN"]}
            onChange={setHardwareMfa}
          />
          <SettingItem
            icon={<Smartphone className="h-4 w-4 text-cyan-400" />}
            title={t("Passkey Biometric Login")}
            value={passkeyBiometrics}
            options={["Enabled", "Disabled", "Touch ID / Face ID", "Strict Prompt"]}
            onChange={setPasskeyBiometrics}
          />
          <SettingItem
            icon={<Clock className="h-4 w-4 text-cyan-400" />}
            title={t("Session Timeout")}
            value={sessionTimeout}
            options={["15 Minutes", "30 Minutes", "1 Hour", "4 Hours", "Never"]}
            onChange={setSessionTimeout}
          />
          <SettingItem
            icon={<SlidersHorizontal className="h-4 w-4 text-cyan-400" />}
            title={t("2FA Transaction Threshold")}
            value={txThreshold}
            options={["Always Require", "$1,000 Threshold", "$10,000 Threshold", "Disabled"]}
            onChange={setTxThreshold}
          />
        </SettingCard>
      </div>

      {/* Save Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        >
          {isSaving ? (
            <span className="animate-pulse">{t("Saving...")}</span>
          ) : saveStatus === "Success" ? (
            <><Check className="h-4 w-4" /> {t("Saved!")}</>
          ) : saveStatus === "Session Expired" ? (
            <span>{t("Session Expired")}</span>
          ) : (
            <><Save className="h-4 w-4" /> {t("Save Changes")}</>
          )}
        </button>

        {saveStatus === "Success" && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold animate-fadeIn">
            <Check className="h-4 w-4" />
            <span>Preferences updated and saved to server!</span>
          </div>
        )}
        {saveStatus === "Error" && (
          <span className="text-xs font-mono text-rose-400 font-semibold">Failed to save settings. Please retry.</span>
        )}
      </motion.div>
    </div>
  );
}

function SettingCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ borderColor: 'rgba(56,189,248,0.25)' }}
      className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 transition-all"
    >
      <h2 className="text-xl font-bold text-white mb-6">
        {title}
      </h2>
      <div className="space-y-3.5">
        {children}
      </div>
    </motion.div>
  );
}

function SettingItem({ icon, title, value, options, onChange }) {
  return (
    <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 transition-all text-xs sm:text-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <span className="font-semibold text-slate-200">
          {title}
        </span>
      </div>
      {options ? (
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-900 text-cyan-300 font-mono font-semibold text-xs px-3.5 py-2 rounded-xl border border-white/15 outline-none focus:border-cyan-500 cursor-pointer hover:bg-slate-800 transition-colors"
        >
          {options.map(opt => <option key={opt} value={opt} className="bg-slate-950 text-white">{opt}</option>)}
        </select>
      ) : (
        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          {value}
        </span>
      )}
    </div>
  );
}

function InteractiveToggleItem({ icon, title, status, onToggle }) {
  const isOn = status === "ON";
  return (
    <div 
      onClick={onToggle}
      className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 transition-all text-xs sm:text-sm cursor-pointer hover:bg-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <span className="font-semibold text-slate-200">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-3 font-mono">
        <span className={isOn ? "text-emerald-400 font-bold text-xs" : "text-slate-500 text-xs font-semibold"}>
          {status}
        </span>
        <div className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors ${isOn ? "bg-cyan-500/30 border border-cyan-500/50" : "bg-slate-800 border border-white/10"}`}>
          <motion.div 
            className={`w-4 h-4 rounded-full ${isOn ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "bg-slate-500"}`}
            animate={{ x: isOn ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;