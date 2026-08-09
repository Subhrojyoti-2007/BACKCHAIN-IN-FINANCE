import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KYCVerification() {
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Aadhaar Input, 2: OTP Input, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txnId, setTxnId] = useState('');
  
  const { token, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/kyc/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ aadhaar_number: aadhaar })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTxnId(data.transaction_id);
        setStep(2);
      } else {
        if (res.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        setError(data.error || data.msg || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Network error. Could not connect to API.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/kyc/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp, transaction_id: txnId })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setStep(3);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } else {
        setError(data.error || data.msg || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Network error. Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
      <div className="absolute inset-0 bg-[#0f1321]/80 backdrop-blur-md -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20">
            {step === 3 ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Identity Verification
          </h2>
          <p className="text-slate-400 text-sm">
            {step === 1 && "ERC-3643 mandates mandatory KYC. Please verify your identity using Aadhaar to access the platform."}
            {step === 2 && "Enter the 6-digit OTP sent to your Aadhaar-linked mobile number."}
            {step === 3 && "Verification complete. Redirecting to dashboard..."}
          </p>
        </div>
        
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 border border-slate-700/50 rounded-md bg-slate-900/30"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Aadhaar Number</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="0000 0000 0000"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  required
                />
                <Fingerprint className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || aadhaar.length !== 12}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Get OTP <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">One-Time Password (OTP)</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Identity'}
            </button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Change Aadhaar Number
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-400 font-medium animate-pulse">Whitelisting on-chain...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
