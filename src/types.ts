export type Language = 'uz' | 'ru' | 'zh' | 'en';

export interface Product {
  code: string;
  type: 'alum' | 'bimetal';
  raw: number;
  single: number;
  spec?: string;
  actual?: string;
  heat?: number | null;
}

export interface Client {
  id: number;
  name: string;
  country: string;
  cashDebt: number;
  wireDebt: number;
  prices: Record<string, number>;
  address?: string;
  phone?: string;
  bankName?: string;
  bankAccount?: string;
  bankSwift?: string;
}

export interface OrderItem {
  product: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  client: string;
  items: OrderItem[];
  total: number;
  cashPaid: number;
  wirePaid: number;
  status: 'paid' | 'partial' | 'unpaid';
  date: string;
}

export interface Shipment {
  id: string;
  from: string;
  items: string;
  eta: string;
  status: 'ordered' | 'in_transit' | 'customs' | 'arrived';
}

export interface ThemeColors {
  bg: string;
  surface: string;
  card: string;
  border: string;
  accent: string;
  green: string;
  red: string;
  yellow: string;
  cyan: string;
  text: string;
  muted: string;
  inputBg: string;
}

export interface MachineNode {
  id: string;
  name: Record<string, string>;
  type: string;
  status: 'operating' | 'idle' | 'fault' | 'maintenance';
  temperature: number;
  vibration: number;
  rpm: number;
  totalProducedCount: number;
  efficiency?: number;
  failureRate?: number;
  operators?: any;
}
