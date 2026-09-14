import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, Building2, Sparkles } from 'lucide-react';
import api from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [showCaution, setShowCaution] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

 useEffect(() => {
  if (localStorage.getItem('itsmybank_caution') === 'yes') {
    setShowCaution(false);
  }
}, []);

const acceptCaution = () => {
  localStorage.setItem('itsmybank_caution', 'yes');
  setShowCaution(false);
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setMessage(res.data.message);
        setStep('otp');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Is backend running on 8082?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.success) {
        // localStorage.setItem('inayatbank_user', JSON.stringify(res.data.data));
        localStorage.setItem('itsmybank_user', JSON.stringify(res.data.data));
        const role = res.data.data?.role;
        navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
      } else {
        setError(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 45%, #000 100%)' }}>

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-72 h-72 rounded-full bg-fuchsia-600/20 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-600/15 blur-[90px]"
      />

      {/* Fine grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Caution Modal */}
      <AnimatePresence>
        {showCaution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full rounded-3xl p-[1px] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500"
            >
              <div className="bg-slate-950 rounded-3xl p-8">
                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
                  <Shield className="text-white" size={30} />
                </div>
                <h2 className="text-2xl font-black text-center text-white mb-3">
                  Educational Notice
                </h2>
                <p className="text-slate-300 text-center text-sm leading-relaxed mb-6">
                  <span className="text-amber-400 font-bold">ItsMyBank</span> is an{' '}
                  <strong>imaginary educational banking project</strong>.
                  <br /><br />
                  <span className="text-rose-400 font-semibold">Not a real bank.</span>{' '}
                  No real money or real transactions.
                </p>
                <button
                  onClick={acceptCaution}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-orange-500/30"
                >
                  I Understand — Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="rounded-3xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-violet-500/40 to-fuchsia-500/60 shadow-2xl shadow-cyan-500/20">
          <div className="rounded-3xl bg-slate-950/90 backdrop-blur-xl p-8 border border-white/5">

            {/* Brand */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                className="mx-auto mb-4 w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-cyan-500/40 relative"
              >
                <Building2 className="text-white" size={34} />
                <Sparkles className="absolute -top-1 -right-1 text-amber-300" size={16} />
              </motion.div>
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-white">Its</span>
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">MyBank</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1.5 tracking-widest uppercase">
                Secure Digital Banking
              </p>
            </div>

            {step === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition" size={17} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@gmail.com"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.06] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-medium mb-1.5 block">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition" size={17} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-11 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:bg-white/[0.06] transition"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-rose-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 py-2.5 rounded-xl">
                    {error}
                  </motion.p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl font-bold text-white text-sm
                    bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600
                    hover:brightness-110 active:scale-[0.98] transition
                    shadow-lg shadow-cyan-500/25 disabled:opacity-50">
                  {loading ? 'Sending OTP...' : 'Login Securely →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-center text-slate-400 text-xs">
                  OTP sent to <span className="text-cyan-400 font-medium">{email}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-4 text-center text-2xl tracking-[0.6em] text-white placeholder:text-slate-600 placeholder:tracking-[0.3em] focus:outline-none focus:border-cyan-500/60 transition"
                />
                {error && (
                  <p className="text-rose-400 text-xs text-center bg-rose-500/10 py-2 rounded-xl">{error}</p>
                )}
                {message && <p className="text-emerald-400 text-xs text-center">{message}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm
                    bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600
                    hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-cyan-500/25 disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify OTP →'}
                </button>
                <button type="button" onClick={() => setStep('login')}
                  className="w-full text-slate-500 text-xs hover:text-cyan-400 transition">
                  ← Back to Login
                </button>
              </form>
            )}

            <p className="text-center text-slate-500 text-xs mt-6">
              New here?{' '}
              <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-5 tracking-wide">
          © © 2026 ItsMyBank · Educational Project · Not a Real Bank
        </p>
      </motion.div>
    </div>
  );
}