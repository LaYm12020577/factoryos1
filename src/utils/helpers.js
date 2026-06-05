export const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

export const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

export const computeClientDebts = (orders) => {
  const debts = {};
  for (const o of orders) {
    const remaining = o.total - o.cashPaid - o.wirePaid;
    if (remaining <= 0) continue;
    if (!debts[o.client]) debts[o.client] = { cashDebt: 0, wireDebt: 0 };
    const paid = o.cashPaid + o.wirePaid;
    if (paid === 0) {
      debts[o.client].cashDebt += remaining;
    } else {
      debts[o.client].cashDebt += remaining * (o.cashPaid / paid);
      debts[o.client].wireDebt += remaining * (o.wirePaid / paid);
    }
  }
  return debts;
};

export const normalizeOrders = (orders) => orders.map(o => {
  if (o.items) return o;
  const unitPrice = o.qty > 0 ? Math.round(o.total / o.qty * 100) / 100 : 0;
  const { product, qty, ...rest } = o;
  return { ...rest, items: [{ product, qty, unitPrice }] };
});
