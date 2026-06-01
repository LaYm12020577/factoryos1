import { useState } from 'react';
import { motion } from 'motion/react';
import { Network, Server, Phone, MapPin, RefreshCcw, Heart, Layers } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FooterProps {
  currentLang: Language;
}

export default function Footer({ currentLang }: FooterProps) {
  const t = translations[currentLang];
  const [logTriggered, setLogTriggered] = useState(false);
  const [logMessage, setLogMessage] = useState('SYSTEM CORE NOMINAL. CONNECTED TO REGIONAL GATEWAYS.');

  const triggerResetSimulation = () => {
    setLogTriggered(true);
    setLogMessage('RE-ROUTING TELEMETRY STACKS...');
    setTimeout(() => {
      setLogMessage('COMPOSITE SIGNAL RE-SYNC: SUCCESS. CACHE SIZE CLEAR (0 KB).');
      setLogTriggered(false);
    }, 2000);
  };

  return (
    <footer className="relative bg-[#01142c] text-slate-400 font-sans border-t border-white/5 py-16 px-6 md:px-12 overflow-hidden" id="footer-container">
      {/* Glow spots */}
      <div className="glow-spot w-[300px] h-[300px] bg-lime-400 bottom-0 left-0 opacity-[0.03]" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/5 pb-10 mb-10">
        
        {/* Brand identity (4 Columns) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#002045] to-[#04336c] border border-lime-400/30 flex items-center justify-center">
              <Network className="w-4 h-4 text-lime-400" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-white">
              {t.navLogo}
            </span>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Digitize production environments with secure Edge, PLC communication gateways, real-time SCADA overlays, and predictive maintenance engines. Unleash OEE potential globally.
          </p>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#a3e635]">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
            <span>SERVER VERSION 4.12.5 (OK)</span>
          </div>
        </div>

        {/* Dynamic Contacts & Regional Operations (4 Columns) */}
        <div className="md:col-span-4 space-y-4 font-mono text-xs text-slate-300">
          <h4 className="text-xs uppercase font-bold tracking-widest text-lime-400 border-l border-lime-400 pl-2 mb-3">
            REGIONAL GATEWAY INQUIRIES
          </h4>
          
          <div className="space-y-3.5">
            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-semibold text-[11px]">CENTRAL ASIA GATEWAY (UZ)</span>
                <span className="text-slate-400 block text-[10px]">Tashkent IT Park Cluster, Block B</span>
                <span className="text-slate-400 block text-[10px]">+998 (71) 200-4560</span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-semibold text-[11px]">EUROPE MAIN STATION (DE)</span>
                <span className="text-slate-400 block text-[10px]">Munich Technology Center yard 5</span>
                <span className="text-slate-400 block text-[10px]">+49 (89) 5500-1100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual diagnostic Sandbox Terminal (4 Columns) */}
        <div className="md:col-span-4 rounded-xl bg-black/40 border border-white/5 p-4 relative overflow-hidden font-mono text-[10px]">
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="flex items-center space-x-1">
              <Server className="w-3 h-3 text-lime-400" />
              <span>EDGE CONSOLE BUFFER</span>
            </span>
            <button
              onClick={triggerResetSimulation}
              disabled={logTriggered}
              className="text-lime-400 hover:text-white transition-colors duration-200"
              title="Recalibrate server buffers"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${logTriggered ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-1 text-slate-300 leading-normal max-h-[80px] overflow-hidden">
            <p className="text-slate-500 font-medium">› {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</p>
            <p className="text-[#bef264]">{logMessage}</p>
            <p className="text-slate-600">› PLC status: S7-1500 SYNCHRONIZED</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} FACTORY.OS. All Rights Reserved. Fully Redesigned Premium Interface.
        </div>
        <div className="mt-3 md:mt-0 flex items-center space-x-1.5">
          <span>Engineered with precision for autonomous industrial floors.</span>
        </div>
      </div>
    </footer>
  );
}
