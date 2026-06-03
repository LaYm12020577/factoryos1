import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useT } from "../../hooks/useT";

export function AddProductModal({ onClose, onSave, initialProduct }) {
  const T = useT();
  const isEdit = !!initialProduct;
  const [code, setCode] = useState(initialProduct?.code ?? "");
  const [type, setType] = useState(initialProduct?.type ?? "alum");
  const [raw, setRaw] = useState(String(initialProduct?.raw ?? ""));
  const [single, setSingle] = useState(String(initialProduct?.single ?? ""));
  const [spec, setSpec] = useState(initialProduct?.spec ?? "");
  const [actual, setActual] = useState(initialProduct?.actual ?? "");
  const [heat, setHeat] = useState(initialProduct?.heat != null ? String(initialProduct.heat) : "");

  const handleSave = () => {
    if (!code.trim() || !raw || !single) return;
    onSave({
      code: code.trim().toUpperCase(),
      type,
      raw: parseFloat(raw) || 0,
      single: parseFloat(single) || 0,
      spec: spec.trim(),
      actual: actual.trim(),
      heat: heat.trim() ? parseFloat(heat) || null : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-brand-blue/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden my-auto" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10 space-y-8">
           <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold text-brand-blue">{isEdit ? `✏️ ${T.editProductTitle}` : T.addModel}</h2>
            <button className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.model} (Code) *</label>
              <input className="w-full bg-white border border-brand-blue/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-lime outline-none font-bold text-brand-blue shadow-sm disabled:opacity-50" placeholder="e.g. NWS-TE-500E" value={code} onChange={e => setCode(e.target.value)} disabled={isEdit} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.productType} *</label>
              <div className="flex p-1 bg-brand-blue/5 rounded-2xl">
                {[["alum", T.aluminum], ["bimetal", T.bimetal]].map(([k, label]) => (
                  <button key={k} onClick={() => setType(k)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === k ? 'bg-white text-brand-blue shadow-sm' : 'text-brand-blue/40 hover:text-brand-blue'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.rawWeight} (kg) *</label>
                 <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" type="number" step="0.01" placeholder="0.00" value={raw} onChange={e => setRaw(e.target.value)} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.singleWeight} (kg) *</label>
                 <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" type="number" step="0.01" placeholder="0.00" value={single} onChange={e => setSingle(e.target.value)} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.specMm}</label>
                 <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" placeholder="500*80*96" value={spec} onChange={e => setSpec(e.target.value)} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.actualMm}</label>
                 <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" placeholder="577*80*96" value={actual} onChange={e => setActual(e.target.value)} />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.heatKw}</label>
              <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" type="number" placeholder="155" value={heat} onChange={e => setHeat(e.target.value)} />
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-brand-blue text-white rounded-xl py-4 font-bold shadow-lg shadow-brand-blue/20" onClick={handleSave}>{T.save}</button>
              <button className="flex-1 bg-brand-blue/5 py-4 rounded-full font-bold text-brand-blue/60 hover:bg-brand-blue/10 transition-colors" onClick={onClose}>{T.cancel}</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
