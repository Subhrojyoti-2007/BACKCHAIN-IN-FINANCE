import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, RefreshCw, LogOut, ArrowLeft, CheckCircle2, Clock, Lock } from 'lucide-react';

export default function KYCVerification() {
  const { token, user, setUser, setToken, logout } = useAuth();
  const navigate = useNavigate();

  // eKYC states: 'aadhaar' | 'otp' | 'success'
  const [step, setStep] = useState('aadhaar');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Timer for OTP resend
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Format Aadhaar: XXXX XXXX XXXX
  const formatAadhaar = (val) => {
    const numeric = val.replace(/\D/g, '').slice(0, 12);
    const matches = numeric.match(/.{1,4}/g);
    return matches ? matches.join(' ') : numeric;
  };

  const handleAadhaarChange = (e) => {
    setAadhaar(formatAadhaar(e.target.value));
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const rawAadhaar = aadhaar.replace(/\s/g, '');
    
    if (rawAadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits');
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
        body: JSON.stringify({ aadhaar: rawAadhaar })
      });
      const data = await res.json();
      
      if (res.ok) {
        setTransactionId(data.transaction_id);
        setStep('otp');
        setTimer(30); // 30s resend cooldown
      } else {
        setError(data.error || data.msg || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Could not contact the server.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits');
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
        body: JSON.stringify({
          otp,
          transaction_id: transactionId
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Update user state and session JWT token securely
        setToken(data.access_token);
        setUser(data.user);
        
        // Show success screen
        setStep('success');
      } else {
        setError(data.error || 'Invalid OTP. Please check and try again.');
      }
    } catch (err) {
      setError('Network error. Could not contact the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToAadhaar = () => {
    setError('');
    setOtp('');
    setStep('aadhaar');
  };

  // Card slide/fade animations
  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden font-body-md selection:bg-primary selection:text-on-primary text-white">
      {/* Floating stars or light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg mt-8">
        
        {/* Verification Shield Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-3 text-cyan-400 animate-pulse">
            <Fingerprint className="h-10 w-10" />
          </div>
          <h1 className="font-display-lg text-2xl font-bold text-center text-on-surface">Identity Verification</h1>
          <p className="text-sm text-on-surface-variant text-center mt-1">ERC-3643 Compliant Tokenization Protocol Gate</p>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {error && (
            <div className="bg-error/15 border border-error/40 text-error px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'aadhaar' && (
              <motion.div
                key="aadhaar"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="mb-6">
                  <h2 className="font-headline-sm text-lg text-slate-100 mb-2">Aadhaar Number Input</h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Please provide your 12-digit Aadhaar identity number to authorize the smart contract whitelist transaction.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                      Aadhaar Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={aadhaar}
                        onChange={handleAadhaarChange}
                        className="w-full px-4 py-3.5 bg-surface-container-lowest/80 border border-outline-variant/60 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-on-surface text-lg font-mono tracking-widest placeholder-outline-variant transition-all text-center"
                        placeholder="0000 0000 0000"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary font-headline-sm text-base py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Generating UIDAI Session...
                      </>
                    ) : (
                      <>
                        Request OTP
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-cyan-500" /> Secure UIDAI connection
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Cancel Sign In
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <button 
                      onClick={handleBackToAadhaar}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="font-headline-sm text-lg text-slate-100">Enter One-Time Password</h2>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed pl-7">
                    An OTP has been sent to the mobile number registered with your Aadhaar card.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 pl-7">
                      6-Digit Security OTP
                    </label>
                    <div className="relative pl-7">
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={handleOtpChange}
                        className="w-full px-4 py-3.5 bg-surface-container-lowest/80 border border-outline-variant/60 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-on-surface text-xl font-mono tracking-widest placeholder-outline-variant transition-all text-center"
                        placeholder="••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-7 text-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-cyan-500" /> Code expires in 5 min
                    </span>
                    <button
                      type="button"
                      disabled={timer > 0 || loading}
                      onClick={handleSendOtp}
                      className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary font-headline-sm text-base py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold cursor-pointer ml-7 w-[calc(100%-28px)]"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Verifying eKYC...
                      </>
                    ) : (
                      <>
                        Verify and Whitelist
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { type: 'spring', damping: 10, stiffness: 100 } }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400"
                  >
                    <CheckCircle2 className="h-16 w-16" />
                  </motion.div>
                </div>

                <h2 className="font-headline-md text-2xl font-bold text-slate-100 mb-2">Verification Successful</h2>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed max-w-md mx-auto">
                  Your identity has been verified through UIDAI. The on-chain Identity Registry has whitelisted your wallet address.
                </p>

                {/* Whitelist Certificate Details */}
                <div className="bg-surface-container-lowest/80 border border-outline-variant/30 rounded-xl p-4 mb-8 text-left space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Account:</span>
                    <span className="text-cyan-400 font-bold">{user?.address}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Identity Registry Status:</span>
                    <span className="text-emerald-400 font-bold font-semibold">WHITELISTED (ERC-3643)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-200">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference ID:</span>
                    <span className="text-slate-200 text-[10px]">{user?.kyc_reference_id || 'ref_f4e82b7c'}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-headline-sm text-base py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold cursor-pointer"
                >
                  Enter Platform Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
