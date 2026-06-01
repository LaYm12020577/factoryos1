import React, { useState } from 'react';
import { Shipment, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { save } from '../data/defaults';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Anchor, 
  Truck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CircleDot, 
  CheckCircle, 
  X,
  Package,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ShipmentsProps {
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  lang: Language;
}

export default function Shipments({ shipments, setShipments, lang }: ShipmentsProps) {
  const T = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Shipment Fields
  const [newFrom, setNewFrom] = useState<string>("");
  const [newItems, setNewItems] = useState<string>("");
  const [newEta, setNewEta] = useState<string>("");
  const [newStatus, setNewStatus] = useState<'ordered' | 'in_transit' | 'customs' | 'arrived'>('ordered');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = shipments.filter(s => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const handleAddShipment = () => {
    if (!newFrom || !newItems || !newEta) return;
    
    const nextId = `SHP-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: Shipment = {
      id: nextId,
      from: newFrom,
      items: newItems,
      eta: newEta,
      status: newStatus,
    };

    setShipments(prev => {
      const updated = [newItem, ...prev];
      save("fos_shipments", updated);
      return updated;
    });

    setNewFrom("");
    setNewItems("");
    setNewEta("");
    setNewStatus("ordered");
    setShowAddForm(false);
    triggerToast(T.savedMsg);
  };

  const handleDeleteShipment = (id: string) => {
    setShipments(prev => {
      const updated = prev.filter(s => s.id !== id);
      save("fos_shipments", updated);
      return updated;
    });
    triggerToast(T.savedMsg);
  };

  const handleUpdateStatus = (id: string, status: 'ordered' | 'in_transit' | 'customs' | 'arrived') => {
    setShipments(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status } : s);
      save("fos_shipments", updated);
      return updated;
    });
    triggerToast(T.savedMsg);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200/50';
      case 'customs':
      case 'in_transit':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-955 dark:text-amber-400 border border-amber-200/50';
      case 'ordered':
      default:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-955 dark:text-indigo-400 border border-indigo-200/50';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'ordered': return T.ordered;
      case 'in_transit': return T.inTransit;
      case 'customs': return T.atCustoms;
      case 'arrived': return T.arrived;
      default: return status;
    }
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

      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {T.shipments}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {T.trackingCargo}
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(p => !p)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-medium text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {T.newShipmentBtn || "New Shipment"}
        </button>
      </div>

      {/* Filter Tabs Block */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <div className="flex gap-2">
          {['all', 'ordered', 'in_transit', 'customs', 'arrived'].map((st) => {
            const isSel = filter === st;
            return (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold leading-none cursor-pointer transition-all ${isSel ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
              >
                {st === 'all' ? T.all : statusLabel(st)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add New Shipment Dialog box */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 text-left overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add New Supply Chain Shipment</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer font-bold">✕</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">From Location (e.g. 🇨🇳 Guangzhou)</label>
                <input 
                  type="text" 
                  placeholder="🇨🇳 Guangzhou"
                  value={newFrom}
                  onChange={e => setNewFrom(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Estimated Arrival Date (ETA)</label>
                <input 
                  type="date" 
                  value={newEta}
                  onChange={e => setNewEta(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Items Description (e.g. Aluminum billets (5T), Molds)</label>
                <input 
                  type="text" 
                  placeholder="Aluminum billets (5T)"
                  value={newItems}
                  onChange={e => setNewItems(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Current status</label>
                <select 
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none"
                >
                  <option value="ordered">{T.ordered}</option>
                  <option value="in_transit">{T.inTransit}</option>
                  <option value="customs">{T.atCustoms}</option>
                  <option value="arrived">{T.arrived}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button 
                onClick={handleAddShipment}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {T.save}
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                {T.cancel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid displaying active cargo timelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s, index) => {
          const style = getStatusStyle(s.status);
          return (
            <motion.div 
              key={s.id}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-indigo-600 dark:text-sky-400">
                      {s.id}
                    </span>
                    <span className="text-slate-350 dark:text-slate-700">•</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">
                      {s.from}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    {s.items}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider ${style}`}>
                    {statusLabel(s.status)}
                  </span>
                  <button 
                    onClick={() => handleDeleteShipment(s.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Graphical Process Timeline track stepper */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                  <span>⚓ ORDERED</span>
                  <span>🚛 IN TRANSIT</span>
                  <span>🛃 CUSTOMS</span>
                  <span>📦 ARRIVED</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full relative flex items-center justify-between">
                  {['ordered', 'in_transit', 'customs', 'arrived'].map((step, si) => {
                    const states = ['ordered', 'in_transit', 'customs', 'arrived'];
                    const currentIdx = states.indexOf(s.status);
                    const circleActive = si <= currentIdx;
                    return (
                      <button 
                        key={step}
                        onClick={() => handleUpdateStatus(s.id, step as any)}
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${circleActive ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-sm shadow-indigo-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-850'}`}
                        title={`Move status to ${step}`}
                      >
                        {circleActive && <div className="w-1 h-1 bg-white rounded-full" />}
                      </button>
                    );
                  })}
                  {/* Progress filler line dynamically sized */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-indigo-500 rounded-full transition-all" 
                    style={{ width: `${(['ordered', 'in_transit', 'customs', 'arrived'].indexOf(s.status) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Timestamp ETA row */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-450 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  ETA: {s.eta}
                </span>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span> supply logistics active</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
