import React from "react";
import { motion } from "framer-motion";

export function ConfirmModal({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[300] bg-brand-blue/20 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
          <h3 className="text-xl font-bold text-brand-blue mb-2">{title}</h3>
          <p className="text-brand-blue/60 font-medium mb-8 leading-relaxed">{message}</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-red-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20" onClick={onConfirm}>{confirmLabel}</button>
            <button className="bg-brand-blue/5 text-brand-blue py-4 rounded-2xl font-bold text-sm hover:bg-brand-blue/10 transition-colors" onClick={onCancel}>{cancelLabel}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
