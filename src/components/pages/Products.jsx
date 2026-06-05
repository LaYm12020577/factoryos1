import React, { useState } from "react";
import { Plus, ClipboardList, X } from "lucide-react";
import { useT } from "../../hooks/useT";
import { save } from "../../utils/helpers";
import { AddProductModal } from "../modals/AddProductModal";
import { ConfirmModal } from "../ui/ConfirmModal";

const Toast = ({ msg }) => (
  <div className="fixed bottom-24 left-50 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-xl z-[999]">
    {msg}
  </div>
);

export function Products({ products, setProducts }) {
  const T = useT();
  const [tab, setTab] = useState("alum");
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState(null);
  const [toast, setToast] = useState(null);

  const prods = products.filter(p => p.type === tab);

  const handleAdd = (product) => {
    setProducts(prev => { const n = [...prev, product]; save("fos_products", n); return n; });
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const handleEdit = (updated) => {
    setProducts(prev => {
      const n = prev.map(p => p.code === updated.code ? updated : p);
      save("fos_products", n); return n;
    });
    setEditingProduct(null);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const handleDelete = () => {
    setProducts(prev => { const n = prev.filter(p => p.code !== confirmDeleteCode); save("fos_products", n); return n; });
    setConfirmDeleteCode(null);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-8">
      {toast && <Toast msg={toast} />}
      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editingProduct && <AddProductModal onClose={() => setEditingProduct(null)} onSave={handleEdit} initialProduct={editingProduct} />}
      {confirmDeleteCode && (
        <ConfirmModal
          title={T.confirmDeleteProductTitle}
          message={T.confirmDeleteProductMsg}
          confirmLabel={T.confirmYes}
          cancelLabel={T.confirmNo}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDeleteCode(null)}
        />
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{T.productsTitle}</h2>
          <p className="text-brand-blue/50 font-medium">{T.productsSubtitle}</p>
        </div>
        <button 
          className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-brand-blue/20 hover:brightness-110 flex items-center gap-2"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={20}/>
          {T.addModel}
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-brand-blue/5 rounded-2xl w-fit">
        {[["alum", T.aluminum], ["bimetal", T.bimetal]].map(([k, label]) => (
          <button 
            key={k} 
            onClick={() => setTab(k)} 
            className={`
              px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
              ${tab === k ? 'bg-white text-brand-blue shadow-sm' : 'text-brand-blue/40 hover:text-brand-blue'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="liquid-glass rounded-[2rem] overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue/40 border-b border-brand-blue/5">
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">#</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.model}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.rawWeight}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.singleWeight}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.specMm}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">{T.heatKw}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-blue/5 font-medium">
              {prods.map((p, i) => (
                <tr key={p.code} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 text-brand-blue/30 font-bold">{i + 1}</td>
                  <td className="px-6 py-4 font-bold text-brand-blue">{p.code}</td>
                  <td className="px-6 py-4">{p.raw} kg</td>
                  <td className="px-6 py-4">{p.single} kg</td>
                  <td className="px-6 py-4 text-brand-blue/50">{p.spec || "—"}</td>
                  <td className="px-6 py-4">
                    {p.heat ? <span className="text-yellow-600 font-bold">{p.heat}W</span> : <span className="text-brand-blue/20">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 bg-brand-blue/5 text-brand-blue rounded-lg hover:bg-brand-lime transition-colors" onClick={() => setEditingProduct(p)}>
                        <ClipboardList size={16} />
                      </button>
                      <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors" onClick={() => setConfirmDeleteCode(p.code)}>
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
