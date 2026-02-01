import { create } from 'zustand';
import { RewardAccount, RewardOffer, RewardTransaction, RewardRedemption, RewardTier, TIER_THRESHOLDS } from '@/types/rewards';

interface RewardsState {
  account: RewardAccount | null;
  offers: RewardOffer[];
  transactions: RewardTransaction[];
  redemptions: RewardRedemption[];
  isLoading: boolean;
  
  redeemOffer: (offerId: string) => void;
  getTierProgress: () => { current: RewardTier; next: RewardTier | null; progress: number; pointsNeeded: number };
}

const mockAccount: RewardAccount = {
  id: '1',
  user_id: 'current-user',
  points_balance: 2450,
  points_earned_total: 3200,
  points_redeemed_total: 750,
  tier: 'gold',
  tier_points: 2450,
  login_streak_days: 14,
  last_login_date: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
};

const mockOffers: RewardOffer[] = [
  { id: '1', title: '1 Month Free Pro', description: 'Get your next month of Pro subscription completely free', category: 'discount', points_cost: 500, value_description: '£29 value', discount_percent: null, discount_amount: 29, partner_name: 'PropertyTracker', partner_logo_url: null, min_tier: 'bronze', stock_limit: null, stock_remaining: null, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '2', title: '50% Off Annual Upgrade', description: 'Upgrade to Premium at half price for the first year', category: 'discount', points_cost: 1000, value_description: 'Up to £600 savings', discount_percent: 50, discount_amount: null, partner_name: 'PropertyTracker', partner_logo_url: null, min_tier: 'silver', stock_limit: null, stock_remaining: null, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '3', title: '£50 Screwfix Voucher', description: 'E-voucher for use in-store or online at Screwfix', category: 'product', points_cost: 800, value_description: '£50 value', discount_percent: null, discount_amount: 50, partner_name: 'Screwfix', partner_logo_url: null, min_tier: 'bronze', stock_limit: 100, stock_remaining: 45, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '4', title: 'Free EPC Assessment', description: 'Free EPC assessment at participating assessors nationwide', category: 'service', points_cost: 600, value_description: '£80 value', discount_percent: null, discount_amount: 80, partner_name: 'EPC Direct', partner_logo_url: null, min_tier: 'bronze', stock_limit: null, stock_remaining: null, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '5', title: '20% Off Landlord Insurance', description: 'Apply discount to new Simply Business landlord insurance policy', category: 'discount', points_cost: 400, value_description: 'Varies by policy', discount_percent: 20, discount_amount: null, partner_name: 'Simply Business', partner_logo_url: null, min_tier: 'bronze', stock_limit: null, stock_remaining: null, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '6', title: '1-Hour Strategy Call', description: 'Video call with experienced property investment advisor', category: 'service', points_cost: 2000, value_description: '£150 value', discount_percent: null, discount_amount: 150, partner_name: 'PropertyTracker', partner_logo_url: null, min_tier: 'gold', stock_limit: 10, stock_remaining: 3, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '7', title: 'Priority Support Access', description: 'Jump to the front of the support queue for 3 months', category: 'feature', points_cost: 300, value_description: 'Exclusive benefit', discount_percent: null, discount_amount: null, partner_name: 'PropertyTracker', partner_logo_url: null, min_tier: 'silver', stock_limit: null, stock_remaining: null, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
  { id: '8', title: 'Landlord Book Bundle', description: 'Collection of 3 bestselling property investment books', category: 'product', points_cost: 450, value_description: '£45 value', discount_percent: null, discount_amount: 45, partner_name: 'Amazon', partner_logo_url: null, min_tier: 'bronze', stock_limit: 50, stock_remaining: 28, valid_from: null, valid_until: null, is_active: true, created_at: new Date().toISOString() },
];

const mockTransactions: RewardTransaction[] = [
  { id: '1', user_id: 'current-user', transaction_type: 'earned', points: 15, balance_after: 2450, source: 'login', source_details: {}, description: 'Daily login + streak bonus', expires_at: null, created_at: new Date().toISOString() },
  { id: '2', user_id: 'current-user', transaction_type: 'earned', points: 100, balance_after: 2435, source: 'subscription', source_details: {}, description: 'Monthly subscription', expires_at: null, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', user_id: 'current-user', transaction_type: 'earned', points: 10, balance_after: 2335, source: 'action', source_details: {}, description: 'Deal analysis', expires_at: null, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', user_id: 'current-user', transaction_type: 'redeemed', points: -400, balance_after: 2325, source: 'redemption', source_details: { offer_id: '5' }, description: 'Redeemed: 20% Off Landlord Insurance', expires_at: null, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

export const useRewardsStore = create<RewardsState>((set, get) => ({
  account: mockAccount,
  offers: mockOffers,
  transactions: mockTransactions,
  redemptions: [],
  isLoading: false,

  redeemOffer: (offerId) => {
    const { account, offers } = get();
    if (!account) return;

    const offer = offers.find(o => o.id === offerId);
    if (!offer || account.points_balance < offer.points_cost) return;

    const redemption: RewardRedemption = {
      id: crypto.randomUUID(),
      user_id: account.user_id,
      offer_id: offerId,
      points_spent: offer.points_cost,
      redemption_code: `RDM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      used_at: null,
      created_at: new Date().toISOString(),
    };

    const transaction: RewardTransaction = {
      id: crypto.randomUUID(),
      user_id: account.user_id,
      transaction_type: 'redeemed',
      points: -offer.points_cost,
      balance_after: account.points_balance - offer.points_cost,
      source: 'redemption',
      source_details: { offer_id: offerId },
      description: `Redeemed: ${offer.title}`,
      expires_at: null,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      account: state.account ? { ...state.account, points_balance: state.account.points_balance - offer.points_cost, points_redeemed_total: state.account.points_redeemed_total + offer.points_cost } : null,
      redemptions: [...state.redemptions, redemption],
      transactions: [transaction, ...state.transactions],
      offers: state.offers.map(o => o.id === offerId && o.stock_remaining ? { ...o, stock_remaining: o.stock_remaining - 1 } : o),
    }));
  },

  getTierProgress: () => {
    const { account } = get();
    if (!account) return { current: 'bronze' as RewardTier, next: 'silver' as RewardTier, progress: 0, pointsNeeded: 1000 };

    const tiers: RewardTier[] = ['bronze', 'silver', 'gold', 'platinum'];
    const currentTierIndex = tiers.indexOf(account.tier);
    const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

    if (!nextTier) {
      return { current: account.tier, next: null, progress: 100, pointsNeeded: 0 };
    }

    const currentThreshold = TIER_THRESHOLDS[account.tier];
    const nextThreshold = TIER_THRESHOLDS[nextTier];
    const pointsNeeded = nextThreshold - account.tier_points;
    const progress = ((account.tier_points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return { current: account.tier, next: nextTier, progress: Math.min(100, Math.max(0, progress)), pointsNeeded: Math.max(0, pointsNeeded) };
  },
}));
