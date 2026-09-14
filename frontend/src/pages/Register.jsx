import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      if (res.data.success) {
        setSuccess('Account created! OTP sent to email. Please login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 50%, #000 100%)' }}
    >
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-br from-cyan-400/50 via-violet-500/40 to-fuchsia-500/50"
      >
        <div className="rounded-3xl bg-slate-950/90 backdrop-blur-xl p-8 border border-white/5">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <Building2 className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-white">
              Join <span className="text-cyan-400">ItsMyBank</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1">Create your educational bank account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {[
              { name: 'fullName', icon: User, placeholder: 'Full Name', type: 'text' },
              { name: 'email', icon: Mail, placeholder: 'Email', type: 'email' },
              { name: 'phone', icon: Phone, placeholder: 'Phone', type: 'text' },
              { name: 'password', icon: Lock, placeholder: 'Password', type: 'password' },
            ].map(({ name, icon: Icon, placeholder, type }) => (
              <div key={name} className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input
                  name={name}
                  type={type}
                  required
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition"
                />
              </div>
            ))}

            {error && (
              <p className="text-rose-400 text-xs text-center bg-rose-500/10 py-2 rounded-xl">{error}</p>
            )}
            {success && (
              <p className="text-emerald-400 text-xs text-center bg-emerald-500/10 py-2 rounded-xl">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:brightness-110 transition disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}