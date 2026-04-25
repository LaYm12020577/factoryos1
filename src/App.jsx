import { useState, createContext, useContext, useEffect, useRef } from "react";

// ─── localStorage helpers ─────────────────────────────────────
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// ─── i18n ─────────────────────────────────────────────────────
const TRANSLATIONS = {
  uz: {
    dashboard: "Bosh sahifa", orders: "Buyurtmalar", debts: "Qarzlar",
    shipments: "Yetkazib berish", clients: "Mijozlar", products: "Mahsulotlar",
    totalRevenue: "Jami daromad", totalCollected: "Yig'ilgan", totalDebt: "Jami qarz",
    activeShipments: "Faol jo'natmalar", recentOrders: "So'nggi buyurtmalar",
    incomingShipments: "Kelayotgan yuklar", factoryOverview: "Zavod ko'rinishi",
    collected: "yig'ilgan", orders_count: "buyurtma", enRoute: "yo'lda / bojxonada",
    newOrder: "+ Yangi buyurtma", clickRow: "Qatorni bosing — buyurtma ma'lumotlari va hujjatlar",
    all: "Hammasi", paid: "To'langan", partial: "Qisman", unpaid: "To'lanmagan",
    orderId: "Buyurtma №", client: "Mijoz", product: "Mahsulot", qty: "Miqdor",
    total: "Jami", cashPaid: "💵 Naqd", wirePaid: "🏦 O'tkazma", remaining: "Qoldiq",
    progress: "Jarayon", status: "Holat",
    paymentProgress: "To'lov jarayoni", docLang: "Hujjat tili",
    generateInvoice: "Hisob-faktura", generateContract: "Shartnoma",
    generatePL: "Narx varaqasi", addPayment: "To'lov qo'shish",
    cashDebt: "Naqd qarz", wireDebt: "O'tkazma qarz", noDebt: "✓ Qarz yo'q",
    totalDebtLabel: "jami qarz", viewOrders: "Buyurtmalarni ko'rish", exportBtn: "Eksport",
    clientsTitle: "Mijozlar va narxlar", addClient: "+ Mijoz qo'shish",
    clientsSubtitle: "Har bir mijoz uchun narxlarni boshqaring",
    editPrices: "✏️ Narxlarni tahrirlash", currentPrices: "Joriy narxlar",
    editingPrices: "✏️ Tahrirlash — o'zgartiring va saqlang",
    model: "Model", cashPrice: "💵 Naqd narx", wirePrice: "🏦 O'tkazma narx",
    savePrices: "✅ Saqlash", cancel: "Bekor qilish",
    exportPricelist: "📄 Narx varaqasini eksport", genPricelist: "📊 Narx varaqasi",
    productsTitle: "Mahsulotlar", addModel: "+ Model qo'shish",
    productsSubtitle: "Model o'lchamlari va texnik ma'lumotlar",
    rawWeight: "Og'irlik (ipsiz)", singleWeight: "Og'irlik (ipli)",
    specMm: "O'lcham mm", actualMm: "Haqiqiy o'lcham", heatKw: "Issiqlik/KW",
    editMeasure: "O'lchamlarni tahrirlash", specSheet: "📄 Spesifikatsiya",
    aluminum: "Alyuminiy", bimetal: "Bimetal", active: "Faol",
    addShipment: "+ Qo'shish", incomingMaterials: "Xorijdan kelayotgan materiallar",
    newShipment: "Yangi jo'natma", originCountry: "Kelib chiqqan mamlakat",
    items: "Tovarlar / Materiallar", eta: "Kelish sanasi", statusLabel: "Holat",
    save: "Saqlash", updateStatus: "Holatni yangilash", genDoc: "📄 Hujjat",
    ordered: "Buyurtma qilindi", inTransit: "Yo'lda", atCustoms: "Bojxonada", arrived: "Yetib keldi",
    debtsTitle: "Qarz hisoblagich", debtsSubtitle: "Har bir mijoz bo'yicha naqd va o'tkazma qarzlar",
    filterClient: "Mijoz bo'yicha filtrlash", allClients: "Barcha mijozlar",
    totalCashDebt: "💵 Jami naqd qarz", totalWireDebt: "🏦 Jami o'tkazma qarz",
    plTitle: "Narx varaqasini yaratish", plSubtitle: "Mijoz va format tanlang",
    selectClient: "Mijozni tanlang", selectFormat: "Format", taxNote: "O'tkazma narx = naqd + 10% soliq",
    generateBtn: "📊 Yaratish", previewTitle: "Ko'rinish",
    cashNote: "Naqd narx", wireNote: "O'tkazma narx (soliq bilan)",
    newOrderTitle: "Yangi buyurtma", selectProduct: "Mahsulot tanlang",
    unitPrice: "Birlik narxi ($)", addPaymentTitle: "To'lov qo'shish",
    paymentType: "To'lov turi", paymentAmount: "Miqdor ($)", paymentDate: "Sana",
    cash: "💵 Naqd", wire: "🏦 O'tkazma", savedMsg: "Saqlandi ✓",
    addShipmentTitle: "Jo'natma qo'shish", noOrders: "Buyurtmalar yo'q",
    filterProduct: "Mahsulot bo'yicha filtrlash", allProducts: "Barcha mahsulotlar",
    addProduct: "+ Mahsulot qo'shish", models: "model", remove: "O'chirish",
  },
  ru: {
    dashboard: "Главная", orders: "Заказы", debts: "Долги",
    shipments: "Доставки", clients: "Клиенты", products: "Продукты",
    totalRevenue: "Общая выручка", totalCollected: "Собрано", totalDebt: "Общий долг",
    activeShipments: "Активные поставки", recentOrders: "Последние заказы",
    incomingShipments: "Входящие грузы", factoryOverview: "Обзор завода",
    collected: "собрано", orders_count: "заказов", enRoute: "в пути / на таможне",
    newOrder: "+ Новый заказ", clickRow: "Нажмите на строку — детали заказа и документы",
    all: "Все", paid: "Оплачен", partial: "Частично", unpaid: "Не оплачен",
    orderId: "№ Заказа", client: "Клиент", product: "Продукт", qty: "Кол-во",
    total: "Итого", cashPaid: "💵 Наличные", wirePaid: "🏦 Перевод", remaining: "Остаток",
    progress: "Прогресс", status: "Статус",
    paymentProgress: "Прогресс оплаты", docLang: "Язык документа",
    generateInvoice: "Счёт-фактура", generateContract: "Договор",
    generatePL: "Прайс-лист", addPayment: "Добавить оплату",
    cashDebt: "Долг наличными", wireDebt: "Долг переводом", noDebt: "✓ Нет долга",
    totalDebtLabel: "общий долг", viewOrders: "Смотреть заказы", exportBtn: "Экспорт",
    clientsTitle: "Клиенты и прайс-листы", addClient: "+ Добавить клиента",
    clientsSubtitle: "Управляйте ценами для каждого клиента",
    editPrices: "✏️ Изменить цены", currentPrices: "Текущие цены",
    editingPrices: "✏️ Редактирование — измените и сохраните",
    model: "Модель", cashPrice: "💵 Цена нал.", wirePrice: "🏦 Цена безнал.",
    savePrices: "✅ Сохранить", cancel: "Отмена",
    exportPricelist: "📄 Экспорт прайс-листа", genPricelist: "📊 Прайс-лист",
    productsTitle: "Продукты", addModel: "+ Добавить модель",
    productsSubtitle: "Размеры и технические характеристики",
    rawWeight: "Вес (без резьбы)", singleWeight: "Вес (с резьбой)",
    specMm: "Размер мм", actualMm: "Фактический размер", heatKw: "Теплоотдача/KW",
    editMeasure: "Редактировать размеры", specSheet: "📄 Спецификация",
    aluminum: "Алюминий", bimetal: "Биметалл", active: "Активен",
    addShipment: "+ Добавить", incomingMaterials: "Входящие материалы из-за рубежа",
    newShipment: "Новая поставка", originCountry: "Страна происхождения",
    items: "Товары / Материалы", eta: "Дата прибытия", statusLabel: "Статус",
    save: "Сохранить", updateStatus: "Обновить статус", genDoc: "📄 Документ",
    ordered: "Заказано", inTransit: "В пути", atCustoms: "На таможне", arrived: "Прибыло",
    debtsTitle: "Калькулятор долгов", debtsSubtitle: "Долги наличными и переводом по каждому клиенту",
    filterClient: "Фильтр по клиенту", allClients: "Все клиенты",
    totalCashDebt: "💵 Общий долг нал.", totalWireDebt: "🏦 Общий долг безнал.",
    plTitle: "Создать прайс-лист", plSubtitle: "Выберите клиента и формат",
    selectClient: "Выберите клиента", selectFormat: "Формат", taxNote: "Цена безнал. = нал. + 10% налог",
    generateBtn: "📊 Создать", previewTitle: "Предпросмотр",
    cashNote: "Нал. цена", wireNote: "Безнал. цена (с налогом)",
    newOrderTitle: "Новый заказ", selectProduct: "Выберите продукт",
    unitPrice: "Цена за ед. ($)", addPaymentTitle: "Добавить оплату",
    paymentType: "Тип оплаты", paymentAmount: "Сумма ($)", paymentDate: "Дата",
    cash: "💵 Наличные", wire: "🏦 Перевод", savedMsg: "Сохранено ✓",
    addShipmentTitle: "Добавить поставку", noOrders: "Нет заказов",
    filterProduct: "Фильтр по продукту", allProducts: "Все продукты",
    addProduct: "+ Добавить продукт", models: "моделей", remove: "Удалить",
  },
  zh: {
    dashboard: "主页", orders: "订单", debts: "债务",
    shipments: "货运", clients: "客户", products: "产品",
    totalRevenue: "总收入", totalCollected: "已收款", totalDebt: "总债务",
    activeShipments: "在途货物", recentOrders: "最近订单",
    incomingShipments: "到货货物", factoryOverview: "工厂概览",
    collected: "已收", orders_count: "订单", enRoute: "在途/清关",
    newOrder: "+ 新订单", clickRow: "点击行查看订单详情和文件",
    all: "全部", paid: "已付款", partial: "部分付款", unpaid: "未付款",
    orderId: "订单号", client: "客户", product: "产品", qty: "数量",
    total: "合计", cashPaid: "💵 现金", wirePaid: "🏦 转账", remaining: "余额",
    progress: "进度", status: "状态",
    paymentProgress: "付款进度", docLang: "文件语言",
    generateInvoice: "发票", generateContract: "合同",
    generatePL: "价格表", addPayment: "添加付款",
    cashDebt: "现金欠款", wireDebt: "转账欠款", noDebt: "✓ 无欠款",
    totalDebtLabel: "总欠款", viewOrders: "查看订单", exportBtn: "导出",
    clientsTitle: "客户与价格表", addClient: "+ 添加客户",
    clientsSubtitle: "管理每个客户的价格",
    editPrices: "✏️ 编辑价格", currentPrices: "当前价格",
    editingPrices: "✏️ 编辑中 — 修改后保存",
    model: "型号", cashPrice: "💵 现金价", wirePrice: "🏦 转账价",
    savePrices: "✅ 保存", cancel: "取消",
    exportPricelist: "📄 导出价格表", genPricelist: "📊 价格表",
    productsTitle: "产品", addModel: "+ 添加型号",
    productsSubtitle: "型号尺寸和规格",
    rawWeight: "毛重(不含丝)", singleWeight: "单片重(含丝)",
    specMm: "规格mm", actualMm: "实际尺寸mm", heatKw: "散热量/KW",
    editMeasure: "编辑尺寸", specSheet: "📄 规格表",
    aluminum: "铝制", bimetal: "双金属", active: "在售",
    addShipment: "+ 添加", incomingMaterials: "进口原材料货运",
    newShipment: "新货运", originCountry: "原产地", items: "货物/材料",
    eta: "预计到达", statusLabel: "状态", save: "保存",
    updateStatus: "更新状态", genDoc: "📄 文件",
    ordered: "已下单", inTransit: "运输中", atCustoms: "清关中", arrived: "已到达",
    debtsTitle: "债务计算器", debtsSubtitle: "每个客户的现金和转账债务",
    filterClient: "按客户筛选", allClients: "所有客户",
    totalCashDebt: "💵 现金债务合计", totalWireDebt: "🏦 转账债务合计",
    plTitle: "生成价格表", plSubtitle: "选择客户和格式",
    selectClient: "选择客户", selectFormat: "格式", taxNote: "转账价 = 现金价 + 10% 税",
    generateBtn: "📊 生成", previewTitle: "预览",
    cashNote: "现金价", wireNote: "转账价（含税）",
    newOrderTitle: "新订单", selectProduct: "选择产品",
    unitPrice: "单价 ($)", addPaymentTitle: "添加付款",
    paymentType: "付款类型", paymentAmount: "金额 ($)", paymentDate: "日期",
    cash: "💵 现金", wire: "🏦 转账", savedMsg: "已保存 ✓",
    addShipmentTitle: "添加货运", noOrders: "暂无订单",
    filterProduct: "按产品筛选", allProducts: "所有产品",
    addProduct: "+ 添加产品", models: "个型号", remove: "删除",
  },
};

const LangCtx = createContext("uz");
const useLang = () => useContext(LangCtx);
const useT = () => TRANSLATIONS[useLang()];

// ─── THEME ────────────────────────────────────────────────────
const DARK = {
  bg: "#0f1117", surface: "#181c27", card: "#1e2336", border: "#2a3050",
  accent: "#4f8ef7", green: "#2ecc8a", red: "#f25c5c", yellow: "#f5a623",
  cyan: "#38d9f5", text: "#e8ecf7", muted: "#7a85a3", inputBg: "#181c27",
  shadow: "0 2px 12px #0006", overlay: "#00000088",
};
const LIGHT = {
  bg: "#f0f4fb", surface: "#ffffff", card: "#ffffff", border: "#dce3f0",
  accent: "#1a6ef5", green: "#1a9e5c", red: "#d63c3c", yellow: "#c47d00",
  cyan: "#0a8fa8", text: "#1a2035", muted: "#6b7a99", inputBg: "#f5f7fc",
  shadow: "0 2px 10px #1a203510", overlay: "#00000055",
};

const ThemeCtx = createContext(LIGHT);
const useC = () => useContext(ThemeCtx);

const mk = (C, L) => ({
  app: { fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column" },
  topbar: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 100, boxShadow: C.shadow },
  logo: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: C.accent, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 8 },
  topRight: { display: "flex", alignItems: "center", gap: 8 },
  navBar: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 12px" },
  nav: { display: "flex", gap: 2, overflowX: "auto", scrollbarWidth: "none" },
  navBtn: (active) => ({ padding: "10px 13px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 500, whiteSpace: "nowrap", background: "transparent", color: active ? C.accent : C.muted, borderBottom: active ? `2.5px solid ${C.accent}` : "2.5px solid transparent", transition: "all 0.15s" }),
  main: { flex: 1, padding: L ? "24px 16px" : "20px 16px", maxWidth: 900, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  pageTitle: { fontSize: L ? 26 : 22, fontWeight: 700, marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" },
  subtitle: { color: C.muted, fontSize: 13, marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: L ? 16 : 14, padding: L ? 18 : 16, boxShadow: L ? C.shadow : "none" },
  statCard: (color) => ({ background: C.card, border: `1px solid ${L ? C.border : color + "30"}`, borderRadius: L ? 16 : 14, padding: L ? 18 : 16, position: "relative", overflow: "hidden", boxShadow: L ? C.shadow : "none" }),
  statLabel: { fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: 500 },
  statValue: (color) => ({ fontSize: L ? 28 : 24, fontWeight: 700, color, fontFamily: "'Space Grotesk', sans-serif" }),
  statSub: { fontSize: 11, color: C.muted, marginTop: 4 },
  sectionTitle: { fontSize: L ? 15 : 14, fontWeight: 600, marginBottom: 12 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: L ? 14 : 13 },
  th: { textAlign: "left", padding: "9px 10px", color: C.muted, fontWeight: 600, fontSize: 11, borderBottom: `2px solid ${C.border}`, textTransform: "uppercase", letterSpacing: "0.4px", background: L ? "#f7f9fd" : "transparent", whiteSpace: "nowrap" },
  td: { padding: L ? "12px 10px" : "10px 10px", borderBottom: `1px solid ${C.border}`, fontSize: L ? 14 : 13, verticalAlign: "middle" },
  badge: (color) => ({ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}20`, color, border: L ? `1px solid ${color}40` : "none", whiteSpace: "nowrap" }),
  btn: (color) => ({ background: `${color}15`, color, border: `1.5px solid ${color}50`, borderRadius: L ? 10 : 8, padding: L ? "9px 18px" : "7px 14px", fontSize: L ? 14 : 13, fontWeight: 500, cursor: "pointer" }),
  btnSm: (color) => ({ background: `${color}15`, color, border: `1px solid ${color}40`, borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }),
  btnPrimary: { background: C.accent, color: "#fff", border: "none", borderRadius: L ? 10 : 8, padding: L ? "10px 22px" : "9px 18px", fontSize: L ? 14 : 13, fontWeight: 600, cursor: "pointer", boxShadow: L ? `0 3px 10px ${C.accent}40` : "none" },
  input: { background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: L ? "11px 14px" : "9px 12px", color: C.text, fontSize: L ? 15 : 13, width: "100%", outline: "none", boxSizing: "border-box" },
  inputSm: { background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "6px 8px", color: C.text, fontSize: 13, width: "75px", outline: "none", textAlign: "right" },
  select: { background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: L ? "11px 14px" : "9px 12px", color: C.text, fontSize: L ? 15 : 13, width: "100%", outline: "none" },
  label: { fontSize: 12, color: C.muted, marginBottom: 6, display: "block", fontWeight: 500 },
  progress: () => ({ height: L ? 8 : 6, borderRadius: 4, background: C.border, overflow: "hidden" }),
  progressFill: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.6s ease" }),
  divider: { height: 1, background: C.border, margin: "14px 0" },
  col: { display: "flex", flexDirection: "column", gap: 10 },
  infoBox: (color) => ({ background: `${color}10`, border: `1.5px solid ${color}${L ? "35" : "25"}`, borderRadius: 12, padding: L ? "12px 14px" : "10px 12px" }),
  overlay: { position: "fixed", inset: 0, background: C.overlay, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "20px 12px" },
  modal: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, width: "100%", maxWidth: 580, boxShadow: "0 8px 40px #00000040", marginTop: 20 },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.border}` },
  modalBody: { padding: "18px 20px" },
  closeBtn: { background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted },
  toast: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: C.green, color: "#fff", padding: "10px 24px", borderRadius: 24, fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px #0004" },
});

// ─── STATIC PRODUCT DATA ──────────────────────────────────────
const PRODUCTS_ALUM = [
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
const PRODUCTS_BIMETAL = [
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
const ALL_PRODUCTS = [...PRODUCTS_ALUM, ...PRODUCTS_BIMETAL];
const TAX_RATE = 0.10;

// ─── DEFAULT DATA ─────────────────────────────────────────────
const DEFAULT_CLIENTS = [
  { id: 1, name: "Ozodbek", country: "🇺🇿 Uzbekistan", cashDebt: 12000, wireDebt: 8500, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.8).toFixed(2))])) },
  { id: 2, name: "Abu Tashkent", country: "🇺🇿 Uzbekistan", cashDebt: 0, wireDebt: 0, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 4.0).toFixed(2))])) },
  { id: 3, name: "Xushnudbek", country: "🇺🇿 Uzbekistan", cashDebt: 30000, wireDebt: 22000, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.6).toFixed(2))])) },
  { id: 4, name: "Farhodjon", country: "🇨🇳 China", cashDebt: 7200, wireDebt: 5400, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.5).toFixed(2))])) },
  { id: 5, name: "Azizbek", country: "🇺🇿 Uzbekistan", cashDebt: 10500, wireDebt: 9000, prices: Object.fromEntries(ALL_PRODUCTS.map(p => [p.code, parseFloat((p.single * 3.9).toFixed(2))])) },
];
const DEFAULT_ORDERS = [
  { id: "NW2604001", client: "Ozodbek", items: [{ product: "NWS-ST-500C", qty: 120, unitPrice: 400 }], total: 48000, cashPaid: 12000, wirePaid: 8500, status: "partial", date: "2026-04-10" },
  { id: "NW2604002", client: "Abu Tashkent", items: [{ product: "NWS-TE-500E", qty: 80, unitPrice: 280 }], total: 22400, cashPaid: 11200, wirePaid: 11200, status: "paid", date: "2026-04-08" },
  { id: "NW2604003", client: "Xushnudbek", items: [{ product: "NWS-O-500D", qty: 100, unitPrice: 400 }, { product: "NWS-D-500C2", qty: 100, unitPrice: 400 }], total: 80000, cashPaid: 0, wirePaid: 20000, status: "partial", date: "2026-04-15" },
  { id: "NW2604004", client: "Farhodjon", items: [{ product: "NWS-B-500C2", qty: 60, unitPrice: 240 }], total: 14400, cashPaid: 0, wirePaid: 0, status: "unpaid", date: "2026-04-18" },
  { id: "NW2604005", client: "Azizbek", items: [{ product: "NWS-BK-500C", qty: 100, unitPrice: 280 }, { product: "NWS-BO-500CF", qty: 50, unitPrice: 280 }], total: 42000, cashPaid: 10500, wirePaid: 9000, status: "partial", date: "2026-04-20" },
];
const DEFAULT_SHIPMENTS = [
  { id: "SHP-881", from: "🇨🇳 Guangzhou", items: "Aluminum billets (5T), Molds", eta: "2026-04-28", status: "in_transit" },
  { id: "SHP-882", from: "🇹🇷 Istanbul", items: "Steel pipes (2T), Fittings", eta: "2026-05-05", status: "customs" },
  { id: "SHP-883", from: "🇨🇳 Yiwu", items: "Packaging (10k units)", eta: "2026-05-12", status: "ordered" },
  { id: "SHP-884", from: "🇰🇷 Seoul", items: "Special coating material", eta: "2026-04-25", status: "arrived" },
];

// ─── NORMALIZE ORDERS (backward-compat with old single-product format) ─────
const normalizeOrders = (orders) => orders.map(o => {
  if (o.items) return o;
  const unitPrice = o.qty > 0 ? Math.round(o.total / o.qty * 100) / 100 : 0;
  const { product, qty, ...rest } = o;
  return { ...rest, items: [{ product, qty, unitPrice }] };
});


function Toast({ msg }) {
  const C = useC(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  return <div style={S.toast}>{msg}</div>;
}

// ─── PRICELIST MODAL ─────────────────────────────────────────
function PricelistModal({ clients, onClose }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [selClient, setSelClient] = useState(clients[0]?.id ?? null);
  const client = clients.find(c => c.id === Number(selClient));
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{T.plTitle}</div>
          <button style={S.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={S.modalBody}>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>{T.selectClient}</label>
            <select style={S.select} value={selClient} onChange={e => setSelClient(e.target.value)}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 12, color: C.yellow, background: `${C.yellow}15`, border: `1px solid ${C.yellow}40`, borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>⚠️ {T.taxNote}</div>
          {client && (<>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{T.previewTitle}: <span style={{ color: C.accent }}>{client.name}</span></div>
            {[["alum", PRODUCTS_ALUM, T.aluminum, C.yellow], ["bimetal", PRODUCTS_BIMETAL, T.bimetal, C.cyan]].map(([key, prods, label, col]) => (
              <div key={key}>
                <div style={{ fontWeight: 700, fontSize: 13, color: col, marginBottom: 6, marginTop: 8 }}>— {label} ({prods.length})</div>
                <div style={{ overflowX: "auto", marginBottom: 10 }}>
                  <table style={{ ...S.table, fontSize: 12 }}>
                    <thead><tr>{["№", T.model, T.rawWeight, T.singleWeight, T.cashNote+" ($)", T.wireNote+" ($)", T.specMm, T.heatKw].map(h => <th key={h} style={{ ...S.th, padding: "7px 8px", fontSize: 10 }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {prods.map((p, i) => {
                        const cash = client.prices[p.code] ?? "-";
                        const wire = typeof cash === "number" ? (cash * (1 + TAX_RATE)).toFixed(2) : "-";
                        return (<tr key={p.code}>
                          <td style={{ ...S.td, padding: "7px 8px" }}>{i + 1}</td>
                          <td style={{ ...S.td, padding: "7px 8px", fontWeight: 600 }}>{p.code}</td>
                          <td style={{ ...S.td, padding: "7px 8px" }}>{p.raw}</td>
                          <td style={{ ...S.td, padding: "7px 8px" }}>{p.single}</td>
                          <td style={{ ...S.td, padding: "7px 8px", color: C.green, fontWeight: 700 }}>${cash}</td>
                          <td style={{ ...S.td, padding: "7px 8px", color: C.cyan, fontWeight: 700 }}>${wire}</td>
                          <td style={{ ...S.td, padding: "7px 8px", color: C.muted }}>{p.spec}</td>
                          <td style={{ ...S.td, padding: "7px 8px" }}>{p.heat ?? "—"}</td>
                        </tr>);
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button style={S.btnPrimary}>{T.generateBtn} Excel</button>
              <button style={S.btn(C.cyan)}>{T.generateBtn} PNG</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER MODAL ─────────────────────────────────────────────
function OrderModal({ order, onClose, onPaymentSaved, clients }) {
  const C = useC(); const T = useT(); const lang = useLang();
  const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [docLang, setDocLang] = useState(lang);
  const [showPay, setShowPay] = useState(false);
  const [payType, setPayType] = useState("cash");
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const pct = Math.round((order.cashPaid + order.wirePaid) / order.total * 100);
  const cashPct = Math.round(order.cashPaid / order.total * 100);
  const wirePct = Math.round(order.wirePaid / order.total * 100);
  const sc = order.status === "paid" ? C.green : order.status === "partial" ? C.yellow : C.red;
  const TDoc = TRANSLATIONS[docLang];
  const remaining = order.total - order.cashPaid - order.wirePaid;

  const handlePaySave = () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    onPaymentSaved(order.id, payType, amt);
    setShowPay(false);
    setPayAmount("");
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: C.accent }}>{order.id}</span>
            <span style={{ color: C.muted, fontSize: 13, marginLeft: 10 }}>{order.date}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={S.badge(sc)}>{T[order.status] || order.status}</span>
            <button style={S.closeBtn} onClick={onClose}>×</button>
          </div>
        </div>
        <div style={S.modalBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{T.client.toUpperCase()}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{order.client}</div>
            </div>
            <div style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{T.qty.toUpperCase()} · {T.total.toUpperCase()}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{order.items.reduce((s, i) => s + i.qty, 0)} <span style={{ color: C.muted, fontWeight: 400 }}>pcs</span> · <span style={{ color: C.accent }}>${order.total.toLocaleString()}</span></div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 6 }}>{T.product.toUpperCase()}</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ ...S.table, fontSize: 13 }}>
                <thead><tr>
                  <th style={{ ...S.th, fontSize: 10 }}>{T.model}</th>
                  <th style={{ ...S.th, fontSize: 10, textAlign: "right" }}>{T.qty}</th>
                  <th style={{ ...S.th, fontSize: 10, textAlign: "right" }}>{T.unitPrice}</th>
                  <th style={{ ...S.th, fontSize: 10, textAlign: "right" }}>{T.total}</th>
                </tr></thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ ...S.td, padding: "7px 10px", fontWeight: 600, color: C.accent }}>{item.product}</td>
                      <td style={{ ...S.td, padding: "7px 10px", textAlign: "right" }}>{item.qty}</td>
                      <td style={{ ...S.td, padding: "7px 10px", textAlign: "right", color: C.muted }}>${item.unitPrice}</td>
                      <td style={{ ...S.td, padding: "7px 10px", textAlign: "right", fontWeight: 700 }}>${(item.qty * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            <div style={S.infoBox(C.accent)}><div style={{ fontSize: 11, color: C.muted }}>{T.total}</div><div style={{ fontWeight: 700, fontSize: 16 }}>${order.total.toLocaleString()}</div></div>
            <div style={S.infoBox(C.green)}><div style={{ fontSize: 11, color: C.muted }}>{T.cashPaid}</div><div style={{ fontWeight: 700, fontSize: 16, color: C.green }}>${order.cashPaid.toLocaleString()}</div></div>
            <div style={S.infoBox(C.cyan)}><div style={{ fontSize: 11, color: C.muted }}>{T.wirePaid}</div><div style={{ fontWeight: 700, fontSize: 16, color: C.cyan }}>${order.wirePaid.toLocaleString()}</div></div>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 5 }}>{T.paymentProgress} · {pct}% · {T.remaining}: <span style={{ color: C.red, fontWeight: 700 }}>${remaining.toLocaleString()}</span></div>
          <div style={{ height: 10, borderRadius: 5, background: C.border, display: "flex", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ width: `${cashPct}%`, background: C.green }} />
            <div style={{ width: `${wirePct}%`, background: C.cyan }} />
          </div>

          {showPay ? (
            <div style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>{T.addPaymentTitle}</div>
              <div style={S.col}>
                <div>
                  <label style={S.label}>{T.paymentType}</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["cash", T.cash], ["wire", T.wire]].map(([k, label]) => (
                      <button key={k} onClick={() => setPayType(k)}
                        style={{ ...S.btn(k === "cash" ? C.green : C.cyan), fontWeight: payType === k ? 700 : 400, flex: 1 }}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={S.label}>{T.paymentAmount}</label>
                  <input style={S.input} type="number" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                </div>
                <div>
                  <label style={S.label}>{T.paymentDate}</label>
                  <input style={S.input} type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={S.btnPrimary} onClick={handlePaySave}>{T.save}</button>
                  <button style={S.btn(C.muted)} onClick={() => setShowPay(false)}>{T.cancel}</button>
                </div>
              </div>
            </div>
          ) : null}

          <div style={S.divider} />
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 500 }}>{T.docLang}</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[["uz","🇺🇿 UZ"],["ru","🇷🇺 RU"],["zh","🇨🇳 ZH"]].map(([k,v]) => (
              <button key={k} onClick={() => setDocLang(k)} style={{ ...S.btnSm(C.accent), fontWeight: docLang === k ? 700 : 400, opacity: docLang === k ? 1 : 0.55 }}>{v}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button style={S.btnPrimary}>📄 {TDoc.generateInvoice}</button>
            <button style={S.btn(C.cyan)}>📋 {TDoc.generateContract}</button>
            <button style={S.btn(C.yellow)}>📊 {TDoc.generatePL}</button>
            <button style={S.btn(C.green)} onClick={() => setShowPay(true)}>💳 {T.addPayment}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEW ORDER MODAL ──────────────────────────────────────────
function NewOrderModal({ clients, orders, onClose, onSave }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [items, setItems] = useState([{ product: ALL_PRODUCTS[0].code, qty: "" }]);
  const client = clients.find(c => c.id === Number(clientId));

  const addItem = () => setItems(prev => [...prev, { product: ALL_PRODUCTS[0].code, qty: "" }]);
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const enrichedItems = items.map(item => ({
    ...item,
    unitPrice: client?.prices[item.product] ?? 0,
    subtotal: Math.round((parseFloat(item.qty) || 0) * (client?.prices[item.product] ?? 0)),
  }));
  const total = enrichedItems.reduce((s, i) => s + i.subtotal, 0);

  const handleSave = () => {
    const validItems = enrichedItems.filter(i => parseInt(i.qty) > 0);
    if (!clientId || validItems.length === 0) return;
    const newOrder = {
      id: (() => {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const seq = String(orders.length + 1).padStart(3, "0");
        return `NW${yy}${mm}${seq}`;
      })(),
      client: client.name,
      items: validItems.map(i => ({ product: i.product, qty: parseInt(i.qty), unitPrice: i.unitPrice })),
      total,
      cashPaid: 0,
      wirePaid: 0,
      status: "unpaid",
      date: new Date().toISOString().slice(0, 10),
    };
    onSave(newOrder);
    onClose();
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{T.newOrderTitle}</div>
          <button style={S.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={S.modalBody}>
          <div style={S.col}>
            <div>
              <label style={S.label}>{T.client}</label>
              <select style={S.select} value={clientId} onChange={e => setClientId(e.target.value)}>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ ...S.label, marginBottom: 0 }}>{T.product}</label>
                <button style={S.btnSm(C.accent)} onClick={addItem}>{T.addProduct}</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((item, idx) => {
                  const unitPrice = client?.prices[item.product] ?? 0;
                  const subtotal = Math.round((parseFloat(item.qty) || 0) * unitPrice);
                  return (
                    <div key={idx} style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>#{idx + 1}</span>
                        {items.length > 1 && (
                          <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", color: C.red, fontSize: 14, cursor: "pointer", padding: "0 4px" }}>✕</button>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "end" }}>
                        <div>
                          <label style={S.label}>{T.selectProduct}</label>
                          <select style={S.select} value={item.product} onChange={e => updateItem(idx, "product", e.target.value)}>
                            <optgroup label={T.aluminum}>{PRODUCTS_ALUM.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}</optgroup>
                            <optgroup label={T.bimetal}>{PRODUCTS_BIMETAL.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}</optgroup>
                          </select>
                        </div>
                        <div style={{ minWidth: 80 }}>
                          <label style={S.label}>{T.qty}</label>
                          <input style={S.input} type="number" placeholder="0" value={item.qty} onChange={e => updateItem(idx, "qty", e.target.value)} />
                        </div>
                      </div>
                      {item.qty && (
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <div style={{ ...S.infoBox(C.muted), flex: 1, padding: "6px 10px" }}>
                            <div style={{ fontSize: 10, color: C.muted }}>{T.unitPrice}</div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>${unitPrice}</div>
                          </div>
                          <div style={{ ...S.infoBox(C.accent), flex: 1, padding: "6px 10px" }}>
                            <div style={{ fontSize: 10, color: C.muted }}>{T.total}</div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: C.accent }}>${subtotal.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {total > 0 && (
              <div style={{ ...S.infoBox(C.accent), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{T.total}</span>
                <span style={{ fontWeight: 700, fontSize: 20, color: C.accent }}>${total.toLocaleString()}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnPrimary} onClick={handleSave}>{T.save}</button>
              <button style={S.btn(C.muted)} onClick={onClose}>{T.cancel}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────
function Dashboard({ orders, clients, shipments }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalPaid = orders.reduce((s, o) => s + o.cashPaid + o.wirePaid, 0);
  const totalDebt = clients.reduce((s, c) => s + c.cashDebt + c.wireDebt, 0);
  const active = shipments.filter(s => s.status !== "arrived").length;
  const statusLabel = { ordered: T.ordered, in_transit: T.inTransit, customs: T.atCustoms, arrived: T.arrived };
  return (
    <div>
      <div style={S.pageTitle}>{T.dashboard}</div>
      <div style={S.subtitle}>{T.factoryOverview} — 2026</div>
      <div style={S.grid4}>
        {[
          { label: T.totalRevenue, value: `$${(totalRevenue/1000).toFixed(0)}K`, sub: `${orders.length} ${T.orders_count}`, color: C.accent },
          { label: T.totalCollected, value: `$${(totalPaid/1000).toFixed(0)}K`, sub: `${totalRevenue ? Math.round(totalPaid/totalRevenue*100) : 0}% ${T.collected}`, color: C.green },
          { label: T.totalDebt, value: `$${(totalDebt/1000).toFixed(0)}K`, sub: "Cash + Wire", color: C.red },
          { label: T.activeShipments, value: active, sub: T.enRoute, color: C.yellow },
        ].map((s, i) => (
          <div key={i} style={S.statCard(s.color)}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, borderRadius: "0 16px 0 50px", background: `${s.color}12` }} />
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statValue(s.color)}>{s.value}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={S.sectionTitle}>{T.recentOrders}</div>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{[T.orderId, T.client, T.product, T.total, T.progress, T.status].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.slice(0, 5).map(o => {
                const pct = Math.round((o.cashPaid + o.wirePaid) / o.total * 100);
                const sc = o.status === "paid" ? C.green : o.status === "partial" ? C.yellow : C.red;
                return (<tr key={o.id}>
                  <td style={S.td}><span style={{ color: C.accent, fontWeight: 700 }}>{o.id}</span></td>
                  <td style={S.td}>{o.client}</td>
                  <td style={S.td}><span style={{ color: C.muted, fontSize: 12 }}>{o.product}</span></td>
                  <td style={S.td}><strong>${o.total.toLocaleString()}</strong></td>
                  <td style={{ ...S.td, minWidth: 80 }}>
                    <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}>{pct}%</div>
                    <div style={S.progress()}><div style={S.progressFill(pct, sc)} /></div>
                  </td>
                  <td style={S.td}><span style={S.badge(sc)}>{T[o.status] || o.status}</span></td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.sectionTitle}>{T.incomingShipments}</div>
        {shipments.map(s => {
          const sc = s.status === "arrived" ? C.green : s.status === "in_transit" ? C.accent : s.status === "customs" ? C.yellow : C.muted;
          return (<div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontWeight: 700 }}>{s.id} · <span style={{ color: C.muted, fontWeight: 400 }}>{s.from}</span></div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{s.items}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
              <span style={S.badge(sc)}>{statusLabel[s.status]}</span>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>ETA {s.eta}</div>
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}

// ─── ORDERS ──────────────────────────────────────────────────
function Orders({ orders, setOrders, clients }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState(null);

  const allClients = [...new Set(orders.map(o => o.client))].sort();
  const allProducts = [...new Set(orders.flatMap(o => o.items.map(i => i.product)))].sort();

  const filtered = orders.filter(o => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (filterClient !== "all" && o.client !== filterClient) return false;
    if (filterProduct !== "all" && !o.items.some(i => i.product === filterProduct)) return false;
    return true;
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handlePaymentSaved = (orderId, type, amount) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id !== orderId) return o;
        const newCash = type === "cash" ? o.cashPaid + amount : o.cashPaid;
        const newWire = type === "wire" ? o.wirePaid + amount : o.wirePaid;
        const newPaid = newCash + newWire;
        const newStatus = newPaid >= o.total ? "paid" : newPaid > 0 ? "partial" : "unpaid";
        return { ...o, cashPaid: newCash, wirePaid: newWire, status: newStatus };
      });
      save("fos_orders", updated);
      return updated;
    });
    setSelected(null);
    showToast(T.savedMsg);
  };

  const handleNewOrder = (order) => {
    setOrders(prev => { const n = [order, ...prev]; save("fos_orders", n); return n; });
    showToast(T.savedMsg);
  };

  const hdrSelect = {
    background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5,
    padding: "3px 5px", color: C.text, fontSize: 10, cursor: "pointer",
    outline: "none", maxWidth: 120, marginTop: 4, display: "block",
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onPaymentSaved={handlePaymentSaved} clients={clients} />}
      {showNew && <NewOrderModal clients={clients} orders={orders} onClose={() => setShowNew(false)} onSave={handleNewOrder} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={S.pageTitle}>{T.orders}</div>
        <button style={S.btnPrimary} onClick={() => setShowNew(true)}>{T.newOrder}</button>
      </div>
      <div style={S.subtitle}>{T.clickRow}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {[["all", C.accent], ["paid", C.green], ["partial", C.yellow], ["unpaid", C.red]].map(([f, col]) => (
          <button key={f} onClick={() => setFilterStatus(f)} style={{ ...S.btn(col), fontWeight: filterStatus === f ? 700 : 500, opacity: filterStatus === f ? 1 : 0.65 }}>{T[f]}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", color: C.muted, padding: 40 }}>{T.noOrders}</div>
      ) : (
        <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>{T.orderId}</th>
                  <th style={S.th}>
                    {T.client}
                    <select style={hdrSelect} value={filterClient} onChange={e => setFilterClient(e.target.value)} onClick={e => e.stopPropagation()}>
                      <option value="all">{T.allClients}</option>
                      {allClients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </th>
                  <th style={S.th}>
                    {T.product}
                    <select style={hdrSelect} value={filterProduct} onChange={e => setFilterProduct(e.target.value)} onClick={e => e.stopPropagation()}>
                      <option value="all">{T.allProducts}</option>
                      {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </th>
                  <th style={S.th}>{T.qty}</th>
                  <th style={S.th}>{T.total}</th>
                  <th style={S.th}>{T.cashPaid}</th>
                  <th style={S.th}>{T.wirePaid}</th>
                  <th style={S.th}>{T.remaining}</th>
                  <th style={S.th}>{T.progress}</th>
                  <th style={S.th}>
                    {T.status}
                    <select style={hdrSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} onClick={e => e.stopPropagation()}>
                      <option value="all">{T.all}</option>
                      <option value="paid">{T.paid}</option>
                      <option value="partial">{T.partial}</option>
                      <option value="unpaid">{T.unpaid}</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const paid = o.cashPaid + o.wirePaid;
                  const pct = Math.round(paid / o.total * 100);
                  const cp = Math.round(o.cashPaid / o.total * 100);
                  const wp = Math.round(o.wirePaid / o.total * 100);
                  const rem = o.total - paid;
                  const sc = o.status === "paid" ? C.green : o.status === "partial" ? C.yellow : C.red;
                  const totalQty = o.items.reduce((s, i) => s + i.qty, 0);
                  return (<tr key={o.id} onClick={() => setSelected(o)} style={{ cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = `${C.accent}08`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ ...S.td, paddingLeft: 16 }}><span style={{ color: C.accent, fontWeight: 700 }}>{o.id}</span><div style={{ fontSize: 11, color: C.muted }}>{o.date}</div></td>
                    <td style={S.td}>{o.client}</td>
                    <td style={S.td}>
                      <span style={{ color: C.muted, fontSize: 12 }}>{o.items[0].product}</span>
                      {o.items.length > 1 && <span style={{ fontSize: 11, color: C.accent, marginLeft: 4, fontWeight: 600 }}>+{o.items.length - 1} {T.models}</span>}
                    </td>
                    <td style={S.td}>{totalQty}</td>
                    <td style={S.td}><strong>${o.total.toLocaleString()}</strong></td>
                    <td style={S.td}><span style={{ color: C.green, fontWeight: 600 }}>${o.cashPaid.toLocaleString()}</span></td>
                    <td style={S.td}><span style={{ color: C.cyan, fontWeight: 600 }}>${o.wirePaid.toLocaleString()}</span></td>
                    <td style={S.td}><span style={{ color: rem > 0 ? C.red : C.green, fontWeight: 600 }}>${rem.toLocaleString()}</span></td>
                    <td style={{ ...S.td, minWidth: 80 }}>
                      <div style={{ fontSize: 11, marginBottom: 3, fontWeight: 600 }}>{pct}%</div>
                      <div style={{ height: 5, borderRadius: 3, background: C.border, display: "flex", overflow: "hidden", width: 70 }}>
                        <div style={{ width: `${cp}%`, background: C.green }} />
                        <div style={{ width: `${wp}%`, background: C.cyan }} />
                      </div>
                    </td>
                    <td style={{ ...S.td, paddingRight: 16 }}><span style={S.badge(sc)}>{T[o.status] || o.status}</span></td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEBTS ───────────────────────────────────────────────────
function Debts({ clients }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [filterClient, setFilterClient] = useState("all");
  const shown = filterClient === "all" ? clients : clients.filter(c => c.name === filterClient);
  const totalCash = shown.reduce((s, c) => s + c.cashDebt, 0);
  const totalWire = shown.reduce((s, c) => s + c.wireDebt, 0);
  return (
    <div>
      <div style={S.pageTitle}>{T.debtsTitle}</div>
      <div style={S.subtitle}>{T.debtsSubtitle}</div>
      <div style={S.grid2}>
        <div style={S.statCard(C.green)}><div style={S.statLabel}>{T.totalCashDebt}</div><div style={S.statValue(C.green)}>${totalCash.toLocaleString()}</div></div>
        <div style={S.statCard(C.cyan)}><div style={S.statLabel}>{T.totalWireDebt}</div><div style={S.statValue(C.cyan)}>${totalWire.toLocaleString()}</div></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>{T.filterClient}</label>
        <select style={S.select} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
          <option value="all">{T.allClients}</option>
          {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      {shown.map(c => {
        const total = c.cashDebt + c.wireDebt;
        if (total === 0) return (
          <div key={c.id} style={{ ...S.card, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontWeight: 700, fontSize: L ? 16 : 14 }}>{c.name}</div><div style={{ fontSize: 13, color: C.muted }}>{c.country}</div></div>
              <span style={S.badge(C.green)}>{T.noDebt}</span>
            </div>
          </div>
        );
        return (
          <div key={c.id} style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div><div style={{ fontWeight: 700, fontSize: L ? 17 : 15 }}>{c.name}</div><div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{c.country}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, color: C.red, fontSize: L ? 20 : 17 }}>${total.toLocaleString()}</div><div style={{ fontSize: 12, color: C.muted }}>{T.totalDebtLabel}</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={S.infoBox(C.green)}><div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{T.cashDebt}</div><div style={{ fontWeight: 700, color: C.green, fontSize: L ? 20 : 17 }}>${c.cashDebt.toLocaleString()}</div></div>
              <div style={S.infoBox(C.cyan)}><div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{T.wireDebt}</div><div style={{ fontWeight: 700, color: C.cyan, fontSize: L ? 20 : 17 }}>${c.wireDebt.toLocaleString()}</div></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={S.btn(C.accent)}>{T.viewOrders}</button>
              <button style={S.btn(C.muted)}>{T.exportBtn}</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SHIPMENTS ───────────────────────────────────────────────
function Shipments({ shipments, setShipments }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ from: "", items: "", eta: "", status: "ordered" });
  const [toast, setToast] = useState(null);
  const statusMeta = {
    ordered: { color: C.muted, label: T.ordered, icon: "📦" },
    in_transit: { color: C.accent, label: T.inTransit, icon: "🚢" },
    customs: { color: C.yellow, label: T.atCustoms, icon: "🛃" },
    arrived: { color: C.green, label: T.arrived, icon: "✅" },
  };

  const handleAdd = () => {
    if (!form.from || !form.items) return;
    const newS = { id: "SHP-" + Date.now().toString().slice(-4), ...form };
    setShipments(prev => { const n = [newS, ...prev]; save("fos_shipments", n); return n; });
    setForm({ from: "", items: "", eta: "", status: "ordered" });
    setShowAdd(false);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  const cycleStatus = (id) => {
    const cycle = ["ordered", "in_transit", "customs", "arrived"];
    setShipments(prev => {
      const n = prev.map(s => s.id === id ? { ...s, status: cycle[(cycle.indexOf(s.status) + 1) % cycle.length] } : s);
      save("fos_shipments", n); return n;
    });
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={S.pageTitle}>{T.shipments}</div>
        <button style={S.btnPrimary} onClick={() => setShowAdd(!showAdd)}>{T.addShipment}</button>
      </div>
      <div style={S.subtitle}>{T.incomingMaterials}</div>
      {showAdd && (
        <div style={{ ...S.card, marginBottom: 14, border: `2px solid ${C.accent}60` }}>
          <div style={S.sectionTitle}>{T.newShipment}</div>
          <div style={S.col}>
            <div><label style={S.label}>{T.originCountry}</label><input style={S.input} placeholder="e.g. China, Turkey..." value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} /></div>
            <div><label style={S.label}>{T.items}</label><input style={S.input} placeholder="Aluminum billets, fittings..." value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} /></div>
            <div style={S.grid2}>
              <div><label style={S.label}>{T.eta}</label><input style={S.input} type="date" value={form.eta} onChange={e => setForm(f => ({ ...f, eta: e.target.value }))} /></div>
              <div><label style={S.label}>{T.statusLabel}</label>
                <select style={S.select} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="ordered">{T.ordered}</option>
                  <option value="in_transit">{T.inTransit}</option>
                  <option value="customs">{T.atCustoms}</option>
                  <option value="arrived">{T.arrived}</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnPrimary} onClick={handleAdd}>{T.save}</button>
              <button style={S.btn(C.muted)} onClick={() => setShowAdd(false)}>{T.cancel}</button>
            </div>
          </div>
        </div>
      )}
      {shipments.map(s => {
        const meta = statusMeta[s.status] || statusMeta.ordered;
        return (
          <div key={s.id} style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: L ? 26 : 22 }}>{meta.icon}</span>
                <div><div style={{ fontWeight: 700, color: C.accent, fontSize: L ? 16 : 14 }}>{s.id}</div><div style={{ fontSize: 13, color: C.muted }}>{s.from}</div></div>
              </div>
              <span style={S.badge(meta.color)}>{meta.label}</span>
            </div>
            <div style={{ fontSize: L ? 15 : 13, marginBottom: 8 }}>{s.items}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{T.eta}: <strong style={{ color: C.text }}>{s.eta || "—"}</strong></div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={S.btn(C.accent)} onClick={() => cycleStatus(s.id)}>{T.updateStatus} →</button>
              <button style={S.btn(C.muted)}>{T.genDoc}</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CLIENTS ─────────────────────────────────────────────────
function Clients({ clients, setClients }) {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [editingId, setEditingId] = useState(null);
  const [editPrices, setEditPrices] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [showPL, setShowPL] = useState(false);
  const [plTab, setPlTab] = useState("alum");
  const [toast, setToast] = useState(null);

  const startEdit = (c) => { setEditingId(c.id); setEditPrices({ ...c.prices }); setExpandedId(c.id); };
  const saveEdit = (id) => {
    setClients(prev => { const n = prev.map(c => c.id === id ? { ...c, prices: { ...editPrices } } : c); save("fos_clients", n); return n; });
    setEditingId(null);
    setToast(T.savedMsg); setTimeout(() => setToast(null), 2000);
  };

  return (
    <div>
      {toast && <Toast msg={toast} />}
      {showPL && <PricelistModal clients={clients} onClose={() => setShowPL(false)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={S.pageTitle}>{T.clientsTitle}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn(C.yellow)} onClick={() => setShowPL(true)}>{T.genPricelist}</button>
          <button style={S.btnPrimary}>{T.addClient}</button>
        </div>
      </div>
      <div style={S.subtitle}>{T.clientsSubtitle}</div>
      {clients.map(c => {
        const isEditing = editingId === c.id;
        const isExpanded = expandedId === c.id;
        const prods = plTab === "alum" ? PRODUCTS_ALUM : PRODUCTS_BIMETAL;
        return (
          <div key={c.id} style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandedId(isExpanded && !isEditing ? null : c.id)}>
              <div>
                <div style={{ fontWeight: 700, fontSize: L ? 17 : 15 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{c.country}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {!isEditing && <button style={S.btnSm(C.accent)} onClick={e => { e.stopPropagation(); startEdit(c); }}>{T.editPrices}</button>}
                <span style={{ color: C.muted, fontSize: 16 }}>{isExpanded ? "▲" : "▼"}</span>
              </div>
            </div>
            {isExpanded && (
              <div style={{ marginTop: 14 }}>
                <div style={S.divider} />
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[["alum", T.aluminum, C.yellow], ["bimetal", T.bimetal, C.cyan]].map(([k, label, col]) => (
                    <button key={k} onClick={() => setPlTab(k)} style={{ ...S.btnSm(col), fontWeight: plTab === k ? 700 : 400, opacity: plTab === k ? 1 : 0.6 }}>{label}</button>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 10, fontWeight: 500 }}>{isEditing ? T.editingPrices : T.currentPrices}</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ ...S.table, marginBottom: 12 }}>
                    <thead><tr>
                      <th style={S.th}>{T.model}</th>
                      <th style={{ ...S.th, textAlign: "right" }}>{T.cashPrice} ($)</th>
                      <th style={{ ...S.th, textAlign: "right" }}>{T.wirePrice} ($)</th>
                      {isEditing && <th style={{ ...S.th, textAlign: "center" }}>New ($)</th>}
                    </tr></thead>
                    <tbody>
                      {prods.map(p => {
                        const cash = isEditing ? (editPrices[p.code] ?? c.prices[p.code]) : c.prices[p.code];
                        const wire = (cash * (1 + TAX_RATE)).toFixed(2);
                        return (<tr key={p.code}>
                          <td style={S.td}><span style={{ fontWeight: 600 }}>{p.code}</span></td>
                          <td style={{ ...S.td, textAlign: "right" }}>
                            {isEditing ? <span style={{ color: C.muted, textDecoration: "line-through", fontSize: 12 }}>${c.prices[p.code]}</span> : <span style={{ fontWeight: 700, color: C.green }}>${cash}</span>}
                          </td>
                          <td style={{ ...S.td, textAlign: "right", color: C.cyan, fontWeight: 700 }}>${wire}</td>
                          {isEditing && <td style={{ ...S.td, textAlign: "center" }}>
                            <input style={S.inputSm} type="number" value={editPrices[p.code] ?? c.prices[p.code]}
                              onChange={e => setEditPrices(prev => ({ ...prev, [p.code]: parseFloat(e.target.value) || 0 }))} />
                          </td>}
                        </tr>);
                      })}
                    </tbody>
                  </table>
                </div>
                {isEditing
                  ? <div style={{ display: "flex", gap: 8 }}><button style={S.btnPrimary} onClick={() => saveEdit(c.id)}>{T.savePrices}</button><button style={S.btn(C.muted)} onClick={() => setEditingId(null)}>{T.cancel}</button></div>
                  : <div style={{ display: "flex", gap: 8 }}><button style={S.btn(C.muted)}>{T.exportPricelist}</button><button style={S.btn(C.yellow)}>{T.viewOrders}</button></div>
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PRODUCTS ────────────────────────────────────────────────
function Products() {
  const C = useC(); const T = useT(); const L = C.bg === LIGHT.bg; const S = mk(C, L);
  const [tab, setTab] = useState("alum");
  const prods = tab === "alum" ? PRODUCTS_ALUM : PRODUCTS_BIMETAL;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={S.pageTitle}>{T.productsTitle}</div>
        <button style={S.btnPrimary}>{T.addModel}</button>
      </div>
      <div style={S.subtitle}>{T.productsSubtitle}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["alum", T.aluminum, C.yellow], ["bimetal", T.bimetal, C.cyan]].map(([k, label, col]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...S.btn(col), fontWeight: tab === k ? 700 : 500, opacity: tab === k ? 1 : 0.65 }}>{label} ({k === "alum" ? PRODUCTS_ALUM.length : PRODUCTS_BIMETAL.length})</button>
        ))}
      </div>
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{["№", T.model, T.rawWeight + "/KG", T.singleWeight + "/KG", T.specMm, T.actualMm, T.heatKw].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {prods.map((p, i) => (
                <tr key={p.code} onMouseEnter={e => e.currentTarget.style.background = `${C.accent}08`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...S.td, paddingLeft: 16, color: C.muted }}>{i + 1}</td>
                  <td style={S.td}><span style={{ fontWeight: 700, color: C.accent }}>{p.code}</span></td>
                  <td style={S.td}>{p.raw}</td>
                  <td style={S.td}>{p.single}</td>
                  <td style={S.td}><span style={{ color: C.muted }}>{p.spec}</span></td>
                  <td style={S.td}><span style={{ color: C.muted }}>{p.actual}</span></td>
                  <td style={{ ...S.td, paddingRight: 16 }}>{p.heat ? <span style={{ color: C.yellow, fontWeight: 600 }}>{p.heat}W</span> : <span style={{ color: C.border }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────
const TABS_DEF = ["dashboard", "orders", "debts", "shipments", "clients", "products"];
const TAB_ICONS = { dashboard: "⬡", orders: "📋", debts: "💰", shipments: "🚢", clients: "🤝", products: "📡" };
const LANG_OPTIONS = [["uz", "🇺🇿 O'zbek"], ["ru", "🇷🇺 Русский"], ["zh", "🇨🇳 中文"]];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [isLight, setIsLight] = useState(true);
  const [lang, setLang] = useState("uz");
  const [langOpen, setLangOpen] = useState(false);
  const [orders, setOrders] = useState(() => normalizeOrders(load("fos_orders", DEFAULT_ORDERS)));
  const [clients, setClients] = useState(() => load("fos_clients", DEFAULT_CLIENTS));
  const [shipments, setShipments] = useState(() => load("fos_shipments", DEFAULT_SHIPMENTS));
  const dropdownRef = useRef(null);

  const C = isLight ? LIGHT : DARK;
  const T = TRANSLATIONS[lang];
  const S = mk(C, isLight);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pages = {
    dashboard: <Dashboard orders={orders} clients={clients} shipments={shipments} />,
    orders: <Orders orders={orders} setOrders={setOrders} clients={clients} />,
    debts: <Debts clients={clients} />,
    shipments: <Shipments shipments={shipments} setShipments={setShipments} />,
    clients: <Clients clients={clients} setClients={setClients} />,
    products: <Products />,
  };

  return (
    <LangCtx.Provider value={lang}>
      <ThemeCtx.Provider value={C}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
        <div style={S.app}>
          <div style={S.topbar}>
            <div style={S.logo}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect width="22" height="22" rx="6" fill={`${C.accent}20`} />
                <path d="M5 17L9 7L13 13L16 9L18 12" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              FactoryOS
            </div>
            <div style={S.topRight}>
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button onClick={() => setLangOpen(o => !o)}
                  style={{ background: isLight ? "#e8edf8" : "#ffffff15", border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 13, cursor: "pointer", color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                  {LANG_OPTIONS.find(([k]) => k === lang)?.[1] ?? lang}
                  <span style={{ fontSize: 10, opacity: 0.6 }}>{langOpen ? "▲" : "▼"}</span>
                </button>
                {langOpen && (
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 4px 20px #00000020", zIndex: 300, minWidth: 140, overflow: "hidden" }}>
                    {LANG_OPTIONS.map(([k, label]) => (
                      <div key={k} onClick={() => { setLang(k); setLangOpen(false); }}
                        style={{ padding: "10px 16px", fontSize: 13, cursor: "pointer", fontWeight: lang === k ? 700 : 400, color: lang === k ? C.accent : C.text, background: lang === k ? `${C.accent}10` : "transparent", borderBottom: `1px solid ${C.border}` }}>
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button style={{ background: isLight ? "#e8edf8" : "#ffffff15", border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 11px", fontSize: 13, cursor: "pointer", color: C.text }} onClick={() => setIsLight(!isLight)}>
                {isLight ? "🌙" : "☀️"}
              </button>
              <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
                Admin
              </div>
            </div>
          </div>
          <div style={S.navBar}>
            <div style={S.nav}>
              {TABS_DEF.map(t => (
                <button key={t} style={S.navBtn(tab === t)} onClick={() => setTab(t)}>
                  {TAB_ICONS[t]} {T[t]}
                </button>
              ))}
            </div>
          </div>
          <div style={S.main}>{pages[tab]}</div>
        </div>
      </ThemeCtx.Provider>
    </LangCtx.Provider>
  );
}
