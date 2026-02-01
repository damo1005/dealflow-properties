import { create } from 'zustand';
import type { ContractorCategory, Contractor, JobRequest, JobQuote } from '@/types/contractor';

interface ContractorFilters {
  categorySlug: string | null;
  postcode: string;
  radius: number;
  availableToday: boolean;
  within3Days: boolean;
  gassSafeOnly: boolean;
  niceicOnly: boolean;
  dbsCheckedOnly: boolean;
  publicLiabilityOnly: boolean;
  minRating: number;
  maxHourlyRate: number | null;
}

interface ContractorState {
  categories: ContractorCategory[];
  contractors: Contractor[];
  selectedContractor: Contractor | null;
  filters: ContractorFilters;
  jobRequests: JobRequest[];
  jobQuotes: JobQuote[];
  isLoading: boolean;
  
  setCategories: (categories: ContractorCategory[]) => void;
  setContractors: (contractors: Contractor[]) => void;
  setSelectedContractor: (contractor: Contractor | null) => void;
  updateFilters: (filters: Partial<ContractorFilters>) => void;
  resetFilters: () => void;
  setJobRequests: (requests: JobRequest[]) => void;
  setJobQuotes: (quotes: JobQuote[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const initialFilters: ContractorFilters = {
  categorySlug: null,
  postcode: '',
  radius: 10,
  availableToday: false,
  within3Days: false,
  gassSafeOnly: false,
  niceicOnly: false,
  dbsCheckedOnly: false,
  publicLiabilityOnly: false,
  minRating: 0,
  maxHourlyRate: null,
};

export const useContractorStore = create<ContractorState>((set) => ({
  categories: [],
  contractors: [],
  selectedContractor: null,
  filters: initialFilters,
  jobRequests: [],
  jobQuotes: [],
  isLoading: false,
  
  setCategories: (categories) => set({ categories }),
  setContractors: (contractors) => set({ contractors }),
  setSelectedContractor: (contractor) => set({ selectedContractor: contractor }),
  updateFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  resetFilters: () => set({ filters: initialFilters }),
  setJobRequests: (requests) => set({ jobRequests: requests }),
  setJobQuotes: (quotes) => set({ jobQuotes: quotes }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export function filterContractors(contractors: Contractor[], filters: ContractorFilters): Contractor[] {
  return contractors.filter(c => {
    if (filters.gassSafeOnly && !c.is_gas_safe_registered) return false;
    if (filters.niceicOnly && !c.is_niceic_registered) return false;
    if (filters.dbsCheckedOnly && !c.dbs_checked) return false;
    if (filters.publicLiabilityOnly && !c.has_public_liability) return false;
    if (filters.minRating > 0 && c.avg_rating < filters.minRating) return false;
    if (filters.maxHourlyRate && c.hourly_rate && c.hourly_rate > filters.maxHourlyRate) return false;
    return true;
  });
}
