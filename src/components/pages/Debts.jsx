import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useT } from "../../hooks/useT";
import { computeClientDebts } from "../../utils/helpers";

export function Debts({ clients, orders }) {
  const T = useT();
  const [filterClient, setFilterClient] = useState("all");
  const [expandedClientId, setExpandedClientId] = useState(null);
  const clientDebts = computeClientDebts(orders);
  const shown = filterClient === "all" ? clients : clients.filter(c => c.name === filterClient);
  
  const shownDebts = shown.map(c => {
    const cd = clientDebts[c.name] ?? { cashDebt: 0, wireDebt: 0 };
    return { client: c, cashDebt: Math.round(cd.cashDebt), wireDebt: Math.round(cd.wireDebt) };
  });
  const totalCash = shownDebts.reduce((s, d) => s + d.cashDebt, 0);
  const totalWire = shownDebts.reduce((s, d) => s + d.wireDebt, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">{T.debtsTitle}</h2>
        <p className="text-brand-blue/50 font-medium">{T.debtsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="liquid-glass p-6 rounded-3xl border-l-8 border-green-500">
          <div className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">{T.totalCashDebt}</div>
          <div className="text-3xl font-display font-bold text-green-600">${totalCash.toLocaleString()}</div>
        </div>
        <div className="liquid-glass p-6 rounded-3xl border-l-8 border-blue-400">
          <div className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">{T.totalWireDebt}</div>
          <div className="text-3xl font-display font-bold text-blue-600">${totalWire.toLocaleString()}</div>
        </div>
      </div>

      <div className="max-w-md">
        <label className="block text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-3">{T.filterClient}</label>
        <div className="relative">
          <select 
            className="w-full bg-white/50 border border-brand-blue/10 rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-lime font-medium"
            value={filterClient} 
            onChange={e => setFilterClient(e.target.value)}
          >
            <option value="all">{T.allClients}</option>
            {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-blue/40 pointer-events-none" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {shownDebts.map(({ client: c, cashDebt, wireDebt }) => {
          const total = cashDebt + wireDebt;
          const isExpanded = expandedClientId === c.id;

          return (
            <motion.div 
              key={c.id} 
              layout
              className="liquid-glass rounded-3xl overflow-hidden group"
            >
              <div 
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedClientId(isExpanded ? null : c.id)}
              >
                <div>
                  <div className="text-xl font-bold text-brand-blue">{c.name}</div>
                  <div className="text-sm text-brand-blue/40 font-medium">{c.country}</div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-2xl font-display font-bold ${total > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      ${total.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest">{T.totalDebtLabel}</div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-brand-blue/20 group-hover:text-brand-blue/40">
                    <ChevronDown size={24} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-brand-blue/5"
                  >
                    <div className="p-6 space-y-6 bg-white/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/40 p-4 rounded-2xl border border-white/50">
                          <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest mb-1">{T.cashDebt}</div>
                          <div className="text-xl font-bold text-green-600">${cashDebt.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/40 p-4 rounded-2xl border border-white/50">
                          <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest mb-1">{T.wireDebt}</div>
                          <div className="text-xl font-bold text-blue-600">${wireDebt.toLocaleString()}</div>
                        </div>
                      </div>

                      {(() => {
                        const clientOrders = orders.filter(o => o.client === c.name && (o.total - o.cashPaid - o.wirePaid) > 0);
                        if (clientOrders.length === 0) return null;

                        return (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-medium">
                              <thead>
                                <tr className="text-left text-brand-blue/40 border-b border-brand-blue/5">
                                  <th className="pb-2 uppercase tracking-widest text-[10px]">{T.orderId}</th>
                                  <th className="pb-2 uppercase tracking-widest text-[10px] text-right">{T.total}</th>
                                  <th className="pb-2 uppercase tracking-widest text-[10px] text-right">{T.remaining}</th>
                                  <th className="pb-2 uppercase tracking-widest text-[10px] text-right">{T.status}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-brand-blue/5">
                                {clientOrders.map(o => (
                                  <tr key={o.id}>
                                    <td className="py-3 font-bold text-brand-blue">{o.id}</td>
                                    <td className="py-3 text-right">${o.total.toLocaleString()}</td>
                                    <td className="py-3 text-right font-bold text-red-500">${(o.total - o.cashPaid - o.wirePaid).toLocaleString()}</td>
                                    <td className="py-3 text-right">
                                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold">
                                        {T[o.status] || o.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}

                      <div className="flex gap-3">
                        <button className="flex-1 bg-brand-blue text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-blue/90 transition-colors">
                          {T.exportBtn}
                        </button>
                        <button className="flex-1 bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-sm hover:bg-brand-blue/5 transition-colors">
                          {T.viewOrders}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
