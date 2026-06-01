import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Cpu, Server, Cloud, Monitor, Check, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ArchitectureViewProps {
  currentLang: Language;
}

interface ArchLayer {
  index: string;
  nameKey: 'archLayerEdge' | 'archLayerNode' | 'archLayerCloud' | 'archLayerPortal';
  descKey: 'archLayerEdgeDesc' | 'archLayerNodeDesc' | 'archLayerCloudDesc' | 'archLayerPortalDesc';
  icon: typeof Cpu;
  stats: {
    latency: string;
    throughput: string;
    redundancy: string;
  };
  protocols: string[];
}

const layersData: ArchLayer[] = [
  {
    index: 'IV',
    nameKey: 'archLayerPortal',
    descKey: 'archLayerPortalDesc',
    icon: Monitor,
    stats: {
      latency: '< 80 ms',
      throughput: 'Real-time WebSocket Frame',
      redundancy: 'Geo-replicated DNS Fallback',
    },
    protocols: ['WebGL 2.0', 'React 19', 'GraphQL Subscription', 'gRPC-Web'],
  },
  {
    index: 'III',
    nameKey: 'archLayerCloud',
    descKey: 'archLayerCloudDesc',
    icon: Cloud,
    stats: {
      latency: '25 - 50 ms',
      throughput: '3M Datapoints / sec',
      redundancy: 'Active-Active Triple Cluster',
    },
    protocols: ['Apache Kafka', 'TimescaleDB', 'TensorFlow Core', 'Kubernetes'],
  },
  {
    index: 'II',
    nameKey: 'archLayerNode',
    descKey: 'archLayerNodeDesc',
    icon: Server,
    stats: {
      latency: '< 5 ms',
      throughput: '500K Signals / sec',
      redundancy: 'RAID-1 Dual Core Flash',
    },
    protocols: ['Docker Node', 'Redis Cache', 'SQLite Local', 'Erlang Broker'],
  },
  {
    index: 'I',
    nameKey: 'archLayerEdge',
    descKey: 'archLayerEdgeDesc',
    icon: Cpu,
    stats: {
      latency: '< 1 ms',
      throughput: 'Hard Real-time Bus',
      redundancy: 'Fail-safe Hardware Relay',
    },
    protocols: ['Modbus TCP', 'OPC UA Source', 'EtherCAT Bus', 'MQTT Sparkplug'],
  },
];

export default function ArchitectureView({ currentLang }: ArchitectureViewProps) {
  const [activeLayerIndex, setActiveLayerIndex] = useState<string>('I');
  
  const t = translations[currentLang];
  const activeLayer = layersData.find(l => l.index === activeLayerIndex) || layersData[layersData.length - 1];

  return (
    <section className="relative px-6 py-20 pb-28 md:px-12 bg-gradient-to-b from-[#002045] to-[#01142c] overflow-hidden" id="architecture-section">
      <div className="glow-spot w-[450px] h-[450px] bg-lime-400 top-1/2 left-2/3 opacity-[0.05]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center md:text-left mb-16 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400 text-xs font-mono mb-4 uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>Industrial Abstraction Model</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            {t.archHeader}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {t.archSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT Stack visual representation (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-10" id="arch-visual-stack">
            
            {/* Ambient lines behind stack */}
            <div className="absolute w-0.5 h-[80%] bg-gradient-to-b from-lime-400/10 via-lime-400/40 to-lime-400/10 left-1/2 top-10 -translate-x-1/2 pointer-events-none" />

            <div className="w-full max-w-sm flex flex-col space-y-7 relative z-10">
              {layersData.map((layer, index) => {
                const isActive = layer.index === activeLayerIndex;
                const LayerIcon = layer.icon;

                return (
                  <motion.div
                    key={layer.index}
                    onClick={() => setActiveLayerIndex(layer.index)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl cursor-pointer relative transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-[#002045] to-[#04336c] border border-lime-400/50 shadow-[0_15px_30px_rgba(163,230,53,0.15)]'
                        : 'glass-panel opacity-85 hover:opacity-100 hover:border-white/25'
                    }`}
                  >
                    {/* Glowing highlight dot inside active layers */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-lime-400/10 rounded-full blur-xl pointer-events-none" />
                    )}

                    <div className="flex items-center space-x-4">
                      {/* Badge count */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border transition-all duration-300 ${
                        isActive
                          ? 'bg-lime-400 text-[#002045] border-lime-400'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {layer.index}
                      </div>

                      {/* Info lines */}
                      <div className="flex-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                          LAYER METRICS
                        </span>
                        <h4 className={`font-display text-sm font-semibold tracking-wide ${isActive ? 'text-lime-400' : 'text-white'}`}>
                          {t[layer.nameKey]}
                        </h4>
                      </div>

                      <div>
                        <LayerIcon className={`w-5 h-5 ${isActive ? 'text-lime-400' : 'text-slate-500'}`} />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT technical specifications desk (7 Columns) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayerIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl glass-panel relative p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden"
                id="arch-specification-slate"
              >
                {/* Tech specifications grid icon water mark */}
                <div className="absolute top-4 right-4 text-lime-400/10 font-mono text-5xl font-extrabold select-none pointer-events-none">
                  {activeLayer.index}
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
                  <span className="font-mono text-xs uppercase text-lime-400 tracking-widest font-bold">
                    SYSTEM COMPONENT DEFINED
                  </span>
                </div>

                {/* Layer Title name */}
                <h3 className="font-display font-medium text-2xl lg:text-3xl text-white mb-4">
                  {t[activeLayer.nameKey]}
                </h3>

                {/* Description details */}
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-sans">
                  {t[activeLayer.descKey]}
                </p>

                {/* Industry metrics details block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-white/10 py-5 mb-6 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                      DATA BUS LATENCY
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {activeLayer.stats.latency}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                      RATED THROUGHPUT
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {activeLayer.stats.throughput}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                      HOT RECOVERY MODE
                    </span>
                    <span className="text-lime-400 font-semibold text-sm">
                      {activeLayer.stats.redundancy}
                    </span>
                  </div>
                </div>

                {/* Enabled protocol tags */}
                <div>
                  <span className="block text-xs uppercase font-mono tracking-wider text-slate-300 mb-3">
                    COMPATIBLE INDUSTRIAL PROTOCOLS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeLayer.protocols.map((proto) => (
                      <span
                        key={proto}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#002045]/50 border border-white/5 rounded-lg text-xs font-mono text-white"
                      >
                        <Check className="w-3 h-3 text-lime-400" />
                        <span>{proto}</span>
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
