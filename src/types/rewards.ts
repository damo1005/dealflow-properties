export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type TransactionType = 'earned' | 'redeemed' | 'expired' | 'bonus';
export type OfferCategory = 'discount' | 'service' | 'product' | 'feature';
export type RedemptionStatus = 'active' | 'used' | 'expired';

export interface RewardAccount {
  id: string;
  user_id: string;
  points_balance: number;
  points_earned_total: number;
  points_redeemed_total: number;
  tier: RewardTier;
  tier_points: number;
  login_streak_days: number;
  last_login_date: string | null;
  created_at: string;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  points: number;
  balance_after: number | null;
  source: string | null;
  source_details: Record<string, unknown>;
  description: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface RewardOffer {
  id: string;
  title: string;
  description: string | null;
  category: OfferCategory | null;
  points_cost: number;
  value_description: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  partner_name: string | null;
  partner_logo_url: string | null;
  min_tier: RewardTier;
  stock_limit: number | null;
  stock_remaining: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  offer_id: string | null;
  points_spent: number | null;
  redemption_code: string | null;
  status: RedemptionStatus;
  expires_at: string | null;
  used_at: string | null;
  created_at: string;
}

export const TIER_THRESHOLDS: Record<RewardTier, number> = {
  bronze: 0,
  silver: 1000,
  gold: 2500,
  platinum: 5000,
};

export const TIER_BENEFITS: Record<RewardTier, string[]> = {
  bronze: ['Access to rewards marketplace', 'Birthday bonus (100 pts)'],
  silver: ['All Bronze benefits', '10% bonus points on earnings', 'Early access to new features'],
  gold: ['All Silver benefits', '25% bonus points on earnings', 'Priority support', 'Exclusive Gold-only rewards'],
  platinum: ['All Gold benefits', '50% bonus points on earnings', 'Free annual strategy call', 'Exclusive Platinum events', 'Beta access to features'],
};

export const EARN_ACTIONS = [
  { action: 'Monthly subscription payment', points: 100 },
  { action: 'Annual subscription payment', points: 1500 },
  { action: 'Refer a friend (when they subscribe)', points: 500 },
  { action: 'Add a property', points: 50 },
  { action: 'Complete property details 100%', points: 25 },
  { action: 'Daily login', points: 5 },
  { action: 'Login streak (7+ days)', points: 10, note: '/day bonus' },
  { action: 'Use deal analyser', points: 10 },
  { action: 'Generate report', points: 10 },
  { action: 'Complete a course', points: 100 },
  { action: 'Attend virtual event', points: 50 },
  { action: 'Leave a review', points: 200 },
];
