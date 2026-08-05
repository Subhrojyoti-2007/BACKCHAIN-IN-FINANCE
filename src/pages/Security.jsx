import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  KeyRound,
  Database,
} from "lucide-react";
import { AnimatedCounter } from "../components/ui/animated-counter";

const securityChecks = [
  {
    title: "Two-Factor Authentication",
    status: "Enabled",
    icon: <KeyRound />,
  },
  {
    title: "Smart Contract Verification",
    status: "Completed",
    icon: <ShieldCheck />,
  },
  {
    title: "Suspicious Activity Monitoring",
    status: "Active",
    icon: <Eye />,
  },
  {
    title: "Transaction Risk Analysis",
    status: "Enabled",
    icon: <Activity />,
  },
];


const securityEvents = [
  {
    event: "Wallet connection approved",
    time: "5 minutes ago",
    status: "Safe",
  },
  {
    event: "Transaction verification completed",
    time: "20 minutes ago",
    status: "Safe",
  },
  {
    event: "New device login detected",
    time: "1 hour ago",
    status: "Reviewed",
  },
];


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.5 }
  }
};

const slideUpItem = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const eventsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 1.2 }
  }
};

const slideRightItem = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
};

function SecurityCenter() {
  const [reservesStatus, setReservesStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyReserves = async () => {
    setIsVerifying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/proof-of-reserves', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReservesStatus(data.solvent);
      } else {
        setReservesStatus(false);
      }
    } catch (e) {
      console.error(e);
      setReservesStatus(false);
    }
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{opacity:0,y:-20}}
        animate={{opacity:1,y:0}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">
          Security Center
        </h1>
        <p className="text-gray-400 mt-2">
          Protect your blockchain assets with advanced security monitoring
        </p>
      </motion.div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{scale:1.01}}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8"
      >
        <div className="flex items-center gap-4">
          <ShieldCheck
            size={50}
            className="text-green-400"
          />
          <div>
            <h2 className="text-xl font-semibold">
              Wallet Security Score
            </h2>
            <p className="text-5xl font-bold mt-3 flex items-baseline">
              <AnimatedCounter value={92} />
              <span className="text-gray-400 text-2xl ml-1">/100</span>
            </p>
            <p className="text-green-400 mt-2">
              Excellent Protection
            </p>
          </div>
        </div>
        <div className="mt-6 bg-black/30 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "92%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="bg-green-400 h-3 rounded-full"
          />
        </div>
      </motion.div>

      {/* Proof of Reserves */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div className="flex items-center gap-4">
          <Database size={40} className="text-blue-400" />
          <div>
            <h2 className="text-xl font-semibold">
              Proof of Reserves (Zero-Knowledge)
            </h2>
            <p className="text-gray-400 text-sm mt-1 max-w-md">
              Cryptographically verify bank solvency without exposing underlying user balances.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={verifyReserves}
            disabled={isVerifying}
            className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isVerifying ? (
              <span className="animate-spin border-2 border-t-transparent border-black rounded-full w-4 h-4"></span>
            ) : <CheckCircle size={18} />}
            Verify Solvency
          </button>
          
          {reservesStatus !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 mt-2 ${
                reservesStatus ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {reservesStatus ? (
                <><CheckCircle size={14} /> Solvency Verified</>
              ) : (
                <><AlertTriangle size={14} /> Insolvency Detected</>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Security Cards */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-4 gap-6 mb-8"
      >
      {securityChecks.map((item,index)=>(
          <motion.div
            key={index}
            variants={slideUpItem}
            whileHover={{scale:1.05}}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 cursor-pointer transition-colors hover:bg-white/15"
          >
            <div className="text-cyan-400">
              {item.icon}
            </div>
            <h3 className="font-semibold mt-4">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-3 text-green-400">
              <CheckCircle size={18}/>
              {item.status}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Risk Monitoring */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.8 } }
        }}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-3 gap-6 mb-8"
      >
        <RiskCard title="Transaction Risk" value="Low" icon={<Activity/>} />
        <RiskCard title="Network Threats" value="None Detected" icon={<Lock/>} />
        <RiskCard title="Contract Safety" value="Verified" icon={<ShieldCheck/>} />
      </motion.div>

      {/* Security Events */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-5">
          Recent Security Events
        </h2>
        <motion.div 
          variants={eventsContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
        {securityEvents.map((event,index)=>(
            <motion.div
              key={index}
              variants={slideRightItem}
              whileHover={{scale:1.01, backgroundColor: "rgba(255,255,255,0.1)"}}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex justify-between items-center transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400" />
                <div>
                  <h3 className="font-semibold">
                    {event.event}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {event.time}
                  </p>
                </div>
              </div>
              <span className="text-green-400 font-medium">
                {event.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function RiskCard({title,value,icon}){
  return (
    <motion.div
      variants={slideUpItem}
      whileHover={{scale:1.05}}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-colors hover:bg-white/15"
    >
      <div className="text-cyan-400">
        {icon}
      </div>
      <h3 className="text-gray-400 mt-4">
        {title}
      </h3>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </motion.div>
  );
}

export default SecurityCenter;