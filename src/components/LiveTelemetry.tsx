import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Thermometer, RotateCw, RefreshCw, AlertTriangle, CheckCircle, Sliders, Layers, Activity } from 'lucide-react';
import { Language, MachineNode } from '../types';
import { translations } from '../translations';

interface LiveTelemetryProps {
  currentLang: Language;
}

const initialMachines: MachineNode[] = [
  {
    id: 'node-1',
    name: {
      en: 'Robotic Assembly Arm PX-400',
      ru: 'Роботизированный манипулятор PX-400',
      zh: '多轴机器人装配机械臂 PX-400',
      uz: 'Robotlashtirilgan manipulyator PX-400',
    },
    type: 'robotic_arm',
    status: 'operating',
    temperature: 42.4,
    vibration: 24.5,
    rpm: 120,
    totalProducedCount: 14890,
    failureRate: 0.12,
    operators: 1,
  },
  {
    id: 'node-2',
    name: {
      en: 'Ultra-Precision CNC Milling Node',
      ru: 'Сверхточный фрезерный станок с ЧПУ',
      zh: '超高精密数控龙门铣削中心',
      uz: 'O\'ta yuqori aniqlikdagi burchakli tolali CHPU',
    },
    type: 'cnc_milling',
    status: 'operating',
    temperature: 51.8,
    vibration: 48.2,
    rpm: 12000,
    totalProducedCount: 3824,
    failureRate: 0.23,
    operators: 2,
  },
  {
    id: 'node-3',
    name: {
      en: 'Biopolymer Injection Molder V3',
      ru: 'Термопластавтомат биополимеров V3',
      zh: '可降解生物聚合物注塑成型机 V3',
      uz: 'Termoplastavtomat biopolimer V3',
    },
    type: 'injection_molder',
    status: 'idle',
    temperature: 185.0,
    vibration: 2.1,
    rpm: 0,
    totalProducedCount: 42300,
    failureRate: 0.05,
    operators: 1,
  },
  {
    id: 'node-4',
    name: {
      en: 'Smart High-Speed Packaging Line',
      ru: 'Интеллектуальная линия упаковки',
      zh: '智能高速物流分拣与密封包装线',
      uz: 'Intellektual yuqori tezlikdagi qadoqlash liniyasi',
    },
    type: 'packaging_line',
    status: 'operating',
    temperature: 36.1,
    vibration: 18.9,
    rpm: 180,
    totalProducedCount: 65421,
    failureRate: 0.08,
    operators: 3,
  },
  {
    id: 'node-5',
    name: {
      en: 'Modular Sorting Conveyor Belt',
      ru: 'Модульный сортировочный конвейер',
      zh: '智能条码识别模块化分拣输送带',
      uz: 'Modulli saralash konveyer tasmasi',
    },
    type: 'conveyor_belt',
    status: 'maintenance',
    temperature: 28.5,
    vibration: 0.5,
    rpm: 0,
    totalProducedCount: 94503,
    failureRate: 0.15,
    operators: 1,
  },
];

export default function LiveTelemetry({ currentLang }: LiveTelemetryProps) {
  const [machines, setMachines] = useState<MachineNode[]>(initialMachines);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-1');
  const [systemAlert, setSystemAlert] = useState<{ id: string; message: string; type: 'warning' | 'alert' } | null>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(true);

  const t = translations[currentLang];
  const activeNode = machines.find(m => m.id === selectedNodeId) || machines[0];

  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setMachines(prev =>
        prev.map(machine => {
          if (machine.status !== 'operating') return machine;

          // Introduce small variations
          const tempDelta = (Math.random() - 0.5) * 1.2;
          const vibDelta = (Math.random() - 0.5) * 2.8;
          const countAdd = Math.random() > 0.4 ? 1 : 0;

          // Check for simulated overheating warning triggers if they exceed standard values
          const newTemp = Math.min(Math.max(25, machine.temperature + tempDelta), 250);
          const newVib = Math.min(Math.max(0.1, machine.vibration + vibDelta), 100);

          return {
            ...machine,
            temperature: parseFloat(newTemp.toFixed(1)),
            vibration: parseFloat(newVib.toFixed(1)),
            totalProducedCount: machine.totalProducedCount + countAdd,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulationActive]);

  const toggleMachineStatus = (id: string) => {
    setMachines(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const targetStateMap: Record<string, 'operating' | 'idle' | 'maintenance' | 'offline'> = {
          operating: 'idle',
          idle: 'operating',
          maintenance: 'operating',
          offline: 'operating',
        };
        const nextStatus = targetStateMap[m.status] || 'operating';
        return {
          ...m,
          status: nextStatus,
          rpm: nextStatus === 'operating' ? (m.type === 'cnc_milling' ? 12000 : 150) : 0,
        };
      })
    );
  };

  const triggerOverheatAlert = () => {
    // Force selected machine thermal up to dangerous level
    setMachines(prev =>
      prev.map(m => {
        if (m.id !== selectedNodeId) return m;
        return {
          ...m,
          status: 'operating',
          temperature: m.type === 'injection_molder' ? 245.0 : 96.5,
          vibration: 88.4,
        };
      })
    );

    const thermalLevel = activeNode.type === 'injection_molder' ? '245°C' : '96.5°C';
    const alertMsg = {
      en: `WARNING: Node ${activeNode.id} thermal core critical (${thermalLevel})! Internal ventilation failure simulated.`,
      ru: `ВНИМАНИЕ: Тепловое ядро Узла ${activeNode.id} критично (${thermalLevel})! Симуляция отказа вентиляции.`,
      zh: `高危警报：节点 ${activeNode.id} 腔体核心温度超温临界点 (${thermalLevel})！已模拟局端循环风机停转。`,
      uz: `DIQQAT: ${activeNode.id} tugunining termal yadrosi keskin qizidi (${thermalLevel})! Shamollatish tizimi to'xtadi.`,
    };

    setSystemAlert({
      id: Math.random().toString(),
      message: alertMsg[currentLang],
      type: 'alert',
    });

    // Auto dismiss or clear after 5s
    setTimeout(() => {
      setSystemAlert(null);
    }, 8000);
  };

  const getStatusBadge = (status: MachineNode['status']) => {
    switch (status) {
      case 'operating':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-lime-500/15 text-lime-400 border border-lime-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span>{t.telemetryRunState}</span>
          </span>
        );
      case 'idle':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
            <span>{t.telemetryIdleState}</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            <span>{t.telemetryMaintState}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>{t.telemetryStopState}</span>
          </span>
        );
    }
  };

  return (
    <section className="relative px-6 py-20 pb-28 md:px-12 bg-gradient-to-b from-[#002045] to-[#01142c] overflow-hidden" id="telemetry-section">
      {/* Background glow meshes */}
      <div className="glow-spot w-[400px] h-[400px] bg-lime-400 -top-10 -right-20 opacity-[0.06]" />
      <div className="glow-spot w-[600px] h-[600px] bg-[#002045] bottom-10 left-5 opacity-[0.2]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="text-center md:text-left mb-14 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-mono mb-4 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Edge SCADA Kernel v4.2</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            {t.telemetryHeader}
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            {t.telemetrySub}
          </p>
        </div>

        {/* Alert Notification banner */}
        <AnimatePresence>
          {systemAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8 p-4 rounded-xl border border-red-400/40 bg-red-500/10 backdrop-blur-md flex items-start space-x-3.5 text-white shadow-[0_12px_40px_rgba(239,68,68,0.15)]"
              id="telemetry-warning-banner"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1 text-sm font-mono tracking-tight">
                {systemAlert.message}
              </div>
              <button
                onClick={() => setSystemAlert(null)}
                className="text-xs font-mono text-red-400 hover:text-white underline cursor-pointer"
              >
                DISMISS
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid Simulator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Machine List Panel (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a3e635] font-semibold">
                NODE METRIC NODES ({machines.length})
              </span>
              <button
                onClick={() => setIsSimulationActive(!isSimulationActive)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-[11px] font-mono border leading-none transition-colors duration-200 ${
                  isSimulationActive
                    ? 'border-lime-400/30 text-lime-400 bg-lime-400/5 hover:bg-lime-400/10'
                    : 'border-slate-500/30 text-slate-400 bg-white/5 hover:bg-white/10'
                }`}
                title="Pause simulated real-time data flow"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulationActive ? 'animate-spin' : ''}`} />
                <span>{isSimulationActive ? 'STREAMING ACTIVE' : 'PAUSED'}</span>
              </button>
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {machines.map((machine) => {
                const isSelected = machine.id === selectedNodeId;
                return (
                  <motion.div
                    key={machine.id}
                    onClick={() => setSelectedNodeId(machine.id)}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#002045]/80 to-[#04336c]/80 border-l-4 border-l-lime-400 border-t border-b border-r border-white/20 shadow-[0_4px_24px_rgba(163,230,53,0.1)]'
                        : 'glass-panel hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="font-display font-semibold text-white text-sm max-w-[70%]">
                        {machine.name[currentLang]}
                      </div>
                      <div>{getStatusBadge(machine.status)}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 font-mono text-[11px]">
                      <div className="bg-[#002045]/40 border border-white/5 p-2 rounded-lg flex flex-col justify-center">
                        <span className="text-slate-400 mb-0.5 uppercase tracking-wider text-[9px]">{t.telemetryTemp}</span>
                        <span className={`font-semibold ${machine.temperature > 85 ? 'text-red-400 font-bold' : 'text-white'}`}>
                          {machine.temperature}°C
                        </span>
                      </div>
                      
                      <div className="bg-[#002045]/40 border border-white/5 p-2 rounded-lg flex flex-col justify-center text-center">
                        <span className="text-slate-400 mb-0.5 uppercase tracking-wider text-[9px]">VIB (Hz)</span>
                        <span className="text-white font-semibold">{machine.vibration}</span>
                      </div>

                      <div className="bg-[#002045]/40 border border-white/5 p-2 rounded-lg flex flex-col justify-center text-right">
                        <span className="text-slate-400 mb-0.5 uppercase tracking-wider text-[9px]">OEE YIELD</span>
                        <span className="text-lime-400 font-semibold font-mono">
                          {((1 - machine.failureRate) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed Control Desk Node View (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="h-full rounded-2xl glass-panel relative overflow-hidden border border-white/10 p-6 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              
              {/* Internal abstract pattern layout */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div>
                {/* Desk Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-widest text-[#a3e635]">
                      LIVE CONSOLE INTERFACE NODE ({activeNode.id})
                    </div>
                    <h3 className="font-display font-medium text-xl text-white mt-1">
                      {activeNode.name[currentLang]}
                    </h3>
                  </div>
                  <div className="mt-2.5 sm:mt-0 flex items-center space-x-2">
                    <span className="text-xs text-slate-300 font-mono">OPERATORS: {activeNode.operators}</span>
                  </div>
                </div>

                {/* Animated Liquid Gauge Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  
                  {/* Gauge 1: Thermal Core */}
                  <div className="bg-[#002045]/50 border border-white/10 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-300">{t.telemetryTemp}</span>
                      <Thermometer className="w-4.5 h-4.5 text-lime-400" />
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className={`text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full font-mono ${
                            activeNode.temperature > 85 ? 'bg-red-500/20 text-red-400' : 'bg-lime-400/20 text-lime-400'
                          }`}>
                            {activeNode.temperature > 85 ? 'THERMAL DANGER' : 'NORMAL'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold inline-block text-white font-mono">
                            {activeNode.temperature}°C
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2.5 mb-2 text-xs flex rounded bg-[#01142c] border border-white/5">
                        <motion.div
                          animate={{ width: `${Math.min((activeNode.temperature / 200) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            activeNode.temperature > 85 ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-lime-400'
                          }`}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-2">
                      LIMIT STAGES: MIN 20°C / MAX 100°C
                    </span>
                  </div>

                  {/* Gauge 2: Operational RPM Speed */}
                  <div className="bg-[#002045]/50 border border-white/10 p-4 rounded-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-300">{t.telemetrySpeed}</span>
                      <RotateCw className="w-4.5 h-4.5 text-[#a3e635] animate-spin-slow" />
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full bg-lime-400/20 text-lime-400 font-mono">
                            RPM STATUS
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold inline-block text-white font-mono">
                            {activeNode.rpm.toLocaleString()} rpm
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2.5 mb-2 text-xs flex rounded bg-[#01142c] border border-white/5">
                        <motion.div
                          animate={{ width: `${activeNode.status === 'operating' ? 75 : 0}%` }}
                          transition={{ duration: 0.8 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#002045] to-lime-400"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-2">
                      LOAD FACTOR: {activeNode.status === 'operating' ? '82.4% CALIBRATED' : 'STATIONARY SYSTEM'}
                    </span>
                  </div>

                </div>

                {/* Additional parameters widgets */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  
                  <div className="border border-white/10 bg-[#002045]/20 p-3.5 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">{t.telemetryCount}</span>
                    <span className="font-mono text-lg font-semibold text-white block">
                      {activeNode.totalProducedCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="border border-white/10 bg-[#002045]/20 p-3.5 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">VIBRATION DRIFT</span>
                    <span className="font-mono text-lg font-semibold text-lime-400 block">
                      {activeNode.vibration} Hz
                    </span>
                  </div>

                  <div className="border border-white/10 bg-[#002045]/20 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">REJECT COUNT (SCRAP)</span>
                    <span className="font-mono text-lg font-semibold text-red-300 block">
                      {Math.ceil(activeNode.totalProducedCount * activeNode.failureRate).toLocaleString()}
                    </span>
                  </div>

                </div>
              </div>

              {/* Console Action Panel */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Left controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleMachineStatus(activeNode.id)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold transition-all duration-200 hover:border-lime-400/50 cursor-pointer"
                  >
                    {activeNode.status === 'operating' ? (
                      <>
                        <Square className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                        <span>RESET SPEED / PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-lime-400 fill-lime-400" />
                        <span>ENGAGE FORCE RUN</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={triggerOverheatAlert}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-mono text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{t.telemetryTriggerAlert}</span>
                  </button>
                </div>

                {/* Status telemetry logs info */}
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                  <span>{t.telemetrySystemsOnline}</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
