# FactoryOS — MVP

Factory management system for radiator manufacturing.

## Deploy in 5 minutes (phone only, no PC needed)

### Step 1 — Upload to GitHub

1. Go to **github.com** on your phone browser
2. Sign up / log in
3. Tap **+** → **New repository**
4. Name it `factoryos`, set to **Public**, tap **Create repository**
5. On the repo page tap **"uploading an existing file"**
6. Upload ALL files keeping the folder structure:
   ```
   index.html
   package.json
   vite.config.js
   public/favicon.svg
   src/main.jsx
   src/App.jsx
   ```
7. Tap **Commit changes**

### Step 2 — Deploy on Vercel

1. Go to **vercel.com** on your phone
2. Sign up with GitHub
3. Tap **Add New Project**
4. Select your `factoryos` repo
5. Framework will auto-detect as **Vite**
6. Tap **Deploy**
7. In ~2 minutes you get a live URL like `factoryos.vercel.app`

That's it! Share the URL with anyone.

---

## What's working in this MVP

- ✅ Dashboard with live stats
- ✅ Orders table — click any row to open details
- ✅ **Add new order** (select client + product, auto-fills price)
- ✅ **Log payments** (cash or wire) — updates order status automatically
- ✅ Debt calculator (cash debt vs wire debt per client)
- ✅ Shipments tracker — add new, tap "Update Status →" to cycle through stages
- ✅ Client pricelists — expand, edit prices inline, saves instantly
- ✅ Pricelist preview modal (all 29 models, cash + wire prices)
- ✅ Products catalog (Aluminum 17 + Bimetal 12 models)
- ✅ 3 languages: Uzbek (default), Russian, Chinese
- ✅ Light mode (default) + Dark mode
- ✅ **All data saved to localStorage** — persists between sessions

## Run locally (when you have PC)

```bash
npm install
npm run dev
```

## Tech
React 18 + Vite. No backend. Data stored in browser localStorage.
