import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Menu, X, Activity, Cpu, ShieldAlert, Sliders } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  activeSection: string;
}

export default function Navbar({ currentLang, onLangChange, activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Adjust for sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { key: 'features', label: t.navFeatures, id: 'features-section' },
    { key: 'telemetry', label: t.navTelemetry, id: 'telemetry-section' },
    { key: 'calculator', label: t.navCalculator, id: 'calculator-section' },
    { key: 'architecture', label: t.navArchitecture, id: 'architecture-section' },
    { key: 'faq', label: t.navFaq, id: 'faq-section' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'uz', label: 'O\'zbek', flag: '🇺🇿' },
  ];

  const selectedLangInfo = languages.find(l => l.code === currentLang);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'glass-panel shadow-[0_8px_32px_rgba(0,32,69,0.35)] py-3 px-6'
            : 'bg-transparent py-5 px-6 border-b border-white/5'
        }`}
        id="navbar-container"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo-btn"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002045] to-[#04336c] border border-lime-400/30 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lime-400 via-transparent to-transparent"
              />
              <Sliders className="w-5 h-5 text-lime-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wider text-white">
                {t.navLogo}
              </span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-lime-400/80 font-mono">
                  LIVE CORE
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1" id="nav-desktop-links">
            {navItems.map((item) => {
              const isAct = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${
                    isAct 
                      ? 'text-lime-400 bg-white/5' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isAct && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-lime-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions: Lang Dropdown, Demo CTA, Mobile Trigger */}
          <div className="flex items-center space-x-3" id="nav-right-actions">
            {/* Language Selector Dropdown */}
            <div className="relative" id="lang-selector-wrapper">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition-all duration-300 text-sm font-mono text-white"
                id="lang-dropdown-toggle"
              >
                <Globe className="w-4 h-4 text-lime-400" />
                <span className="hidden sm:inline-block">{selectedLangInfo?.label}</span>
                <span className="font-sans text-xs opacity-75">{selectedLangInfo?.flag}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <>
                    {/* Backdrop cover to click away */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl glass-panel shadow-2xl p-1.5 border border-white/10 z-20"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLangChange(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${
                            currentLang === lang.code
                              ? 'bg-lime-400/10 text-lime-400 font-medium border-l-2 border-lime-400'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span className="text-xs">{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                          <span className="text-[10px] uppercase font-mono text-slate-500">{lang.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hidden sm:flex items-center space-x-2 px-5 py-2 rounded-xl bg-lime-400 hover:bg-[#bef264] text-[#002045] font-display font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] cursor-pointer"
              id="nav-cta-btn"
            >
              <span>{t.navContact}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-lime-400 hover:bg-white/10 transition-colors"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-4 top-[84px] z-40 lg:hidden rounded-2xl glass-panel shadow-2xl p-6 border border-white/10 flex flex-col space-y-4"
            id="mobile-menu-drawer"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium tracking-wide text-base transition-colors ${
                    activeSection === item.key
                      ? 'text-lime-400 bg-white/5'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-px bg-white/5 my-2" />

            <button
              onClick={() => scrollToSection('contact-section')}
              className="w-full py-3 rounded-xl bg-lime-400 text-[#002045] font-display font-semibold text-center shadow-[0_0_15px_rgba(163,230,53,0.2)] transition-transform active:scale-95"
            >
              {t.navContact}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
