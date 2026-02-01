import { create } from 'zustand';
import { CurrencySettings, ExchangeRate, ForeignIncome, SUPPORTED_CURRENCIES } from '@/types/currency';

interface CurrencyState {
  settings: CurrencySettings | null;
  exchangeRates: ExchangeRate[];
  foreignIncome: ForeignIncome[];
  isLoading: boolean;
  
  updateSettings: (settings: Partial<CurrencySettings>) => void;
  convertToGBP: (amount: number, fromCurrency: string) => number;
  convertFromGBP: (amount: number, toCurrency: string) => number;
  getRate: (currency: string) => number;
  addForeignIncome: (income: Omit<ForeignIncome, 'id' | 'created_at'>) => void;
}

const mockSettings: CurrencySettings = {
  id: '1',
  user_id: 'current-user',
  display_currency: 'GBP',
  home_currency: 'GBP',
  auto_convert: true,
  created_at: new Date().toISOString(),
};

const mockExchangeRates: ExchangeRate[] = [
  { id: '1', base_currency: 'GBP', target_currency: 'EUR', rate: 1.1878, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '2', base_currency: 'GBP', target_currency: 'USD', rate: 1.2650, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '3', base_currency: 'GBP', target_currency: 'AED', rate: 4.6450, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '4', base_currency: 'GBP', target_currency: 'SGD', rate: 1.6890, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '5', base_currency: 'GBP', target_currency: 'HKD', rate: 9.8750, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '6', base_currency: 'GBP', target_currency: 'AUD', rate: 1.9340, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '7', base_currency: 'GBP', target_currency: 'CAD', rate: 1.7120, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
  { id: '8', base_currency: 'GBP', target_currency: 'CHF', rate: 1.1050, rate_date: new Date().toISOString().split('T')[0], source: 'ecb', created_at: new Date().toISOString() },
];

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  settings: mockSettings,
  exchangeRates: mockExchangeRates,
  foreignIncome: [],
  isLoading: false,

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...newSettings } : null,
    }));
  },

  getRate: (currency) => {
    if (currency === 'GBP') return 1;
    const rate = get().exchangeRates.find(r => r.target_currency === currency);
    return rate?.rate || 1;
  },

  convertToGBP: (amount, fromCurrency) => {
    if (fromCurrency === 'GBP') return amount;
    const rate = get().getRate(fromCurrency);
    return amount / rate;
  },

  convertFromGBP: (amount, toCurrency) => {
    if (toCurrency === 'GBP') return amount;
    const rate = get().getRate(toCurrency);
    return amount * rate;
  },

  addForeignIncome: (income) => {
    const gbpAmount = get().convertToGBP(income.original_amount, income.original_currency);
    const rate = get().getRate(income.original_currency);
    
    const newIncome: ForeignIncome = {
      ...income,
      id: crypto.randomUUID(),
      gbp_amount: gbpAmount,
      exchange_rate: rate,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      foreignIncome: [...state.foreignIncome, newIncome],
    }));
  },
}));
