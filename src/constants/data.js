// ─── STATIC PRODUCT DATA ──────────────────────────────────────
export const PRODUCTS_ALUM = [
  { code: "NWS-TE-350E", raw: 0.59, single: 0.69, spec: "350*80*80", actual: "419*76*78", heat: 105 },
  { code: "NWS-T-350C3", raw: 0.57, single: 0.67, spec: "350*80*96", actual: "413*76*96", heat: null },
  { code: "NWS-CO-500A8", raw: 0.54, single: 0.64, spec: "500*80*80", actual: "560*70*75", heat: null },
  { code: "NWS-CO-500A6", raw: 0.60, single: 0.70, spec: "500*80*80", actual: "560*74*75", heat: 117 },
  { code: "NWS-TE-500E", raw: 0.70, single: 0.80, spec: "500*80*80", actual: "569*76*78", heat: 129 },
  { code: "NWS-TE-500A", raw: 0.92, single: 1.02, spec: "500*80*80", actual: "577*80*80", heat: null },
  { code: "NWS-T-500C5", raw: 0.62, single: 0.72, spec: "500*80*96", actual: "562*74*96", heat: 121 },
  { code: "NWS-T-500C3", raw: 0.72, single: 0.82, spec: "500*80*96", actual: "562*76*96", heat: null },
  { code: "NWS-ST-500C", raw: 0.80, single: 0.90, spec: "500*80*96", actual: "579*77*96", heat: 140 },
  { code: "NWS-SL-500C", raw: 0.84, single: 0.94, spec: "500*80*96", actual: "577*80*96", heat: null },
  { code: "NWS-T-500C2", raw: 0.85, single: 0.95, spec: "500*80*96", actual: "577*78*96", heat: 145 },
  { code: "NWS-D-500C2", raw: 0.88, single: 0.98, spec: "500*80*96", actual: "575*80*96", heat: 150 },
  { code: "NWS-H-500C", raw: 1.03, single: 1.13, spec: "500*80*96", actual: "574*80*95", heat: null },
  { code: "NWS-F-500C", raw: 1.07, single: 1.17, spec: "500*80*96", actual: "569*80*96", heat: 155 },
  { code: "NWS-O-500C2", raw: 1.15, single: 1.25, spec: "500*80*96", actual: "577*80*95", heat: 161 },
  { code: "NWS-G-500C", raw: 1.20, single: 1.30, spec: "500*80*96", actual: "577*80*96", heat: null },
  { code: "NWS-O-500D", raw: 1.28, single: 1.38, spec: "500*80*100", actual: "578*80*100", heat: 180 },
];
export const PRODUCTS_BIMETAL = [
  { code: "NWS-B-200C", raw: 0.80, single: 0.90, spec: "200*80*96", actual: "256*78.5*95", heat: null },
  { code: "NWS-TE-350BM", raw: 0.91, single: 1.01, spec: "350*80*80", actual: "408*75*78", heat: 105 },
  { code: "NWS-B-500A8", raw: 0.96, single: 1.06, spec: "500*80*80", actual: "546*70*75", heat: null },
  { code: "NWS-B-500A7", raw: 0.99, single: 1.09, spec: "500*80*80", actual: "546*74*75", heat: null },
  { code: "NWS-B-500A6", raw: 1.05, single: 1.15, spec: "500*80*80", actual: "546*74*75", heat: 115 },
  { code: "NWS-TE-500BM", raw: 1.11, single: 1.21, spec: "500*80*80", actual: "558*75*78", heat: 129 },
  { code: "NWS-BT-500C5", raw: 1.08, single: 1.18, spec: "500*80*96", actual: "546*74*96", heat: 125 },
  { code: "NWS-B-500C2", raw: 1.24, single: 1.34, spec: "500*80*96", actual: "567*75*96", heat: 140 },
  { code: "NWS-BO-500CQ", raw: 1.58, single: 1.68, spec: "500*80*96", actual: "564*80*96", heat: null },
  { code: "NWS-BK-500C", raw: 1.60, single: 1.70, spec: "500*80*96", actual: "550*80*96", heat: 155 },
  { code: "NWS-BO-500CF", raw: 1.67, single: 1.77, spec: "500*80*96", actual: "550*80*97", heat: 160 },
  { code: "NWS-BO-500DV", raw: 1.76, single: 1.86, spec: "500*80*100", actual: "597*80*100", heat: null },
];
export const ALL_PRODUCTS = [...PRODUCTS_ALUM, ...PRODUCTS_BIMETAL];
export const TAX_RATE = 0.10;

// ─── COUNTRY LIST ─────────────────────────────────────────────
export const COUNTRIES = [
  "🇺🇿 Uzbekistan", "🇷🇺 Russia", "🇨🇳 China", "🇹🇷 Turkey",
  "🇰🇿 Kazakhstan", "🇹🇯 Tajikistan", "🇰🇬 Kyrgyzstan", "🇦🇿 Azerbaijan",
  "🇬🇪 Georgia", "🇺🇦 Ukraine", "🇦🇲 Armenia", "🇧🇾 Belarus",
  "🇹🇲 Turkmenistan", "🇲🇳 Mongolia", "🇦🇫 Afghanistan",
  "🇩🇪 Germany", "🇫🇷 France", "🇬🇧 United Kingdom", "🇮🇹 Italy",
  "🇪🇸 Spain", "🇵🇱 Poland", "🇳🇱 Netherlands", "🇨🇿 Czech Republic",
  "🇷🇴 Romania", "🇭🇺 Hungary", "🇸🇰 Slovakia", "🇧🇬 Bulgaria",
  "🇷🇸 Serbia", "🇭🇷 Croatia", "🇲🇩 Moldova", "🇱🇻 Latvia",
  "🇱🇹 Lithuania", "🇪🇪 Estonia", "🇨🇭 Switzerland", "🇦🇹 Austria",
  "🇧🇪 Belgium", "🇵🇹 Portugal", "🇸🇪 Sweden", "🇳🇴 Norway",
  "🇫🇮 Finland", "🇩🇰 Denmark",
  "🇮🇷 Iran", "🇮🇶 Iraq", "🇸🇦 Saudi Arabia", "🇦🇪 UAE",
  "🇮🇱 Israel", "🇯🇴 Jordan", "🇱🇧 Lebanon", "🇸🇾 Syria",
  "🇵🇰 Pakistan", "🇮🇳 India", "🇧🇩 Bangladesh",
  "🇯🇵 Japan", "🇰🇷 South Korea", "🇻🇳 Vietnam", "🇹🇭 Thailand",
  "🇲🇾 Malaysia", "🇮🇩 Indonesia", "🇵🇭 Philippines",
  "🇸🇬 Singapore", "🇭🇰 Hong Kong",
  "🇺🇸 USA", "🇨🇦 Canada", "🇲🇽 Mexico",
  "🇧🇷 Brazil", "🇦🇷 Argentina",
  "🇦🇺 Australia", "🇳🇿 New Zealand",
  "🇿🇦 South Africa", "🇪🇬 Egypt", "🇲🇦 Morocco", "🇩🇿 Algeria",
  "🇳🇬 Nigeria", "🇰🇪 Kenya",
];

// ─── DEFAULT DATA ─────────────────────────────────────────────
export const DEFAULT_CLIENTS = [
  { id: 1, name: "Ozodbek", country: "🇺🇿 Uzbekistan", cashDebt: 12000, wireDebt: 8500, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.8).toFixed(2))])) },
  { id: 2, name: "Abu Tashkent", country: "🇺🇿 Uzbekistan", cashDebt: 0, wireDebt: 0, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 4.0).toFixed(2))])) },
  { id: 3, name: "Xushnudbek", country: "🇺🇿 Uzbekistan", cashDebt: 30000, wireDebt: 22000, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.6).toFixed(2))])) },
  { id: 4, name: "Farhodjon", country: "🇨🇳 China", cashDebt: 7200, wireDebt: 5400, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.5).toFixed(2))])) },
  { id: 5, name: "Azizbek", country: "🇺🇿 Uzbekistan", cashDebt: 10500, wireDebt: 9000, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.9).toFixed(2))])) },
];
export const DEFAULT_ORDERS = [
  { id: "NW2604001", client: "Ozodbek", items: [{ product: "NWS-ST-500C", qty: 120, unitPrice: 400 }], total: 48000, cashPaid: 12000, wirePaid: 8500, status: "partial", date: "2026-04-10" },
  { id: "NW2604002", client: "Abu Tashkent", items: [{ product: "NWS-TE-500E", qty: 80, unitPrice: 280 }], total: 22400, cashPaid: 11200, wirePaid: 11200, status: "paid", date: "2026-04-08" },
  { id: "NW2604003", client: "Xushnudbek", items: [{ product: "NWS-O-500D", qty: 100, unitPrice: 400 }, { product: "NWS-D-500C2", qty: 100, unitPrice: 400 }], total: 80000, cashPaid: 0, wirePaid: 20000, status: "partial", date: "2026-04-15" },
  { id: "NW2604004", client: "Farhodjon", items: [{ product: "NWS-B-500C2", qty: 60, unitPrice: 240 }], total: 14400, cashPaid: 0, wirePaid: 0, status: "unpaid", date: "2026-04-18" },
  { id: "NW2604005", client: "Azizbek", items: [{ product: "NWS-BK-500C", qty: 100, unitPrice: 280 }, { product: "NWS-BO-500CF", qty: 50, unitPrice: 280 }], total: 42000, cashPaid: 10500, wirePaid: 9000, status: "partial", date: "2026-04-20" },
];
export const DEFAULT_SHIPMENTS = [
  { id: "SHP-881", from: "🇨🇳 Guangzhou", items: "Aluminum billets (5T), Molds", eta: "2026-04-28", status: "in_transit" },
  { id: "SHP-882", from: "🇹🇷 Istanbul", items: "Steel pipes (2T), Fittings", eta: "2026-05-05", status: "customs" },
  { id: "SHP-883", from: "🇨🇳 Yiwu", items: "Packaging (10k units)", eta: "2026-05-12", status: "ordered" },
  { id: "SHP-884", from: "🇰🇷 Seoul", items: "Special coating material", eta: "2026-04-25", status: "arrived" },
];
