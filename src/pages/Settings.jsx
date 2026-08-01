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

function Settings() {
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
            value="English"
          />
          <SettingItem
            icon={<DollarSign/>}
            title="Currency"
            value="USD"
          />
          <SettingItem
            icon={<Shield/>}
            title="Profile Visibility"
            value="Public"
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
            value="Ethereum Mainnet"
          />
          <SettingItem
            icon={<CheckCircle/>}
            title="Wallet Connection"
            value="Auto Connect ON"
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
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        className="mt-8 bg-cyan-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-cyan-400 transition-colors"
      >
        Save Changes
      </motion.button>
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

function SettingItem({icon, title, value}){
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
      <span className="text-green-400 font-medium">
        {value}
      </span>
    </motion.div>
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