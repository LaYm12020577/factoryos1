import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import { useT } from "../../hooks/useT";
import { OrderModal } from "../modals/OrderModal";
import { NewOrderModal } from "../modals/NewOrderModal";
import { ConfirmModal } from "../ui/ConfirmModal";
import { save } from "../../utils/helpers";

const Toast = ({ msg }) => (
  <div className="fixed bottom-24 left-50 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[999]">
    {msg}
  </div>
);

export function Orders({ orders, setOrders, clients, products }) {
  const T = useT();
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = orders.filter(o => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    return true;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handlePaymentSaved = (orderId, type, amount) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id !== orderId) return o;
        const newCash = type === "cash" ? o.cashPaid + amount : o.cashPaid;
        const newWire = type === "wire" ? o.wirePaid + amount : o.wirePaid;
        const newPaid = newCash + newWire;
        const newStatus = newPaid >= o.total ? "paid" : newPaid > 0 ? "partial" : "unpaid";
        return { ...o, cashPaid: newCash, wirePaid: newWire, status: newStatus };
      });
      save("fos_orders", updated);
      return updated;
    });
    setSelected(null);
    showToast(T.savedMsg);
  };

  const handleNewOrder = (order) => {
    setOrders(prev => { const n = [order, ...prev]; save("fos_orders", n); return n; });
    showToast(T.savedMsg);
  };

  const handleEditOrder = (updatedOrder) => {
    setOrders(prev => {
      const n = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      save("fos_orders", n); return n;
    });
    setSelected(null);
    showToast(T.savedMsg);
  };

  const handleDeleteConfirmed = () => {
    setOrders(prev => {
      const n = prev.filter(o => o.id !== confirmDeleteId);
      save("fos_orders", n); return n;
    });
    setConfirmDeleteId(null);
    setSelected(null);
    showToast(T.savedMsg);
  };

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} />}
      {selected && !editingOrder && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onPaymentSaved={handlePaymentSaved}
          onEdit={(o) => { setEditingOrder(o); setSelected(null); }}
          onDelete={(id) => setConfirmDeleteId(id)}
          clients={clients}
          products={products}
        />
      )}
      {confirmDeleteId && (
        <ConfirmModal
          title={T.confirmDeleteTitle}
          message={T.confirmDeleteMsg}
          confirmLabel={T.confirmYes}
          cancelLabel={T.confirmNo}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
      {showNew && <NewOrderModal clients={clients} orders={orders} onClose={() => setShowNew(false)} onSave={handleNewOrder} products={products} />}
      {editingOrder && (
        <NewOrderModal
          clients={clients}
          orders={orders}
          onClose={() => setEditingOrder(null)}
          onSave={handleEditOrder}
          initialOrder={editingOrder}
          products={products}
        />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{T.orders}</h2>
          <p className="text-brand-blue/50 font-medium">{T.clickRow}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-brand-blue/20 hover:brightness-110 flex items-center justify-center gap-2"
          onClick={() => setShowNew(true)}
        >
          <Plus size={20} />
          {T.newOrder}
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "paid", "partial", "unpaid"].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilterStatus(f)} 
            className={`
              px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all
              ${filterStatus === f 
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                : 'bg-white text-brand-blue/60 hover:bg-brand-blue/5'}
            `}
          >
            {T[f]}
          </button>
        ))}
      </div>

      <div className="liquid-glass rounded-3xl overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue/40 border-b border-brand-blue/5">
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.orderId}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.client}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.total}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.remaining}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.progress}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-blue/5">
              {filtered.map(o => {
                const paid = o.cashPaid + o.wirePaid;
                const pct = Math.round(paid / o.total * 100);
                const cp = Math.round(o.cashPaid / o.total * 100);
                const wp = Math.round(o.wirePaid / o.total * 100);
                const rem = o.total - paid;
                const statusStyle = o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

                return (
                  <motion.tr 
                    key={o.id} 
                    onClick={() => setSelected(o)} 
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.4)" }}
                    className="cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-blue">{o.id}</div>
                      <div className="text-[10px] font-bold text-brand-blue/30 uppercase">{o.date}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{o.client}</td>
                    <td className="px-6 py-4 font-bold text-brand-blue">${o.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${rem > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ${rem.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-brand-blue/5 rounded-full overflow-hidden flex">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${cp}%` }} className="bg-green-500 h-full" />
                          <motion.div initial={{ width: 0 }} animate={{ width: `${wp}%` }} className="bg-blue-400 h-full" />
                        </div>
                        <span className="text-[10px] font-bold text-brand-blue/40 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right sm:text-left">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}>
                        {T[o.status] || o.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-brand-blue/40 font-bold uppercase tracking-widest text-xs">
            {T.noOrders}
          </div>
        )}
      </div>
    </div>
  );
}
