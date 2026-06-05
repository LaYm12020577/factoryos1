import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Wallet, 
  Truck, 
  Users, 
  Package, 
  Moon, 
  Sun, 
  Globe,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

import { LangCtx, ThemeCtx } from "./context/AppContext";
import { TRANSLATIONS } from "./constants/translations";
import { load, normalizeOrders } from "./utils/helpers";
import { DEFAULT_ORDERS, DEFAULT_CLIENTS, DEFAULT_SHIPMENTS, PRODUCTS_ALUM, PRODUCTS_BIMETAL } from "./constants/data";

import { Dashboard } from "./components/pages/Dashboard";
import { Orders } from "./components/pages/Orders";
import { Debts } from "./components/pages/Debts";
import { Shipments } from "./components/pages/Shipments";
import { Clients } from "./components/pages/Clients";
import { Products } from "./components/pages/Products";

const DARK = { bg: "#0f1117" };
const LIGHT = { bg: "#f0f4fb" };

const TABS_DEF = ["dashboard", "orders", "debts", "shipments", "clients", "products"];
const LANG_OPTIONS = [["uz", "🇺🇿 O'zbek"], ["ru", "🇷🇺 Русский"], ["zh", "🇨🇳 中文"], ["en", "🇺🇸 English"]];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [isLight, setIsLight] = useState(true);
  const [lang, setLang] = useState("uz");
  const [langOpen, setLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState(() => normalizeOrders(load("fos_orders", DEFAULT_ORDERS)));
  const [clients, setClients] = useState(() => load("fos_clients", DEFAULT_CLIENTS));
  const [shipments, setShipments] = useState(() => load("fos_shipments", DEFAULT_SHIPMENTS));
  const [products, setProducts] = useState(() => load("fos_products",
    [...PRODUCTS_ALUM.map(p => ({ ...p, type: "alum" })), ...PRODUCTS_BIMETAL.map(p => ({ ...p, type: "bimetal" }))]
  ));
  const dropdownRef = useRef(null);

  const C = isLight ? LIGHT : DARK;
  const T = TRANSLATIONS[lang];

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = useMemo(() => [
    { id: "dashboard", label: T.dashboard, icon: <LayoutDashboard size={20} /> },
    { id: "orders", label: T.orders, icon: <ClipboardList size={20} /> },
    { id: "debts", label: T.debts, icon: <Wallet size={20} /> },
    { id: "shipments", label: T.shipments, icon: <Truck size={20} /> },
    { id: "clients", label: T.clients, icon: <Users size={20} /> },
    { id: "products", label: T.products, icon: <Package size={20} /> },
  ], [T]);

  const pages = {
    dashboard: <Dashboard orders={orders} clients={clients} shipments={shipments} />,
    orders: <Orders orders={orders} setOrders={setOrders} clients={clients} products={products} />,
    debts: <Debts clients={clients} orders={orders} />,
    shipments: <Shipments shipments={shipments} setShipments={setShipments} />,
    clients: <Clients clients={clients} setClients={setClients} orders={orders} products={products} />,
    products: <Products products={products} setProducts={setProducts} />,
  };

  return (
    <LangCtx.Provider value={lang}>
      <ThemeCtx.Provider value={C}>
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isLight ? 'bg-slate-50 text-brand-blue' : 'bg-slate-950 text-white'}`}>
          <header className="sticky top-0 z-[100] liquid-glass px-4 md:px-8 py-3 flex items-center justify-between border-b border-white/20">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="bg-brand-blue p-2 rounded-xl shadow-lg shadow-brand-blue/20"
              >
                <Package className="text-brand-lime" size={24} />
              </motion.div>
              <h1 className="font-display font-bold text-xl tracking-tight hidden sm:block">FactoryOS</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div ref={dropdownRef} className="relative">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 border border-brand-blue/5 transition-all text-sm font-medium"
                >
                  <Globe size={16} className="text-brand-blue/60" />
                  <span className="hidden xs:inline">{LANG_OPTIONS.find(([k]) => k === lang)?.[1].split(' ')[1]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-brand-blue/5 rounded-2xl shadow-2xl shadow-brand-blue/10 overflow-hidden z-[110]"
                    >
                      {LANG_OPTIONS.map(([k, label]) => (
                        <button
                          key={k}
                          onClick={() => { setLang(k); setLangOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between ${lang === k ? 'bg-brand-lime/20 text-brand-blue font-bold' : 'hover:bg-brand-blue/5 text-brand-blue/70'}`}
                        >
                          {label}
                          {lang === k && <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsLight(!isLight)}
                className="p-2 rounded-full bg-white/50 hover:bg-brand-lime border border-brand-blue/5 transition-all text-brand-blue shadow-sm"
              >
                {isLight ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-brand-blue/10">
                <div className="text-right">
                  <div className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest leading-none mb-1">Role</div>
                  <div className="text-sm font-bold text-brand-blue leading-none">Admin</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-brand-lime font-bold shadow-lg shadow-brand-blue/20">
                  AD
                </div>
              </div>

              <button 
                className="md:hidden p-2 text-brand-blue"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </header>

          <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full relative">
            <aside className={`
              fixed md:sticky top-[61px] left-0 z-40 w-64 h-[calc(100vh-61px)] bg-white/60 backdrop-blur-xl border-r border-brand-blue/5 transition-transform duration-300 md:translate-x-0
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <nav className="p-4 flex flex-col gap-2">
                <LayoutGroup id="nav">
                  {navItems.map((item) => {
                    const isActive = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setTab(item.id); setIsMobileMenuOpen(false); }}
                        className={`
                          relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                          ${isActive ? 'text-brand-blue' : 'text-brand-blue/50 hover:text-brand-blue hover:bg-white'}
                        `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="nav-bg"
                            className="absolute inset-0 bg-brand-lime rounded-xl shadow-lg shadow-brand-lime/30"
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                          {item.icon}
                        </span>
                        <span className="relative z-10 font-bold text-sm tracking-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </LayoutGroup>
              </nav>

              <div className="absolute bottom-8 left-4 right-4">
                <div className="p-4 rounded-2xl bg-brand-blue text-white shadow-xl shadow-brand-blue/20">
                  <div className="text-xs font-bold text-brand-lime uppercase tracking-widest mb-2">Factory Stats</div>
                  <div className="text-sm opacity-80 mb-4 font-medium italic">"Quality is our priority"</div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      className="h-full bg-brand-lime" 
                    />
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {pages[tab]}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </ThemeCtx.Provider>
    </LangCtx.Provider>
  );
}
