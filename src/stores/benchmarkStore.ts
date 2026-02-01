import { create } from 'zustand';
import { BenchmarkData, PortfolioSnapshot, BenchmarkMetric, BenchmarkScorecard } from '@/types/benchmark';

interface BenchmarkState {
  benchmarkData: BenchmarkData[];
  snapshots: PortfolioSnapshot[];
  selectedRegion: string;
  selectedPropertyType: string;
  isLoading: boolean;
  
  setBenchmarkData: (data: BenchmarkData[]) => void;
  setSnapshots: (snapshots: PortfolioSnapshot[]) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedPropertyType: (type: string) => void;
  setIsLoading: (loading: boolean) => void;
  
  getScorecard: () => BenchmarkScorecard;
  getCurrentBenchmark: () => BenchmarkData | null;
}

const mockBenchmarkData: BenchmarkData[] = [
  {
    id: '1',
    region: 'uk_average',
    property_type: 'all',
    avg_gross_yield: 5.9,
    avg_net_yield: 4.2,
    avg_void_rate: 4.5,
    avg_expense_ratio: 25,
    avg_rent_growth_1y: 4.2,
    avg_capital_growth_1y: 5.1,
    avg_roi: 12.5,
    data_period: '2025_q4',
    data_date: '2025-12-31',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    region: 'north_west',
    property_type: 'all',
    avg_gross_yield: 6.8,
    avg_net_yield: 5.0,
    avg_void_rate: 3.8,
    avg_expense_ratio: 24,
    avg_rent_growth_1y: 4.8,
    avg_capital_growth_1y: 4.5,
    avg_roi: 14.2,
    data_period: '2025_q4',
    data_date: '2025-12-31',
    created_at: new Date().toISOString(),
  },
];

// Mock user portfolio data
const mockUserMetrics = {
  gross_yield: 6.8,
  net_yield: 5.1,
  void_rate: 2.1,
  expense_ratio: 28,
  rent_growth: 5.8,
  capital_growth: 4.2,
  collection_rate: 98,
  roi: 15.2,
};

export const useBenchmarkStore = create<BenchmarkState>((set, get) => ({
  benchmarkData: mockBenchmarkData,
  snapshots: [],
  selectedRegion: 'uk_average',
  selectedPropertyType: 'all',
  isLoading: false,

  setBenchmarkData: (data) => set({ benchmarkData: data }),
  setSnapshots: (snapshots) => set({ snapshots }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedPropertyType: (type) => set({ selectedPropertyType: type }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  getCurrentBenchmark: () => {
    const { benchmarkData, selectedRegion, selectedPropertyType } = get();
    return benchmarkData.find(
      (b) => b.region === selectedRegion && b.property_type === selectedPropertyType
    ) || null;
  },

  getScorecard: () => {
    const benchmark = get().getCurrentBenchmark();
    if (!benchmark) {
      return { overall_score: 0, rating: 'N/A', metrics: [] };
    }

    const getStatus = (percentile: number): BenchmarkMetric['status'] => {
      if (percentile >= 80) return 'excellent';
      if (percentile >= 60) return 'good';
      if (percentile >= 40) return 'average';
      if (percentile >= 20) return 'below_average';
      return 'poor';
    };

    const metrics: BenchmarkMetric[] = [
      {
        name: 'Gross Yield',
        yourValue: mockUserMetrics.gross_yield,
        marketValue: benchmark.avg_gross_yield || 0,
        difference: mockUserMetrics.gross_yield - (benchmark.avg_gross_yield || 0),
        percentile: 75,
        status: getStatus(75),
      },
      {
        name: 'Net Yield',
        yourValue: mockUserMetrics.net_yield,
        marketValue: benchmark.avg_net_yield || 0,
        difference: mockUserMetrics.net_yield - (benchmark.avg_net_yield || 0),
        percentile: 80,
        status: getStatus(80),
      },
      {
        name: 'Void Rate',
        yourValue: mockUserMetrics.void_rate,
        marketValue: benchmark.avg_void_rate || 0,
        difference: (benchmark.avg_void_rate || 0) - mockUserMetrics.void_rate,
        percentile: 85,
        status: getStatus(85),
      },
      {
        name: 'Expense Ratio',
        yourValue: mockUserMetrics.expense_ratio,
        marketValue: benchmark.avg_expense_ratio || 0,
        difference: (benchmark.avg_expense_ratio || 0) - mockUserMetrics.expense_ratio,
        percentile: 45,
        status: getStatus(45),
      },
      {
        name: 'Capital Growth',
        yourValue: mockUserMetrics.capital_growth,
        marketValue: benchmark.avg_capital_growth_1y || 0,
        difference: mockUserMetrics.capital_growth - (benchmark.avg_capital_growth_1y || 0),
        percentile: 35,
        status: getStatus(35),
      },
      {
        name: 'Rent Growth',
        yourValue: mockUserMetrics.rent_growth,
        marketValue: benchmark.avg_rent_growth_1y || 0,
        difference: mockUserMetrics.rent_growth - (benchmark.avg_rent_growth_1y || 0),
        percentile: 90,
        status: getStatus(90),
      },
      {
        name: 'Collection Rate',
        yourValue: mockUserMetrics.collection_rate,
        marketValue: 94,
        difference: mockUserMetrics.collection_rate - 94,
        percentile: 80,
        status: getStatus(80),
      },
    ];

    const avgPercentile = metrics.reduce((sum, m) => sum + m.percentile, 0) / metrics.length;
    const overall_score = Math.round(avgPercentile);
    
    let rating = 'Poor';
    if (overall_score >= 80) rating = 'Excellent';
    else if (overall_score >= 65) rating = 'Above Average';
    else if (overall_score >= 50) rating = 'Average';
    else if (overall_score >= 35) rating = 'Below Average';

    return { overall_score, rating, metrics };
  },
}));
