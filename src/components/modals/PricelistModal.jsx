import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, ClipboardList, Globe } from "lucide-react";
import { useT } from "../../hooks/useT";
import { TAX_RATE } from "../../constants/data";

export function PricelistModal({ clients, products, onClose }) {
  const T = useT();
  const [selClient, setSelClient] = useState(clients[0]?.id ?? null);
  const client = clients.find(c => c.id === Number(selClient));
  const alumProds = products.filter(p => p.type === "alum");
  const bimetalProds = products.filter(p => p.type === "bimetal");

  return (
    <div className="fixed inset-0 z-[200] bg-brand-blue/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl max-w-4xl w-full overflow-hidden my-auto" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-brand-blue">{T.plTitle}</h2>
              <p className="text-brand-blue/50 font-medium">{T.plSubtitle}</p>
            </div>
            <button className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.selectClient}</label>
              <div className="relative">
                <select className="w-full bg-white border border-brand-blue/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-lime outline-none font-bold text-brand-blue appearance-none shadow-sm" value={selClient} onChange={e => setSelClient(e.target.value)}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-blue/30 pointer-events-none" />
              </div>
            </div>
            <div className="bg-brand-lime/20 border border-brand-lime/30 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-lime flex items-center justify-center text-brand-blue shadow-sm">💡</div>
              <div className="text-xs font-bold text-brand-blue/70 leading-relaxed">{T.taxNote}</div>
            </div>
          </div>

          {client && (
            <div className="space-y-8">
              {[["alum", alumProds, T.aluminum, 'text-yellow-600'], ["bimetal", bimetalProds, T.bimetal, 'text-blue-500']].map(([key, prods, label, colorCls]) => (
                <div key={key}>
                  <div className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${colorCls} flex items-center gap-3`}>
                    <div className="h-px flex-1 bg-current opacity-10" />
                    {label} ({prods.length})
                    <div className="h-px flex-1 bg-current opacity-10" />
                  </div>
                  <div className="overflow-x-auto rounded-3xl border border-brand-blue/5 bg-white/40 shadow-sm">
                    <table className="w-full text-xs font-medium text-left">
                      <thead>
                        <tr className="bg-brand-blue/5 text-brand-blue/40 uppercase tracking-widest text-[9px]">
                          <th className="px-6 py-4">№</th>
                          <th className="px-6 py-4">{T.model}</th>
                          <th className="px-6 py-4">{T.cashNote}</th>
                          <th className="px-6 py-4">{T.wireNote}</th>
                          <th className="px-6 py-4 hidden sm:table-cell">{T.specMm}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-blue/5">
                        {prods.map((p, i) => {
                          const cash = client.prices[p.code] ?? "-";
                          const wire = typeof cash === "number" ? (cash * (1 + TAX_RATE)).toFixed(2) : "-";
                          return (
                            <tr key={p.code} className="hover:bg-white/60 transition-colors">
                              <td className="px-6 py-4 text-brand-blue/30 font-bold">{i + 1}</td>
                              <td className="px-6 py-4 font-bold text-brand-blue">{p.code}</td>
                              <td className="px-6 py-4 font-bold text-green-600">${cash}</td>
                              <td className="px-6 py-4 font-bold text-blue-500">${wire}</td>
                              <td className="px-6 py-4 text-brand-blue/40 hidden sm:table-cell">{p.spec}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-brand-blue/5">
                <button className="flex-1 bg-brand-blue text-white rounded-xl py-4 font-bold shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3">
                  <ClipboardList size={20} />
                  {T.generateBtn} Excel
                </button>
                <button className="flex-1 bg-brand-blue text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-3">
                  <Globe size={20} className="text-brand-lime" />
                  {T.generateBtn} PNG
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
