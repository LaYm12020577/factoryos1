import React, { useState } from 'react';
import { Client, Product, Language, Order } from '../types';
import { TRANSLATIONS } from '../translations';
import { COUNTRIES, save, computeClientDebts } from '../data/defaults';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Search, 
  MapPin, 
  Phone, 
  DollarSign, 
  Sparkles, 
  Edit, 
  Building2, 
  X,
  CreditCard,
  Settings2,
  Lock
} from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  orders: Order[];
  products: Product[];
  lang: Language;
}

export default function Clients({ clients, setClients, orders, products, lang }: ClientsProps) {
  const T = TRANSLATIONS[lang];
  const clientDebts = computeClientDebts(orders);
  const [search, setSearch] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Client Fields
  const [newName, setNewName] = useState<string>("");
  const [newCountry, setNewCountry] = useState<string>(COUNTRIES[0]);
  const [newPhone, setNewPhone] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newBank, setNewBank] = useState<string>("");
  const [newAccount, setNewAccount] = useState<string>("");
  const [newSwift, setNewSwift] = useState<string>("");

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredClients = clients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.country.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreateClient = () => {
    if (!newName) return;

    // Build default prices from standard raw weights
    const cPrices: Record<string, number> = {};
    for (const p of products) {
      cPrices[p.code] = parseFloat((p.single * 3.8).toFixed(2));
    }

    const nextId = clients.reduce((max, c) => c.id > max ? c.id : max, 0) + 1;
    const newC: Client = {
      id: nextId,
      name: newName,
      country: newCountry,
      cashDebt: 0,
      wireDebt: 0,
      prices: cPrices,
      phone: newPhone,
      address: newAddress,
      bankName: newBank,
      bankAccount: newAccount,
      bankSwift: newSwift,
    };

    setClients(prev => {
      const updated = [...prev, newC];
      save("fos_clients", updated);
      return updated;
    });

    setNewName("");
    setNewPhone("");
    setNewAddress("");
    setNewBank("");
    setNewAccount("");
    setNewSwift("");
    setSelectedClient(newC);
    setShowAddForm(false);
    triggerToast(T.savedMsg);
  };

  const handleUpdatePrice = (clientName: string, productCode: string, newRate: number) => {
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.name !== clientName) return c;
        const upPrices = { ...c.prices, [productCode]: newRate };
        return { ...c, prices: upPrices };
      });
      // Synchronize selection state as well
      const updatedSel = updated.find(c => c.name === clientName);
      if (updatedSel) setSelectedClient(updatedSel);
      save("fos_clients", updated);
      return updated;
    });
    triggerToast(T.savedMsg);
  };

  const handleDeleteClient = (id: number) => {
    setClients(prev => {
      const updated = prev.filter(c => c.id !== id);
      save("fos_clients", updated);
      return updated;
    });
    setSelectedClient(null);
    triggerToast(T.savedMsg);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Toast notifications */}
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

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {T.clients}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {T.debtAndPrices}
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(p => !p)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-medium text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {T.addClientBtn || "New Client"}
        </button>
      </div>

      {/* Search block */}
      <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm max-w-sm w-full gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder={T.search} 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-slate-800 dark:text-white text-sm"
        />
      </div>

      {/* Grid structure main panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left list (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            {T.clientsList}
          </h3>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredClients.map(c => {
              const works = selectedClient?.id === c.id;
              const d = clientDebts[c.name] || { cashDebt: 0, wireDebt: 0 };
              const totalCDebt = d.cashDebt + d.wireDebt;
              return (
                <div 
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${works ? 'bg-indigo-50/20 border-indigo-400 dark:bg-indigo-950/25 dark:border-sky-550/70' : 'bg-slate-50 dark:bg-slate-950/40 border-slate-150 dark:border-slate-800/30 hover:border-slate-350'}`}
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                      {c.name}
                    </span>
                    <span className="text-slate-450 dark:text-slate-500 font-medium text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {c.country}
                    </span>
                  </div>
                  
                  {/* Debt preview indicator if positive */}
                  {totalCDebt > 0 && (
                    <span className="text-[10px] font-bold font-mono px-2 py-1 bg-rose-50 text-rose-650 rounded-lg">
                      ${totalCDebt.toLocaleString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Sandbox with profile panel (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
          {selectedClient ? (
            <div className="space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                    {selectedClient.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedClient.country}
                    </span>
                    {selectedClient.phone && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {selectedClient.phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteClient(selectedClient.id)}
                  className="px-3.5 py-1.5 hover:bg-rose-50 hover:text-rose-650 dark:hover:bg-rose-955/20 text-slate-400 rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-rose-250 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {T.deleteClientBtn || "Delete"}
                </button>
              </div>

              {/* Dynamic segmented configuration blocks */}
              {(() => {
                const detailDebt = clientDebts[selectedClient.name] || { cashDebt: 0, wireDebt: 0 };
                const detailTotalDebt = detailDebt.cashDebt + detailDebt.wireDebt;
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Outstandings */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl relative">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{T.totalDebt}</div>
                      <div className="text-lg font-mono font-black text-rose-550">${detailTotalDebt.toLocaleString()}</div>
                      <div className="text-[9px] font-mono text-slate-450 mt-1 uppercase">💵 C: ${Math.round(detailDebt.cashDebt).toLocaleString()} | 🏦 W: ${Math.round(detailDebt.wireDebt).toLocaleString()}</div>
                    </div>

                    {/* Bank / billing spec card */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">🏦 {T.bankDetailsTitle || "Bank Details"}</div>
                      {selectedClient.bankName ? (
                        <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400 font-mono">
                          <div className="font-semibold">{selectedClient.bankName}</div>
                          <div>A/C: {selectedClient.bankAccount}</div>
                          <div>SW: {selectedClient.bankSwift}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">No bank settings associated</div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Customizable Prices Panel list */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                  <Settings2 className="w-4 h-4 text-indigo-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {T.customPriceRates || "Custom Price Rates"} · CODE VS CLIENT-PRICE
                  </span>
                </div>

                <div className="max-h-[220px] overflow-y-auto border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 rounded-2xl divide-y divide-slate-155 dark:divide-slate-855">
                  {products.map(p => {
                    const clientVal = selectedClient.prices[p.code] ?? p.single * 3.8;
                    return (
                      <div 
                        key={p.code}
                        className="p-3 flex items-center justify-between hover:bg-white dark:hover:bg-slate-900 transition-colors"
                      >
                        <div className="space-y-0.5 text-[11px] font-mono text-left">
                          <span className="text-indigo-650 dark:text-sky-400 font-bold block">{p.code}</span>
                          <span className="text-slate-400 flex items-center gap-1 text-[10px]">Standard single raw: ${p.single}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-xs text-slate-350">$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            value={clientVal}
                            onChange={(e) => handleUpdatePrice(selectedClient.name, p.code, parseFloat(e.target.value) || 0)}
                            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-lg p-1.5 w-20 text-xs text-center font-bold outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 dark:text-slate-550 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl m-10">
              No client selected
            </div>
          )}
        </div>

      </div>

      {/* Add Client Interactive Model Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-[800]" onClick={() => setShowAddForm(false)}>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-12 text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40">
                <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-base">
                  ➕ {T.addClientBtn || "Add New Client"}
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer font-bold">✕</button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-405 block mb-1">Xaridor Nomi (Name)</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Jafarbek Tashkent"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-805 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-405 block mb-1">Mamlakat (Country)</label>
                  <select 
                    value={newCountry}
                    onChange={e => setNewCountry(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-805 dark:text-slate-200 outline-none font-medium"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-405 block mb-1">Telefon (Phone) — Optional</label>
                  <input 
                    type="text" 
                    placeholder="+998 (90) 123-4567"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-805 dark:text-white outline-none"
                  />
                </div>

                {/* Bank / detail options toggler */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-505" />
                    <span>Bank Specifications (Optional)</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Bank Name (e.g. Asaka Bank)"
                    value={newBank}
                    onChange={e => setNewBank(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs outline-none text-slate-800 dark:text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Account number"
                    value={newAccount}
                    onChange={e => setNewAccount(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs outline-none text-slate-800 dark:text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="SWIFT code"
                    value={newSwift}
                    onChange={e => setNewSwift(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs outline-none text-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={handleCreateClient}
                    className="flex-1 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm rounded-2xl shadow-md cursor-pointer transition-all"
                  >
                    {T.save}
                  </button>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-705 text-slate-655 dark:text-slate-350 font-display font-semibold text-sm rounded-2xl transition-all cursor-pointer"
                  >
                    {T.cancel}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
