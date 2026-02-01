import { create } from "zustand";
import type { AuctionHouse, Auction, AuctionLot, AuctionWatch } from "@/types/auction";

interface AuctionState {
  auctionHouses: AuctionHouse[];
  auctions: Auction[];
  lots: AuctionLot[];
  watches: AuctionWatch[];
  isLoading: boolean;
  selectedLotId: string | null;
  filters: AuctionFilters;

  setAuctionHouses: (houses: AuctionHouse[]) => void;
  setAuctions: (auctions: Auction[]) => void;
  setLots: (lots: AuctionLot[]) => void;
  setWatches: (watches: AuctionWatch[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedLotId: (id: string | null) => void;
  setFilters: (filters: Partial<AuctionFilters>) => void;
  addWatch: (watch: AuctionWatch) => void;
  removeWatch: (lotId: string) => void;
}

interface AuctionFilters {
  dateRange: 'week' | '2weeks' | 'month' | 'all';
  auctionHouses: string[];
  priceMin: number | null;
  priceMax: number | null;
  propertyTypes: string[];
  bedrooms: number | null;
  postcode: string;
  radius: number;
  showBMV: boolean;
  showHighYield: boolean;
  hideIssues: boolean;
}

const defaultFilters: AuctionFilters = {
  dateRange: 'month',
  auctionHouses: [],
  priceMin: null,
  priceMax: null,
  propertyTypes: [],
  bedrooms: null,
  postcode: '',
  radius: 25,
  showBMV: false,
  showHighYield: false,
  hideIssues: false,
};

export const useAuctionStore = create<AuctionState>((set) => ({
  auctionHouses: [],
  auctions: [],
  lots: [],
  watches: [],
  isLoading: false,
  selectedLotId: null,
  filters: defaultFilters,

  setAuctionHouses: (auctionHouses) => set({ auctionHouses }),
  setAuctions: (auctions) => set({ auctions }),
  setLots: (lots) => set({ lots }),
  setWatches: (watches) => set({ watches }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedLotId: (selectedLotId) => set({ selectedLotId }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  addWatch: (watch) => set((state) => ({ watches: [watch, ...state.watches] })),
  removeWatch: (lotId) => set((state) => ({ 
    watches: state.watches.filter((w) => w.lot_id !== lotId) 
  })),
}));

// Mock data
export const mockAuctionHouses: AuctionHouse[] = [
  {
    id: "ah1",
    name: "Essential Information Group",
    website: "https://www.eigpropertyauctions.co.uk",
    logo_url: null,
    buyer_premium_pct: 1.2,
    regions: ["London", "South East", "Midlands"],
    is_active: true,
    last_sync_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "ah2",
    name: "Allsop",
    website: "https://www.allsop.co.uk",
    logo_url: null,
    buyer_premium_pct: 1.2,
    regions: ["London", "National"],
    is_active: true,
    last_sync_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const mockAuctions: Auction[] = [
  {
    id: "a1",
    auction_house_id: "ah1",
    name: "February Online Auction",
    auction_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    auction_type: "online",
    catalogue_url: "https://example.com/catalogue",
    total_lots: 156,
    lots_sold: 0,
    avg_sale_vs_guide: null,
    status: "upcoming",
    created_at: new Date().toISOString(),
  },
  {
    id: "a2",
    auction_house_id: "ah2",
    name: "March Room Auction",
    auction_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    auction_type: "room",
    catalogue_url: "https://example.com/catalogue2",
    total_lots: 89,
    lots_sold: 0,
    avg_sale_vs_guide: null,
    status: "upcoming",
    created_at: new Date().toISOString(),
  },
];

export const mockAuctionLots: AuctionLot[] = [
  {
    id: "lot1",
    auction_id: "a1",
    lot_number: "24",
    address: "123 High Street, Enfield",
    postcode: "EN3 4AB",
    property_type: "Flat",
    bedrooms: 2,
    tenure: "Freehold",
    guide_price: 180000,
    reserve_price: null,
    estimated_value: 215000,
    legal_pack_url: "https://example.com/legal-pack",
    has_tenants: false,
    has_issues: false,
    issues_summary: null,
    sold: null,
    sale_price: null,
    buyer_premium: null,
    total_price: null,
    ai_score: 84,
    risk_flags: ["Needs cosmetic refurb"],
    opportunity_flags: ["BMV 16%", "Vacant possession", "High yield potential"],
    images: [],
    description: "Two bedroom flat in need of modernization. Kitchen and bathroom dated.",
    status: "upcoming",
    created_at: new Date().toISOString(),
  },
  {
    id: "lot2",
    auction_id: "a1",
    lot_number: "45",
    address: "45 Oak Road, Tottenham",
    postcode: "N17 8CD",
    property_type: "Terraced",
    bedrooms: 3,
    tenure: "Freehold",
    guide_price: 285000,
    reserve_price: null,
    estimated_value: 320000,
    legal_pack_url: "https://example.com/legal-pack2",
    has_tenants: true,
    has_issues: false,
    issues_summary: null,
    sold: null,
    sale_price: null,
    buyer_premium: null,
    total_price: null,
    ai_score: 72,
    risk_flags: ["Existing tenancy"],
    opportunity_flags: ["BMV 11%", "Tenanted - immediate income"],
    images: [],
    description: "Three bedroom terraced house with sitting tenant.",
    status: "upcoming",
    created_at: new Date().toISOString(),
  },
  {
    id: "lot3",
    auction_id: "a1",
    lot_number: "67",
    address: "67 Elm Street, Walthamstow",
    postcode: "E17 5EF",
    property_type: "Flat",
    bedrooms: 1,
    tenure: "Leasehold",
    guide_price: 155000,
    reserve_price: null,
    estimated_value: 175000,
    legal_pack_url: null,
    has_tenants: false,
    has_issues: true,
    issues_summary: "Short lease - 72 years remaining",
    sold: null,
    sale_price: null,
    buyer_premium: null,
    total_price: null,
    ai_score: 58,
    risk_flags: ["Short lease", "Lease extension needed"],
    opportunity_flags: ["BMV 11%"],
    images: [],
    description: "One bedroom flat, short lease.",
    status: "upcoming",
    created_at: new Date().toISOString(),
  },
  {
    id: "lot4",
    auction_id: "a2",
    lot_number: "12",
    address: "89 Park Road, Islington",
    postcode: "N1 2AB",
    property_type: "Flat",
    bedrooms: 2,
    tenure: "Leasehold",
    guide_price: 350000,
    reserve_price: null,
    estimated_value: 395000,
    legal_pack_url: "https://example.com/legal-pack3",
    has_tenants: false,
    has_issues: false,
    issues_summary: null,
    sold: null,
    sale_price: null,
    buyer_premium: null,
    total_price: null,
    ai_score: 91,
    risk_flags: [],
    opportunity_flags: ["BMV 11%", "Prime location", "High rental demand"],
    images: [],
    description: "Two bedroom flat in prime Islington location.",
    status: "upcoming",
    created_at: new Date().toISOString(),
  },
];
