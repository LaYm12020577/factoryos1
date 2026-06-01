import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Globe, 
  Sun, 
  Moon, 
  Tv, 
  Layers, 
  FileSpreadsheet, 
  Activity, 
  UserCheck, 
  Box, 
  Cpu, 
  Coins, 
  TrendingUp, 
  Anchor,
  Flame,
  Zap,
  ArrowUpRight
} from 'lucide-react';

import { Language, Order, Client, Shipment, Product } from './types';
import { TRANSLATIONS } from './translations';

// Import local state defaults representation
import { 
  load, 
  save, 
  PRODUCTS_ALUM, 
  PRODUCTS_BIMETAL, 
  DEFAULT_CLIENTS, 
  DEFAULT_ORDERS, 
  DEFAULT_SHIPMENTS 
} from './data/defaults';

// Actual sub-views
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Debts from './components/Debts';
import Shipments from './components/Shipments';
import Clients from './components/Clients';
import Products from './components/Products';

const normalizeOrders = (orders: any[]): Order[] => {
  return orders.map(o => {
    if (o.items) return o;
    const unitPrice = o.qty > 0 ? Math.round(o.total / o.qty * 100) / 100 : 0;
    const { product, qty, ...rest } = o;
    return { ...rest, items: [{ product, qty, unitPrice }] };
  });
};

export default function App() {
  const [tab, setTab] = useState<string>('dashboard');
  const isLight = true; // Hardcoded light theme only
  const [lang, setLang] = useState<Language>(() => load<Language>("fos_lang", "uz"));
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parallax floating coordinates on mouse event
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 45,
        y: (e.clientY - window.innerHeight / 2) / 45,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // System states populated from persistent JSON storage
  const [orders, setOrders] = useState<Order[]>(() => normalizeOrders(load<any[]>("fos_orders", DEFAULT_ORDERS)));
  const [clients, setClients] = useState<Client[]>(() => load<Client[]>("fos_clients", DEFAULT_CLIENTS));
  const [shipments, setShipments] = useState<Shipment[]>(() => load<Shipment[]>("fos_shipments", DEFAULT_SHIPMENTS));
  const [products, setProducts] = useState<Product[]>(() => load<Product[]>("fos_products", [
    ...PRODUCTS_ALUM.map(p => ({ ...p, type: 'alum' as const })),
    ...PRODUCTS_BIMETAL.map(p => ({ ...p, type: 'bimetal' as const }))
  ]));

  const T = TRANSLATIONS[lang];

  // Save current preferences to persistent memory cache - always force light
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    save("fos_lang", lang);
  }, [lang]);

  // Handle outside dropdown clicks helper
  useEffect(() => {
    const handleDropdownDismiss = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    window.addEventListener('mousedown', handleDropdownDismiss);
    return () => window.removeEventListener('mousedown', handleDropdownDismiss);
  }, []);

  const tabIcons: Record<string, React.ReactNode> = {
    dashboard: <Tv className="w-4 h-4" />,
    orders: <FileSpreadsheet className="w-4 h-4" />,
    debts: <Coins className="w-4 h-4" />,
    shipments: <Anchor className="w-4 h-4" />,
    clients: <UserCheck className="w-4 h-4" />,
    products: <Cpu className="w-4 h-4" />
  };

  const LANG_OPTIONS: { code: Language; label: string; flag: string }[] = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "en", label: "English", flag: "🇬🇧" }
  ];

  return (
    <div className="min-h-screen font-sans transition-colors duration-450 relative overflow-hidden bg-white text-slate-900">
      
      {/* Dynamic Parallax Floating Glowing Spheres */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: mousePos.x * 1.5, y: mousePos.y * 1.5 }}
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-lime-400/5 blur-[130px]"
        />
        <motion.div 
          animate={{ x: -mousePos.x * 2, y: -mousePos.y * 2 }}
          className="absolute top-2/3 right-10 w-80 h-80 rounded-full bg-lime-400/10 blur-[120px]"
        />
        <motion.div 
          animate={{ x: mousePos.x * 0.8, y: -mousePos.y * 1.2 }}
          className="absolute -top-12 right-1/4 w-72 h-72 rounded-full bg-slate-300/20 blur-[100px]"
        />
      </div>

      {/* Primary Sticky Top Bar - #002045 corporate dark navy representing 15% color presence */}
      <header className="sticky top-0 z-40 border-b border-indigo-950 bg-[#002045] text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo Spec */}
          <div className="flex items-center">
            <span className="font-display font-black text-2xl tracking-widest text-white">
              FactoryOS
            </span>
          </div>

          {/* Right Area Controls with Switchers */}
          <div className="flex items-center gap-3">
            
            {/* Language Selection Widget */}
            <div ref={dropdownRef} className="relative z-50">
              <button 
                onClick={() => setLangOpen(o => !o)}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 text-slate-100 transition-all cursor-pointer flex items-center justify-center"
                title="Select Language"
              >
                <Globe className="w-4.5 h-4.5 text-lime-400" />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-44 rounded-2xl shadow-xl border overflow-hidden p-1.5 z-50 bg-white border-slate-200 text-slate-900"
                  >
                    {LANG_OPTIONS.map(({ code, label, flag }) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLang(code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          lang === code 
                            ? "bg-[#002045] text-lime-400 font-bold" 
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{flag}</span>
                          <span>{label}</span>
                        </span>
                        <span className="text-[9px] uppercase font-mono opacity-50">{code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* Subnav tab bar bench */}
      <nav className="border-b bg-slate-50 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-2 overflow-x-auto scrollbar-none">
            {['dashboard', 'orders', 'debts', 'shipments', 'clients', 'products'].map((tabKey) => {
              const acts = tab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold leading-none cursor-pointer transition-all ${
                    acts 
                      ? "bg-[#002045] text-lime-400 shadow-md shadow-[#002045]/15 border border-[#002045]" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#002045]"
                  }`}
                >
                  {tabIcons[tabKey]}
                  <span>{T[tabKey] || tabKey}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main viewport Container Box - Pure White representing the 75% fond */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {tab === "dashboard" && <Dashboard orders={orders} clients={clients} shipments={shipments} lang={lang} />}
            {tab === "orders" && <Orders orders={orders} setOrders={setOrders} clients={clients} products={products} lang={lang} />}
            {tab === "debts" && <Debts clients={clients} setClients={setClients} orders={orders} setOrders={setOrders} lang={lang} />}
            {tab === "shipments" && <Shipments shipments={shipments} setShipments={setShipments} lang={lang} />}
            {tab === "clients" && <Clients clients={clients} setClients={setClients} orders={orders} products={products} lang={lang} />}
            {tab === "products" && <Products products={products} setProducts={setProducts} lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Elegant minimalist branding footer */}
      <footer className="border-t py-6 mt-16 text-center text-xs font-mono bg-slate-50 border-slate-200 text-slate-500">
        <p>© 2026 FactoryOS Industrial ERP Consortium. Built on React & Framer Engine. Live telemetry channels are operational.</p>
      </footer>

    </div>
  );
}
