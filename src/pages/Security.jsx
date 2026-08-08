import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Eye,
  KeyRound,
  Database,
  RefreshCw
} from "lucide-react";
import { AnimatedCounter } from "../components/ui/animated-counter";

const securityChecks = [
  {
    title: "Two-Factor Authentication",
    status: "Enabled",
    icon: KeyRound,
    color: "text-cyan-400"
  },
  {
    title: "Smart Contract Audits",
    status: "Completed",
    icon: ShieldCheck,
    color: "text-emerald-400"
  },
  {
    title: "Real-Time Threat Monitor",
    status: "Active",
    icon: Eye,
    color: "text-indigo-400"
  },
  {
    title: "Transaction Risk Scoring",
    status: "Enabled",
    icon: Activity,
    color: "text-blue-400"
  },
];

const securityEvents = [
  {
    event: "Wallet Connection Authorized",
    time: "5 minutes ago",
    status: "Verified Safe",
  },
  {
    event: "Transaction Zero-Knowledge Proof Audited",
    time: "20 minutes ago",
    status: "Verified Safe",
  },
  {
    event: "New Multi-Sig Device Authorized",
    time: "1 hour ago",
    status: "Reviewed",
  },
];

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
    <div className="min-h-screen text-slate-100 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold">Institutional Vault Shield</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Security <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Center</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Cryptographic proof-of-reserves, multi-party computation, and active threat monitoring.</p>
      </motion.div>

      {/* Security Score Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
<<<<<<< HEAD
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{scale:1.01}}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-8 mb-8"
=======
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Institutional Trust Rating</p>
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono mt-1 flex items-baseline">
                <AnimatedCounter value={98} />
                <span className="text-slate-400 text-xl font-normal ml-1">/100</span>
              </div>
              <p className="text-xs font-mono text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Maximum Cryptographic Protection Active
              </p>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Security Gauge</span>
              <span className="text-emerald-400 font-bold">98%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "98%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.4)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proof of Reserves Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
=======
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
            <Database className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Zero-Knowledge Proof of Reserves
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
              Cryptographically verify treasury solvency on-chain without exposing private user balances.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <button
            onClick={verifyReserves}
            disabled={isVerifying}
            className="btn-primary w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : <CheckCircle2 className="h-4 w-4" />}
            <span>{isVerifying ? "Verifying Solvency..." : "Verify Protocol Solvency"}</span>
          </button>
          
          {reservesStatus !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-2 ${
                reservesStatus ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              {reservesStatus ? (
                <><CheckCircle2 className="h-4 w-4" /> Solvency Verified 100% On-Chain</>
              ) : (
                <><AlertTriangle className="h-4 w-4" /> Solvency Warning</>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Security Checks Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
<<<<<<< HEAD
      {securityChecks.map((item,index)=>(
          <motion.div
            key={index}
            variants={slideUpItem}
            whileHover={{scale:1.05}}
            className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-5 cursor-pointer transition-colors hover:bg-white/15"
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
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6"
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
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-4 flex justify-between items-center transition-colors cursor-pointer"
=======
        {securityChecks.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              variants={slideUpItem}
              whileHover={{ y: -3, borderColor: 'rgba(56,189,248,0.3)' }}
              className="glass-card rounded-2xl p-6 border border-white/10 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit mb-4">
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <h3 className="font-bold text-white text-base mb-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{item.status}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Security Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10"
      >
        <h2 className="text-xl font-bold text-white mb-6">
          Recent Security Audit Log
        </h2>
        <div className="space-y-3 font-mono text-xs sm:text-sm">
          {securityEvents.map((event, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all"
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white">
                    {event.event}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {event.time}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {event.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

<<<<<<< HEAD
function RiskCard({title,value,icon}){
  return (
    <motion.div
      variants={slideUpItem}
      whileHover={{scale:1.05}}
      className="rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl p-6 cursor-pointer transition-colors hover:bg-white/15"
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

=======
>>>>>>> 793a4810ad7946105cd3970d194e197c481172a9
export default SecurityCenter;