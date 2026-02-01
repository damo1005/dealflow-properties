export interface AuctionHouse {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  buyer_premium_pct: number;
  regions: string[] | null;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
}

export interface Auction {
  id: string;
  auction_house_id: string;
  name: string;
  auction_date: string;
  auction_type: 'online' | 'room' | 'hybrid' | null;
  catalogue_url: string | null;
  total_lots: number;
  lots_sold: number;
  avg_sale_vs_guide: number | null;
  status: 'upcoming' | 'live' | 'completed';
  created_at: string;
  auction_house?: AuctionHouse;
}

export interface AuctionLot {
  id: string;
  auction_id: string;
  lot_number: string;
  address: string;
  postcode: string | null;
  property_type: string | null;
  bedrooms: number | null;
  tenure: string | null;
  guide_price: number | null;
  reserve_price: number | null;
  estimated_value: number | null;
  legal_pack_url: string | null;
  has_tenants: boolean;
  has_issues: boolean;
  issues_summary: string | null;
  sold: boolean | null;
  sale_price: number | null;
  buyer_premium: number | null;
  total_price: number | null;
  ai_score: number | null;
  risk_flags: string[];
  opportunity_flags: string[];
  images: string[] | null;
  description: string | null;
  status: 'upcoming' | 'sold' | 'unsold' | 'withdrawn';
  created_at: string;
  auction?: Auction;
}

export interface AuctionWatch {
  id: string;
  user_id: string;
  lot_id: string;
  max_bid: number | null;
  bid_rationale: string | null;
  notes: string | null;
  reminded: boolean;
  remind_before_hours: number;
  created_at: string;
  lot?: AuctionLot;
}

export interface BidCalculation {
  id: string;
  user_id: string;
  lot_id: string;
  strategy: 'btl' | 'brr' | 'flip' | null;
  purchase_costs: Record<string, number>;
  refurb_costs: number | null;
  target_yield: number | null;
  target_profit: number | null;
  max_bid: number | null;
  recommended_bid: number | null;
  walk_away_price: number | null;
  created_at: string;
}

export interface BidCalculatorInputs {
  guidePrice: number;
  estimatedValue: number;
  strategy: 'btl' | 'brr' | 'flip';
  targetYield: number;
  targetProfit: number;
  refurbCosts: number;
  expectedRent: number;
  depositPercent: number;
  mortgageRate: number;
  buyerPremiumPct: number;
}

export interface BidCalculatorResults {
  maxBid: number;
  recommendedBid: number;
  walkAwayPrice: number;
  totalInvestment: number;
  depositRequired: number;
  stampDuty: number;
  buyerPremium: number;
  monthlyMortgage: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  grossYield: number;
  netYield: number;
  roi: number;
}

export const AUCTION_HOUSES = [
  'Essential Information Group',
  'Allsop',
  'SDL Auctions',
  'Barnett Ross',
];

export const PROPERTY_TYPES = [
  'Flat',
  'Terraced',
  'Semi-Detached',
  'Detached',
  'Commercial',
  'Land',
];
