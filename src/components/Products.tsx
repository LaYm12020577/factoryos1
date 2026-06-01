import React, { useState } from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { save } from '../data/defaults';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Settings, 
  Layers, 
  Calculator, 
  Flame, 
  Box, 
  Scale, 
  Ruler,
  Plus,
  Trash2,
  Lock,
  Compass
} from 'lucide-react';

interface ProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  lang: Language;
}

export default function Products({ products, setProducts, lang }: ProductsProps) {
  const T = TRANSLATIONS[lang];
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // New product fields
  const [newCode, setNewCode] = useState<string>("");
  const [newType, setNewType] = useState<'alum' | 'bimetal'>('alum');
  const [newRaw, setNewRaw] = useState<string>("");
  const [newSingle, setNewSingle] = useState<string>("");
  const [newSpec, setNewSpec] = useState<string>("");
  const [newActual, setNewActual] = useState<string>("");
  const [newHeat, setNewHeat] = useState<string>("");

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = products.filter(p => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !p.code.toLowerCase().includes(search.toLowerCase()) && !p.spec.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddNewProductCustom = () => {
    if (!newCode || !newRaw || !newSingle) return;

    const newItem: Product = {
      code: newCode,
      type: newType,
      raw: parseFloat(newRaw) || 0,
      single: parseFloat(newSingle) || 0,
      spec: newSpec || "500*80*96",
      actual: newActual || "577*80*96",
      heat: parseInt(newHeat) ? parseInt(newHeat) : null,
    };

    setProducts(prev => {
      const updated = [...prev, newItem];
      save("fos_products", updated);
      return updated;
    });

    setNewCode("");
    setNewRaw("");
    setNewSingle("");
    setNewSpec("");
    setNewActual("");
    setNewHeat("");
    setShowAddForm(false);
    triggerToast(T.savedMsg);
  };

  const handleDeleteProduct = (code: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.code !== code);
      save("fos_products", updated);
      return updated;
    });
    triggerToast(T.savedMsg);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Toast notifs */}
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

      {/* Head line block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {T.products}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {T.specsOverview}
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(p => !p)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-medium text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {T.addNewProductBtn || "New Spec Model"}
        </button>
      </div>

      {/* Filter and search bar bench */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <div className="flex gap-2">
          {['all', 'alum', 'bimetal'].map((t) => {
            const isSel = filterType === t;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold leading-none cursor-pointer transition-all ${isSel ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-505'}`}
              >
                {t === 'all' ? T.all : t === 'alum' ? T.aluminum : T.bimetal}
              </button>
            );
          })}
        </div>

        <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-2.5 max-w-xs w-full gap-2">
          <Search className="w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder={T.search} 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-xs text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Insert custom specs form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4 text-left overflow-hidden col-span-2"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add New Radiator Model Custom Specifications</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-450 hover:text-slate-655 cursor-pointer font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Product Code Name</label>
                <input 
                  type="text" 
                  placeholder="NWS-TE-500MAX"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Radiator Material type</label>
                <select 
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-805 dark:text-slate-205 outline-none font-medium"
                >
                  <option value="alum">Aluminum</option>
                  <option value="bimetal">Bimetal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Heat Flow output (Watts) — Optional</label>
                <input 
                  type="number" 
                  placeholder="130"
                  value={newHeat}
                  onChange={e => setNewHeat(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Raw Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.85"
                  value={newRaw}
                  onChange={e => setNewRaw(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-405 mb-1 block">Single Pack weight (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.95"
                  value={newSingle}
                  onChange={e => setNewSingle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-405 mb-1 block">Nominal Spec Size (e.g. 500*80*96)</label>
                <input 
                  type="text" 
                  placeholder="500*80*96"
                  value={newSpec}
                  onChange={e => setNewSpec(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-850 dark:text-white outline-none font-mono"
                />
              </div>

              <div className="col-span-1 sm:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-405 mb-1 block">Actual Physical Dimension Format Size</label>
                <input 
                  type="text" 
                  placeholder="577*80*96"
                  value={newActual}
                  onChange={e => setNewActual(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-850 dark:text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button 
                onClick={handleAddNewProductCustom}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {T.save}
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-655 dark:text-slate-205 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                {T.cancel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento specifications grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, index) => (
          <motion.div
            key={p.code}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(0.2, index * 0.03) }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-750 transition-colors"
          >
            {/* Header / Type badge */}
            <div className="flex justify-between items-start">
              <div className="space-y-1 text-left">
                <span className="font-mono font-black text-indigo-600 dark:text-sky-400 text-sm block">
                  {p.code}
                </span>
                <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-bold font-mono uppercase tracking-wider ${p.type === 'alum' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400'}`}>
                  {p.type === 'alum' ? T.aluminum : T.bimetal}
                </span>
              </div>

              <button 
                onClick={() => handleDeleteProduct(p.code)}
                className="p-1 px-2.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-all cursor-pointer font-bold text-xs"
                title="Delete standard specifications"
              >
                ✕
              </button>
            </div>

            {/* Spec Attributes list block */}
            <div className="grid grid-cols-2 gap-3.5 font-mono text-[11px] text-left pt-2 border-t border-slate-100 dark:border-slate-850">
              
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl space-y-0.5">
                <div className="text-[9px] text-slate-400 uppercase font-sans flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>{T.weightRaw || "Raw Wt"}</span>
                </div>
                <div className="font-extrabold text-slate-800 dark:text-slate-105">{p.raw.toFixed(2)} kg</div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl space-y-0.5">
                <div className="text-[9px] text-slate-400 uppercase font-sans flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>{T.weightSingle || "Single Pack"}</span>
                </div>
                <div className="font-extrabold text-[#002045] dark:text-white">{p.single.toFixed(2)} kg</div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl space-y-0.5">
                <div className="text-[9px] text-slate-400 uppercase font-sans flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nominal size</span>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-300">{p.spec}</div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/30 rounded-xl space-y-0.5">
                <div className="text-[9px] text-slate-400 uppercase font-sans flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  <span>Actual size</span>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-300">{p.actual}</div>
              </div>

            </div>

            {/* Bottom Heat flow rate */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wide flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                {T.heatFlowOutput || "Heat flow output"}
              </span>
              <span className="font-extrabold text-slate-800 dark:text-slate-105">
                {p.heat ? `${p.heat} W` : "—"}
              </span>
            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
