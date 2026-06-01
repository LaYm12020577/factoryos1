import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, Building2, User, Mail, Phone, Code, CheckCircle, RefreshCcw, Landmark } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface DemoFormProps {
  currentLang: Language;
}

export default function DemoForm({ currentLang }: DemoFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState('electronics');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);

  const t = translations[currentLang];

  // Simulated node parameters compiled dynamically
  const [generatedStrategy, setGeneratedStrategy] = useState<{
    nodeToken: string;
    suggestedGateways: number;
    recommendedOpcUaPort: number;
    estimatedSetupDays: number;
  } | null>(null);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email) return;
      setStep(2);
    }
  };

  const triggerCompilation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate cryptographic configuration compiling
    setTimeout(() => {
      const generatedToken = "FOS-NODE-" + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
      const gatewayCount = Math.max(2, Math.floor(Math.random() * 8) + 1);
      const portRange = Math.floor(4840 + Math.random() * 200);
      const days = Math.floor(Math.random() * 4) + 3;

      setGeneratedStrategy({
        nodeToken: generatedToken,
        suggestedGateways: gatewayCount,
        recommendedOpcUaPort: portRange,
        estimatedSetupDays: days,
      });

      // Save lead information in local persist storage
      const leadData = { name, email, phone, sector, notes, generatedToken, date: new Date().toISOString() };
      localStorage.setItem('factoryos_compiled_strategy', JSON.stringify(leadData));

      setIsSubmitting(false);
      setSubSuccess(true);
      setStep(3);
    }, 2800);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSector('electronics');
    setNotes('');
    setStep(1);
    setSubSuccess(false);
    setGeneratedStrategy(null);
  };

  return (
    <section className="relative px-6 py-20 pb-28 md:px-12 bg-gradient-to-b from-[#01142c] to-[#002045]" id="contact-section">
      <div className="glow-spot w-[600px] h-[600px] bg-lime-400 bottom-0 right-10 opacity-[0.04]" />
      
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-mono mb-4 uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Integration Sandbox</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            {t.contactHeader}
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {t.contactSub}
          </p>
        </div>

        {/* Form Container cards */}
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Animated compilation loading loader */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#002045]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative w-20 h-20 mb-8" id="form-loader-anim">
                  {/* Rotating visual rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-lime-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[#002045] animate-spin-reverse" />
                  <div className="absolute inset-4 rounded-full border-2 border-[#a3e635]/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-lime-400 animate-pulse" />
                  </div>
                </div>

                <motion.h4
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-mono text-xs uppercase tracking-widest text-lime-400 mb-2"
                >
                  COMPILING DIGITAL STRATEGY
                </motion.h4>
                <div className="space-y-1.5 text-xs text-slate-400 font-mono max-w-md">
                  <p>› Initiating dynamic factory mesh compiler...</p>
                  <p className="text-lime-400/80">› Assigning cryptographic telemetry nodes...</p>
                  <p>› Mapping Industrial OPC UA standard interfaces...</p>
                  <p>› Estimating localized payback timelines...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper progress indicator */}
          {!subSuccess && (
            <div className="flex items-center justify-center space-x-12 mb-10 font-mono text-xs" id="form-stepper">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center space-x-2 border-b-2 pb-2 transition-colors duration-200 ${
                  step === 1 ? 'border-lime-400 text-white font-bold' : 'border-transparent text-slate-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">01</span>
                <span>CONTACTS INFO</span>
              </button>

              <button
                disabled={!name || !email}
                onClick={() => setStep(2)}
                className={`flex items-center space-x-2 border-b-2 pb-2 transition-colors duration-200 disabled:opacity-40 ${
                  step === 2 ? 'border-lime-400 text-white font-bold' : 'border-transparent text-slate-500'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">02</span>
                <span>PLANT PROFILE</span>
              </button>
            </div>
          )}

          {/* Form body */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="form-step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextStep}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="relative">
                    <label className="block text-xs uppercase font-mono text-slate-300 font-semibold mb-2 tracking-wide">
                      {t.contactName} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#002045]/40 border border-white/10 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-lime-400/80 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="relative">
                    <label className="block text-xs uppercase font-mono text-slate-300 font-semibold mb-2 tracking-wide">
                      {t.contactEmail} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="j.doe@enterprise-plant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#002045]/40 border border-white/10 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-lime-400/80 transition-colors"
                      />
                    </div>
                  </div>

                </div>

                {/* Telephone field */}
                <div className="relative">
                  <label className="block text-xs uppercase font-mono text-slate-300 font-semibold mb-2 tracking-wide">
                    {t.contactPhone}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+998 (90) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#002045]/40 border border-white/10 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-lime-400/80 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={!name || !email}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-lime-400 text-[#002045] font-display font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(163,230,53,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>PROCEED TO PROFILE</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="form-step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={triggerCompilation}
                className="space-y-6"
              >
                {/* Sector selection */}
                <div>
                  <label className="block text-xs uppercase font-mono text-slate-300 font-semibold mb-2 tracking-wide">
                    {t.contactSector}
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-4 py-3 bg-[#002045] border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-lime-400"
                  >
                    <option value="automotive">{t.calcAutomotive}</option>
                    <option value="food_bev">{t.calcFoodBev}</option>
                    <option value="electronics">{t.calcElectronics}</option>
                    <option value="heavy_industry">{t.calcHeavyIndustry}</option>
                    <option value="plastics">{t.calcPlastics}</option>
                  </select>
                </div>

                {/* Technical specifications */}
                <div>
                  <label className="block text-xs uppercase font-mono text-slate-300 font-semibold mb-2 tracking-wide">
                    {t.contactNotes}
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific notes like: 4 robotic CNC lines, Modbus protocols required, goal: decrease micro-stopping cycles"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-[#002045]/40 border border-white/10 rounded-xl font-sans text-sm text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    BACK
                  </button>

                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-lime-400 text-[#002045] font-display font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(163,230,53,0.2)] cursor-pointer"
                  >
                    <span>{t.contactBtn}</span>
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && subSuccess && generatedStrategy && (
              <motion.div
                key="form-step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                
                {/* Success sign */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-lime-500/10 border border-lime-400/40 text-lime-400 mb-4 animate-bounce">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-xl md:text-2xl mb-2.5">
                    Strategic Deploy File Compiled!
                  </h3>
                  <p className="text-slate-300 text-xs font-mono max-w-lg mx-auto">
                    {t.contactSuccess}
                  </p>
                </div>

                {/* Spec details card */}
                <div className="bg-[#002045]/50 border border-lime-400/30 rounded-2xl p-5 sm:p-7 relative overflow-hidden">
                  
                  {/* Glowing line watermark */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent" />

                  <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3 font-mono text-[11px] text-slate-400">
                    <span>DEPLOYMENT CONFIG SPEC</span>
                    <span className="text-lime-400 font-bold">{generatedStrategy.nodeToken}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5 font-mono text-xs">
                    
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-slate-400 block mb-1 uppercase text-[9px] tracking-wider">TARGET DOMAIN</span>
                      <span className="text-white font-semibold uppercase">{sector}</span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-slate-400 block mb-1 uppercase text-[9px] tracking-wider">PRIMARY GATEWAYS</span>
                      <span className="text-white font-semibold uppercase">{generatedStrategy.suggestedGateways} Node Core Hubs</span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-slate-400 block mb-1 uppercase text-[9px] tracking-wider">OPC-UA COMMUNICATIONS PORT</span>
                      <span className="text-lime-400 font-bold font-mono">Port :{generatedStrategy.recommendedOpcUaPort}</span>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-slate-400 block mb-1 uppercase text-[9px] tracking-wider">ESTIMATED LAUNCH DELAY</span>
                      <span className="text-white font-semibold uppercase">{generatedStrategy.estimatedSetupDays} Working Days</span>
                    </div>

                  </div>

                </div>

                <div className="flex items-center justify-center space-x-4 pt-4">
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-mono font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>COMPILE NEW CONFIG</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
