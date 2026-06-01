import React from 'react';
import { Product, Client, Order, Shipment, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Truck, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  Box, 
  Package, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DashboardProps {
  orders: Order[];
  clients: Client[];
  shipments: Shipment[];
  lang: Language;
}

export default function Dashboard({ orders, clients, shipments, lang }: DashboardProps) {
  const T = TRANSLATIONS[lang];

  // Calculations
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalPaid = orders.reduce((s, o) => s + o.cashPaid + o.wirePaid, 0);
  const totalDebt = orders.reduce((s, o) => s + Math.max(0, o.total - o.cashPaid - o.wirePaid), 0);
  const activeShipments = shipments.filter(s => s.status !== "arrived").length;

  const cards = [
    {
      label: T.totalRevenue,
      value: `$${(totalRevenue).toLocaleString()}`,
      sub: `${orders.length} ${T.orders_count}`,
      icon: TrendingUp,
      color: "bg-[#002045]",
      textColor: "text-[#ffffff]",
      bgLight: "bg-[#002045]",
    },
    {
      label: T.totalCollected,
      value: `$${(totalPaid).toLocaleString()}`,
      sub: `${totalRevenue ? Math.round((totalPaid / totalRevenue) * 100) : 0}% ${T.collected}`,
      icon: DollarSign,
      color: "bg-[#002045]",
      textColor: "text-[#ffffff]",
      bgLight: "bg-[#002045]",
    },
    {
      label: T.totalDebt,
      value: `$${(totalDebt).toLocaleString()}`,
      sub: "Cash + Wire",
      icon: AlertCircle,
      color: "bg-[#002045]",
      textColor: "text-[#ffffff]",
      bgLight: "bg-[#002045]",
    },
    {
      label: T.activeShipments,
      value: activeShipments.toString(),
      sub: T.enRoute,
      icon: Truck,
      color: "bg-[#002045]",
      textColor: "text-[#ffffff]",
      bgLight: "bg-[#002045]",
    },
  ];

  const statusLabel: Record<string, string> = { 
    ordered: T.ordered, 
    in_transit: T.inTransit, 
    customs: T.atCustoms, 
    arrived: T.arrived 
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
      case 'arrived':
        return 'bg-lime-100 text-slate-900 border border-lime-400';
      case 'partial':
      case 'customs':
      case 'in_transit':
        return 'bg-slate-100 text-slate-800 border border-slate-300';
      case 'unpaid':
      case 'ordered':
      default:
        return 'bg-amber-100 text-[#002045] border border-amber-300';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-[#002045]">
            {T.dashboard}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {T.factoryOverview} — 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
          </span>
          <span className="text-xs font-mono bg-slate-100 text-[#002045] px-2.5 py-1 rounded-full border border-slate-205 font-bold">
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="relative overflow-hidden rounded-2xl bg-white border-2 border-[#002045] p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono block tracking-tight text-[#002045]">
                  {card.value}
                </span>
                <span className="text-[12px] text-slate-500 mt-1 block font-semibold">
                  {card.sub}
                </span>
              </div>
              {/* Vibrant accent micro-bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-[4px] ${card.color}`} />
            </motion.div>
          );
        })}
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#002045] text-base">
              {T.recentOrders}
            </h3>
            <span className="text-xs font-mono text-white font-bold px-2.5 py-1 bg-[#002045] rounded-lg">
              {orders.length} TOTAL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">{T.orderId}</th>
                  <th className="py-3.5 px-4">{T.client}</th>
                  <th className="py-3.5 px-4">{T.total}</th>
                  <th className="py-3.5 px-4">{T.progress}</th>
                  <th className="py-3.5 px-6">{T.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => {
                  const pct = Math.round((o.cashPaid + o.wirePaid) / o.total * 105);
                  const displayPct = Math.min(100, Math.round((o.cashPaid + o.wirePaid) / o.total * 100));
                  
                  return (
                    <tr 
                      key={o.id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-[#002045] text-sm">
                        {o.id}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium text-sm">
                        {o.client}
                      </td>
                      <td className="py-4 px-4 font-mono text-[#002045] font-extrabold text-sm">
                        ${o.total.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-slate-600 w-10">
                            {displayPct}%
                          </span>
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-lime-400 transition-all duration-550" 
                              style={{ width: `${Math.min(100, (o.cashPaid / o.total) * 100)}%` }} 
                            />
                            <div 
                              className="h-full bg-indigo-600 transition-all duration-550" 
                              style={{ width: `${Math.min(100, (o.wirePaid / o.total) * 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold font-display uppercase tracking-widest ${getStatusStyle(o.status)}`}>
                          {T[o.status] || o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoming Shipments (5 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <h3 className="font-bold text-[#002045] text-base">
              {T.incomingShipments}
            </h3>
            <span className="text-xs font-mono text-white font-bold px-2.5 py-1 bg-[#002045] rounded-lg">
              {activeShipments} ACTIVE
            </span>
          </div>

          <div className="space-y-4">
            {shipments.map((s) => {
              const markerStyle = getStatusStyle(s.status);
              return (
                <div 
                  key={s.id} 
                  className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start justify-between gap-3 text-left"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-mono font-bold text-slate-900">
                        {s.id}
                      </span>
                      <span className="text-slate-300 font-light font-mono">•</span>
                      <span className="text-[12px] text-[#002045] font-bold">
                        {s.from}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-sans line-clamp-1">
                      {s.items}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ETA: {s.eta}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider ${markerStyle}`}>
                      {statusLabel[s.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
