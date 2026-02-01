export interface CurrencySettings {
  id: string;
  user_id: string;
  display_currency: string;
  home_currency: string;
  auto_convert: boolean;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  rate_date: string;
  source: string;
  created_at: string;
}

export interface ForeignIncome {
  id: string;
  user_id: string;
  portfolio_property_id: string | null;
  original_currency: string;
  original_amount: number;
  exchange_rate: number | null;
  gbp_amount: number | null;
  conversion_date: string | null;
  description: string | null;
  created_at: string;
}

export const SUPPORTED_CURRENCIES = [
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
];

export function getCurrencySymbol(code: string): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code;
}
