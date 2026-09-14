


// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { QRCodeSVG } from 'qrcode.react';
// // import {
// //   Wallet, ArrowLeftRight, CreditCard, Snowflake,
// //   History, LogOut, Plus, Building2, Zap, MessageCircle
// // } from 'lucide-react';

// import {
//   Wallet, ArrowLeftRight, CreditCard, Snowflake,
//   History, LogOut, Plus, Building2, Zap, MessageCircle,
//   QrCode, Bell, Download
// } from 'lucide-react';
// import api from '../api/axios';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   const [card, setCard] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [tab, setTab] = useState('home');
//   const [msg, setMsg] = useState('');
//   const [amount, setAmount] = useState('5000');
//   const [transfer, setTransfer] = useState({ toAccountNumber: '', amount: '', description: '' });
//   const [bill, setBill] = useState({ billerType: 'ELECTRICITY', consumerNumber: '', amount: '' });
//   const [chatInput, setChatInput] = useState('');
//   const [chatReply, setChatReply] = useState('');

//   const [qrData, setQrData] = useState(null);
//   const [reminders, setReminders] = useState([]);
//   const [reminderForm, setReminderForm] = useState({
//   title: '',
//   message: '',
//   remindAt: '',
// });
// const [qrPay, setQrPay] = useState({ toAccountNumber: '', amount: '' });

//   useEffect(() => {
//     const u = localStorage.getItem('itsmybank_user');
//     if (!u) {
//       navigate('/login');
//       return;
//     }
//     const parsed = JSON.parse(u);
//     setUser(parsed);
//     loadAll(parsed.userId);
//   }, [navigate]);

//   const loadAll = async (userId) => {
//     try {
//       const res = await api.get(`/account/user/${userId}`);
//       if (res.data.success && res.data.data?.length) {
//         const accs = res.data.data;
//         setAccounts(accs);
//         const accNo = accs[0].accountNumber;
//         const [cardRes, txRes] = await Promise.all([
//           api.get(`/account/card/${accNo}`),
//           api.get(`/account/transactions/${accNo}`),
//         ]);
//         if (cardRes.data.success) setCard(cardRes.data.data);
//         if (txRes.data.success) setTransactions(txRes.data.data || []);
//       }
//     } catch {
//       setMsg('Failed to load data');
//     }
//   };

//   const showMsg = (text) => {
//     setMsg(text);
//     setTimeout(() => setMsg(''), 3000);
//   };

//   const deposit = async () => {
//     if (!accounts[0]) return;
//     try {
//       const res = await api.post('/account/deposit', {
//         accountNumber: accounts[0].accountNumber,
//         amount: Number(amount),
//       });
//       showMsg(res.data.message);
//       loadAll(user.userId);
//     } catch (err) {
//       showMsg(err.response?.data?.message || 'Deposit failed');
//     }
//   };

//   const doTransfer = async (e) => {
//     e.preventDefault();
//     if (!accounts[0]) return;
//     try {
//       const res = await api.post('/account/transfer', {
//         fromAccountNumber: accounts[0].accountNumber,
//         toAccountNumber: transfer.toAccountNumber,
//         amount: Number(transfer.amount),
//         description: transfer.description || 'Transfer',
//       });
//       showMsg(res.data.message);
//       setTransfer({ toAccountNumber: '', amount: '', description: '' });
//       loadAll(user.userId);
//     } catch (err) {
//       showMsg(err.response?.data?.message || 'Transfer failed');
//     }
//   };

//   const toggleFreeze = async () => {
//     if (!accounts[0]) return;
//     const accNo = accounts[0].accountNumber;
//     const frozen = accounts[0].frozen;
//     try {
//       const res = await api.put(
//         frozen ? `/account/unfreeze/${accNo}` : `/account/freeze/${accNo}`
//       );
//       showMsg(res.data.message);
//       loadAll(user.userId);
//     } catch (err) {
//       showMsg(err.response?.data?.message || 'Action failed');
//     }
//   };

//   const payBill = async (e) => {
//     e.preventDefault();
//     if (!accounts[0]) return;
//     try {
//       const res = await api.post('/banking/bill', {
//         accountNumber: accounts[0].accountNumber,
//         billerType: bill.billerType,
//         consumerNumber: bill.consumerNumber,
//         amount: Number(bill.amount),
//       });
//       showMsg(res.data.message);
//       setBill({ billerType: 'ELECTRICITY', consumerNumber: '', amount: '' });
//       loadAll(user.userId);
//     } catch (err) {
//       showMsg(err.response?.data?.message || 'Bill payment failed');
//     }
//   };

//   const sendChat = async (e) => {
//     e.preventDefault();
//     if (!chatInput.trim()) return;
//     try {
//       const res = await api.post('/banking/chatbot', { message: chatInput });
//       setChatReply(res.data.data?.reply || res.data.message);
//       setChatInput('');
//     } catch {
//       setChatReply('Chatbot unavailable. Is backend running?');
//     }
//   };

//   const loadQR = async () => {
//   if (!accounts[0]) return;
//   try {
//     const res = await api.get(`/banking/qr/${accounts[0].accountNumber}`);
//     if (res.data.success) setQrData(res.data.data);
//   } catch {
//     showMsg('QR load failed');
//   }
// };

// const loadReminders = async () => {
//   if (!user) return;
//   try {
//     const res = await api.get(`/banking/reminders/${user.userId}`);
//     if (res.data.success) setReminders(res.data.data || []);
//   } catch {
//     setReminders([]);
//   }
// };

// const addReminder = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await api.post('/banking/reminder', {
//       userId: user.userId,
//       title: reminderForm.title,
//       message: reminderForm.message,
//       remindAt: reminderForm.remindAt, // e.g. 2026-09-20T10:00:00
//     });
//     showMsg(res.data.message);
//     setReminderForm({ title: '', message: '', remindAt: '' });
//     loadReminders();
//   } catch (err) {
//     showMsg(err.response?.data?.message || 'Reminder failed');
//   }
// };

// const payByQR = async (e) => {
//   e.preventDefault();
//   if (!accounts[0]) return;
//   try {
//     const res = await api.post('/account/transfer', {
//       fromAccountNumber: accounts[0].accountNumber,
//       toAccountNumber: qrPay.toAccountNumber,
//       amount: Number(qrPay.amount),
//       description: 'QR Payment',
//     });
//     showMsg(res.data.message);
//     setQrPay({ toAccountNumber: '', amount: '' });
//     loadAll(user.userId);
//   } catch (err) {
//     showMsg(err.response?.data?.message || 'QR payment failed');
//   }
// };

// const downloadPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(16);
//   doc.text('ItsMyBank — Account Statement', 20, 20);
//   doc.setFontSize(10);
//   doc.text('Educational project only — not a real bank', 20, 28);
//   if (acc) {
//     doc.text(`Account: ${acc.accountNumber}`, 20, 38);
//     doc.text(`Balance: Rs. ${Number(acc.balance).toLocaleString()}`, 20, 46);
//     doc.text(`Name: ${user.fullName}`, 20, 54);
//   }
//   doc.text('Transactions:', 20, 66);
//   let y = 74;
//   transactions.slice(0, 25).forEach((tx, i) => {
//     const line = `${i + 1}. ${tx.type} | Rs.${tx.amount} | ${tx.description || ''} | ${tx.status}`;
//     doc.text(line.substring(0, 90), 20, y);
//     y += 8;
//     if (y > 270) {
//       doc.addPage();
//       y = 20;
//     }
//   });
//   doc.save(`ItsMyBank-Statement-${acc?.accountNumber || 'account'}.pdf`);
//   showMsg('PDF downloaded');
// };

// // jab tab change ho / data load ho
// useEffect(() => {
//   if (tab === 'qr' && accounts[0]) loadQR();
//   if (tab === 'reminders' && user) loadReminders();
// }, [tab, accounts, user]);

//   const logout = () => {
//     localStorage.removeItem('itsmybank_user');
//     navigate('/login');
//   };

//   if (!user) return null;
//   const acc = accounts[0];

//  const tabs = [
//   { id: 'home', icon: Wallet, label: 'Home' },
//   { id: 'transfer', icon: ArrowLeftRight, label: 'Transfer' },
//   { id: 'card', icon: CreditCard, label: 'Card' },
//   { id: 'qr', icon: QrCode, label: 'QR' },
//   { id: 'bills', icon: Zap, label: 'Bills' },
//   { id: 'chat', icon: MessageCircle, label: 'Help' },
//   { id: 'history', icon: History, label: 'History' },
//   { id: 'reminders', icon: Bell, label: 'Alerts' },
// ];

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
//         <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
//               <Building2 size={20} />
//             </div>
//             <div>
//               <h1 className="font-black text-lg">
//                 Its<span className="text-cyan-400">MyBank</span>
//               </h1>
//               <p className="text-slate-500 text-xs">{user.fullName}</p>
//             </div>
//           </div>
//           <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition">
//             <LogOut size={16} /> Logout
//           </button>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 py-6">
//         <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-5">
//           Educational project only — not a real bank. Demo / test mode.
//         </p>

//         {msg && (
//           <motion.p
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-4 text-sm text-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl py-2"
//           >
//             {msg}
//           </motion.p>
//         )}

//         <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
//           {tabs.map((t) => (
//             <button
//               key={t.id}
//               onClick={() => setTab(t.id)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
//                 tab === t.id
//                   ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white'
//                   : 'bg-white/5 text-slate-400 hover:bg-white/10'
//               }`}
//             >
//               <t.icon size={16} /> {t.label}
//             </button>
//           ))}
//         </div>

//         {tab === 'home' && acc && (
//           <div className="space-y-4">
//             <motion.div
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="rounded-3xl p-6 bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-600/20 border border-white/10"
//             >
//               <p className="text-slate-400 text-xs">{acc.accountType} Account</p>
//               <p className="text-4xl font-black mt-1">Rs. {Number(acc.balance).toLocaleString()}</p>
//               <p className="text-slate-500 text-xs mt-3 font-mono">{acc.accountNumber}</p>
//               <p className="text-xs mt-1">{acc.frozen ? '🔒 Frozen' : '✅ Active'}</p>
//             </motion.div>

//             <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
//               <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
//                 <Plus size={16} className="text-cyan-400" /> Test Deposit
//               </h3>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
//                 />
//                 <button onClick={deposit} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
//                   Add
//                 </button>
//               </div>
//               <div className="flex gap-2 mt-2">
//                 {['1000', '5000', '10000'].map((v) => (
//                   <button key={v} onClick={() => setAmount(v)} className="text-xs px-3 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400">
//                     {v}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button
//               onClick={toggleFreeze}
//               className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
//             >
//               <Snowflake size={16} className="text-cyan-400" />
//               {acc.frozen ? 'Unfreeze Account' : 'Freeze Account'}
//             </button>
//           </div>
//         )}

//         {tab === 'transfer' && (
//           <form onSubmit={doTransfer} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 max-w-md">
//             <h3 className="font-bold">Send Money</h3>
//             <input
//               placeholder="To Account Number"
//               value={transfer.toAccountNumber}
//               onChange={(e) => setTransfer({ ...transfer, toAccountNumber: e.target.value })}
//               required
//               className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
//             />
//             <input
//               type="number"
//               placeholder="Amount"
//               value={transfer.amount}
//               onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })}
//               required
//               className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
//             />
//             <input
//               placeholder="Description (optional)"
//               value={transfer.description}
//               onChange={(e) => setTransfer({ ...transfer, description: e.target.value })}
//               className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
//             />
//             <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
//               Transfer Now
//             </button>
//           </form>
//         )}

//         {tab === 'card' && (
//           <div className="max-w-md mx-auto">
//             {card ? (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl"
//                 style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 35%, #0e7490 70%, #164e63 100%)' }}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30" />
//                 <div className="relative z-10 p-6 h-full flex flex-col justify-between">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-white font-black text-lg">Its<span className="text-cyan-300">MyBank</span></p>
//                       <p className="text-cyan-200/70 text-[10px] tracking-[0.2em] uppercase">Debit Card</p>
//                     </div>
//                     <span className="text-white/50 text-xs font-semibold">VISA</span>
//                   </div>
//                   <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600" />
//                   <p className="text-white text-xl font-mono tracking-[0.15em]">{card.cardNumber}</p>
//                   <div className="flex justify-between text-sm">
//                     <div>
//                       <p className="text-white/50 text-[9px] uppercase">Card Holder</p>
//                       <p className="text-white text-sm font-semibold uppercase">{card.cardHolderName}</p>
//                     </div>
//                     <div>
//                       <p className="text-white/50 text-[9px] uppercase">Expires</p>
//                       <p className="text-white text-sm font-semibold">{card.expiry}</p>
//                     </div>
//                     <div>
//                       <p className="text-white/50 text-[9px] uppercase">CVV</p>
//                       <p className="text-white text-sm font-semibold">{card.frozen ? '•••' : card.cvv}</p>
//                     </div>
//                   </div>
//                 </div>
//                 {card.frozen && (
//                   <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] bg-rose-500 text-white px-3 py-0.5 rounded-full font-bold">
//                     FROZEN
//                   </span>
//                 )}
//               </motion.div>
//             ) : (
//               <p className="text-slate-500 text-center">No card found</p>
//             )}
//           </div>
//         )}

//         {tab === 'bills' && (
//           <form onSubmit={payBill} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 max-w-md">
//             <h3 className="font-bold text-lg">Pay Bills</h3>
//             <select
//               value={bill.billerType}
//               onChange={(e) => setBill({ ...bill, billerType: e.target.value })}
//               className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
//             >
//               <option value="ELECTRICITY">Electricity</option>
//               <option value="GAS">Gas</option>
//               <option value="INTERNET">Internet</option>
//               <option value="MOBILE">Mobile</option>
//             </select>
//             <input
//               placeholder="Consumer Number"
//               value={bill.consumerNumber}
//               onChange={(e) => setBill({ ...bill, consumerNumber: e.target.value })}
//               required
//               className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
//             />
//             <input
//               type="number"
//               placeholder="Amount"
//               value={bill.amount}
//               onChange={(e) => setBill({ ...bill, amount: e.target.value })}
//               required
//               className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
//             />
//             <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
//               Pay Bill
//             </button>
//           </form>
//         )}

//         {tab === 'chat' && (
//           <div className="rounded-2xl bg-white/5 border border-white/10 p-6 max-w-md space-y-4">
//             <h3 className="font-bold text-lg flex items-center gap-2">
//               <MessageCircle size={18} className="text-cyan-400" /> ItsMyBank Help
//             </h3>
//             <div className="min-h-[100px] rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-slate-300">
//               {chatReply || 'Ask about balance, transfer, deposit, bill, freeze...'}
//             </div>
//             <form onSubmit={sendChat} className="flex gap-2">
//               <input
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 placeholder="Type your question..."
//                 className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
//               />
//               <button type="submit" className="px-4 py-2.5 rounded-xl bg-cyan-600 font-bold text-sm">
//                 Send
//               </button>
//             </form>
//           </div>
//         )}


//         {/* QR */}
// {tab === 'qr' && (
//   <div className="grid md:grid-cols-2 gap-6">
//     <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
//       <h3 className="font-bold mb-4">Receive Money — My QR</h3>
//       {qrData ? (
//         <>
//           <div className="bg-white p-4 rounded-2xl inline-block">
//             <QRCodeSVG value={qrData.qrText || qrData.accountNumber} size={180} />
//           </div>
//           <p className="text-sm text-cyan-300 mt-4 font-mono">{qrData.accountNumber}</p>
//           <p className="text-xs text-slate-500 mt-1">{qrData.accountHolder}</p>
//           <p className="text-[10px] text-slate-600 mt-2">Scan / share account number to receive</p>
//         </>
//       ) : (
//         <button onClick={loadQR} className="text-sm text-cyan-400">Load QR</button>
//       )}
//     </div>

//     <form onSubmit={payByQR} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
//       <h3 className="font-bold">Pay via QR / Account</h3>
//       <input
//         placeholder="Receiver Account Number"
//         value={qrPay.toAccountNumber}
//         onChange={(e) => setQrPay({ ...qrPay, toAccountNumber: e.target.value })}
//         required
//         className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
//       />
//       <input
//         type="number"
//         placeholder="Amount"
//         value={qrPay.amount}
//         onChange={(e) => setQrPay({ ...qrPay, amount: e.target.value })}
//         required
//         className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
//       />
//       <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
//         Pay Now
//       </button>
//     </form>
//   </div>
// )}

// {/* REMINDERS / NOTIFICATIONS */}
// {tab === 'reminders' && (
//   <div className="grid md:grid-cols-2 gap-6">
//     <form onSubmit={addReminder} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3">
//       <h3 className="font-bold flex items-center gap-2"><Bell size={18} /> Add Reminder</h3>
//       <input
//         placeholder="Title (e.g. Electricity Bill)"
//         value={reminderForm.title}
//         onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
//         required
//         className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
//       />
//       <input
//         placeholder="Message"
//         value={reminderForm.message}
//         onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
//         className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
//       />
//       <input
//         type="datetime-local"
//         value={reminderForm.remindAt}
//         onChange={(e) => {
//           // convert to LocalDateTime format: 2026-09-20T10:00:00
//           const v = e.target.value;
//           setReminderForm({ ...reminderForm, remindAt: v.length === 16 ? v + ':00' : v });
//         }}
//         required
//         className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
//       />
//       <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
//         Save Reminder
//       </button>
//     </form>

//     <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
//       <h3 className="font-bold mb-4">Your Alerts</h3>
//       {reminders.length === 0 && <p className="text-slate-500 text-sm">No reminders yet</p>}
//       <div className="space-y-2">
//         {reminders.map((r) => (
//           <div key={r.id} className="rounded-xl bg-black/30 border border-white/10 px-4 py-3">
//             <p className="font-semibold text-sm">{r.title}</p>
//             <p className="text-xs text-slate-400">{r.message}</p>
//             <p className="text-[10px] text-cyan-500/80 mt-1">{r.remindAt}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )}

//         {tab === 'history' && (
//           <div className="space-y-2">
//             <button
//       onClick={downloadPDF}
//       className="mb-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm font-semibold hover:bg-white/15"
//     >
//       <Download size={16} /> Download PDF Statement
//     </button>
//             {transactions.length === 0 && <p className="text-slate-500 text-sm">No transactions yet</p>}
//             {transactions.map((tx) => (
//               <div key={tx.id} className="flex justify-between items-center rounded-xl bg-white/5 border border-white/10 px-4 py-3">
//                 <div>
//                   <p className="text-sm font-semibold">{tx.type}</p>
//                   <p className="text-xs text-slate-500">{tx.description}</p>
//                 </div>
//                 <p className={`font-bold text-sm ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
//                   {tx.type === 'DEPOSIT' ? '+' : '-'}Rs. {Number(tx.amount).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import {
  Wallet, ArrowLeftRight, CreditCard, Snowflake,
  History, LogOut, Plus, Building2, Zap, MessageCircle,
  QrCode, Bell, Download
} from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [card, setCard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('home');
  const [msg, setMsg] = useState('');
  const [amount, setAmount] = useState('5000');
  const [transfer, setTransfer] = useState({ toAccountNumber: '', amount: '', description: '' });
  const [bill, setBill] = useState({ billerType: 'ELECTRICITY', consumerNumber: '', amount: '' });
  const [chatInput, setChatInput] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [qrData, setQrData] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [reminderForm, setReminderForm] = useState({ title: '', message: '', remindAt: '' });
  const [qrPay, setQrPay] = useState({ toAccountNumber: '', amount: '' });

  useEffect(() => {
    const u = localStorage.getItem('itsmybank_user');
    if (!u) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(u);
    setUser(parsed);
    loadAll(parsed.userId);
  }, [navigate]);

  const loadAll = async (userId) => {
    try {
      const res = await api.get(`/account/user/${userId}`);
      if (res.data.success && res.data.data?.length) {
        const accs = res.data.data;
        setAccounts(accs);
        const accNo = accs[0].accountNumber;
        const [cardRes, txRes] = await Promise.all([
          api.get(`/account/card/${accNo}`),
          api.get(`/account/transactions/${accNo}`),
        ]);
        if (cardRes.data.success) setCard(cardRes.data.data);
        if (txRes.data.success) setTransactions(txRes.data.data || []);
      }
    } catch {
      setMsg('Failed to load data');
    }
  };

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3500);
  };

  const deposit = async () => {
    if (!accounts[0]) return;
    try {
      const res = await api.post('/account/deposit', {
        accountNumber: accounts[0].accountNumber,
        amount: Number(amount),
      });
      showMsg(res.data.message);
      loadAll(user.userId);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Deposit failed');
    }
  };

  const doTransfer = async (e) => {
    e.preventDefault();
    if (!accounts[0]) return;
    try {
      const res = await api.post('/account/transfer', {
        fromAccountNumber: accounts[0].accountNumber,
        toAccountNumber: transfer.toAccountNumber,
        amount: Number(transfer.amount),
        description: transfer.description || 'Transfer',
      });
      showMsg(res.data.message);
      setTransfer({ toAccountNumber: '', amount: '', description: '' });
      loadAll(user.userId);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Transfer failed');
    }
  };

  const toggleFreeze = async () => {
    if (!accounts[0]) return;
    const accNo = accounts[0].accountNumber;
    const frozen = accounts[0].frozen;
    try {
      const res = await api.put(
        frozen ? `/account/unfreeze/${accNo}` : `/account/freeze/${accNo}`
      );
      showMsg(res.data.message);
      loadAll(user.userId);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Action failed');
    }
  };

  const payBill = async (e) => {
    e.preventDefault();
    if (!accounts[0]) return;
    try {
      const res = await api.post('/banking/bill', {
        accountNumber: accounts[0].accountNumber,
        billerType: bill.billerType,
        consumerNumber: bill.consumerNumber,
        amount: Number(bill.amount),
      });
      showMsg(res.data.message);
      setBill({ billerType: 'ELECTRICITY', consumerNumber: '', amount: '' });
      loadAll(user.userId);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Bill payment failed');
    }
  };

  const sendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      const res = await api.post('/banking/chatbot', { message: chatInput });
      setChatReply(res.data.data?.reply || res.data.message);
      setChatInput('');
    } catch {
      setChatReply('Chatbot unavailable. Please check if backend is running on port 8082.');
    }
  };

  const loadQR = async () => {
    if (!accounts[0]) {
      showMsg('Account not found');
      return;
    }
    try {
      const res = await api.get(`/banking/qr/${accounts[0].accountNumber}`);
      if (res.data.success) {
        setQrData(res.data.data);
      } else {
        setQrData({
          accountNumber: accounts[0].accountNumber,
          accountHolder: user?.fullName,
          qrText: `ITSMYBANK|${accounts[0].accountNumber}|${user?.fullName || ''}`,
        });
      }
    } catch {
      setQrData({
        accountNumber: accounts[0].accountNumber,
        accountHolder: user?.fullName,
        qrText: `ITSMYBANK|${accounts[0].accountNumber}|${user?.fullName || ''}`,
      });
    }
  };

  const loadReminders = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/banking/reminders/${user.userId}`);
      if (res.data.success) setReminders(res.data.data || []);
    } catch {
      setReminders([]);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    try {
      let remindAt = reminderForm.remindAt;
      if (remindAt.length === 16) remindAt = remindAt + ':00';
      const res = await api.post('/banking/reminder', {
        userId: user.userId,
        title: reminderForm.title,
        message: reminderForm.message,
        remindAt,
      });
      showMsg(res.data.message);
      setReminderForm({ title: '', message: '', remindAt: '' });
      loadReminders();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Reminder failed');
    }
  };

  const payByQR = async (e) => {
    e.preventDefault();
    if (!accounts[0]) return;
    try {
      const res = await api.post('/account/transfer', {
        fromAccountNumber: accounts[0].accountNumber,
        toAccountNumber: qrPay.toAccountNumber,
        amount: Number(qrPay.amount),
        description: 'QR Payment',
      });
      showMsg(res.data.message);
      setQrPay({ toAccountNumber: '', amount: '' });
      loadAll(user.userId);
    } catch (err) {
      showMsg(err.response?.data?.message || 'QR payment failed');
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('ItsMyBank - Account Statement', 20, 20);
      doc.setFontSize(10);
      doc.text('Educational project only - not a real bank', 20, 28);

      if (accounts[0]) {
        doc.text('Account: ' + accounts[0].accountNumber, 20, 40);
        doc.text('Balance: Rs. ' + Number(accounts[0].balance).toLocaleString(), 20, 48);
      }
      if (user) {
        doc.text('Name: ' + user.fullName, 20, 56);
      }

      doc.text('Transactions:', 20, 68);
      let y = 76;
      const list = transactions || [];

      if (list.length === 0) {
        doc.text('No transactions yet. Please deposit or transfer first.', 20, y);
      } else {
        list.slice(0, 30).forEach((tx, i) => {
          const line =
            (i + 1) + '. ' +
            (tx.type || '') + ' | Rs.' +
            (tx.amount || 0) + ' | ' +
            (tx.description || '') + ' | ' +
            (tx.status || '');
          doc.text(line.substring(0, 85), 20, y);
          y += 8;
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }

      doc.save('ItsMyBank-Statement.pdf');
      showMsg('PDF downloaded successfully');
    } catch (err) {
      console.error(err);
      showMsg('PDF error: ' + (err.message || 'failed'));
    }
  };

  const logout = () => {
    localStorage.removeItem('itsmybank_user');
    navigate('/login');
  };

  if (!user) return null;
  const acc = accounts[0];

  const tabs = [
    { id: 'home', icon: Wallet, label: 'Home' },
    { id: 'transfer', icon: ArrowLeftRight, label: 'Transfer' },
    { id: 'card', icon: CreditCard, label: 'Card' },
    { id: 'qr', icon: QrCode, label: 'QR' },
    { id: 'bills', icon: Zap, label: 'Bills' },
    { id: 'chat', icon: MessageCircle, label: 'Help' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'reminders', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="font-black text-lg">
                Its<span className="text-cyan-400">MyBank</span>
              </h1>
              <p className="text-slate-500 text-xs">{user.fullName}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-5">
          Educational project only — not a real bank. Demo / test mode.
        </p>

        {msg && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm text-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl py-2"
          >
            {msg}
          </motion.p>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id === 'reminders') loadReminders();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                tab === t.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'home' && acc && (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-600/20 border border-white/10"
            >
              <p className="text-slate-400 text-xs">{acc.accountType} Account</p>
              <p className="text-4xl font-black mt-1">Rs. {Number(acc.balance).toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-3 font-mono">{acc.accountNumber}</p>
              <p className="text-xs mt-1">{acc.frozen ? 'Locked (Frozen)' : 'Active'}</p>
            </motion.div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Plus size={16} className="text-cyan-400" /> Test Deposit
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
                />
                <button onClick={deposit} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
                  Add
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {['1000', '5000', '10000'].map((v) => (
                  <button key={v} onClick={() => setAmount(v)} className="text-xs px-3 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400">
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={toggleFreeze}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
            >
              <Snowflake size={16} className="text-cyan-400" />
              {acc.frozen ? 'Unfreeze Account' : 'Freeze Account'}
            </button>
          </div>
        )}

        {tab === 'transfer' && (
          <form onSubmit={doTransfer} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 max-w-md">
            <h3 className="font-bold">Send Money</h3>
            <input
              placeholder="To Account Number"
              value={transfer.toAccountNumber}
              onChange={(e) => setTransfer({ ...transfer, toAccountNumber: e.target.value })}
              required
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
            />
            <input
              type="number"
              placeholder="Amount"
              value={transfer.amount}
              onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })}
              required
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
            />
            <input
              placeholder="Description (optional)"
              value={transfer.description}
              onChange={(e) => setTransfer({ ...transfer, description: e.target.value })}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
            />
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
              Transfer Now
            </button>
          </form>
        )}

        {tab === 'card' && (
          <div className="max-w-md mx-auto">
            {card ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 35%, #0e7490 70%, #164e63 100%)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-black text-lg">Its<span className="text-cyan-300">MyBank</span></p>
                      <p className="text-cyan-200/70 text-[10px] tracking-[0.2em] uppercase">Debit Card</p>
                    </div>
                    <span className="text-white/50 text-xs font-semibold">VISA</span>
                  </div>
                  <div className="w-12 h-9 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600" />
                  <p className="text-white text-xl font-mono tracking-[0.15em]">{card.cardNumber}</p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-white/50 text-[9px] uppercase">Card Holder</p>
                      <p className="text-white text-sm font-semibold uppercase">{card.cardHolderName}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-[9px] uppercase">Expires</p>
                      <p className="text-white text-sm font-semibold">{card.expiry}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-[9px] uppercase">CVV</p>
                      <p className="text-white text-sm font-semibold">{card.frozen ? '***' : card.cvv}</p>
                    </div>
                  </div>
                </div>
                {card.frozen && (
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] bg-rose-500 text-white px-3 py-0.5 rounded-full font-bold">
                    FROZEN
                  </span>
                )}
              </motion.div>
            ) : (
              <p className="text-slate-500 text-center">No card found</p>
            )}
          </div>
        )}

        {tab === 'qr' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <h3 className="font-bold mb-4">Receive Money — My QR</h3>
              {!accounts[0] ? (
                <p className="text-slate-500 text-sm">No account loaded</p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={loadQR}
                    className="mb-4 text-sm px-4 py-2 rounded-xl bg-cyan-600 font-semibold"
                  >
                    {qrData ? 'Refresh QR' : 'Generate QR'}
                  </button>
                  {qrData && (
                    <>
                      <div className="bg-white p-4 rounded-2xl inline-block">
                        <QRCodeSVG
                          value={String(qrData.qrText || qrData.accountNumber || '')}
                          size={180}
                        />
                      </div>
                      <p className="text-sm text-cyan-300 mt-4 font-mono">{qrData.accountNumber}</p>
                      <p className="text-xs text-slate-500 mt-1">{qrData.accountHolder || user?.fullName}</p>
                    </>
                  )}
                </>
              )}
            </div>

            <form onSubmit={payByQR} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
              <h3 className="font-bold">Pay via Account Number</h3>
              <input
                placeholder="Receiver Account Number"
                value={qrPay.toAccountNumber}
                onChange={(e) => setQrPay({ ...qrPay, toAccountNumber: e.target.value })}
                required
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
              />
              <input
                type="number"
                placeholder="Amount"
                value={qrPay.amount}
                onChange={(e) => setQrPay({ ...qrPay, amount: e.target.value })}
                required
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
              />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
                Pay Now
              </button>
            </form>
          </div>
        )}

        {tab === 'bills' && (
          <form onSubmit={payBill} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 max-w-md">
            <h3 className="font-bold text-lg">Pay Bills</h3>
            <select
              value={bill.billerType}
              onChange={(e) => setBill({ ...bill, billerType: e.target.value })}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
            >
              <option value="ELECTRICITY">Electricity</option>
              <option value="GAS">Gas</option>
              <option value="INTERNET">Internet</option>
              <option value="MOBILE">Mobile</option>
            </select>
            <input
              placeholder="Consumer Number"
              value={bill.consumerNumber}
              onChange={(e) => setBill({ ...bill, consumerNumber: e.target.value })}
              required
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
            />
            <input
              type="number"
              placeholder="Amount"
              value={bill.amount}
              onChange={(e) => setBill({ ...bill, amount: e.target.value })}
              required
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
            />
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
              Pay Bill
            </button>
          </form>
        )}

        {tab === 'chat' && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 max-w-md space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MessageCircle size={18} className="text-cyan-400" /> ItsMyBank Help
            </h3>
            <div className="min-h-[100px] rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-slate-300">
              {chatReply || 'Ask about balance, transfer, deposit, bill, card, freeze, QR...'}
            </div>
            <form onSubmit={sendChat} className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-cyan-600 font-bold text-sm">
                Send
              </button>
            </form>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={downloadPDF}
              className="mb-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-sm font-semibold hover:bg-white/15"
            >
              <Download size={16} /> Download PDF Statement
            </button>
            {transactions.length === 0 && (
              <p className="text-slate-500 text-sm">No transactions yet. Make a deposit first.</p>
            )}
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{tx.type}</p>
                  <p className="text-xs text-slate-500">{tx.description}</p>
                </div>
                <p className={`font-bold text-sm ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}Rs. {Number(tx.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === 'reminders' && (
          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={addReminder} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Bell size={18} /> Add Reminder</h3>
              <input
                placeholder="Title (e.g. Electricity Bill)"
                value={reminderForm.title}
                onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                required
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
              />
              <input
                placeholder="Message"
                value={reminderForm.message}
                onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
              />
              <input
                type="datetime-local"
                value={reminderForm.remindAt}
                onChange={(e) => setReminderForm({ ...reminderForm, remindAt: e.target.value })}
                required
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm"
              />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-sm">
                Save Reminder
              </button>
            </form>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-bold mb-4">Your Alerts</h3>
              {reminders.length === 0 && <p className="text-slate-500 text-sm">No reminders yet</p>}
              <div className="space-y-2">
                {reminders.map((r) => (
                  <div key={r.id} className="rounded-xl bg-black/30 border border-white/10 px-4 py-3">
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-slate-400">{r.message}</p>
                    <p className="text-[10px] text-cyan-500/80 mt-1">{String(r.remindAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}