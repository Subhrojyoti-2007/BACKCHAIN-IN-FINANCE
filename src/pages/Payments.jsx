import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Send,
  Wallet,
  ShieldCheck,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";

const securityContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const securityItem = {
  hidden: { opacity: 0, x: 30, y: -30 }, // Slide from top right
  visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const assetsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.6 }
  }
};

const assetItem = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

function Payments() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("ETH");
  const [statusMsg, setStatusMsg] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch users for the demo
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
        if (data.length > 0) {
          setReceiver(data[0].address);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

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
    <div className="min-h-screen bg-transparent text-white p-6 overflow-hidden">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-3xl font-bold">Crypto Payments</h1>
        <p className="text-gray-400 mt-2">Send, receive and manage blockchain transactions securely</p>
      </motion.div>

      {/* Payment Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Send Payment */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 20 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Send className="text-cyan-400"/>
            <h2 className="text-xl font-semibold">Send Payment</h2>
          </div>

          {statusMsg && (
            <div className={`p-4 rounded-xl mb-5 flex items-center gap-3 ${isError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              {isError ? <AlertCircle /> : <CheckCircle />}
              <p>{statusMsg}</p>
            </div>
          )}

          <div className="mb-5 p-4 rounded-xl bg-black/30 border border-white/5">
            <label className="text-gray-400 text-sm block mb-1">From Wallet</label>
            <p className="font-medium text-white">{user?.username} ({user?.address})</p>
          </div>

          <label className="text-gray-400">Recipient Wallet Address</label>
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full mt-2 mb-5 p-3 rounded-xl bg-black/30 outline-none text-white focus:ring-2 focus:ring-cyan-500 transition-shadow"
          >
            {users.map(u => (
              <option key={`receiver-${u.address}`} value={u.address}>
                {u.username} ({u.address}) {u.is_kyc_verified ? '✅ KYC' : '❌ No KYC'}
              </option>
            ))}
          </select>

          <label className="text-gray-400">Select Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full mt-2 mb-5 p-3 rounded-xl bg-black/30 outline-none text-white focus:ring-2 focus:ring-cyan-500 transition-shadow"
          >
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="USDC">USDC</option>
            <option value="AAVE">AAVE</option>
          </select>

          <label className="text-gray-400">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1.5"
            className="w-full mt-2 mb-6 p-3 rounded-xl bg-black/30 outline-none text-white focus:ring-2 focus:ring-cyan-500 transition-shadow"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendPayment}
            disabled={isSubmitting || !amount}
            className="w-full bg-cyan-500 text-black font-bold p-3 rounded-xl hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Send Payment"}
          </motion.button>
        </motion.div>

        {/* Security Card */}
        <motion.div 
          variants={securityContainer}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
        >
          <motion.div variants={securityItem} className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-green-400"/>
            <h2 className="text-xl font-semibold">Transaction Security</h2>
          </motion.div>
          <SecurityItem text="Wallet address verified via backend"/>
          <SecurityItem text="ERC-3643 KYC Compliance Enforced"/>
          <SecurityItem text="Gas fee optimized"/>
          <SecurityItem text="Smart contract protected"/>
        </motion.div>
      </div>

      {/* Assets */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-5">Supported Assets</h2>
        <motion.div 
          variants={assetsContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-5"
        >
          <AssetCard name="Ethereum" symbol="ETH" balance="12.45 ETH" />
          <AssetCard name="Bitcoin" symbol="BTC" balance="2.18 BTC" />
          <AssetCard name="USD Coin" symbol="USDC" balance="18,500 USDC" />
          <AssetCard name="Aave" symbol="AAVE" balance="85 AAVE" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function SecurityItem({text}) {
  return (
    <motion.div 
      variants={securityItem}
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-3 border border-white/5 cursor-default transition-colors hover:bg-black/40"
    >
      <CheckCircle className="text-green-400"/>
      <p>{text}</p>
    </motion.div>
  );
}

function AssetCard({name, symbol, balance}) {
  return (
    <motion.div 
      variants={assetItem}
      whileHover={{scale:1.05, boxShadow: "0px 10px 30px rgba(34,211,238,0.15)", y: -5}} 
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/5 cursor-pointer transition-colors hover:bg-black/40"
    >
      <Wallet className="text-cyan-400"/>
      <h3 className="font-bold mt-3">{name}</h3>
      <p className="text-gray-400">{symbol}</p>
      <p className="mt-2 font-semibold text-cyan-50">{balance}</p>
    </motion.div>
  );
}

export default Payments;