import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, Globe, X, Plus, Trash2 } from "lucide-react";
import { useT } from "../../hooks/useT";
import { save } from "../../utils/helpers";
import { ShipmentDetailModal } from "../modals/ShipmentDetailModal";
import { ConfirmModal } from "../ui/ConfirmModal";

const Toast = ({ msg }) => (
  <div className="fixed bottom-24 left-50 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[999]">
    {msg}
  </div>
);

export function Shipments({ shipments, setShipments }) {
  const T = useT();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ from: "", items: "", eta: "", status: "ordered" });
  const [toast, setToast] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const statusMeta = {
    ordered: { color: 'slate', label: T.ordered, icon: <Package size={20}/> },
    in_transit: { color: 'blue', label: T.inTransit, icon: <Truck size={20}/> },
    customs: { color: 'yellow', label: T.atCustoms, icon: <Globe size={20}/> },
    arrived: { color: 'green', label: T.arrived, icon: <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>✅</motion.div> },
  };

  const handleAdd = () => {
    if (!form.from || !form.items) return;
    const newS = { id: "SHP-" + Date.now().toString().slice(-4), ...form };
    setShipments(prev => { const n = [newS, ...prev]; save("fos_shipments", n); return n; });
    setForm({ from: "", items: "", eta: "", status: "ordered" });
    setShowAdd(false);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setShipments(prev => {
      const n = prev.map(s => s.id === id ? { ...s, status: newStatus } : s);
      save("fos_shipments", n);
      return n;
    });
  };

  const handleDeleteShipment = (id) => {
    setShipments(prev => {
      const n = prev.filter(s => s.id !== id);
      save("fos_shipments", n);
      return n;
    });
    setToast(`${T.deletedMsg} ✓`); 
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-8">
      {toast && <Toast msg={toast} />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{T.shipments}</h2>
          <p className="text-brand-blue/50 font-medium">{T.incomingMaterials}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-brand-blue/20 hover:brightness-110 flex items-center gap-2"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? <X size={20}/> : <Plus size={20}/>}
          {T.addShipment}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="liquid-glass p-8 rounded-[2rem] space-y-6">
              <h3 className="text-xl font-bold">{T.newShipment}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.originCountry}</label>
                  <input className="w-full bg-white border border-brand-blue/5 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-medium" placeholder="China, Turkey..." value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.items}</label>
                  <input className="w-full bg-white border border-brand-blue/5 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-medium" placeholder="Aluminum billets..." value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.eta}</label>
                  <input className="w-full bg-white border border-brand-blue/5 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-medium" type="date" value={form.eta} onChange={e => setForm(f => ({ ...f, eta: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.statusLabel}</label>
                  <select className="w-full bg-white border border-brand-blue/5 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-medium appearance-none" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="ordered">{T.ordered}</option>
                    <option value="in_transit">{T.inTransit}</option>
                    <option value="customs">{T.atCustoms}</option>
                    <option value="arrived">{T.arrived}</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-brand-blue text-white rounded-xl py-4 font-bold shadow-lg shadow-brand-blue/20" onClick={handleAdd}>{T.save}</button>
                <button className="flex-1 bg-brand-blue/5 py-4 rounded-full font-bold text-brand-blue/60 hover:bg-brand-blue/10 transition-colors" onClick={() => setShowAdd(false)}>{T.cancel}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shipments.map((s, i) => {
          const meta = statusMeta[s.status] || statusMeta.ordered;
          return (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedShipment(s)}
              className="liquid-glass p-6 rounded-[2rem] group cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
                    ${s.status === 'arrived' ? 'bg-green-100 text-green-600' : 
                      s.status === 'in_transit' ? 'bg-blue-100 text-blue-600' : 
                      s.status === 'customs' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}
                  `}>
                    {meta.icon}
                  </div>
                  <div>
                    <div className="font-bold text-brand-blue text-lg">{s.id}</div>
                    <div className="text-xs font-bold text-brand-blue/30 uppercase tracking-widest">{s.from}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest
                     ${s.status === 'arrived' ? 'bg-green-100 text-green-700' : 
                       s.status === 'in_transit' ? 'bg-blue-100 text-blue-700' : 
                       s.status === 'customs' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}
                  `}>
                    {meta.label}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(s.id);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/40 rounded-2xl border border-white/50">
                  <div className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mb-1">{T.items}</div>
                  <div className="text-sm font-bold text-brand-blue">{s.items}</div>
                </div>
                
                <div className="flex items-center justify-between px-2">
                  <div className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest">{T.eta}</div>
                  <div className="text-xs font-bold text-brand-blue">{s.eta || "—"}</div>
                </div>

                <div className="text-xs font-medium text-brand-blue/50 text-center pt-2">
                  {T.clickToEdit || "Нажмите на карточку для редактирования"}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedShipment && (
          <ShipmentDetailModal
            shipment={selectedShipment}
            onClose={() => setSelectedShipment(null)}
            onUpdate={handleUpdateStatus}
            onDelete={handleDeleteShipment}
          />
        )}
      </AnimatePresence>

      {showDeleteConfirm && (
        <ConfirmModal
          title={T.deleteShipment || "Удалить доставку?"}
          message={T.deleteShipmentMsg || "Это действие нельзя отменить"}
          confirmLabel={T.delete}
          cancelLabel={T.cancel}
          onConfirm={() => {
            handleDeleteShipment(showDeleteConfirm);
            setShowDeleteConfirm(null);
          }}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
