import React from "react";
import { motion } from "framer-motion";
import { Globe, X, ClipboardList, Wallet, Plus, Truck } from "lucide-react";
import { useT } from "../../hooks/useT";

export function ClientInfoModal({ client, orders, onClose, onEdit, onDelete }) {
  const T = useT();
  const clientOrders = orders.filter(o => o.client === client.name);
  const totalAmount = clientOrders.reduce((s, o) => s + o.total, 0);
  const totalPaid = clientOrders.reduce((s, o) => s + o.cashPaid + o.wirePaid, 0);
  const totalDebt = Math.max(0, totalAmount - totalPaid);

  const generateContract = () => {
    const today = new Date().toLocaleDateString("en-GB");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Contract – ${client.name}</title>
    <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#111}
    h1{text-align:center;font-size:22px;margin-bottom:4px}h2{font-size:15px;margin-top:28px;border-bottom:1px solid #ccc;padding-bottom:4px}
    .meta{text-align:center;color:#555;font-size:13px;margin-bottom:28px}
    table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
    th{background:#f0f4fb;padding:8px 10px;text-align:left;border:1px solid #dce3f0}
    td{padding:8px 10px;border:1px solid #dce3f0}
    .sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px}
    .sig-box{border-top:1px solid #000;padding-top:8px;font-size:13px}
    </style></head><body>
    <h1>SUPPLY CONTRACT</h1>
    <div class="meta">No. FC-${Date.now().toString().slice(-6)} &nbsp;|&nbsp; Date: ${today}</div>
    <h2>1. Parties</h2>
    <p><strong>Supplier:</strong> FactoryOS Industrial Co.</p>
    <p><strong>Buyer:</strong> ${client.name} &nbsp; (${client.country})</p>
    <h2>2. Subject</h2>
    <p>The Supplier agrees to supply aluminum and/or bimetal radiators as per individual order specifications agreed by both parties.</p>
    <h2>3. Order Summary</h2>
    <table><tr><th>Orders</th><th>Total Amount</th><th>Paid</th><th>Outstanding</th></tr>
    <tr><td>${clientOrders.length}</td><td>$${totalAmount.toLocaleString()}</td><td>$${totalPaid.toLocaleString()}</td><td>$${totalDebt.toLocaleString()}</td></tr></table>
    <h2>4. Payment Terms</h2>
    <p>Payment is due within 30 days of delivery. Late payments are subject to 1.5% monthly interest. Cash and wire transfer accepted.</p>
    <h2>5. Delivery</h2>
    <p>Delivery terms and timelines are specified per order. Risk transfers upon handover to the carrier.</p>
    <h2>6. Validity</h2>
    <p>This contract is valid for 12 months from the date of signing.</p>
    <div class="sig">
      <div class="sig-box"><strong>Supplier:</strong> FactoryOS<br/><br/>Signature: _______________<br/>Date: ${today}</div>
      <div class="sig-box"><strong>Buyer:</strong> ${client.name}<br/><br/>Signature: _______________<br/>Date: _______________</div>
    </div></body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-brand-blue/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden my-auto" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center text-brand-lime text-2xl font-bold">
                {client.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-brand-blue">{client.name}</h2>
                <p className="text-brand-blue/40 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                   <Globe size={12} /> {client.country}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && <button className="p-3 rounded-xl bg-brand-blue/5 text-brand-blue hover:bg-brand-lime transition-colors" onClick={() => { onClose(); onEdit(client); }}><ClipboardList size={20} /></button>}
              {onDelete && <button className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors" onClick={() => { onClose(); onDelete(client.id); }}><X size={20} /></button>}
              <button className="p-3 rounded-xl bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}><X size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-5 rounded-[2rem] text-center border border-blue-100 shadow-sm">
               <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">{T.totalOrders}</div>
               <div className="text-2xl font-display font-bold text-blue-600">{clientOrders.length}</div>
            </div>
            <div className="bg-green-50 p-5 rounded-[2rem] text-center border border-green-100 shadow-sm">
               <div className="text-[9px] font-bold text-green-400 uppercase tracking-widest mb-1">{T.totalAmount}</div>
               <div className="text-xl font-display font-bold text-green-600">${totalAmount.toLocaleString()}</div>
            </div>
            <div className="bg-red-50 p-5 rounded-[2rem] text-center border border-red-100 shadow-sm">
               <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">{T.totalDebt}</div>
               <div className="text-xl font-display font-bold text-red-600">${totalDebt.toLocaleString()}</div>
            </div>
          </div>

          {(client.address || client.phone || client.bankName || client.bankAccount || client.bankSwift) && (
            <div className="p-6 rounded-3xl bg-brand-blue/5 border border-brand-blue/5 space-y-3 mb-8">
              <div className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mb-2 px-2">{T.optionalFields}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                {client.address && <div className="flex items-start gap-3 bg-white/40 p-3 rounded-xl">📍 <span className="text-brand-blue/70">{client.address}</span></div>}
                {client.phone && <div className="flex items-center gap-3 bg-white/40 p-3 rounded-xl">📞 <span className="text-brand-blue/70">{client.phone}</span></div>}
                {client.bankName && <div className="flex items-center gap-3 bg-white/40 p-3 rounded-xl col-span-full">🏦 <span className="text-brand-blue/70">{client.bankName} · {client.bankAccount}</span></div>}
              </div>
            </div>
          )}

          {clientOrders.length > 0 && (
            <div className="space-y-4 mb-8">
               <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.recentOrders}</div>
               <div className="rounded-3xl border border-brand-blue/5 bg-white/40 overflow-hidden max-h-48 overflow-y-auto">
                 <table className="w-full text-xs font-medium text-left">
                   <thead>
                     <tr className="bg-brand-blue/5 text-brand-blue/40 uppercase tracking-widest text-[9px]">
                       <th className="px-6 py-3">{T.orderId}</th>
                       <th className="px-6 py-3">{T.date}</th>
                       <th className="px-6 py-3 text-right">{T.total}</th>
                       <th className="px-6 py-3 text-center">{T.status}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-brand-blue/5">
                     {clientOrders.slice(0, 5).map(o => (
                       <tr key={o.id} className="hover:bg-white/60 transition-colors">
                         <td className="px-6 py-4 font-bold text-brand-blue">{o.id}</td>
                         <td className="px-6 py-4 text-brand-blue/40">{o.date}</td>
                         <td className="px-6 py-4 text-right font-bold text-brand-blue">${o.total.toLocaleString()}</td>
                         <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                             o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {T[o.status] || o.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-brand-blue/5">
            <button className="bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm flex flex-col items-center gap-2" onClick={generateContract}>
              <ClipboardList size={16} /> {T.generateContract}
            </button>
            <button className="bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm flex flex-col items-center gap-2">
              <ClipboardList size={16} /> {T.generateInvoice}
            </button>
            <button className="bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm flex flex-col items-center gap-2">
              <Wallet size={16} /> {T.genPricelist}
            </button>
            <button className="bg-brand-lime text-brand-blue rounded-xl py-3 font-bold text-[10px] uppercase tracking-widest hover:brightness-105 transition-all shadow-lg shadow-brand-lime/20 flex flex-col items-center gap-2">
              <Plus size={16} /> {T.exportBtn}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
