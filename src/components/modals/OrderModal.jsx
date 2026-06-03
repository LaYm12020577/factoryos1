import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Truck, Wallet, Plus, X, Globe } from "lucide-react";
import { useT } from "../../hooks/useT";

export function OrderModal({ order, onClose, onPaymentSaved, onEdit, onDelete, clients, products }) {
  const T = useT();
  const [showPay, setShowPay] = useState(false);
  const [payType, setPayType] = useState("cash");
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const pct = Math.round((order.cashPaid + order.wirePaid) / order.total * 100);
  const cashPct = Math.round(order.cashPaid / order.total * 100);
  const wirePct = Math.round(order.wirePaid / order.total * 100);
  const remaining = order.total - order.cashPaid - order.wirePaid;
  const client = clients.find(c => c.name === order.client) ?? { name: order.client, country: "", address: "", phone: "", bankName: "", bankAccount: "", bankSwift: "" };
  const today = new Date().toLocaleDateString("en-GB");

  const getProductData = (code) => (products || []).find(p => p.code === code);

  const handlePaySave = () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    onPaymentSaved(order.id, payType, amt);
    setShowPay(false);
    setPayAmount("");
  };

  const generateInvoice = () => {
    const rows = order.items.map((it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td style="font-weight:700">${it.product}</td>
        <td style="text-align:right">${it.qty}</td>
        <td style="text-align:right">$${it.unitPrice}</td>
        <td style="text-align:right;font-weight:700">$${(it.qty * it.unitPrice).toFixed(2)}</td>
      </tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Invoice – ${order.id}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#111}
      h1{font-size:26px;margin:0}h2{font-size:14px;margin-top:24px;border-bottom:1px solid #ccc;padding-bottom:4px;color:#555}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
      .meta{font-size:13px;color:#555;margin-top:4px}
      .parties{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:20px}
      .party{background:#f8faff;border:1px solid #dce3f0;border-radius:8px;padding:14px}
      .party-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
      .party-name{font-weight:700;font-size:15px}
      table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
      th{background:#f0f4fb;padding:9px 10px;text-align:left;border:1px solid #dce3f0;font-size:11px;text-transform:uppercase}
      td{padding:9px 10px;border:1px solid #dce3f0}
      .totals{margin-top:20px;display:flex;justify-content:flex-end}
      .totals-box{min-width:260px}
      .total-row{display:flex;justify-content:space-between;padding:5px 0;font-size:14px;border-bottom:1px solid #eee}
      .total-final{display:flex;justify-content:space-between;padding:8px 0;font-size:16px;font-weight:700;color:#d63c3c;border-top:2px solid #000;margin-top:4px}
      .footer{margin-top:40px;font-size:12px;color:#888;text-align:center}
    </style></head><body>
    <div class="header">
      <div>
        <h1>INVOICE</h1>
        <div class="meta">No. <strong>${order.id}</strong> &nbsp;|&nbsp; Date: <strong>${order.date}</strong></div>
      </div>
      <div style="text-align:right;font-size:13px;color:#555">
        <div style="font-weight:700;font-size:15px">FactoryOS Industrial Co.</div>
        <div>radiator manufacturer</div>
      </div>
    </div>
    <div class="parties">
      <div class="party">
        <div class="party-label">Seller</div>
        <div class="party-name">FactoryOS Industrial Co.</div>
        <div style="font-size:13px;color:#555;margin-top:4px">Radiator manufacturer</div>
      </div>
      <div class="party">
        <div class="party-label">Buyer</div>
        <div class="party-name">${client.name}</div>
        <div style="font-size:13px;color:#555;margin-top:4px">
          ${client.country}${client.address ? "<br/>" + client.address : ""}
          ${client.phone ? "<br/>Tel: " + client.phone : ""}
        </div>
      </div>
    </div>
    <h2>Items</h2>
    <table>
      <thead><tr><th>№</th><th>Product Code</th><th style="text-align:right">Qty (pcs)</th><th style="text-align:right">Unit Price ($)</th><th style="text-align:right">Amount ($)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div class="totals-box">
        <div class="total-row"><span>Subtotal:</span><span>$${order.total.toFixed(2)}</span></div>
        <div class="total-row"><span>💵 Cash Paid:</span><span style="color:#1a9e5c">$${order.cashPaid.toFixed(2)}</span></div>
        <div class="total-row"><span>🏦 Wire Paid:</span><span style="color:#0a8fa8">$${order.wirePaid.toFixed(2)}</span></div>
        <div class="total-final"><span>Balance Due:</span><span>$${remaining.toFixed(2)}</span></div>
      </div>
    </div>
    ${client.bankName ? `<h2>Bank Details</h2>
    <div style="font-size:13px;line-height:1.8">
      ${client.bankName ? "Bank: <strong>" + client.bankName + "</strong><br/>" : ""}
      ${client.bankAccount ? "Account: <strong>" + client.bankAccount + "</strong><br/>" : ""}
      ${client.bankSwift ? "SWIFT: <strong>" + client.bankSwift + "</strong>" : ""}
    </div>` : ""}
    <div class="footer">Generated by FactoryOS &nbsp;|&nbsp; ${today}</div>
    </body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
  };

  const generateNakladnoy = () => {
    const rows = order.items.map((it, i) => {
      const pd = getProductData(it.product);
      const unitW = pd?.single ?? "—";
      const totalW = pd?.single ? (pd.single * it.qty).toFixed(2) : "—";
      return `<tr>
        <td>${i + 1}</td>
        <td style="font-weight:700">${it.product}</td>
        <td style="text-align:right">${it.qty}</td>
        <td style="text-align:right">${unitW}</td>
        <td style="text-align:right">${totalW}</td>
        <td style="text-align:right">$${it.unitPrice}</td>
        <td style="text-align:right;font-weight:700">$${(it.qty * it.unitPrice).toFixed(2)}</td>
      </tr>`;
    }).join("");
    const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
    const totalWt = order.items.reduce((s, it) => {
      const pd = getProductData(it.product);
      return s + (pd?.single ? pd.single * it.qty : 0);
    }, 0);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Delivery Note – ${order.id}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:860px;margin:40px auto;padding:20px;color:#111}
      h1{font-size:20px;text-align:center;margin-bottom:4px}
      .sub{text-align:center;font-size:13px;color:#555;margin-bottom:20px}
      .parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px;font-size:13px}
      .party-label{font-weight:700;color:#555;margin-bottom:4px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th{background:#f0f4fb;padding:8px 10px;text-align:left;border:1px solid #dce3f0;font-size:11px;text-transform:uppercase}
      td{padding:8px 10px;border:1px solid #dce3f0}
      .summary{margin-top:16px;display:flex;gap:24px;font-size:13px}
      .sum-box{background:#f8faff;border:1px solid #dce3f0;border-radius:6px;padding:10px 16px;min-width:160px}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:50px}
      .sig-box{border-top:1px solid #000;padding-top:6px;font-size:12px}
    </style></head><body>
    <h1>DELIVERY NOTE / ТОВАРНАЯ НАКЛАДНАЯ</h1>
    <div class="sub">No. ${order.id} &nbsp;|&nbsp; Date: ${order.date}</div>
    <div class="parties">
      <div>
        <div class="party-label">Shipper (Грузоотправитель)</div>
        <div>FactoryOS Industrial Co.</div>
      </div>
      <div>
        <div class="party-label">Consignee (Грузополучатель)</div>
        <div><strong>${client.name}</strong></div>
        <div>${client.country}${client.address ? ", " + client.address : ""}</div>
      </div>
    </div>
    <table>
      <thead><tr>
        <th>№</th><th>Product Code</th>
        <th style="text-align:right">Qty (pcs)</th>
        <th style="text-align:right">Unit Wt (kg)</th>
        <th style="text-align:right">Total Wt (kg)</th>
        <th style="text-align:right">Unit Price ($)</th>
        <th style="text-align:right">Amount ($)</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="summary">
      <div class="sum-box"><div style="font-size:11px;color:#888;margin-bottom:4px">TOTAL QTY</div><div style="font-weight:700;font-size:16px">${totalQty} pcs</div></div>
      <div class="sum-box"><div style="font-size:11px;color:#888;margin-bottom:4px">TOTAL WEIGHT</div><div style="font-weight:700;font-size:16px">${totalWt.toFixed(2)} kg</div></div>
      <div class="sum-box"><div style="font-size:11px;color:#888;margin-bottom:4px">TOTAL AMOUNT</div><div style="font-weight:700;font-size:16px">$${order.total.toFixed(2)}</div></div>
    </div>
    <div class="sig">
      <div class="sig-box"><strong>Shipper:</strong> FactoryOS<br/><br/>Signature: _______________<br/>Date: ${today}</div>
      <div class="sig-box"><strong>Consignee:</strong> ${client.name}<br/><br/>Signature: _______________<br/>Date: _______________</div>
    </div>
    </body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
  };

  const generatePricelist = () => {
    if (!client || !client.prices) return;
    const TAX_RATE = 0.10;
    const allProds = products || [];
    const alumProds = allProds.filter(p => p.type === "alum");
    const bimetalProds = allProds.filter(p => p.type === "bimetal");
    const buildRows = (prods) => prods.map((p, i) => {
      const cash = client.prices[p.code] ?? "—";
      const wire = typeof cash === "number" ? (cash * (1 + TAX_RATE)).toFixed(2) : "—";
      return `<tr>
        <td>${i + 1}</td>
        <td style="font-weight:700">${p.code}</td>
        <td style="text-align:right">${p.raw}</td>
        <td style="text-align:right">${p.single}</td>
        <td style="text-align:right;color:#1a9e5c;font-weight:700">$${cash}</td>
        <td style="text-align:right;color:#0a8fa8;font-weight:700">$${wire}</td>
        <td style="text-align:right;color:#888">${p.spec || "—"}</td>
        <td style="text-align:right">${p.heat ? p.heat + "W" : "—"}</td>
      </tr>`;
    }).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Pricelist – ${client.name}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:860px;margin:40px auto;padding:20px;color:#111}
      h1{font-size:22px;margin-bottom:4px}
      .meta{font-size:13px;color:#555;margin-bottom:24px}
      .note{background:#fffbe6;border:1px solid #f5a623;border-radius:6px;padding:8px 14px;font-size:12px;color:#7a5500;margin-bottom:20px}
      h2{font-size:14px;margin-top:24px;border-bottom:1px solid #ccc;padding-bottom:4px;color:#444}
      table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
      th{background:#f0f4fb;padding:8px 10px;text-align:left;border:1px solid #dce3f0;font-size:11px;text-transform:uppercase}
      td{padding:8px 10px;border:1px solid #dce3f0}
      .footer{margin-top:32px;font-size:12px;color:#888;text-align:center}
    </style></head><body>
    <h1>PRICE LIST</h1>
    <div class="meta">Client: <strong>${client.name}</strong> &nbsp;|&nbsp; ${client.country} &nbsp;|&nbsp; Date: ${today}</div>
    <div class="note">⚠️ Wire price = Cash price + 10% tax. Prices in USD per section.</div>
    ${alumProds.length > 0 ? `<h2>Aluminum Radiators (${alumProds.length} models)</h2>
    <table><thead><tr><th>№</th><th>Model</th><th style="text-align:right">Raw Wt</th><th style="text-align:right">Single Wt</th><th style="text-align:right">Cash Price ($)</th><th style="text-align:right">Wire Price ($)</th><th style="text-align:right">Spec mm</th><th style="text-align:right">Heat W</th></tr></thead>
    <tbody>${buildRows(alumProds)}</tbody></table>` : ""}
    ${bimetalProds.length > 0 ? `<h2>Bimetal Radiators (${bimetalProds.length} models)</h2>
    <table><thead><tr><th>№</th><th>Model</th><th style="text-align:right">Raw Wt</th><th style="text-align:right">Single Wt</th><th style="text-align:right">Cash Price ($)</th><th style="text-align:right">Wire Price ($)</th><th style="text-align:right">Spec mm</th><th style="text-align:right">Heat W</th></tr></thead>
    <tbody>${buildRows(bimetalProds)}</tbody></table>` : ""}
    <div class="footer">Generated by FactoryOS &nbsp;|&nbsp; ${today}</div>
    </body></html>`;
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
              <div className="bg-brand-blue p-3 rounded-2xl">
                <ClipboardList className="text-brand-lime" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-bold text-brand-blue">{order.id}</h2>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {T[order.status] || order.status}
                  </span>
                </div>
                <p className="text-brand-blue/40 font-bold uppercase tracking-widest text-[10px]">{order.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 rounded-xl bg-brand-blue/5 text-brand-blue hover:bg-brand-lime transition-colors" onClick={() => onEdit(order)}>
                <ClipboardList size={20} />
              </button>
              <button className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors" onClick={() => onDelete(order.id)}>
                <X size={20} />
              </button>
              <button className="p-3 rounded-xl bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10 transition-colors" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-[2rem] bg-white border border-brand-blue/5 shadow-sm">
              <div className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mb-1">{T.client}</div>
              <div className="text-lg font-bold text-brand-blue">{order.client}</div>
            </div>
            <div className="p-6 rounded-[2rem] bg-white border border-brand-blue/5 shadow-sm text-right">
              <div className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mb-1">{T.total}</div>
              <div className="text-lg font-bold text-brand-blue">${order.total.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
             <div className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest px-2">{T.product}</div>
             <div className="rounded-3xl border border-brand-blue/5 bg-white/40 overflow-hidden">
                <table className="w-full text-sm font-medium">
                  <thead>
                    <tr className="bg-brand-blue/5 text-brand-blue/40 uppercase tracking-widest text-[9px]">
                      <th className="px-6 py-4">{T.model}</th>
                      <th className="px-6 py-4 text-right">{T.qty}</th>
                      <th className="px-6 py-4 text-right">{T.total}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-blue/5">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/60 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-blue">{item.product}</td>
                        <td className="px-6 py-4 text-right">{item.qty} pcs</td>
                        <td className="px-6 py-4 text-right font-bold text-brand-blue">${(item.qty * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-green-50 text-green-700">
               <div className="text-[9px] font-bold uppercase tracking-widest mb-1">{T.cashPaid}</div>
               <div className="text-xl font-display font-bold">${order.cashPaid.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-700">
               <div className="text-[9px] font-bold uppercase tracking-widest mb-1">{T.wirePaid}</div>
               <div className="text-xl font-display font-bold">${order.wirePaid.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 text-red-600">
               <div className="text-[9px] font-bold uppercase tracking-widest mb-1">{T.remaining}</div>
               <div className="text-xl font-display font-bold">${remaining.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest">{T.paymentProgress}</span>
              <span className="text-[10px] font-bold text-brand-blue/60 uppercase tracking-widest">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-brand-blue/5 rounded-full overflow-hidden flex">
              <motion.div initial={{ width: 0 }} animate={{ width: `${cashPct}%` }} className="bg-green-500 h-full" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${wirePct}%` }} className="bg-blue-400 h-full" />
            </div>
          </div>

          <AnimatePresence>
            {showPay && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="p-6 rounded-[2rem] bg-brand-blue/5 space-y-6">
                  <h3 className="font-bold text-brand-blue">{T.addPaymentTitle}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex p-1 bg-white rounded-2xl">
                      {[["cash", T.cash], ["wire", T.wire]].map(([k, label]) => (
                        <button key={k} onClick={() => setPayType(k)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${payType === k ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-brand-blue/40 hover:text-brand-blue'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest px-2">{T.paymentAmount}</label>
                      <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" type="number" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest px-2">{T.paymentDate}</label>
                      <input className="w-full bg-white border border-brand-blue/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-bold" type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-brand-blue text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-brand-blue/20" onClick={handlePaySave}>{T.save}</button>
                    <button className="flex-1 text-brand-blue/40 font-bold text-xs" onClick={() => setShowPay(false)}>{T.cancel}</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-brand-blue/5">
            <button className="bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm flex flex-col items-center gap-2" onClick={generateInvoice}>
              <ClipboardList size={16} /> {T.generateInvoice}
            </button>
            <button className="bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm flex flex-col items-center gap-2" onClick={generateNakladnoy}>
              <Truck size={16} /> {T.generateNakladnaya}
            </button>
            <button className="bg-white border border-brand-blue/10 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 transition-all shadow-sm flex flex-col items-center gap-2" onClick={generatePricelist}>
              <Wallet size={16} /> {T.generatePL}
            </button>
            <button className="bg-brand-lime text-brand-blue py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:brightness-105 transition-all shadow-lg shadow-brand-lime/20 flex flex-col items-center gap-2" onClick={() => setShowPay(true)}>
              <Plus size={16} /> {T.addPayment}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
