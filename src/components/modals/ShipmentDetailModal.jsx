import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Check, Package, Truck, Globe } from "lucide-react";
import { useT } from "../../hooks/useT";
import { ConfirmModal } from "../ui/ConfirmModal";

const Toast = ({ msg }) => (
  <div className="fixed bottom-24 left-50 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[999]">
    {msg}
  </div>
);

export function ShipmentDetailModal({ shipment, onClose, onUpdate, onDelete }) {
  const T = useT();
  const [selectedStatus, setSelectedStatus] = useState(shipment.status);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusOptions = [
    { value: "ordered", label: T.ordered, icon: <Package size={20} />, color: "slate" },
    { value: "in_transit", label: T.inTransit, icon: <Truck size={20} />, color: "blue" },
    { value: "customs", label: T.atCustoms, icon: <Globe size={20} />, color: "yellow" },
    { value: "arrived", label: T.arrived, icon: <Check size={20} />, color: "green" },
  ];

  const handleStatusChange = (newStatus) => {
    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);
      onUpdate(shipment.id, newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = () => {
    onDelete(shipment.id);
    onClose();
  };

  return (
    <>
      {saved && <Toast msg={`${T.savedMsg} ✓`} />}
      
      <div 
        className="fixed inset-0 z-[200] bg-brand-blue/20 backdrop-blur-sm flex items-center justify-center p-4" 
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden" 
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/20 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-brand-blue">{shipment.id}</h3>
              <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mt-1">{shipment.from}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Items */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest mb-2">{T.items}</div>
              <div className="text-sm font-bold text-brand-blue">{shipment.items}</div>
            </div>

            {/* ETA */}
            <div>
              <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest mb-2">{T.eta}</div>
              <div className="text-sm font-bold text-brand-blue">{shipment.eta || "—"}</div>
            </div>

            {/* Status Selection */}
            <div>
              <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest mb-3">{T.statusLabel}</div>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((option) => {
                  const colorMap = {
                    slate: { bg: '#e2e8f0', text: '#475569', bgActive: '#64748b', boxShadow: '0 0 0 3px rgba(100, 116, 139, 0.1)' },
                    blue: { bg: '#dbeafe', text: '#1e40af', bgActive: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' },
                    yellow: { bg: '#fef3c7', text: '#92400e', bgActive: '#eab308', boxShadow: '0 0 0 3px rgba(234, 179, 8, 0.1)' },
                    green: { bg: '#dcfce7', text: '#166534', bgActive: '#22c55e', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)' },
                  };
                  const colors = colorMap[option.color];
                  const isActive = selectedStatus === option.value;
                  
                  return (
                    <motion.button
                      key={option.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(option.value)}
                      style={{
                        backgroundColor: isActive ? colors.bgActive : colors.bg,
                        color: isActive ? '#ffffff' : colors.text,
                        boxShadow: isActive ? colors.boxShadow : 'none',
                      }}
                      className="p-3 rounded-2xl font-bold text-xs transition-all flex flex-col items-center gap-2 hover:opacity-90"
                    >
                      {option.icon}
                      <span className="text-[10px]">{option.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/20 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-brand-blue/5 text-brand-blue py-3 rounded-xl font-bold text-sm hover:bg-brand-blue/10 transition-colors"
            >
              {T.close}
            </button>
          </div>
        </motion.div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title={T.deleteShipment || "Удалить доставку?"}
          message={T.deleteShipmentMsg || "Это действие нельзя отменить"}
          confirmLabel={T.delete}
          cancelLabel={T.cancel}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
