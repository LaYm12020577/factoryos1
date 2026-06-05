import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { COUNTRIES } from "../../constants/data";
import { load, save } from "../../utils/helpers";
import { useT } from "../../hooks/useT";

export function CountrySelect({ value, onChange }) {
  const T = useT();
  const [search, setSearch] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(() => load("fos_recent_countries", []));
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  const filteredRecent = recent.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  const filteredOthers = filtered.filter(c => !recent.includes(c));

  const select = (country) => {
    onChange(country);
    setSearch(country);
    setOpen(false);
    const newRecent = [country, ...recent.filter(c => c !== country)].slice(0, 5);
    setRecent(newRecent);
    save("fos_recent_countries", newRecent);
  };

  const dropItem = (country, isRecent) => (
    <div key={country} onClick={() => select(country)}
      className="px-4 py-3 text-sm cursor-pointer hover:bg-brand-lime/10 transition-colors flex items-center gap-3 text-brand-blue font-medium"
    >
      {isRecent ? <span className="text-xs">⭐️</span> : <Globe size={14} className="opacity-30" />}
      {country}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input 
          className="w-full bg-white border border-brand-blue/5 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-lime outline-none font-medium pr-10 transition-all"
          placeholder={T.searchCountry || "Search country..."} 
          value={search}
          onChange={e => { setSearch(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} 
        />
        <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-blue/20 pointer-events-none" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-brand-blue/5 rounded-2xl shadow-2xl z-[150] max-h-60 overflow-y-auto"
          >
            {filteredRecent.length > 0 && (
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest border-b border-brand-blue/5">
                {T.recentlyUsed || "Recently used"}
              </div>
            )}
            {filteredRecent.map(c => dropItem(c, true))}
            {filteredOthers.length > 0 && <div className="h-px bg-brand-blue/5" />}
            {filteredOthers.map(c => dropItem(c, false))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-xs font-bold text-brand-blue/30 uppercase tracking-widest">No results</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
