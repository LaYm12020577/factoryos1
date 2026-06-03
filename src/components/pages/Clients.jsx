import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Globe, ChevronDown } from "lucide-react";
import { useT } from "../../hooks/useT";
import { save } from "../../utils/helpers";
import { ALL_PRODUCTS, TAX_RATE } from "../../constants/data";
import { PricelistModal } from "../modals/PricelistModal";
import { ClientInfoModal } from "../modals/ClientInfoModal";
import { AddClientModal } from "../modals/AddClientModal";
import { ConfirmModal } from "../ui/ConfirmModal";

const Toast = ({ msg }) => (
  <div className="fixed bottom-24 left-50 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[999]">
    {msg}
  </div>
);

export function Clients({ clients, setClients, orders, products }) {
  const T = useT();
  const [editingId, setEditingId] = useState(null);
  const [editPrices, setEditPrices] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [showPL, setShowPL] = useState(false);
  const [plTab, setPlTab] = useState("alum");
  const [toast, setToast] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [confirmDeleteClientId, setConfirmDeleteClientId] = useState(null);

  const startEdit = (c) => { setEditingId(c.id); setEditPrices({ ...c.prices }); setExpandedId(c.id); };
  const saveEdit = (id) => {
    setClients(prev => { const n = prev.map(c => c.id === id ? { ...c, prices: { ...editPrices } } : c); save("fos_clients", n); return n; });
    setEditingId(null);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const handleAddClient = (newClient) => {
    setClients(prev => { const n = [...prev, newClient]; save("fos_clients", n); return n; });
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const handleEditClient = (updated) => {
    setClients(prev => { const n = prev.map(c => c.id === updated.id ? updated : c); save("fos_clients", n); return n; });
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const handleDeleteClient = () => {
    setClients(prev => { const n = prev.filter(c => c.id !== confirmDeleteClientId); save("fos_clients", n); return n; });
    setConfirmDeleteClientId(null);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-8">
      {toast && <Toast msg={toast} />}
      {showPL && <PricelistModal clients={clients} products={products || ALL_PRODUCTS} onClose={() => setShowPL(false)} />}
      {selectedClient && (
        <ClientInfoModal
          client={selectedClient}
          orders={orders}
          onClose={() => setSelectedClient(null)}
          onEdit={(c) => { setSelectedClient(null); setEditingClient(c); }}
          onDelete={(id) => { setSelectedClient(null); setConfirmDeleteClientId(id); }}
        />
      )}
      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onSave={handleAddClient}
          products={products}
        />
      )}
      {editingClient && (
        <AddClientModal
          onClose={() => setEditingClient(null)}
          onSave={handleEditClient}
          initialClient={editingClient}
          products={products}
        />
      )}
      {confirmDeleteClientId && (
        <ConfirmModal
          title={T.confirmDeleteClientTitle}
          message={T.confirmDeleteClientMsg}
          confirmLabel={T.confirmYes}
          cancelLabel={T.confirmNo}
          onConfirm={handleDeleteClient}
          onCancel={() => setConfirmDeleteClientId(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{T.clientsTitle}</h2>
          <p className="text-brand-blue/50 font-medium">{T.clientsSubtitle}</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-white border border-brand-blue/10 text-brand-blue font-bold text-sm shadow-sm hover:bg-brand-blue/5 transition-all"
            onClick={() => setShowPL(true)}
          >
            {T.genPricelist}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-brand-blue/20 hover:brightness-110 flex items-center gap-2"
            onClick={() => setShowAddClient(true)}
          >
            <Plus size={20}/>
            {T.addClient}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {clients.map(c => {
          const isEditing = editingId === c.id;
          const isExpanded = expandedId === c.id;
          const allProds = products || ALL_PRODUCTS;
          const prods = allProds.filter(p => p.type === plTab);

          return (
            <motion.div 
              key={c.id} 
              layout
              className="liquid-glass rounded-3xl overflow-hidden"
            >
              <div 
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded && !isEditing ? null : c.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold text-xl">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-brand-blue">{c.name}</div>
                    <div className="text-sm text-brand-blue/40 font-medium">{c.country}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    className="p-2 bg-brand-blue/5 text-brand-blue rounded-xl hover:bg-brand-lime transition-colors"
                    onClick={e => { e.stopPropagation(); setSelectedClient(c); }}
                  >
                    <Globe size={18} />
                  </button>
                  {!isEditing && (
                    <button 
                      className="px-4 py-2 bg-white border border-brand-blue/10 rounded-xl text-xs font-bold text-brand-blue/60 hover:text-brand-blue transition-colors"
                      onClick={e => { e.stopPropagation(); startEdit(c); }}
                    >
                      {T.editPrices}
                    </button>
                  )}
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-brand-blue/20">
                    <ChevronDown size={24} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-brand-blue/5"
                  >
                    <div className="p-6 bg-white/20">
                      <div className="flex gap-2 p-1 bg-brand-blue/5 rounded-2xl w-fit mb-6">
                        {[["alum", T.aluminum], ["bimetal", T.bimetal]].map(([k, label]) => (
                          <button 
                            key={k} 
                            onClick={() => setPlTab(k)} 
                            className={`
                              px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                              ${plTab === k ? 'bg-white text-brand-blue shadow-sm' : 'text-brand-blue/40 hover:text-brand-blue'}
                            `}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-brand-blue/5 bg-white/40">
                        <table className="w-full text-sm font-medium">
                          <thead>
                            <tr className="text-left text-brand-blue/40 border-b border-brand-blue/5">
                              <th className="px-6 py-4 uppercase tracking-widest text-[10px]">{T.model}</th>
                              <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-right">{T.cashPrice} ($)</th>
                              <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-right">{T.wirePrice} ($)</th>
                              {isEditing && <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-center">New ($)</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-blue/5">
                            {prods.map(p => {
                              const cash = isEditing ? (editPrices[p.code] ?? c.prices[p.code]) : c.prices[p.code];
                              const wire = (cash * (1 + TAX_RATE)).toFixed(2);
                              return (
                                <tr key={p.code} className="hover:bg-white/40 transition-colors">
                                  <td className="px-6 py-4 font-bold text-brand-blue">{p.code}</td>
                                  <td className="px-6 py-4 text-right font-bold text-green-600">
                                    {isEditing ? <span className="line-through opacity-30 text-xs mr-2">${c.prices[p.code]}</span> : `$${cash}`}
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold text-blue-500">${wire}</td>
                                  {isEditing && (
                                    <td className="px-6 py-4 text-center">
                                      <input 
                                        type="number" 
                                        className="w-20 bg-white border border-brand-blue/10 rounded-lg px-2 py-1 text-center font-bold text-brand-blue focus:ring-2 focus:ring-brand-lime outline-none"
                                        value={editPrices[p.code] ?? c.prices[p.code]}
                                        onChange={e => setEditPrices(prev => ({ ...prev, [p.code]: parseFloat(e.target.value) || 0 }))} 
                                      />
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex gap-3 mt-6">
                        {isEditing ? (
                          <>
                            <button className="flex-1 bg-brand-blue text-white rounded-xl py-3 font-bold" onClick={() => saveEdit(c.id)}>{T.savePrices}</button>
                            <button className="flex-1 bg-brand-blue/5 py-3 rounded-full font-bold text-brand-blue/60" onClick={() => setEditingId(null)}>{T.cancel}</button>
                          </>
                        ) : (
                          <>
                            <button className="flex-1 bg-brand-blue text-white py-3 rounded-xl font-bold text-xs hover:bg-brand-blue/90 transition-all">{T.exportPricelist}</button>
                            <button className="flex-1 bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-xs hover:bg-brand-blue/5 transition-all">{T.viewOrders}</button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
