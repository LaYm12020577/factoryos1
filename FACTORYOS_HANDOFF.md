# FactoryOS — Complete Project Handoff Document

> **Version:** UI Demo v5 (React JSX single-file prototype)
> **Last updated:** April 2026
> **Status:** UI prototype complete. Backend not yet built.

---

## 1. Project Overview

### Purpose
FactoryOS is a factory management system for a **radiator manufacturing factory** based in Uzbekistan. It manages the full operational workflow: order tracking, payment collection, client debt calculation, incoming material shipments, document generation (invoices, contracts, pricelists), and product catalog.

### Target Users
- **Factory employees** in Uzbekistan (Uzbek/Russian speakers, some older and less tech-savvy)
- **International clients** and partners in China (Chinese speakers)
- Up to **20 internal users** with role-based access
- Accessed via **web browser** on both desktop and mobile

### Core Idea
The factory sells aluminum and bimetal radiators to ~10 clients. Each client has a **custom price per product model**. Payments are split between **cash** and **wire transfer** — wire transfer prices are ~10% higher due to tax. The system must track these separately, auto-calculate debts, generate documents (invoice/PI/PL/contract) in the client's language with one click, and track incoming material shipments from China, Turkey, South Korea, etc.

---

## 2. Features Implemented (UI Demo)

### ✅ Dashboard
- 4 KPI stat cards: Total Revenue, Total Collected, Total Debt, Active Shipments
- Recent orders table with payment progress bars (green=cash, cyan=wire)
- Incoming shipments list with status badges

### ✅ Orders Tab
- Full table view of all orders (compact, like a spreadsheet)
- Columns: Order ID, Client, Product, Qty, Total, Cash Paid, Wire Paid, Remaining, Progress bar, Status
- Filter buttons: All / Paid / Partial / Unpaid
- **Click any row** → opens Order Modal

### ✅ Order Modal (popup)
- Shows full order breakdown: client, product, qty
- 3 info boxes: Total, Cash Paid, Wire Paid
- Dual-color progress bar (green=cash portion, cyan=wire portion)
- Remaining balance in red
- **Document language picker** (UZ/RU/ZH) — independent from UI language
- 4 action buttons: Generate Invoice, Generate Contract, Generate PL, Add Payment
- Close by clicking outside or × button

### ✅ Debts Tab
- Summary cards: Total Cash Debt, Total Wire Debt
- Per-client cards showing cash debt and wire debt separately
- Filter by client dropdown
- Clients with zero debt shown with green "No Debt" badge

### ✅ Shipments Tab
- Cards for each incoming material shipment
- Status: Ordered → In Transit → At Customs → Arrived
- Each card shows: shipment ID, origin country, items, ETA, status badge
- "Add Shipment" form with fields: origin country, items, ETA, status
- Buttons: Update Status, Generate Doc

### ✅ Clients Tab
- Per-client collapsible cards
- Expand → shows pricelist table with Aluminum / Bimetal tab switcher
- Columns: Model, Cash Price ($), Wire Price (auto = cash × 1.10)
- **Edit Prices** button → inline editing with number inputs
  - Old price shown with strikethrough during edit
  - Save / Cancel buttons
  - Wire price updates automatically
- Export Pricelist button (UI only, no backend)
- **"Generate Pricelist" button** (top right) → opens Pricelist Modal

### ✅ Pricelist Modal
- Select client from dropdown
- Warning note: "Wire price = cash + 10% tax"
- Preview table split into two sections: Aluminum (17 models) and Bimetal (12 models)
- Columns: №, Model, Raw Weight/KG, Single Weight/KG, Cash Price ($), Wire Price ($), Spec mm, Heat/KW
- Buttons: Generate Excel, Generate PNG (UI only, no backend yet)

### ✅ Products Tab
- Tab switcher: Aluminum (17) / Bimetal (12)
- Full table: №, Model code, Raw weight, Single weight, Spec mm, Actual size mm, Heat dissipation KW
- Heat values shown in yellow, missing values shown as "—"
- All 29 real product models from client's actual pricelist

### ✅ Internationalization (i18n)
- 3 languages: **Uzbek (uz)**, Russian (ru), Chinese (zh)
- **Default: Uzbek**
- Language dropdown in topbar (flag + name, chevron)
- Switching language updates: all nav tabs, all page titles, all labels, all buttons, all table headers, all badges
- Document language in Order Modal is **independent** from UI language (can generate Russian doc while UI is in Uzbek)

### ✅ Light / Dark Theme
- **Default: Light mode**
- Toggle button in topbar (☀️ / 🌙)
- Light mode: white cards, soft gray background, stronger borders, larger fonts — designed for older users
- Dark mode: deep navy/dark blue background, glowing accent colors
- ALL components respond to theme via `useC()` context hook

### ✅ Responsive Layout
- Max width 900px, centered
- Horizontal scroll on tables for mobile
- Sticky topbar
- Scrollable nav tabs (no wrapping)

---

## 3. Features Planned / TODO

### 🔲 Backend (Not built yet)
- **FastAPI** (Python) REST API
- **PostgreSQL** database
- JWT authentication with bcrypt passwords
- Role-based access control (see roles below)

### 🔲 Real Order Creation
- Form to create new order: select client, select product(s), enter qty
- Auto-fills unit price from client's pricelist
- Set payment type per order: cash / wire / split (50/50)
- Order gets assigned cash_total and wire_total at creation

### 🔲 Real Payment Logging
- "Add Payment" button in order modal should open a form
- Fields: amount, type (cash or wire), date, confirmed by (accountant name)
- Updates order status automatically (unpaid → partial → paid)

### 🔲 Order Import from Excel/Text
- Upload .xlsx file with orders
- System parses rows, maps to clients and products
- Preview table before confirming import

### 🔲 Real Debt Calculation
- Debt = sum of (order cash_total - cash_paid) per client = cash debt
- Debt = sum of (order wire_total - wire_paid) per client = wire debt
- Filterable by: client, date range, sales rep, overdue flag
- "Груз на наличие" = orders tagged as cash orders
- "Груз на банк" = orders tagged as wire/bank orders
- Client debt sheet sample is pending from client — will implement exact format once received

### 🔲 Real Document Generation
- Invoice (PI): fill Word/PDF template with order data, client info, product table, prices
- Contract: fill contract template with client-specific terms and prices
- Pricelist (PL): generate Excel or PNG matching the factory's existing pricelist format (bilingual header: Chinese + local language, two sections: Aluminum / Bimetal)
- Templates will be provided by client (Word .docx format)
- Backend: WeasyPrint or ReportLab for PDF, openpyxl for Excel, Pillow for PNG

### 🔲 Real Pricelist Export
- Excel: two-sheet workbook (Aluminum, Bimetal) matching PNG format
- PNG: rendered table with bilingual header, date, factory name
- Format reference: "乌兹纳瓦斯售乌兹出厂价(2026年3月9日) / Uzbekistan Nawas-price list for Uzbekistan EXW price 2026/3/9"

### 🔲 Authentication & Role System
Roles planned:
| Role | Permissions |
|---|---|
| Super Admin | Everything including user management |
| Admin | Everything except user management |
| Accountant | View + log payments + generate docs |
| Sales | View + create orders + generate docs |
| Warehouse | View + manage shipments |
| Read-only | View only, no edits |
| Brigadier | TBD (future production tracking features) |

### 🔲 Security Hardening
- SQLAlchemy ORM only (no raw SQL → prevents SQLi)
- Pydantic input validation on all endpoints
- CSP headers, SameSite cookies
- Rate limiting on login endpoint
- HTTPS via nginx + Let's Encrypt

### 🔲 Shipment Document Generation
- Generate shipping tracking document for each shipment
- Fields: origin, carrier, items, weight, ETA, customs reference

### 🔲 Client Debt Summary Sheet
- Pending: client will provide sample Excel debt calculation file
- Expected: same structure as existing manual Excel sheet but auto-calculated

---

## 4. Tech Stack

### Current (UI Demo)
| Layer | Technology |
|---|---|
| UI Framework | React 18 (JSX) |
| Build | Vite (implied, single .jsx file) |
| Styling | Inline styles via `mk(C, L)` style factory function |
| State | React `useState`, `createContext`, `useContext` |
| Fonts | Google Fonts: DM Sans, Space Grotesk |
| i18n | Custom `TRANSLATIONS` object + `LangCtx` context |
| Theme | Custom `DARK`/`LIGHT` token objects + `ThemeCtx` context |
| No libraries | No Tailwind, no Ant Design, no external UI lib |

### Planned (Full Stack)
| Layer | Technology | Reason |
|---|---|---|
| Backend | Python + FastAPI | Async, auto docs, wide lib support |
| Database | PostgreSQL | Multi-user, concurrent, robust |
| ORM | SQLAlchemy | Parameterized queries, prevents SQLi |
| Auth | JWT + bcrypt | Stateless, secure |
| PDF generation | WeasyPrint / ReportLab | Invoice/contract PDF from templates |
| Excel generation | openpyxl | Pricelist export, order import |
| Image generation | Pillow | PNG pricelist export |
| Frontend | React + Vite | Already designed |
| Hosting | VPS + nginx + gunicorn | Full control, ~$10/month |
| SSL | Let's Encrypt | Free HTTPS |
| Containerization | Docker + docker-compose | Easy deployment |

---

## 5. Project Structure

### Current (Single-file demo)
```
factory-demo-v5.jsx          ← Entire UI in one React file
FACTORYOS_HANDOFF.md         ← This document
```

### Planned Full Project Structure
```
factoryos/
├── backend/
│   ├── main.py                  ← FastAPI app entry point
│   ├── database.py              ← SQLAlchemy engine + session
│   ├── models/
│   │   ├── user.py              ← User, Role models
│   │   ├── client.py            ← Client, PriceList models
│   │   ├── order.py             ← Order, OrderItem, Payment models
│   │   ├── product.py           ← Product model
│   │   └── shipment.py         ← Shipment model
│   ├── routers/
│   │   ├── auth.py              ← Login, JWT endpoints
│   │   ├── orders.py            ← CRUD for orders + payments
│   │   ├── clients.py           ← CRUD for clients + pricelists
│   │   ├── products.py          ← CRUD for products
│   │   ├── shipments.py         ← CRUD for shipments
│   │   ├── debts.py             ← Debt calculation endpoints
│   │   └── documents.py        ← Invoice/contract/PL generation
│   ├── services/
│   │   ├── pdf_generator.py     ← WeasyPrint PDF from templates
│   │   ├── excel_generator.py   ← openpyxl pricelist/export
│   │   └── debt_calculator.py  ← Cash/wire debt logic
│   ├── templates/
│   │   ├── invoice_uz.docx      ← Invoice template (Uzbek)
│   │   ├── invoice_ru.docx      ← Invoice template (Russian)
│   │   ├── contract_template.docx
│   │   └── pricelist_template.xlsx
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx             ← React entry point
│   │   ├── App.jsx              ← Root component (theme + lang providers)
│   │   ├── i18n/
│   │   │   └── translations.js  ← All UZ/RU/ZH strings
│   │   ├── theme/
│   │   │   └── tokens.js        ← DARK/LIGHT color tokens
│   │   ├── styles/
│   │   │   └── mk.js            ← Style factory function
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx
│   │   │   └── LangContext.jsx
│   │   ├── data/
│   │   │   ├── products.js      ← PRODUCTS_ALUM, PRODUCTS_BIMETAL
│   │   │   └── mock.js          ← Mock orders, clients, shipments
│   │   ├── components/
│   │   │   ├── Topbar.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── OrderModal.jsx
│   │   │   └── PricelistModal.jsx
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Orders.jsx
│   │       ├── Debts.jsx
│   │       ├── Shipments.jsx
│   │       ├── Clients.jsx
│   │       └── Products.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
└── nginx.conf
```

---

## 6. Key Components / Pages

### `App` (Root)
- Holds global state: `tab`, `isLight`, `lang`, `langOpen`
- Wraps everything in `LangCtx.Provider` and `ThemeCtx.Provider`
- Renders `Topbar` with language dropdown + theme toggle
- Renders `NavBar` with 6 tab buttons
- Conditionally renders the active page component

### `Dashboard`
- Reads from `INIT_ORDERS` and `INIT_CLIENTS` to compute stats
- Renders 4 stat cards (2×2 grid on mobile)
- Renders recent orders table (first 4 orders)
- Renders incoming shipments list

### `Orders`
- Local state: `filter` (all/paid/partial/unpaid), `selected` (order object or null)
- Renders filter buttons + full orders table
- Row click → sets `selected` → renders `<OrderModal>`
- Progress bar is a flex div with two colored segments (green + cyan)

### `OrderModal`
- Props: `order`, `onClose`
- Local state: `docLang` (independent of UI lang)
- Computes `pct`, `cashPct`, `wirePct` from order data
- Renders payment breakdown, dual-color progress bar
- Renders doc language picker (UZ/RU/ZH buttons)
- 4 action buttons (no backend connection yet)

### `Debts`
- Local state: `filterClient`
- Computes `totalCash`, `totalWire` from filtered clients
- Per-client cards with cash/wire split boxes

### `Shipments`
- Local state: `showAdd` (boolean)
- Maps `statusMeta` object: status key → {color, label, icon}
- "Add Shipment" form appears/hides with showAdd toggle

### `Clients`
- Local state: `clients` (array, mutable), `editingId`, `editPrices`, `expandedId`, `showPL`, `plTab`
- Expand: click card header → toggles `expandedId`
- Edit: `startEdit(c)` copies prices to `editPrices`, `saveEdit(id)` merges back into `clients`
- Wire prices are **computed on render**: `cash * (1 + TAX_RATE)` — not stored
- Pricelist Modal: separate component `<PricelistModal>`

### `PricelistModal`
- Props: `clients`, `onClose`
- Local state: `selClient`
- Looks up selected client from `clients` array
- Renders two table sections: Aluminum, Bimetal
- Wire price computed inline: `cash * (1 + TAX_RATE)`

### `Products`
- Local state: `tab` (alum/bimetal)
- Renders compact table from `PRODUCTS_ALUM` or `PRODUCTS_BIMETAL`

---

## 7. State Management / Data Flow

### Global State (via React Context)
```
LangCtx  → current language string: "uz" | "ru" | "zh"
ThemeCtx → current color token object: DARK | LIGHT
```

Both contexts are provided at the root `<App>` level. Every component accesses them via:
```js
const C = useC();   // color tokens
const T = useT();   // translation strings for current lang
const L = C.bg === LIGHT.bg;  // boolean: is light mode?
```

### Local State (per component)
- `Orders`: filter, selected order for modal
- `Clients`: clients array (editable), editingId, editPrices, expandedId
- `Shipments`: showAdd form toggle
- `Debts`: filterClient
- `App`: tab, isLight, lang, langOpen

### Data Flow
```
INIT_CLIENTS / INIT_ORDERS / SHIPMENTS / PRODUCTS_*
       ↓ (read-only static data in demo)
  Page Components
       ↓ (computed values: totals, pct, wire prices)
  Rendered UI
       ↓ (user edits prices in Clients)
  Local useState → re-render only (no persistence in demo)
```

### Wire Price Formula
```js
const TAX_RATE = 0.10;
wire_price = cash_price * (1 + TAX_RATE)
// Wire price is NEVER stored — always computed from cash price
```

---

## 8. Styling System

### Approach: Style Factory Function
No CSS files, no Tailwind, no external library. All styles are plain JavaScript objects generated by the `mk(C, L)` function:

```js
const mk = (C, L) => ({
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: L ? 16 : 14,   // L = isLight
    padding: L ? 18 : 16,
    boxShadow: L ? C.shadow : "none",
  },
  // ...
});
```

- `C` = color token object (DARK or LIGHT)
- `L` = boolean (true = light mode)
- Light mode gets: larger padding, larger font sizes, box shadows, border accents on badges
- Dark mode gets: glow-style colored borders on stat cards, no shadows

### Color Tokens
```js
// LIGHT
{ bg: "#f0f4fb", surface: "#ffffff", card: "#ffffff",
  border: "#dce3f0", accent: "#1a6ef5", green: "#1a9e5c",
  red: "#d63c3c", yellow: "#c47d00", cyan: "#0a8fa8",
  text: "#1a2035", muted: "#6b7a99", inputBg: "#f5f7fc" }

// DARK
{ bg: "#0f1117", surface: "#181c27", card: "#1e2336",
  border: "#2a3050", accent: "#4f8ef7", green: "#2ecc8a",
  red: "#f25c5c", yellow: "#f5a623", cyan: "#38d9f5",
  text: "#e8ecf7", muted: "#7a85a3", inputBg: "#181c27" }
```

### Fonts
- **DM Sans** — body text, labels, buttons (weights: 400, 500, 600, 700)
- **Space Grotesk** — page titles, stat values, logo (weights: 600, 700)
- Loaded via Google Fonts CDN in the component

### Component Patterns
- `S.card` — standard card container
- `S.statCard(color)` — colored accent border card
- `S.btn(color)` — ghost button with color tint
- `S.btnPrimary` — solid accent blue button
- `S.btnSm(color)` — small inline button
- `S.badge(color)` — pill-shaped status label
- `S.infoBox(color)` — tinted info cell
- `S.table`, `S.th`, `S.td` — table styles
- `S.overlay` + `S.modal` — full-screen modal

---

## 9. Important Code Snippets

### i18n System
```js
const TRANSLATIONS = { uz: {...}, ru: {...}, zh: {...} };
const LangCtx = createContext("uz");
const useLang = () => useContext(LangCtx);
const useT = () => TRANSLATIONS[useLang()];

// Usage in any component:
const T = useT();
<button>{T.newOrder}</button>  // renders in current language
```

### Theme System
```js
const ThemeCtx = createContext(DARK);
const useC = () => useContext(ThemeCtx);

// Usage:
const C = useC();
const L = C.bg === LIGHT.bg;  // isLight boolean
const S = mk(C, L);           // get all styles for current theme
```

### Wire Price Calculation
```js
const TAX_RATE = 0.10;
// In Clients component and PricelistModal:
const wire = (cash * (1 + TAX_RATE)).toFixed(2);
```

### Dual-Color Payment Progress Bar
```js
// Green = cash portion, Cyan = wire portion, remaining = gray background
const cashPct = Math.round(order.cashPaid / order.total * 100);
const wirePct = Math.round(order.wirePaid / order.total * 100);

<div style={{ height: 10, display: "flex", background: C.border, borderRadius: 5, overflow: "hidden" }}>
  <div style={{ width: `${cashPct}%`, background: C.green }} />
  <div style={{ width: `${wirePct}%`, background: C.cyan }} />
</div>
```

### Inline Price Editing in Clients
```js
const startEdit = (c) => {
  setEditingId(c.id);
  setEditPrices({ ...c.prices });  // copy current prices
  setExpandedId(c.id);
};
const saveEdit = (id) => {
  setClients(prev => prev.map(c =>
    c.id === id ? { ...c, prices: { ...editPrices } } : c
  ));
  setEditingId(null);
};
```

### Language Dropdown
```js
const LANG_OPTIONS = [["uz","🇺🇿 O'zbek"],["ru","🇷🇺 Русский"],["zh","🇨🇳 中文"]];
const [langOpen, setLangOpen] = useState(false);

// Button shows current lang, click toggles dropdown
// Dropdown items set lang + close on click
```

### Product Data Structure
```js
{ code: "NWS-ST-500C", raw: 0.80, single: 0.90,
  spec: "500*80*96", actual: "579*77*96", heat: 140 }
// raw = weight without thread (KG)
// single = weight with thread (KG)
// spec = nominal dimension mm
// actual = real outer dimension mm
// heat = heat dissipation in Watts (null if not specified)
```

### Client Data Structure
```js
{
  id: 1,
  name: "Ozodbek",
  country: "🇺🇿 Uzbekistan",
  cashDebt: 12000,   // USD
  wireDebt: 8500,    // USD
  prices: {          // cash price per product code
    "NWS-ST-500C": 3.42,
    "NWS-TE-500E": 3.04,
    // ... all 29 products
  }
}
```

### Order Data Structure
```js
{
  id: "ORD-2401",
  client: "Ozodbek",
  product: "NWS-ST-500C",
  qty: 120,
  total: 48000,       // USD total order value
  cashPaid: 12000,    // USD paid in cash so far
  wirePaid: 8500,     // USD paid by wire so far
  status: "partial",  // "paid" | "partial" | "unpaid"
  date: "2026-04-10"
}
```

---

## 10. Setup Instructions

### Running the Current Demo
The demo is a single `.jsx` file (`factory-demo-v5.jsx`) designed to run in Claude.ai's artifact renderer. To run it locally:

```bash
# 1. Create a new Vite + React project
npm create vite@latest factoryos -- --template react
cd factoryos

# 2. Replace src/App.jsx with the contents of factory-demo-v5.jsx
# Remove the "export default" and make it the App component

# 3. Run
npm install
npm run dev
```

### Future Full Stack Setup
```bash
# Backend
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose bcrypt pydantic openpyxl weasyprint pillow
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# With Docker
docker-compose up --build
```

### Environment Variables (Backend)
```env
DATABASE_URL=postgresql://user:password@localhost/factoryos
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

---

## 11. Known Issues / Limitations

1. **No backend** — All data is hardcoded mock data. Nothing persists between sessions.
2. **No real document generation** — Invoice/Contract/PL/Excel/PNG buttons are UI-only placeholders.
3. **No authentication** — No login screen, no role enforcement, no user sessions.
4. **Client prices are mock** — Prices are auto-generated as `single_weight × multiplier`. Real prices need to be entered manually per client.
5. **Order status not auto-calculated** — Status (paid/partial/unpaid) is hardcoded. In real system it should derive from payments.
6. **No order creation form** — "+ New Order" button does nothing.
7. **Debt sheet format pending** — Client has not yet shared the Excel debt calculation sample. Debt tab will need to be redesigned once received.
8. **Single file architecture** — The entire app is one 900-line `.jsx` file. Needs to be split into proper component files for production.
9. **Pricelist PNG/Excel export** — Not implemented; requires backend with openpyxl/Pillow.
10. **Language dropdown doesn't close on outside click** — No `useEffect` click-outside listener implemented yet.

---

## 12. Future Improvements

### Phase 1 — Backend Foundation
- FastAPI + PostgreSQL setup
- SQLAlchemy models matching data structures above
- JWT auth with role-based middleware
- CRUD endpoints for all entities

### Phase 2 — Real Order & Payment Flow
- Order creation form with client/product selector
- Payment logging (cash vs wire, with date and confirmed-by)
- Auto-calculate order status from payments
- Order import from Excel (.xlsx)

### Phase 3 — Document Generation
- Invoice PDF from .docx template (client will provide)
- Contract PDF from .docx template
- Pricelist Excel export (matching existing format exactly)
- Pricelist PNG export (bilingual header: Chinese + Uzbek/Russian)

### Phase 4 — Debt System
- Implement exact debt calculation format once client provides sample Excel
- "Груз на наличие" (cash orders) vs "Груз на банк" (wire orders) tagging per order
- Debt filter by: client, date range, overdue, sales rep
- Export debt report to Excel

### Phase 5 — Brigadier Features
- Production batch tracking (TBD — client hasn't defined this yet)
- Quality control checkpoints (TBD)

### Phase 6 — Polish
- Split single JSX file into proper component structure
- Add `useEffect` click-outside handler for dropdowns
- Add form validation with error messages
- Add loading states and skeleton screens
- Add toast notifications for save/error actions
- Pagination for large order lists
- Date range filters on orders and debts

---