import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FaqProps {
  currentLang: Language;
}

export default function Faq({ currentLang }: FaqProps) {
  const t = translations[currentLang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative px-6 py-20 pb-28 md:px-12 bg-gradient-to-b from-[#002045] to-[#01142c] overflow-hidden" id="faq-section">
      <div className="glow-spot w-[500px] h-[500px] bg-lime-400 -bottom-10 -left-10 opacity-[0.03]" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-mono mb-4 uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Operational FAQ Documentation</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            {t.faqHeader}
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            {t.faqSub}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4" id="faq-accordion-list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-gradient-to-tr from-[#002045]/60 to-[#04336c]/40 border-lime-400/30 shadow-[0_8px_24px_rgba(163,230,53,0.05)]'
                    : 'glass-panel border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header btn button */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-white focus:outline-none cursor-pointer"
                >
                  <span className="font-display font-medium text-sm sm:text-base pr-4 select-none">
                    {item.q}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isOpen
                      ? 'bg-lime-400 text-[#002045] border-lime-400'
                      : 'bg-white/5 text-slate-450 border-white/15'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Content collapsible drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-6 border-t border-white/5 pt-4">
                        <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
