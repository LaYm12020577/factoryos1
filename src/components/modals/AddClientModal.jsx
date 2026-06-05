import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useT } from "../../hooks/useT";
import { CountrySelect } from "../ui/CountrySelect";
import { ALL_PRODUCTS } from "../../constants/data";

export function AddClientModal({ onClose, onSave, initialClient, products }) {
  const T = useT();
  const isEdit = !!initialClient;
  const [name, setName] = useState(initialClient?.name ?? "");
  const [country, setCountry] = useState(initialClient?.country ?? "");
  const [multiplier, setMultiplier] = useState("3.8");
  const [address, setAddress] = useState(initialClient?.address ?? "");
  const [phone, setPhone] = useState(initialClient?.phone ?? "");
  const [bankName, setBankName] = useState(initialClient?.bankName ?? "");
  const [bankAccount, setBankAccount] = useState(initialClient?.bankAccount ?? "");
  const [bankSwift, setBankSwift] = useState(initialClient?.bankSwift ?? "");

  const handleSave = () => {
    if (!name.trim()) return;
    const extra = Object.fromEntries(
      Object.entries({
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        bankName: bankName.trim() || undefined,
        bankAccount: bankAccount.trim() || undefined,
        bankSwift: bankSwift.trim() || undefined,
      }).filter(([, v]) => v !== undefined)
    );
    if (isEdit) {
      onSave({ ...initialClient, name: name.trim(), country: country.trim() || "🌍 Unknown", ...extra });
    } else {
      const mult = parseFloat(multiplier) || 3.8;
      onSave({
        id: Date.now(),
        name: name.trim(),
        country: country.trim() || "🌍 Unknown",
        cashDebt: 0, wireDebt: 0,
        prices: Object.fromEntries((products || ALL_PRODUCTS).map(p => [p.code, parseFloat((p.single * mult).toFixed(2))])),
        ...extra,
      });
    }
    onClose();
  };

  const fieldGroup = (label, val, setVal, placeholder, type = "text") => (
    <div>
      <label className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest px-2 mb-2 block">{label}</label>
      <input className="w-full bg-white border border-brand-blue/5 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-medium transition-all" type={type} placeholder={placeholder} value={val} onChange={e => setVal(e.target.value)} />
    </div>
  );

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
            <h2 className="text-3xl font-display font-bold text-brand-blue">{isEdit ? `✏️ ${T.editClient}` : T.addClientTitle}</h2>
            <button className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
               {fieldGroup(T.clientNameLabel, name, setName, "e.g. Ozodbek")}
               <div>
                  <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2 mb-2 block">{T.clientCountryLabel}</label>
                  <CountrySelect value={country} onChange={setCountry} />
               </div>
               {!isEdit && (
                 <div className="p-5 rounded-3xl bg-brand-lime/10 border border-brand-lime/20">
                    <label className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-1 mb-2 block">{T.priceMultiplier}</label>
                    <input className="w-full bg-white border-none rounded-xl px-4 py-3 font-bold text-brand-blue outline-none focus:ring-2 focus:ring-brand-lime transition-all" type="number" step="0.1" min="1" value={multiplier} onChange={e => setMultiplier(e.target.value)} />
                    <p className="text-[10px] font-bold text-brand-blue/30 mt-2 italic">× single weight (e.g. 3.8 → price = weight × 3.8)</p>
                 </div>
               )}
            </div>

            <div className="h-px bg-brand-blue/5" />
            <div className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest px-2">{T.optionalFields}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldGroup(T.clientAddress, address, setAddress, "Street, City, Country")}
              {fieldGroup(T.clientPhone, phone, setPhone, "+998...", "tel")}
              <div className="sm:col-span-2">
                 {fieldGroup(T.clientBank, bankName, setBankName, "Bank name")}
              </div>
              {fieldGroup(T.clientBankAccount, bankAccount, setBankAccount, "Account")}
              {fieldGroup(T.clientBankSwift, bankSwift, setBankSwift, "SWIFT")}
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
