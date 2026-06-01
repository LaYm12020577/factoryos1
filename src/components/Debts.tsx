import React, { useState } from 'react';
import { Client, Order, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { computeClientDebts, save, load } from '../data/defaults';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  DollarSign, 
  AlertCircle, 
  ArrowDownCircle, 
  MapPin, 
  ArrowUpRight, 
  Sparkles, 
  Plus, 
  CheckCircle2,
  Lock
} from 'lucide-react';

interface DebtsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  lang: Language;
}

export default function Debts({ clients, setClients, orders, setOrders, lang }: DebtsProps) {
  const T = TRANSLATIONS[lang];
  const [search, setSearch] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Payments form (Bulk)
  const [showPayForm, setShowPayForm] = useState<boolean>(false);
  const [payType, setPayType] = useState<'cash' | 'wire'>('cash');
  const [payAmount, setPayAmount] = useState<string>("");
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Right pane options
  const [ledgerFilter, setLedgerFilter] = useState<'unpaid' | 'paid' | 'all'>('unpaid');
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [customPayAmount, setCustomPayAmount] = useState<string>("");
  const [customPayType, setCustomPayType] = useState<'cash' | 'wire'>('cash');

  // Unified Payment history transactions timeline state
  interface PaymentHistoryItem {
    id: string;
    client: string;
    amount: number;
    type: 'cash' | 'wire';
    date: string;
    reference?: string;
  }
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(() => {
    const defaults = [
      { id: "TX-1001", client: "Ozodbek", amount: 12000, type: "cash" as const, date: "2026-04-10", reference: "Invoice NW2604001" },
      { id: "TX-1002", client: "Ozodbek", amount: 8500, type: "wire" as const, date: "2026-04-11", reference: "Invoice NW2604001" },
      { id: "TX-1003", client: "Abu Tashkent", amount: 11200, type: "cash" as const, date: "2026-04-08", reference: "Invoice NW2604002" },
      { id: "TX-1004", client: "Abu Tashkent", amount: 11200, type: "wire" as const, date: "2026-04-08", reference: "Invoice NW2604002" },
      { id: "TX-1005", client: "Xushnudbek", amount: 20000, type: "wire" as const, date: "2026-04-15", reference: "Invoice NW2604003" },
      { id: "TX-1006", client: "Azizbek", amount: 10500, type: "cash" as const, date: "2026-04-20", reference: "Invoice NW2604005" },
      { id: "TX-1007", client: "Azizbek", amount: 9000, type: "wire" as const, date: "2026-04-20", reference: "Invoice NW2604005" }
    ];
    return load<PaymentHistoryItem[]>("fos_payment_history", defaults);
  });

  const clientDebts = computeClientDebts(orders);

  // Aggregate outstanding
  let totalCashDebt = 0;
  let totalWireDebt = 0;

  const list = clients.map(c => {
    const d = clientDebts[c.name] || { cashDebt: 0, wireDebt: 0 };
    // Merging initial setup debts with standard dynamic order outstandings
    const finalCash = c.cashDebt + d.cashDebt;
    const finalWire = c.wireDebt + d.wireDebt;
    return {
      ...c,
      cashDebt: finalCash,
      wireDebt: finalWire,
      totalDebt: finalCash + finalWire,
    };
  }).filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.country.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.totalDebt - a.totalDebt);

  // Compute grand aggregated total outstanding cash & wire sums across all indices
  for (const item of list) {
    totalCashDebt += item.cashDebt;
    totalWireDebt += item.wireDebt;
  }

  const clientProfile = clients.find(c => c.name === selectedClient);

  // Compile active invoices comprising starting debts and standard orders
  const activeInvoices: any[] = [];
  if (selectedClient && clientProfile && (clientProfile.cashDebt + clientProfile.wireDebt > 0)) {
    const startObj = {
      id: `START-${clientProfile.id}`,
      client: clientProfile.name,
      items: [],
      total: clientProfile.cashDebt + clientProfile.wireDebt,
      cashPaid: 0,
      wirePaid: 0,
      status: 'unpaid' as const,
      date: 'N/A',
      isStartingBalance: true,
      cashDebt: clientProfile.cashDebt,
      wireDebt: clientProfile.wireDebt
    };
    if (ledgerFilter === 'unpaid' || ledgerFilter === 'all') {
      activeInvoices.push(startObj);
    }
  }

  const actualInvoices = orders.filter(o => {
    if (selectedClient && o.client !== selectedClient) return false;
    if (ledgerFilter === 'unpaid' && o.status === 'paid') return false;
    if (ledgerFilter === 'paid' && o.status !== 'paid') return false;
    return true;
  });
  activeInvoices.push(...actualInvoices);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handlePayOrder = (orderId: string, amt: number, type: 'cash' | 'wire') => {
    if (orderId.startsWith("START-")) {
      setClients(prev => {
        const updated = prev.map(c => {
          if (c.name !== selectedClient) return c;
          if (type === 'cash') {
            return { ...c, cashDebt: Math.max(0, c.cashDebt - amt) };
          } else {
            return { ...c, wireDebt: Math.max(0, c.wireDebt - amt) };
          }
        });
        save("fos_clients", updated);
        return updated;
      });

      const txId = "TX-" + Math.floor(1000 + Math.random() * 9000);
      const newTx = {
        id: txId,
        client: selectedClient!,
        amount: amt,
        type: type,
        date: new Date().toISOString().slice(0, 10),
        reference: `Cleared Starting Debt`
      };
      setPaymentHistory(prev => {
        const next = [newTx, ...prev];
        save("fos_payment_history", next);
        return next;
      });
      triggerToast(T.savedMsg);
      return;
    }

    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id !== orderId) return o;
        const newCash = type === "cash" ? o.cashPaid + amt : o.cashPaid;
        const newWire = type === "wire" ? o.wirePaid + amt : o.wirePaid;
        const newPaid = newCash + newWire;
        const newStatus: 'paid' | 'partial' | 'unpaid' = newPaid >= o.total ? "paid" : newPaid > 0 ? "partial" : "unpaid";
        return { ...o, cashPaid: newCash, wirePaid: newWire, status: newStatus };
      });
      save("fos_orders", updated);
      return updated;
    });

    const txId = "TX-" + Math.floor(1000 + Math.random() * 9000);
    const newTx = {
      id: txId,
      client: selectedClient!,
      amount: amt,
      type: type,
      date: new Date().toISOString().slice(0, 10),
      reference: `Invoice ${orderId}`
    };
    setPaymentHistory(prev => {
      const next = [newTx, ...prev];
      save("fos_payment_history", next);
      return next;
    });

    triggerToast(T.savedMsg);
  };

  const handleCustomPay = (orderId: string) => {
    const amt = parseFloat(customPayAmount);
    if (!amt || amt <= 0) return;

    if (orderId.startsWith("START-")) {
      setClients(prev => {
        const updated = prev.map(c => {
          if (c.name !== selectedClient) return c;
          if (customPayType === 'cash') {
            const sub = Math.min(amt, c.cashDebt);
            return { ...c, cashDebt: c.cashDebt - sub };
          } else {
            const sub = Math.min(amt, c.wireDebt);
            return { ...c, wireDebt: c.wireDebt - sub };
          }
        });
        save("fos_clients", updated);
        return updated;
      });

      const txId = "TX-" + Math.floor(1000 + Math.random() * 9000);
      const newTx = {
        id: txId,
        client: selectedClient!,
        amount: amt,
        type: customPayType,
        date: new Date().toISOString().slice(0, 10),
        reference: `Partial Paid Starting Debt`
      };
      setPaymentHistory(prev => {
        const next = [newTx, ...prev];
        save("fos_payment_history", next);
        return next;
      });

      setPayingOrderId(null);
      setCustomPayAmount("");
      triggerToast(T.savedMsg);
      return;
    }

    setOrders(prev => {
      let actualAmt = 0;
      const updated = prev.map(o => {
        if (o.id !== orderId) return o;
        const oDue = o.total - o.cashPaid - o.wirePaid;
        actualAmt = Math.min(amt, oDue);

        const newCash = customPayType === "cash" ? o.cashPaid + actualAmt : o.cashPaid;
        const newWire = customPayType === "wire" ? o.wirePaid + actualAmt : o.wirePaid;
        const newPaid = newCash + newWire;
        const newStatus: 'paid' | 'partial' | 'unpaid' = newPaid >= o.total ? "paid" : newPaid > 0 ? "partial" : "unpaid";
        return { ...o, cashPaid: newCash, wirePaid: newWire, status: newStatus };
      });

      if (actualAmt > 0) {
        const txId = "TX-" + Math.floor(1000 + Math.random() * 9000);
        const newTx = {
          id: txId,
          client: selectedClient!,
          amount: actualAmt,
          type: customPayType,
          date: new Date().toISOString().slice(0, 10),
          reference: `Invoice ${orderId} (Partial)`
        };
        setPaymentHistory(prevH => {
          const next = [newTx, ...prevH];
          save("fos_payment_history", next);
          return next;
        });
      }

      save("fos_orders", updated);
      return updated;
    });

    setPayingOrderId(null);
    setCustomPayAmount("");
    triggerToast(T.savedMsg);
  };

  const handleBulkPayment = () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0 || !selectedClient) return;

    let remainingPayment = amt;

    setOrders(prev => {
      const clientInvoices = prev
        .filter(o => o.client === selectedClient && o.status !== "paid")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const paymentDistribution: Record<string, { addCash: number; addWire: number }> = {};

      for (const inv of clientInvoices) {
        if (remainingPayment <= 0) break;
        const oDue = inv.total - inv.cashPaid - inv.wirePaid;
        if (oDue <= 0) continue;

        const payingAmt = Math.min(oDue, remainingPayment);
        remainingPayment -= payingAmt;

        paymentDistribution[inv.id] = {
          addCash: payType === 'cash' ? payingAmt : 0,
          addWire: payType === 'wire' ? payingAmt : 0
        };
      }

      const updated = prev.map(o => {
        const dist = paymentDistribution[o.id];
        if (!dist) return o;

        const newCash = o.cashPaid + dist.addCash;
        const newWire = o.wirePaid + dist.addWire;
        const newPaid = newCash + newWire;
        const newStatus: 'paid' | 'partial' | 'unpaid' = newPaid >= o.total ? "paid" : newPaid > 0 ? "partial" : "unpaid";

        return { ...o, cashPaid: newCash, wirePaid: newWire, status: newStatus };
      });

      save("fos_orders", updated);
      return updated;
    });

    if (remainingPayment > 0) {
      setClients(prev => {
        const updated = prev.map(c => {
          if (c.name !== selectedClient) return c;
          if (payType === 'cash') {
            const sub = Math.min(remainingPayment, c.cashDebt);
            remainingPayment -= sub;
            return { ...c, cashDebt: c.cashDebt - sub };
          } else {
            const sub = Math.min(remainingPayment, c.wireDebt);
            remainingPayment -= sub;
            return { ...c, wireDebt: c.wireDebt - sub };
          }
        });
        save("fos_clients", updated);
        return updated;
      });
    }

    const txId = "TX-" + Math.floor(1000 + Math.random() * 9000);
    const newTx = {
      id: txId,
      client: selectedClient,
      amount: amt,
      type: payType,
      date: payDate || new Date().toISOString().slice(0, 10),
      reference: `Bulk Payment (Auto-Split)`
    };
    setPaymentHistory(prev => {
      const next = [newTx, ...prev];
      save("fos_payment_history", next);
      return next;
    });

    setPayAmount("");
    setShowPayForm(false);
    triggerToast(T.savedMsg);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Toast Notifs */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-semibold font-display px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-[999] tracking-wide"
          >
            <Sparkles className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {T.debts}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {T.debtsSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-rose-50 text-rose-700 dark:bg-rose-955/35 dark:text-rose-400 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/40">
            TOTAL DEBT: ${(totalCashDebt + totalWireDebt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Aggregate balance displays */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-left relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{T.totalCashDebt}</div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">${totalCashDebt.toLocaleString()}</div>
          <div className="absolute right-4 bottom-4 text-emerald-100 dark:text-slate-800/20"><DollarSign className="w-12 h-12" /></div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-left relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{T.totalWireDebt}</div>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">${totalWireDebt.toLocaleString()}</div>
          <div className="absolute right-4 bottom-4 text-cyan-100 dark:text-slate-800/20"><DollarSign className="w-12 h-12" /></div>
        </div>
        <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-3xl shadow-sm text-left relative overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{T.totalDebt}</div>
          <div className="text-2xl font-black font-mono text-indigo-600 dark:text-sky-400">${(totalCashDebt + totalWireDebt).toLocaleString()}</div>
          <div className="absolute right-4 bottom-4 text-indigo-100 dark:text-slate-800/25"><AlertCircle className="w-12 h-12" /></div>
        </div>
      </div>

      {/* Row filtering search */}
      <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm max-w-md w-full gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder={T.filterClient} 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-sm"
        />
      </div>

      {/* Grid of clients debits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Client Balances List (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base text-left border-b border-slate-100 dark:border-slate-800 pb-3">
            {T.allClients}
          </h3>

          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin">
            {list.map(c => {
              const isSelected = selectedClient === c.name;
              return (
                <div 
                  key={c.id}
                  onClick={() => setSelectedClient(isSelected ? null : c.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center text-left ${isSelected ? 'bg-indigo-50/20 border-indigo-400/80 dark:bg-indigo-950/20 dark:border-sky-500/75' : 'bg-slate-50 dark:bg-slate-950/40 border-slate-150 dark:border-slate-800/30 hover:border-slate-300'}`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {c.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-450 dark:text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.country}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1 font-mono">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      ${c.totalDebt.toLocaleString()}
                    </div>
                    {c.totalDebt > 0 && (
                      <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wide">
                        <span className="text-emerald-650 dark:text-emerald-400">💵 ${c.cashDebt.toLocaleString()}</span>
                        <span className="text-slate-300 dark:text-slate-800">|</span>
                        <span className="text-cyan-600 dark:text-cyan-405">🏦 ${c.wireDebt.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Client detailed invoices / register payment panel (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                {selectedClient ? `${selectedClient} — Invoices` : "Detailed Ledger"}
              </h3>
              {selectedClient && (
                <button 
                  onClick={() => setShowPayForm(p => !p)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-display cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {T.addPayment}
                </button>
              )}
            </div>

            {/* Expansible bulk pay form */}
            {selectedClient && showPayForm ? (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mb-5 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-4 text-left overflow-hidden"
              >
                <div className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">{T.addPaymentTitle} (Bulk / Auto-split)</div>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-sans font-bold mb-1 block">{T.paymentType}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setPayType('cash')}
                        className={`py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${payType === 'cash' ? 'bg-emerald-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500'}`}
                      >
                        {T.cash}
                      </button>
                      <button 
                        onClick={() => setPayType('wire')}
                        className={`py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all ${payType === 'wire' ? 'bg-cyan-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500'}`}
                      >
                        {T.wire}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-sans font-bold mb-1 block">{T.paymentAmount}</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-lg p-1.5 text-xs text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBulkPayment} className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer">{T.save}</button>
                  <button onClick={() => setShowPayForm(false)} className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-655 rounded-lg text-xs cursor-pointer">{T.cancel}</button>
                </div>
              </motion.div>
            ) : null}

            {/* Filter segments tab group */}
            {selectedClient && (
              <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-4 text-xs font-semibold gap-1">
                {(['unpaid', 'paid', 'all'] as const).map(f => {
                  const label = {
                    uz: { unpaid: "Qarzlar", paid: "To'langan", all: "Barchasi" },
                    ru: { unpaid: "Долги", paid: "Оплачено", all: "Все счета" },
                    zh: { unpaid: "待付账单", paid: "已结算", all: "全部" },
                    en: { unpaid: "Outstanding", paid: "Paid", all: "All" }
                  }[lang]?.[f] || f;
                  
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setLedgerFilter(f);
                        setPayingOrderId(null);
                      }}
                      className={`py-1.5 rounded-lg text-center cursor-pointer transition-all ${ledgerFilter === f ? 'bg-white dark:bg-slate-850 text-indigo-600 dark:text-sky-400 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Invoices queue view */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {activeInvoices.length === 0 ? (
                <div className="text-center p-10 text-slate-400 dark:text-slate-550 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl font-display text-sm">
                  {selectedClient ? "No invoices found for this filter!" : "Select a client on the left to review invoice books"}
                </div>
              ) : (
                activeInvoices.map(o => {
                  const rem = o.total - o.cashPaid - o.wirePaid;
                  const isPayingThis = payingOrderId === o.id;

                  return (
                    <div 
                      key={o.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/40 rounded-xl flex flex-col gap-2.5 text-left transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-indigo-600 dark:text-sky-400 text-xs">{o.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({o.client})</span>
                          </div>
                          <div className="text-[10px] text-slate-450 dark:text-slate-500 font-mono">
                            Date: {o.date}
                          </div>
                        </div>

                        <div className="text-right">
                          {rem <= 0 ? (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                              ✓ {T.paid}
                            </span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className="font-mono font-bold text-rose-550 text-xs">${rem.toLocaleString()}</span>
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">DUE</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment levels breakdown */}
                      <div className="text-[10px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-lg p-2.5 flex justify-between items-center gap-2 font-mono">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">T:</span> <span className="font-bold text-slate-800 dark:text-slate-200">${o.total.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-slate-200 dark:text-slate-800">|</span>
                          <div>
                            <span className="text-emerald-500">💵:</span> <span className="text-emerald-650 dark:text-emerald-400 font-bold">${o.cashPaid.toLocaleString()}</span>
                          </div>
                          <span className="text-slate-200 dark:text-slate-800">|</span>
                          <div>
                            <span className="text-cyan-500 font-bold">🏦:</span> <span className="text-cyan-600 dark:text-cyan-400 font-bold">${o.wirePaid.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons if not paid */}
                      {rem > 0 && (
                        <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-150/40 dark:border-slate-800/40">
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold font-mono">Action:</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handlePayOrder(o.id, rem, 'cash')}
                              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold font-mono uppercase tracking-wider rounded-md border border-emerald-250/35 cursor-pointer active:scale-95 transition-all"
                            >
                              💵 {T.cash}
                            </button>
                            <button 
                              onClick={() => handlePayOrder(o.id, rem, 'wire')}
                              className="px-2 py-0.5 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/15 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold font-mono uppercase tracking-wider rounded-md border border-cyan-255/35 cursor-pointer active:scale-95 transition-all"
                            >
                              🏦 {T.wire}
                            </button>
                            <button 
                              onClick={() => {
                                if (isPayingThis) {
                                  setPayingOrderId(null);
                                } else {
                                  setPayingOrderId(o.id);
                                  setCustomPayAmount(rem.toString());
                                }
                              }}
                              className={`px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider rounded-md border cursor-pointer active:scale-95 transition-all ${isPayingThis ? 'bg-indigo-620 text-white border-indigo-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-350 border-slate-200 dark:border-slate-700/60'}`}
                            >
                              ✏️ {lang === 'ru' ? 'Част.' : 'Partial'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expandable Inline custom partial pay form */}
                      <AnimatePresence>
                        {isPayingThis && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-xl p-3.5 space-y-3 overflow-hidden text-xs text-left my-1"
                          >
                            <div className="font-bold text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
                              <span>Partial Payment Form</span>
                              <span className="font-mono text-indigo-600 dark:text-sky-400">{o.id}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase font-extrabold mb-1 block">Pay Via:</label>
                                <div className="grid grid-cols-2 gap-1 font-mono">
                                  <button
                                    onClick={() => setCustomPayType('cash')}
                                    className={`py-1 rounded text-[10px] font-extrabold uppercase transition-all cursor-pointer ${customPayType === 'cash' ? 'bg-emerald-600 text-white shadow-xs' : 'border border-slate-250 dark:border-slate-700 text-slate-500'}`}
                                  >
                                    CASH
                                  </button>
                                  <button
                                    onClick={() => setCustomPayType('wire')}
                                    className={`py-1 rounded text-[10px] font-extrabold uppercase transition-all cursor-pointer ${customPayType === 'wire' ? 'bg-cyan-600 text-white shadow-xs' : 'border border-slate-250 dark:border-slate-700 text-slate-500'}`}
                                  >
                                    WIRE
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase font-extrabold mb-1 block">Amount ($):</label>
                                <input
                                  type="number"
                                  max={rem}
                                  placeholder={`Max $${rem}`}
                                  value={customPayAmount}
                                  onChange={e => setCustomPayAmount(e.target.value)}
                                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 font-mono text-xs text-slate-850 dark:text-white outline-none font-extrabold"
                                />
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCustomPay(o.id)}
                                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold rounded-lg text-[10px] uppercase cursor-pointer"
                              >
                                Record Payment
                              </button>
                              <button
                                onClick={() => setPayingOrderId(null)}
                                className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] uppercase cursor-pointer"
                              >
                                {T.cancel}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            {/* Payment History Block */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-450">
                  {lang === 'ru' ? "История платежей" : lang === 'uz' ? "To'lovlar tarixi" : "Payment History Timeline"}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-0.5 text-slate-500 font-mono rounded-md">
                  {selectedClient 
                    ? (paymentHistory.filter(p => p.client === selectedClient).length) + " items" 
                    : paymentHistory.length + " items"
                  }
                </span>
              </div>

              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {(() => {
                  const itemsToShow = selectedClient 
                    ? paymentHistory.filter(p => p.client === selectedClient) 
                    : paymentHistory;

                  if (itemsToShow.length === 0) {
                    return (
                      <div className="text-xs text-slate-400 italic text-center py-4">
                        No payments recorded yet!
                      </div>
                    );
                  }

                  return itemsToShow.map(p => (
                    <div key={p.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/30 border border-slate-150 dark:border-slate-800/50 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">{p.client}</span>
                          <span className="text-[9px] bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400 font-mono px-1.5 py-0.5 rounded">
                            {p.id}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.date} · <span className="italic">{p.reference || "Payment"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-black ${p.type === 'cash' ? 'text-emerald-550' : 'text-cyan-555'}`}>
                          {p.type === 'cash' ? '💵' : '🏦'} +${p.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
