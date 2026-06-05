import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-brand-blue/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className={`bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl ${maxWidth} w-full overflow-hidden my-auto`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-brand-blue">{title}</h2>
            <button className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
