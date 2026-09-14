// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Building2, LogOut, Users, Wallet, AlertTriangle, Activity } from 'lucide-react';
// import api from '../api/axios';

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [data, setData] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [msg, setMsg] = useState('');
// // 
//   useEffect(() => {
//     const u = localStorage.getItem('itsmybank_user');
//     if (!u) {
//       navigate('/login');
//       return;
//     }
//     const parsed = JSON.parse(u);
//     if (parsed.role !== 'ADMIN') {
//       navigate('/dashboard');
//       return;
//     }
//     setUser(parsed);
//     load();
//   }, [navigate]);

//   const load = async () => {
//     try {
//       const [dash, fraud] = await Promise.all([
//         api.get('/admin/dashboard'),
//         api.get('/admin/fraud-alerts'),
//       ]);
//       if (dash.data.success) setData(dash.data.data);
//       if (fraud.data.success) setAlerts(fraud.data.data || []);
//     } catch {
//       setMsg('Failed to load admin data');
//     }
//   };

//   const blockUser = async (id, block) => {
//     try {
//       const res = await api.put(block ? `/admin/block/${id}` : `/admin/unblock/${id}`);
//       setMsg(res.data.message);
//       load();
//     } catch (err) {
//       setMsg(err.response?.data?.message || 'Action failed');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('itsmybank_user');
//     navigate('/login');
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <header className="border-b border-white/10 sticky top-0 bg-slate-950/90 backdrop-blur z-20">
//         <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
//               <Building2 size={20} />
//             </div>
//             <div>
//               <h1 className="font-black">ItsMyBank <span className="text-rose-400">Admin</span></h1>
//               <p className="text-xs text-slate-500">{user.fullName}</p>
//             </div>
//           </div>
//           <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400">
//             <LogOut size={16} /> Logout
//           </button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
//           Admin Panel · Educational project · Not a real bank
//         </p>

//         {msg && (
//           <p className="text-sm text-center text-cyan-300 bg-cyan-500/10 rounded-xl py-2">{msg}</p>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {[
//             { label: 'Users', value: data?.totalUsers ?? '—', icon: Users, color: 'from-cyan-500/20' },
//             { label: 'Accounts', value: data?.totalAccounts ?? '—', icon: Wallet, color: 'from-violet-500/20' },
//             { label: 'Total Balance', value: data?.totalBalance != null ? `Rs. ${Number(data.totalBalance).toLocaleString()}` : '—', icon: Activity, color: 'from-emerald-500/20' },
//             { label: 'Transactions', value: data?.totalTransactions ?? '—', icon: AlertTriangle, color: 'from-orange-500/20' },
//           ].map((s) => (
//             <motion.div
//               key={s.label}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`rounded-2xl p-4 border border-white/10 bg-gradient-to-br ${s.color} to-transparent`}
//             >
//               <s.icon size={18} className="text-slate-400 mb-2" />
//               <p className="text-xs text-slate-400">{s.label}</p>
//               <p className="text-lg font-black mt-1">{s.value}</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* Users */}
//         <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
//           <div className="px-4 py-3 border-b border-white/10 font-bold text-sm">All Users</div>
//           <div className="divide-y divide-white/5">
//             {(data?.users || []).map((u) => (
//               <div key={u.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
//                 <div>
//                   <p className="font-semibold">{u.fullName}</p>
//                   <p className="text-xs text-slate-500">{u.email} · {u.role}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`text-xs px-2 py-0.5 rounded-full ${u.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
//                     {u.enabled ? 'Active' : 'Blocked'}
//                   </span>
//                   <button
//                     onClick={() => blockUser(u.id, u.enabled)}
//                     className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
//                   >
//                     {u.enabled ? 'Block' : 'Unblock'}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Fraud Alerts */}
//         <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 overflow-hidden">
//           <div className="px-4 py-3 border-b border-orange-500/20 font-bold text-sm text-orange-300 flex items-center gap-2">
//             <AlertTriangle size={16} /> Fraud Alerts (Amount ≥ 50,000)
//           </div>
//           <div className="divide-y divide-white/5">
//             {alerts.length === 0 && (
//               <p className="px-4 py-6 text-sm text-slate-500">No high-value alerts</p>
//             )}
//             {alerts.map((t) => (
//               <div key={t.id} className="px-4 py-3 text-sm flex justify-between">
//                 <div>
//                   <p className="font-semibold">{t.type}</p>
//                   <p className="text-xs text-slate-500">{t.description}</p>
//                 </div>
//                 <p className="text-orange-400 font-bold">Rs. {Number(t.amount).toLocaleString()}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, LogOut, Users, Wallet, AlertTriangle, Activity } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('itsmybank_user');
    if (!u) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(u);
    if (parsed.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    setUser(parsed);
    load();
  }, [navigate]);

  const load = async () => {
    try {
      const [dash, fraud] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/fraud-alerts'),
      ]);
      if (dash.data.success) setData(dash.data.data);
      if (fraud.data.success) setAlerts(fraud.data.data || []);
    } catch {
      setMsg('Failed to load admin data');
    }
  };

  const blockUser = async (id, block) => {
    try {
      const res = await api.put(block ? `/admin/block/${id}` : `/admin/unblock/${id}`);
      setMsg(res.data.message);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('itsmybank_user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 sticky top-0 bg-slate-950/90 backdrop-blur z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="font-black">ItsMyBank <span className="text-rose-400">Admin</span></h1>
              <p className="text-xs text-slate-500">{user.fullName}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
          Admin Panel · Educational project · Not a real bank
        </p>

        {msg && <p className="text-sm text-center text-cyan-300 bg-cyan-500/10 rounded-xl py-2">{msg}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Users', value: data?.totalUsers ?? '—', icon: Users },
            { label: 'Accounts', value: data?.totalAccounts ?? '—', icon: Wallet },
            { label: 'Total Balance', value: data?.totalBalance != null ? `Rs. ${Number(data.totalBalance).toLocaleString()}` : '—', icon: Activity },
            { label: 'Transactions', value: data?.totalTransactions ?? '—', icon: AlertTriangle },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 border border-white/10 bg-white/5"
            >
              <s.icon size={18} className="text-slate-400 mb-2" />
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-lg font-black mt-1">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 font-bold text-sm">All Users</div>
          <div className="divide-y divide-white/5">
            {(data?.users || []).map((u) => (
              <div key={u.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-semibold">{u.fullName}</p>
                  <p className="text-xs text-slate-500">{u.email} · {u.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {u.enabled ? 'Active' : 'Blocked'}
                  </span>
                  <button
                    onClick={() => blockUser(u.id, u.enabled)}
                    className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                  >
                    {u.enabled ? 'Block' : 'Unblock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-orange-500/20 font-bold text-sm text-orange-300 flex items-center gap-2">
            <AlertTriangle size={16} /> Fraud Alerts (≥ Rs. 50,000)
          </div>
          <div className="divide-y divide-white/5">
            {alerts.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">No high-value alerts</p>}
            {alerts.map((t) => (
              <div key={t.id} className="px-4 py-3 text-sm flex justify-between">
                <div>
                  <p className="font-semibold">{t.type}</p>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </div>
                <p className="text-orange-400 font-bold">Rs. {Number(t.amount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}