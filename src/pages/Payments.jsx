import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Send,
  Wallet,
  ShieldCheck,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";


function Payments() {
  const [users, setUsers] = useState([]);
  const [sender, setSender] = useState("");
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
          setSender(data[0].address);
          if (data.length > 1) {
            setReceiver(data[1].address);
          }
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender,
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
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="mb-8">
        <h1 className="text-3xl font-bold">Crypto Payments</h1>
        <p className="text-gray-400 mt-2">Send, receive and manage blockchain transactions securely</p>
      </motion.div>

      {/* Payment Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Send Payment */}
        <motion.div whileHover={{scale:1.01}} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
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

          <label className="text-gray-400">Sender Wallet (Demo)</label>
          <select
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full mt-2 mb-5 p-3 rounded-xl bg-black/30 outline-none text-white"
          >
            {users.map(u => (
              <option key={`sender-${u.address}`} value={u.address}>
                {u.username} ({u.address}) {u.is_kyc_verified ? '✅ KYC' : '❌ No KYC'}
              </option>
            ))}
          </select>

          <label className="text-gray-400">Recipient Wallet Address</label>
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full mt-2 mb-5 p-3 rounded-xl bg-black/30 outline-none text-white"
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
            className="w-full mt-2 mb-5 p-3 rounded-xl bg-black/30 outline-none text-white"
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
            className="w-full mt-2 mb-6 p-3 rounded-xl bg-black/30 outline-none text-white"
          />

          <button
            onClick={handleSendPayment}
            disabled={isSubmitting || !amount}
            className="w-full bg-cyan-500 text-black font-bold p-3 rounded-xl hover:bg-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Send Payment"}
          </button>
        </motion.div>

        {/* Security Card */}
        <motion.div whileHover={{scale:1.01}} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-green-400"/>
            <h2 className="text-xl font-semibold">Transaction Security</h2>
          </div>
          <SecurityItem text="Wallet address verified via backend"/>
          <SecurityItem text="ERC-3643 KYC Compliance Enforced"/>
          <SecurityItem text="Gas fee optimized"/>
          <SecurityItem text="Smart contract protected"/>
        </motion.div>
      </div>

      {/* Assets */}
      <motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">Supported Assets</h2>
        <div className="grid md:grid-cols-4 gap-5">
          <AssetCard name="Ethereum" symbol="ETH" balance="12.45 ETH" />
          <AssetCard name="Bitcoin" symbol="BTC" balance="2.18 BTC" />
          <AssetCard name="USD Coin" symbol="USDC" balance="18,500 USDC" />
          <AssetCard name="Aave" symbol="AAVE" balance="85 AAVE" />
        </div>
      </motion.div>
    </div>
  );
}

function SecurityItem({text}) {
  return (
    <div className="flex items-center gap-3 bg-black/20 rounded-xl p-4 mb-3">
      <CheckCircle className="text-green-400"/>
      <p>{text}</p>
    </div>
  );
}

function AssetCard({name, symbol, balance}) {
  return (
    <motion.div whileHover={{scale:1.05}} className="bg-black/20 rounded-xl p-5">
      <Wallet className="text-cyan-400"/>
      <h3 className="font-bold mt-3">{name}</h3>
      <p className="text-gray-400">{symbol}</p>
      <p className="mt-2">{balance}</p>
    </motion.div>
  );
}

export default Payments;