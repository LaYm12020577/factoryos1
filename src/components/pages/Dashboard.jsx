import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Wallet, Plus, Truck } from "lucide-react";
import { useT } from "../../hooks/useT";
import { Card } from "../ui/Card";

export function Dashboard({ orders, clients, shipments }) {
  const T = useT();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalPaid = orders.reduce((s, o) => s + o.cashPaid + o.wirePaid, 0);
  const totalDebt = orders.reduce((s, o) => s + Math.max(0, o.total - o.cashPaid - o.wirePaid), 0);
  const active = shipments.filter(s => s.status !== "arrived").length;
  const statusLabel = { ordered: T.ordered, in_transit: T.inTransit, customs: T.atCustoms, arrived: T.arrived };

  return (
    <div className="space-y-8 pb-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-3xl font-display font-bold tracking-tight mb-1">{T.dashboard}</h2>
        <p className="text-brand-blue/50 font-medium">{T.factoryOverview} — 2026</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: T.totalRevenue, value: `$${(totalRevenue/1000).toFixed(0)}K`, sub: `${orders.length} ${T.orders_count}`, color: 'brand-blue', icon: <ClipboardList size={24}/> },
          { label: T.totalCollected, value: `$${(totalPaid/1000).toFixed(0)}K`, sub: `${totalRevenue ? Math.round(totalPaid/totalRevenue*100) : 0}% ${T.collected}`, color: 'green', icon: <Wallet size={24}/> },
          { label: T.totalDebt, value: `$${(totalDebt/1000).toFixed(0)}K`, sub: "Cash + Wire", color: 'red', icon: <Plus size={24} className="rotate-45"/> },
          { label: T.activeShipments, value: active, sub: T.enRoute, color: 'yellow', icon: <Truck size={24}/> },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="liquid-glass p-6 rounded-3xl relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {s.icon}
            </div>
            <div className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-4">{s.label}</div>
            <div className="text-3xl font-display font-bold mb-2">{s.value}</div>
            <div className="text-xs font-bold text-brand-blue/60">{s.sub}</div>
            <div className={`absolute bottom-0 left-0 h-1.5 w-full opacity-20 ${s.color === 'brand-blue' ? 'bg-brand-blue' : s.color === 'green' ? 'bg-green-500' : s.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="liquid-glass rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">{T.recentOrders}</h3>
            <button className="text-sm font-bold text-brand-blue/50 hover:text-brand-blue transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-blue/40 border-b border-brand-blue/5">
                  <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">{T.orderId}</th>
                  <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">{T.client}</th>
                  <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">{T.total}</th>
                  <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">{T.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-blue/5">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="group hover:bg-white/40 transition-colors">
                    <td className="py-4 font-bold text-brand-blue">{o.id}</td>
                    <td className="py-4 font-medium">{o.client}</td>
                    <td className="py-4 font-bold text-brand-blue">${o.total.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`
                        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {T[o.status] || o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="liquid-glass rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">{T.incomingShipments}</h3>
          </div>
          <div className="space-y-4">
            {shipments.map(s => {
               const statusStyle = s.status === "arrived" ? 'bg-green-100 text-green-700' : s.status === "in_transit" ? 'bg-blue-100 text-blue-700' : s.status === "customs" ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700';
               return (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/20 group hover:border-brand-lime/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center group-hover:bg-brand-lime/20 transition-colors text-brand-blue">
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{s.id} · <span className="text-brand-blue/50 font-medium">{s.from}</span></div>
                      <div className="text-xs text-brand-blue/40 font-medium">{s.items}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}>
                      {statusLabel[s.status]}
                    </span>
                    <div className="text-[10px] font-bold text-brand-blue/30 mt-2">ETA {s.eta}</div>
                  </div>
                </div>
               )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
