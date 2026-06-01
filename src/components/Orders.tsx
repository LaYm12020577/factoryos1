import React, { useState } from 'react';
import { Product, Client, Order, OrderItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { getProductData, TAX_RATE, save } from '../data/defaults';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  X, 
  FileText, 
  Receipt, 
  CreditCard, 
  Lock, 
  Sparkles,
  Printer
} from 'lucide-react';

interface OrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  clients: Client[];
  products: Product[];
  lang: Language;
}

export default function Orders({ orders, setOrders, clients, products, lang }: OrdersProps) {
  const T = TRANSLATIONS[lang];
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrder, setShowNewOrder] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const allClients = [...new Set(orders.map(o => o.client))].sort();
  const allProducts = [...new Set(orders.flatMap(o => o.items.map(i => i.product)))].sort();

  const filteredOrders = orders.filter(o => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (filterClient !== "all" && o.client !== filterClient) return false;
    if (filterProduct !== "all" && !o.items.some(i => i.product === filterProduct)) return false;
    return true;
  });

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handlePaymentSaved = (orderId: string, type: 'cash' | 'wire', amount: number) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id !== orderId) return o;
        const newCash = type === "cash" ? o.cashPaid + amount : o.cashPaid;
        const newWire = type === "wire" ? o.wirePaid + amount : o.wirePaid;
        const newPaid = newCash + newWire;
        const newStatus: 'paid' | 'partial' | 'unpaid' = newPaid >= o.total ? "paid" : newPaid > 0 ? "partial" : "unpaid";
        return { ...o, cashPaid: newCash, wirePaid: newWire, status: newStatus };
      });
      save("fos_orders", updated);
      return updated;
    });
    setSelectedOrder(null);
    triggerToast(T.savedMsg);
  };

  const handleNewOrderSaved = (order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      save("fos_orders", updated);
      return updated;
    });
    triggerToast(T.savedMsg);
  };

  const handleEditOrderSaved = (updatedOrder: Order) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
      save("fos_orders", updated);
      return updated;
    });
    setSelectedOrder(null);
    triggerToast(T.savedMsg);
  };

  const handleDeleteConfirmed = () => {
    if (!confirmDeleteId) return;
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== confirmDeleteId);
      save("fos_orders", updated);
      return updated;
    });
    setConfirmDeleteId(null);
    setSelectedOrder(null);
    triggerToast(T.savedMsg);
  };

  const statusLabel: Record<string, string> = {
    paid: T.paid,
    partial: T.partial,
    unpaid: T.unpaid,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50';
      case 'partial':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50';
      case 'unpaid':
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Toast Notifs */}
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

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-[#002045] dark:text-white">
            {T.orders}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {T.clickRow}
          </p>
        </div>
        <button 
          onClick={() => setShowNewOrder(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border-[1.6px] border-[#002045] text-[#002045] hover:bg-slate-50 font-display font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          {T.newOrder}
        </button>
      </div>

      {/* Filters Bench */}
      <div className="p-5 bg-white border-[2.8px] border-[#002045] rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#002045] font-bold text-sm">
          <Filter className="w-4 h-4 text-[#002045]" />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-505 mb-2 block">
              {T.status}
            </label>
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full bg-white border-[1.8px] border-[#002045] rounded-2xl p-3 text-sm text-[#002045] font-bold outline-none"
            >
              <option value="all">{T.all}</option>
              <option value="paid">{T.paid}</option>
              <option value="partial">{T.partial}</option>
              <option value="unpaid">{T.unpaid}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-505 mb-2 block">
              {T.client}
            </label>
            <select 
              value={filterClient}
              onChange={e => setFilterClient(e.target.value)}
              className="w-full bg-white border-[1.6px] border-[#002045] rounded-2xl p-3 text-sm text-[#002045] font-bold outline-none"
            >
              <option value="all">{T.allClients}</option>
              {allClients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-505 mb-2 block">
              {T.product}
            </label>
            <select 
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="w-full bg-white border-[1.6px] border-[#002045] rounded-2xl p-3 text-sm text-[#002045] font-bold outline-none"
            >
              <option value="all">{T.allProducts}</option>
              {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Orders Grid/Table Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center text-slate-400 dark:text-slate-500">
          {T.noOrders}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002045] text-white font-bold text-[11px] uppercase tracking-wider border-b border-[#002045]">
                  <th className="py-4 px-6 text-white">{T.orderId}</th>
                  <th className="py-4 px-4 text-white">{T.client}</th>
                  <th className="py-4 px-4 text-white">{T.product}</th>
                  <th className="py-4 px-4 text-white">{T.qty}</th>
                  <th className="py-4 px-4 text-white">{T.total}</th>
                  <th className="py-4 px-4 text-white">{T.cashPaid}</th>
                  <th className="py-4 px-4 text-white">{T.wirePaid}</th>
                  <th className="py-4 px-4 text-white">{T.remaining}</th>
                  <th className="py-4 px-4 text-white">{T.progress}</th>
                  <th className="py-4 px-6 text-right text-white">{T.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredOrders.map((o, idx) => {
                  const paid = o.cashPaid + o.wirePaid;
                  const pct = Math.round(paid / o.total * 100);
                  const cp = Math.round(o.cashPaid / o.total * 100);
                  const wp = Math.round(o.wirePaid / o.total * 100);
                  const rem = o.total - paid;
                  const totalQty = o.items.reduce((s, i) => s + i.qty, 0);

                  return (
                    <tr 
                      key={o.id} 
                      onClick={() => setSelectedOrder(o)}
                      className="hover:bg-slate-50/75 dark:hover:bg-slate-950/20 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono font-black text-indigo-600 dark:text-sky-400 block">
                          {o.id}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                          {o.date}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-205 text-sm">
                        {o.client}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-bold">
                            {o.items[0]?.product}
                          </span>
                          {o.items.length > 1 && (
                            <span className="inline-block text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-0.5">
                              +{o.items.length - 1} {T.models}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-slate-600 dark:text-slate-300">
                        {totalQty}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                        ${o.total.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                        ${o.cashPaid.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
                        ${o.wirePaid.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-mono text-sm">
                        <span className={rem > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-semibold'}>
                          ${rem.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 min-w-[100px]">
                        <div className="flex flex-col font-mono text-[10px] w-16">
                          <span className="font-bold text-slate-600 dark:text-slate-400 mb-1">{pct}%</span>
                          <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-550" style={{ width: `${cp}%` }} />
                            <div className="h-full bg-cyan-550" style={{ width: `${wp}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-block px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-display select-none ${getStatusColor(o.status)}`}>
                          {statusLabel[o.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {selectedOrder && !editingOrder && (
          <OrderDetailsModal 
            order={selectedOrder}
            clients={clients}
            products={products}
            lang={lang}
            onClose={() => setSelectedOrder(null)}
            onPaymentSaved={handlePaymentSaved}
            onEdit={(o) => { setEditingOrder(o); setSelectedOrder(null); }}
            onDelete={(id) => setConfirmDeleteId(id)}
          />
        )}

        {editingOrder && (
          <NewOrEditOrderModal 
            clients={clients}
            orders={orders}
            products={products}
            lang={lang}
            initialOrder={editingOrder}
            onClose={() => setEditingOrder(null)}
            onSave={handleEditOrderSaved}
          />
        )}

        {showNewOrder && (
          <NewOrEditOrderModal 
            clients={clients}
            orders={orders}
            products={products}
            lang={lang}
            onClose={() => setShowNewOrder(false)}
            onSave={handleNewOrderSaved}
          />
        )}

        {confirmDeleteId && (
          <ConfirmDialog 
            title={T.confirmDeleteTitle}
            message={T.confirmDeleteMsg}
            confirmLabel={T.confirmYes}
            cancelLabel={T.confirmNo}
            onConfirm={handleDeleteConfirmed}
            onCancel={() => setConfirmDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* COMPONENT: ConfirmDialog */
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[900]" onClick={onCancel}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-display font-semibold text-sm transition-all cursor-pointer"
          >
            {confirmLabel}
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-display font-semibold text-sm transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* COMPONENT: OrderDetailsModal */
interface OrderDetailsModalProps {
  order: Order;
  clients: Client[];
  products: Product[];
  lang: Language;
  onClose: () => void;
  onPaymentSaved: (orderId: string, type: 'cash' | 'wire', amount: number) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}
function OrderDetailsModal({ order, clients, products, lang, onClose, onPaymentSaved, onEdit, onDelete }: OrderDetailsModalProps) {
  const T = TRANSLATIONS[lang];
  const client = clients.find(c => c.name === order.client) || clients[0];
  const remaining = order.total - order.cashPaid - order.wirePaid;
  const pct = Math.round((order.cashPaid + order.wirePaid) / order.total * 100);
  const cashPct = Math.round(order.cashPaid / order.total * 100);
  const wirePct = Math.round(order.wirePaid / order.total * 100);

  const [showPayForm, setShowPayForm] = useState<boolean>(false);
  const [payType, setPayType] = useState<'cash' | 'wire'>('cash');
  const [payAmount, setPayAmount] = useState<string>("");
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handlePaySave = () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    onPaymentSaved(order.id, payType, amt);
    setShowPayForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400';
      case 'partial': return 'bg-amber-100 text-amber-800 dark:bg-amber-955 dark:text-amber-400';
      default: return 'bg-rose-100 text-rose-800 dark:bg-rose-955 dark:text-rose-400';
    }
  };

  // Documents Generative Printing Functions (Identical matching variables to prevent regressions)
  const today = new Date().toLocaleDateString("en-GB");

  const generateInvoice = () => {
    const rows = order.items.map((it, i) => `<tr>
      <td>${i + 1}</td>
      <td style="font-weight:700">${it.product}</td>
      <td style="text-align:right">${it.qty}</td>
      <td style="text-align:right">$${it.unitPrice.toFixed(2)}</td>
      <td style="text-align:right;font-weight:700">$${(it.qty * it.unitPrice).toFixed(2)}</td>
    </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Invoice – ${order.id}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:800px;margin:30px auto;padding:20px;color:#111;line-height:1.6}
      .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #002045;padding-bottom:14px;margin-bottom:30px}
      h1{margin:0;font-size:26px;color:#002045}
      .meta{font-size:13px;color:#555;margin-top:5px}
      h2{font-size:15px;margin-top:30px;color:#002045}
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
        <div class="meta font-mono">No. <strong>${order.id}</strong> &nbsp;|&nbsp; Date: <strong>${order.date}</strong></div>
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
        <div class="party-name">${client?.name || order.client}</div>
        <div style="font-size:13px;color:#555;margin-top:4px">
          ${client?.country || ""}${client?.address ? "<br/>" + client.address : ""}
          ${client?.phone ? "<br/>Tel: " + client.phone : ""}
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
    ${client?.bankName ? `<h2>Bank Details</h2>
    <div style="font-size:13px;line-height:1.8">
      ${client.bankName ? "Bank: <strong>" + client.bankName + "</strong><br/>" : ""}
      ${client.bankAccount ? "Account: <strong>" + client.bankAccount + "</strong><br/>" : ""}
      ${client.bankSwift ? "SWIFT: <strong>" + client.bankSwift + "</strong>" : ""}
    </div>` : ""}
    <div class="footer font-mono">Generated by FactoryOS &nbsp;|&nbsp; ${today}</div>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
  };

  const generateNakladnoy = () => {
    const rows = order.items.map((it, i) => {
      const pd = products.find(p => p.code === it.product);
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
      const pd = products.find(p => p.code === it.product);
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
        <div><strong>${client?.name || order.client}</strong></div>
        <div>${client?.country || ""}${client?.address ? ", " + client.address : ""}</div>
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
      <div class="sig-box"><strong>Consignee:</strong> ${client?.name || order.client}<br/><br/>Signature: _______________<br/>Date: _______________</div>
    </div>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-[800]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40">
          <div>
            <span className="font-mono font-black text-indigo-600 dark:text-sky-400 text-lg mr-2">
              {order.id}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {order.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1.5 rounded-lg text-[10px] font-bold font-display uppercase tracking-widest ${getStatusColor(order.status)}`}>
              {T[order.status] || order.status}
            </span>
            <button 
              onClick={() => onEdit(order)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-650 transition-colors"
              title={T.editOrder}
            >
              <Edit className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => onDelete(order.id)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-rose-650 transition-colors"
              title={T.deleteOrder}
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                {T.client}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {order.client}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                {T.qty} · {T.total}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm font-mono">
                {order.items.reduce((s, i) => s + i.qty, 0)} pcs · <span className="text-indigo-600 dark:text-sky-400">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Items spec table */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {T.product}
            </div>
            <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl overflow-hidden font-mono text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-450 dark:text-slate-505 border-b border-slate-150 dark:border-slate-800 font-bold uppercase text-[9px] tracking-wider">
                    <th className="p-3">{T.model}</th>
                    <th className="p-3 text-right">{T.qty}</th>
                    <th className="p-3 text-right">{T.unitPrice}</th>
                    <th className="p-3 text-right">{T.total}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item, id) => (
                    <tr key={id} className="text-slate-700 dark:text-slate-200">
                      <td className="p-3 font-bold text-indigo-600 dark:text-sky-450">{item.product}</td>
                      <td className="p-3 text-right">{item.qty}</td>
                      <td className="p-3 text-right text-slate-400">${item.unitPrice}</td>
                      <td className="p-3 text-right font-bold">${(item.qty * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Balance display widget */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl text-center">
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{T.total}</div>
              <div className="text-base font-black font-mono text-indigo-600 dark:text-sky-450">${order.total.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl text-center">
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{T.cashPaid}</div>
              <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">${order.cashPaid.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-cyan-70/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 rounded-2xl text-center">
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{T.wirePaid}</div>
              <div className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400">${order.wirePaid.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress graph */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{T.paymentProgress} · {pct}%</span>
              <span>{T.remaining}: <strong className="text-rose-500 font-bold">${remaining.toLocaleString()}</strong></span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
              <div className="h-full bg-emerald-555 transition-all" style={{ width: `${cashPct}%` }} />
              <div className="h-full bg-cyan-555 transition-all" style={{ width: `${wirePct}%` }} />
            </div>
          </div>

          {/* Register a payment expansion view */}
          {showPayForm ? (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 text-left overflow-hidden"
            >
              <div className="font-bold text-slate-800 dark:text-white text-sm">{T.addPaymentTitle}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">
                    {T.paymentType}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setPayType('cash')}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-center border cursor-pointer transition-all ${payType === 'cash' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-transparent border-slate-200 text-slate-550'}`}
                    >
                      {T.cash}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPayType('wire')}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-center border cursor-pointer transition-all ${payType === 'wire' ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm shadow-cyan-600/20' : 'bg-transparent border-slate-200 text-slate-550'}`}
                    >
                      {T.wire}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">
                    {T.paymentAmount}
                  </label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={payAmount} 
                    onChange={e => setPayAmount(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handlePaySave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {T.save}
                </button>
                <button 
                  onClick={() => setShowPayForm(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  {T.cancel}
                </button>
              </div>
            </motion.div>
          ) : null}

          {/* Action Bench for dynamic actions/printing */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button 
              onClick={generateInvoice}
              className="flex items-center justify-center gap-2 py-3 border border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50 dark:border-slate-800 dark:bg-transparent dark:hover:bg-slate-850/30 text-indigo-700 dark:text-sky-400 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              {T.generateInvoice}
            </button>
            <button 
              onClick={generateNakladnoy}
              className="flex items-center justify-center gap-2 py-3 border border-cyan-205 bg-cyan-50/20 hover:bg-cyan-50 dark:border-slate-800 dark:bg-transparent dark:hover:bg-slate-850/30 text-cyan-705 dark:text-cyan-455 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-cyan-500" />
              {T.generateNakladnaya}
            </button>
            <button 
              onClick={() => setShowPayForm(true)}
              className="col-span-2 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-white" />
              {T.addPayment}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


/* COMPONENT: NewOrEditOrderModal */
interface NewOrEditOrderModalProps {
  clients: Client[];
  orders: Order[];
  products: Product[];
  lang: Language;
  onClose: () => void;
  onSave: (order: Order) => void;
  initialOrder?: Order;
}
function NewOrEditOrderModal({ clients, orders, products, lang, onClose, onSave, initialOrder }: NewOrEditOrderModalProps) {
  const T = TRANSLATIONS[lang];
  const isEdit = !!initialOrder;
  const alumProds = products.filter(p => p.type === "alum");
  const bimetalProds = products.filter(p => p.type === "bimetal");

  const [clientId, setClientId] = useState<string>(() => {
    if (initialOrder) {
      const c = clients.find(c => c.name === initialOrder.client);
      return String(c?.id ?? clients[0]?.id ?? "");
    }
    return String(clients[0]?.id ?? "");
  });

  const [priceType, setPriceType] = useState<'cash' | 'wire'>('cash');
  const [items, setItems] = useState<{ product: string; qty: string; customPrice: string | null; priceUnlocked: boolean }[]>(() => {
    if (initialOrder) {
      return initialOrder.items.map(i => ({
        product: i.product,
        qty: String(i.qty),
        customPrice: String(i.unitPrice),
        priceUnlocked: true,
      }));
    }
    return [{ product: products[0]?.code ?? "", qty: "", customPrice: null, priceUnlocked: false }];
  });

  const [confirmPriceIdx, setConfirmPriceIdx] = useState<number | null>(null);
  const selectedClient = clients.find(c => c.id === Number(clientId)) || clients[0];

  const getUnitPriceValue = (item: typeof items[0]) => {
    if (item.priceUnlocked && item.customPrice !== null && item.customPrice !== "") {
      return parseFloat(item.customPrice) || 0;
    }
    const cashPrice = selectedClient?.prices[item.product] ?? 0;
    return priceType === "wire" ? parseFloat((cashPrice * (1 + TAX_RATE)).toFixed(2)) : cashPrice;
  };

  const addItemRow = () => {
    setItems(prev => [...prev, { product: products[0]?.code ?? "", qty: "", customPrice: null, priceUnlocked: false }]);
  };

  const removeItemRow = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updateItemRow = (idx: number, field: string, val: any) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const unlockPriceInput = (idx: number, currentPrice: number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, priceUnlocked: true, customPrice: String(currentPrice) } : item));
    setConfirmPriceIdx(null);
  };

  const enrichedItems = items.map(item => {
    const unitPrice = getUnitPriceValue(item);
    return { ...item, unitPrice, subtotal: (parseFloat(item.qty) || 0) * unitPrice };
  });

  const totalAmount = enrichedItems.reduce((s, i) => s + i.subtotal, 0);

  const handleSaveOrder = () => {
    const validItems = enrichedItems.filter(i => parseInt(i.qty) > 0);
    if (!clientId || validItems.length === 0) return;
    const mappedItems: OrderItem[] = validItems.map(i => ({ product: i.product, qty: parseInt(i.qty), unitPrice: i.unitPrice }));

    if (isEdit && initialOrder) {
      const newStatus: 'paid' | 'partial' | 'unpaid' = initialOrder.cashPaid + initialOrder.wirePaid >= totalAmount ? "paid"
        : initialOrder.cashPaid + initialOrder.wirePaid > 0 ? "partial" : "unpaid";
      onSave({ ...initialOrder, client: selectedClient.name, items: mappedItems, total: totalAmount, status: newStatus });
    } else {
      const seqId = () => {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const seq = String(orders.length + 1).padStart(3, "0");
        return `NW${yy}${mm}${seq}`;
      };

      onSave({
        id: seqId(),
        client: selectedClient.name,
        items: mappedItems,
        total: totalAmount,
        cashPaid: 0,
        wirePaid: 0,
        status: "unpaid",
        date: new Date().toISOString().slice(0, 10),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-[850]" onClick={onClose}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40">
          <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-base">
            {isEdit ? `✏/📝 ${T.editOrder}: ${initialOrder?.id}` : T.newOrderTitle}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full font-bold text-slate-400 hover:text-slate-650 cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Form elements */}
        <div className="p-6 space-y-6">
          
          {/* Select client */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
              {T.client}
            </label>
            <select 
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-sm text-slate-800 dark:text-slate-200 outline-none font-medium"
            >
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Select payment type (Cash vs Wire) */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
              {T.priceType}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setPriceType('cash')}
                className={`py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-center border cursor-pointer transition-all ${priceType === 'cash' ? 'bg-gradient-to-r from-emerald-500 to-emerald-650 border-emerald-500 text-white shadow-md shadow-emerald-500/15' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50/50'}`}
              >
                {T.cash}
              </button>
              <button 
                type="button" 
                onClick={() => setPriceType('wire')}
                className={`py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-center border cursor-pointer transition-all ${priceType === 'wire' ? 'bg-gradient-to-r from-cyan-500 to-cyan-650 border-cyan-500 text-white shadow-md shadow-cyan-500/15' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50/50'}`}
              >
                {T.wire}
              </button>
            </div>
          </div>

          {/* Order Items bench */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/20 p-2 px-4 rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505">
                {T.product}
              </span>
              <button 
                type="button"
                onClick={addItemRow}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-705 text-indigo-700 dark:text-sky-400 font-bold rounded-lg text-[10px] uppercase transition-all tracking-wider cursor-pointer font-display"
              >
                {T.addProduct}
              </button>
            </div>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
              {items.map((item, idx) => {
                const currentUnitPrice = getUnitPriceValue(item);
                const subtotal = (parseFloat(item.qty) || 0) * currentUnitPrice;

                return (
                  <div 
                    key={idx} 
                    className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-2xl space-y-3 relative text-left"
                  >
                    <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
                      <span className="font-bold">ITEM #{idx + 1}</span>
                      {items.length > 1 && (
                        <button 
                          onClick={() => removeItemRow(idx)}
                          className="text-rose-500 hover:text-rose-750 font-bold transition-all text-sm cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                          {T.selectProduct}
                        </label>
                        <select 
                          value={item.product}
                          onChange={e => updateItemRow(idx, "product", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-250 font-medium"
                        >
                          {alumProds.length > 0 && <optgroup label={T.aluminum}>{alumProds.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}</optgroup>}
                          {bimetalProds.length > 0 && <optgroup label={T.bimetal}>{bimetalProds.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}</optgroup>}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                          {T.qty}
                        </label>
                        <input 
                          type="number" 
                          placeholder="0"
                          value={item.qty}
                          onChange={e => updateItemRow(idx, "qty", e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-mono text-xs text-slate-800 dark:text-white text-center outline-none"
                        />
                      </div>
                    </div>

                    {/* Pricing input/toggle box */}
                    {item.qty && (
                      <div className="space-y-2">
                        {confirmPriceIdx === idx && (
                          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 rounded-xl flex items-center justify-between gap-2">
                            <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold flex-1">{T.confirmPriceChange}</span>
                            <div className="flex gap-2">
                              <button onClick={() => unlockPriceInput(idx, currentUnitPrice)} className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer">{T.changePriceYes}</button>
                              <button onClick={() => setConfirmPriceIdx(null)} className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 rounded-lg text-[10px] font-medium cursor-pointer">{T.changePriceNo}</button>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px]">
                            <div className="text-[9px] text-slate-400 uppercase font-sans mb-1">{T.unitPrice}</div>
                            {item.priceUnlocked ? (
                              <input 
                                type="number" 
                                step="0.01" 
                                value={item.customPrice ?? ""}
                                onChange={e => updateItemRow(idx, "customPrice", e.target.value)}
                                className="w-full bg-slate-50 p-1 rounded font-bold border border-slate-200 outline-none text-slate-800"
                              />
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-slate-800 dark:text-white">${currentUnitPrice.toFixed(2)}</span>
                                <button 
                                  type="button"
                                  onClick={() => setConfirmPriceIdx(confirmPriceIdx === idx ? null : idx)}
                                  className="text-[10px] text-slate-400 hover:text-indigo-650 cursor-pointer"
                                  title={T.unlockPrice}
                                >
                                  🔒
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="p-2.5 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/10 rounded-xl font-mono text-[11px] flex flex-col justify-center">
                            <div className="text-[9px] text-slate-400 uppercase font-sans mb-0.5">{T.total}</div>
                            <span className="font-black text-indigo-600 dark:text-sky-400">${subtotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer totals / save */}
          {totalAmount > 0 && (
            <div className="p-4 bg-indigo-50/50 dark:bg-[#002045]/30 border border-indigo-100 dark:border-indigo-905 rounded-2xl flex items-center justify-between">
              <span className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">{T.total}</span>
              <span className="text-xl font-black font-mono text-indigo-600 dark:text-sky-400">${totalAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button 
              onClick={handleSaveOrder}
              className="flex-1 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm rounded-2xl shadow-md cursor-pointer transition-all"
            >
              {T.save}
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-display font-semibold text-sm rounded-2xl transition-all cursor-pointer"
            >
              {T.cancel}
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
