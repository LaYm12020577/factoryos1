import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Clock, ChevronRight, Gauge, HelpCircle, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface OeeCalculatorProps {
  currentLang: Language;
}

interface SectorConfig {
  id: string;
  nameKey: 'calcAutomotive' | 'calcFoodBev' | 'calcElectronics' | 'calcHeavyIndustry' | 'calcPlastics';
  unitValue: number; // Avg dollar value per production unit
  avgDowntimeHours: number; // Avg monthly unplanned down hours
}

const sectorConfigs: SectorConfig[] = [
  { id: 'automotive', nameKey: 'calcAutomotive', unitValue: 340, avgDowntimeHours: 42 },
  { id: 'food_bev', nameKey: 'calcFoodBev', unitValue: 12, avgDowntimeHours: 24 },
  { id: 'electronics', nameKey: 'calcElectronics', unitValue: 85, avgDowntimeHours: 35 },
  { id: 'heavy_metals', nameKey: 'calcHeavyIndustry', unitValue: 480, avgDowntimeHours: 55 },
  { id: 'plastics', nameKey: 'calcPlastics', unitValue: 22, avgDowntimeHours: 30 },
];

export default function OeeCalculator({ currentLang }: OeeCalculatorProps) {
  const [selectedSectorId, setSelectedSectorId] = useState('electronics');
  const [productionScale, setProductionScale] = useState(120000);
  const [currentOee, setCurrentOee] = useState(62);

  const t = translations[currentLang];
  const activeSector = sectorConfigs.find(s => s.id === selectedSectorId) || sectorConfigs[0];

  // Dynamic calculations
  const [retainedGains, setRetainedGains] = useState(0);
  const [downtimeSaved, setDowntimeSaved] = useState(0);
  const [peakOee, setPeakOee] = useState(0);
  const [paybackMonths, setPaybackMonths] = useState(0.0);

  useEffect(() => {
    // FactoryOS yields an efficiency peak: the lower the current, the higher the correction
    const boostFactor = (100 - currentOee) * 0.35 + 8; // e.g., if 60, boost is 40*0.35 + 8 = 22%
    const calculatedPeak = Math.min(Math.round(currentOee + boostFactor), 98);
    setPeakOee(calculatedPeak);

    // OEE improvement delta
    const oeeImprovementDecimal = (calculatedPeak - currentOee) / 100;
    
    // Retained annual gains = Volume * Unit value * Gain delta * 12 months (scaled slightly for reality)
    const rawGains = productionScale * activeSector.unitValue * oeeImprovementDecimal * 2.1;
    setRetainedGains(Math.round(rawGains));

    // Unplanned downtime hours saved per month (average FactoryOS cuts down down-hours by 55%)
    const rawDownHoursSaved = Math.round(activeSector.avgDowntimeHours * (1 - (currentOee / 100)) * 0.55);
    setDowntimeSaved(Math.max(2, rawDownHoursSaved));

    // Payback period (months) = system implementation investment / monthly gains
    // We assume a dynamic investment scale based on production volume ($15K up to $180K)
    const assumedLicenseInvestment = 15000 + (productionScale * 0.12);
    const monthlyGain = rawGains / 12;
    const rawPayback = monthlyGain > 0 ? assumedLicenseInvestment / monthlyGain : 3.0;
    setPaybackMonths(parseFloat(Math.max(1.8, Math.min(rawPayback, 9.5)).toFixed(1)));

  }, [selectedSectorId, productionScale, currentOee, activeSector]);

  return (
    <section className="relative px-6 py-20 pb-28 md:px-12 bg-gradient-to-b from-[#01142c] to-[#002045] overflow-hidden" id="calculator-section">
      <div className="glow-spot w-[500px] h-[500px] bg-lime-400 bottom-10 left-10 opacity-[0.05]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-mono mb-4 uppercase tracking-widest">
            <Coins className="w-3.5 h-3.5" />
            <span>ROI Core Engine v1.8</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            {t.calcHeader}
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            {t.calcSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT inputs pane (7 columns) */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between border border-white/10 shadow-2xl">
            
            <div className="space-y-8">
              {/* Profile selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                  {t.calcIndustry}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {sectorConfigs.map((sector) => {
                    const isSel = sector.id === selectedSectorId;
                    return (
                      <button
                        key={sector.id}
                        onClick={() => setSelectedSectorId(sector.id)}
                        className={`p-3 rounded-xl text-left border text-xs font-medium transition-all duration-300 ${
                          isSel
                            ? 'bg-lime-400 text-[#002045] border-lime-400 shadow-[0_4px_12px_rgba(163,230,53,0.2)]'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {t[sector.nameKey]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider 1: Volume scale */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    {t.calcScale}
                  </span>
                  <span className="font-mono text-lime-400 font-semibold px-2.5 py-0.5 rounded-md bg-lime-400/10 border border-lime-400/20 text-sm">
                    {productionScale.toLocaleString()} units
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="500000"
                  step="2000"
                  value={productionScale}
                  onChange={(e) => setProductionScale(parseInt(e.target.value))}
                  className="w-full accent-lime-400 cursor-pointer h-1.5 rounded-lg bg-white/10 outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                  <span>2K UNITS</span>
                  <span>250K MID-PLANT</span>
                  <span>500K GIGA-SCALE</span>
                </div>
              </div>

              {/* Slider 2: Current efficiency */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    {t.calcCurrentOee}
                  </span>
                  <span className="font-mono text-white font-semibold px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-sm">
                    {currentOee}% OEE
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="92"
                  value={currentOee}
                  onChange={(e) => setCurrentOee(parseInt(e.target.value))}
                  className="w-full accent-lime-400 cursor-pointer h-1.5 rounded-lg bg-white/10 outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                  <span className="text-red-400">30% (UNSTABLE)</span>
                  <span className="text-yellow-300">65% (AVERAGE)</span>
                  <span className="text-lime-400">92% (EXCELLENT)</span>
                </div>
              </div>
            </div>

            {/* Note block */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-start space-x-3 text-slate-400 text-xs leading-relaxed font-mono">
              <HelpCircle className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <span>
                Calculations are modeled based on standard factory operations using IoT and neural network sensors. Actual deployments may experience minor variances.
              </span>
            </div>

          </div>

          {/* RIGHT output metrics card (5 columns) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-tr from-[#002045] to-[#04336c] border border-lime-400/25 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Gauge className="w-40 h-40 text-white" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-lime-400 tracking-widest block mb-1">
                {t.calcOutputLabel}
              </span>
              <h3 className="font-display font-medium text-white text-lg mb-6 leading-tight">
                FactoryOS Projected Impact
              </h3>

              {/* Peak OEE Boost */}
              <div className="bg-[#002045]/40 border border-white/10 rounded-xl p-4.5 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block mb-1">{t.calcIncreaseOee}</span>
                  <span className="text-[10px] font-mono text-lime-400 font-semibold uppercase tracking-wider">
                    +{peakOee - currentOee}% RETRACTED GAIN
                  </span>
                </div>
                <div className="text-right font-mono text-3xl font-bold text-lime-400">
                  {peakOee}%
                </div>
              </div>

              {/* Retained Annual Gain amount */}
              <div className="mb-6.5">
                <span className="text-xs text-slate-400 block mb-1.5 uppercase tracking-wider font-mono">
                  {t.calcAnnualGain}
                </span>
                <div className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex items-baseline">
                  <span className="text-lime-400 mr-1">$</span>
                  {retainedGains.toLocaleString()}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ year</span>
                </div>
              </div>

              {/* Smaller widgets */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10 mb-6 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                    DOWNTIME SAVED
                  </span>
                  <span className="text-white font-semibold text-sm flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-lime-400 mr-1 shrink-0" />
                    <span>{downtimeSaved} hrs / mo</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                    SYSTEM PAYBACK
                  </span>
                  <span className="text-white font-semibold text-sm flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#bef264] mr-1 shrink-0" />
                    <span>{paybackMonths} {t.calcMonths}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Request demo quick-link */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-display font-medium text-sm">
                Ready to optimize OEE?
              </span>
              <button
                onClick={() => {
                  const element = document.getElementById('contact-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center space-x-1 text-xs font-mono font-bold text-lime-400 hover:text-white transition-colors duration-200 uppercase cursor-pointer"
              >
                <span>SETUP PILOT PLAN</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
