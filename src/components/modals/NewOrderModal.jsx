import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Plus, Wallet } from "lucide-react";
import { useT } from "../../hooks/useT";

export function NewOrderModal({ clients, orders, onClose, onSave, initialOrder, products }) {
  const T = useT();
  const TAX_RATE = 0.10;
  const isEdit = !!initialOrder;
  const allProducts = products || [];
  const alumProds = allProducts.filter(p => p.type === "alum");
  const bimetalProds = allProducts.filter(p => p.type === "bimetal");

  const [clientId, setClientId] = useState(() => {
    if (initialOrder) {
      const c = clients.find(c => c.name === initialOrder.client);
      return c?.id ?? clients[0]?.id ?? "";
    }
    return clients[0]?.id ?? "";
  });
  const [priceType, setPriceType] = useState("cash");
  const [items, setItems] = useState(() => {
    if (initialOrder) return initialOrder.items.map(i => ({
      product: i.product, qty: String(i.qty),
      customPrice: String(i.unitPrice), priceUnlocked: true,
    }));
    return [{ product: allProducts[0]?.code ?? "", qty: "", customPrice: null, priceUnlocked: false }];
  });
  const client = clients.find(c => c.id === Number(clientId));

  const getUnitPrice = (item) => {
    if (item.priceUnlocked && item.customPrice !== null && item.customPrice !== "") {
      return parseFloat(item.customPrice) || 0;
    }
    const cashPrice = client?.prices[item.product] ?? 0;
    return priceType === "wire" ? parseFloat((cashPrice * (1 + TAX_RATE)).toFixed(2)) : cashPrice;
  };

  const addItem = () => setItems(prev => [...prev, { product: allProducts[0]?.code ?? "", qty: "", customPrice: null, priceUnlocked: false }]);
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  const unlockPrice = (idx, currentPrice) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, priceUnlocked: true, customPrice: String(currentPrice) } : item));
  };

  const enrichedItems = items.map(item => {
    const up = getUnitPrice(item);
    return { ...item, unitPrice: up, subtotal: (parseFloat(item.qty) || 0) * up };
  });
  const total = enrichedItems.reduce((s, i) => s + i.subtotal, 0);

  const handleSave = () => {
    const validItems = enrichedItems.filter(i => parseInt(i.qty) > 0);
    if (!clientId || validItems.length === 0) return;
    const mappedItems = validItems.map(i => ({ product: i.product, qty: parseInt(i.qty), unitPrice: i.unitPrice }));
    if (isEdit) {
      const newStatus = initialOrder.cashPaid + initialOrder.wirePaid >= total ? "paid"
        : initialOrder.cashPaid + initialOrder.wirePaid > 0 ? "partial" : "unpaid";
      onSave({ ...initialOrder, client: client.name, items: mappedItems, total, status: newStatus });
    } else {
      const newOrder = {
        id: (() => {
          const now = new Date();
          const yy = String(now.getFullYear()).slice(-2);
          const mm = String(now.getMonth() + 1).padStart(2, "0");
          const seq = String(orders.length + 1).padStart(3, "0");
          return `NW${yy}${mm}${seq}`;
        })(),
        client: client.name,
        items: mappedItems,
        total,
        cashPaid: 0,
        wirePaid: 0,
        status: "unpaid",
        date: new Date().toISOString().slice(0, 10),
      };
      onSave(newOrder);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-brand-blue/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden my-auto" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold text-brand-blue">{isEdit ? `✏️ ${T.editOrder}` : T.newOrderTitle}</h2>
            <button className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.client}</label>
              <div className="relative">
                <select className="w-full bg-white border border-brand-blue/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-brand-lime outline-none font-bold text-brand-blue appearance-none shadow-sm" value={clientId} onChange={e => setClientId(e.target.value)}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-blue/30 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.priceType}</label>
              <div className="flex p-1 bg-brand-blue/5 rounded-2xl">
                {[["cash", T.cash], ["wire", T.wire]].map(([k, label]) => (
                  <button key={k} onClick={() => setPriceType(k)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${priceType === k ? 'bg-white text-brand-blue shadow-sm' : 'text-brand-blue/40 hover:text-brand-blue'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest">{T.product}</label>
                <button className="text-xs font-bold text-brand-blue hover:text-brand-blue/70 transition-colors flex items-center gap-1" onClick={addItem}>
                  <Plus size={14} /> {T.addProduct}
                </button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => {
                  const unitPrice = getUnitPrice(item);
                  const subtotal = (parseFloat(item.qty) || 0) * unitPrice;
                  return (
                    <motion.div layout key={idx} className="p-5 rounded-3xl bg-white border border-brand-blue/5 shadow-sm space-y-4 relative group">
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors">
                          <X size={16} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-brand-blue/30 uppercase tracking-widest px-1">{T.selectProduct}</label>
                          <select className="w-full bg-brand-blue/5 border-none rounded-xl px-4 py-2 font-bold text-brand-blue outline-none focus:ring-1 focus:ring-brand-lime transition-all" value={item.product} onChange={e => updateItem(idx, "product", e.target.value)}>
                            {alumProds.length > 0 && <optgroup label={T.aluminum}>{alumProds.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}</optgroup>}
                            {bimetalProds.length > 0 && <optgroup label={T.bimetal}>{bimetalProds.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}</optgroup>}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-brand-blue/30 uppercase tracking-widest px-1">{T.qty}</label>
                          <input className="w-full bg-brand-blue/5 border-none rounded-xl px-4 py-2 font-bold text-brand-blue outline-none focus:ring-1 focus:ring-brand-lime transition-all text-center" type="number" placeholder="0" value={item.qty} onChange={e => updateItem(idx, "qty", e.target.value)} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {item.qty && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between px-1 pt-2 border-t border-brand-blue/5">
                            <div className="flex items-center gap-2">
                               {item.priceUnlocked ? (
                                 <input className="w-20 bg-brand-blue/5 rounded-lg px-2 py-1 text-xs font-bold text-brand-blue" type="number" step="0.01" value={item.customPrice ?? ""} onChange={e => updateItem(idx, "customPrice", e.target.value)} />
                               ) : (
                                 <span className="text-xs font-bold text-brand-blue/60">${unitPrice.toFixed(2)}</span>
                               )}
                               <button onClick={() => unlockPrice(idx, unitPrice)} className="text-brand-blue/20 hover:text-brand-blue/40 transition-colors">
                                 <Wallet size={14} />
                               </button>
                            </div>
                            <div className="text-sm font-bold text-brand-blue">${subtotal.toFixed(2)}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-brand-blue text-white p-6 rounded-[2rem] flex items-center justify-between shadow-xl shadow-brand-blue/20">
               <span className="font-bold text-brand-lime uppercase tracking-widest text-xs">{T.total}</span>
               <span className="text-3xl font-display font-bold">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-brand-blue text-white rounded-xl py-4 font-bold shadow-lg shadow-brand-blue/20" onClick={handleSave}>{T.save}</button>
              <button className="flex-1 bg-brand-blue/5 py-4 rounded-full font-bold text-brand-blue/60 hover:bg-brand-blue/10 transition-colors" onClick={onClose}>{T.cancel}</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
