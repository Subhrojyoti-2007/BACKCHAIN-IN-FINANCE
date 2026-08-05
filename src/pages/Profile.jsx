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
} from "lucide-react";


const wallets = [
  {
    name: "MetaMask",
    address: "0x82AF...91EF",
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


const stats = [
  {
    title: "Total Transactions",
    value: "248",
    icon: <Activity />,
    initial: { opacity: 0, x: -50 },
  },
  {
    title: "Wallet Age",
    value: "14 Months",
    icon: <Wallet />,
    initial: { opacity: 0, y: 50 },
  },
  {
    title: "Portfolio Rank",
    value: "Top 5%",
    icon: <Award />,
    initial: { opacity: 0, x: 50 },
  },
];

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
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <User size={50} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Ava Turner
            </h2>
            <div className="flex items-center gap-2 mt-2 text-green-400">
              <ShieldCheck size={20}/>
              Verified Wallet
            </div>
            <div className="flex items-center gap-2 mt-3 text-gray-300">
              <Wallet size={18}/>
              0x82AF....91EF
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Copy size={16} className="cursor-pointer hover:text-cyan-400 transition-colors" />
              </motion.div>
            </div>
            <p className="text-gray-400 mt-2">
              Ethereum Mainnet
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
      {stats.map((item,index)=>(
          <motion.div
            key={index}
            initial={item.initial}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + (index * 0.1), type: "spring", stiffness: 80 }}
            whileHover={{scale:1.05}}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-colors hover:bg-white/15"
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
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8"
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex justify-between items-center transition-colors cursor-pointer"
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
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-5">
          Account Preferences
        </h2>

        <motion.div
          variants={preferencesContainer}
          initial="hidden"
          animate="visible"
        >
          <Preference icon={<Mail/>} title="Email Notifications" value="ON" />
          <Preference icon={<Bell/>} title="Security Alerts" value="ON" />
          <Preference icon={<Moon/>} title="Dark Mode" value="ON" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Preference({icon,title,value}){
  return (
    <motion.div
      variants={slideUpItem}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.1)" }}
      className="flex justify-between items-center bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-3 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-cyan-400">
          {icon}
        </div>
        <p>
          {title}
        </p>
      </div>
      <span className="text-green-400 font-medium">
        {value}
      </span>
    </motion.div>
  );
}

export default Profile;