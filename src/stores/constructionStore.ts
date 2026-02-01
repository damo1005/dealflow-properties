import { create } from 'zustand';
import { ConstructionProject, ProjectCompany, MyContractor, TrackedProject } from '@/types/construction';

interface ConstructionFilters {
  postcode: string;
  radius: number;
  status: string;
  projectType: string;
  ccsOnly: boolean;
  ultraSitesOnly: boolean;
  hasAward: boolean;
}

interface ConstructionStore {
  // Data
  projects: ConstructionProject[];
  companies: ProjectCompany[];
  myContractors: MyContractor[];
  trackedProjects: TrackedProject[];
  
  // UI State
  selectedProject: ConstructionProject | null;
  isDetailModalOpen: boolean;
  viewMode: 'map' | 'list';
  isLoading: boolean;
  
  // Filters
  filters: ConstructionFilters;
  
  // Actions
  setProjects: (projects: ConstructionProject[]) => void;
  setCompanies: (companies: ProjectCompany[]) => void;
  setMyContractors: (contractors: MyContractor[]) => void;
  setTrackedProjects: (tracked: TrackedProject[]) => void;
  setSelectedProject: (project: ConstructionProject | null) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  setViewMode: (mode: 'map' | 'list') => void;
  setIsLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<ConstructionFilters>) => void;
  resetFilters: () => void;
  
  // Computed
  getFilteredProjects: () => ConstructionProject[];
  getProjectCompanies: (projectId: string) => ProjectCompany[];
}

const initialFilters: ConstructionFilters = {
  postcode: '',
  radius: 5,
  status: 'all',
  projectType: 'all',
  ccsOnly: false,
  ultraSitesOnly: false,
  hasAward: false,
};

export const useConstructionStore = create<ConstructionStore>((set, get) => ({
  projects: [],
  companies: [],
  myContractors: [],
  trackedProjects: [],
  selectedProject: null,
  isDetailModalOpen: false,
  viewMode: 'list',
  isLoading: false,
  filters: initialFilters,
  
  setProjects: (projects) => set({ projects }),
  setCompanies: (companies) => set({ companies }),
  setMyContractors: (contractors) => set({ myContractors: contractors }),
  setTrackedProjects: (tracked) => set({ trackedProjects: tracked }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setIsDetailModalOpen: (open) => set({ isDetailModalOpen: open }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  resetFilters: () => set({ filters: initialFilters }),
  
  getFilteredProjects: () => {
    const { projects, filters } = get();
    return projects.filter((project) => {
      if (filters.status !== 'all' && project.status !== filters.status) return false;
      if (filters.projectType !== 'all' && project.project_type !== filters.projectType) return false;
      if (filters.ccsOnly && !project.is_ccs_registered) return false;
      if (filters.ultraSitesOnly && !project.is_ultra_site) return false;
      if (filters.hasAward && !project.has_national_award) return false;
      return true;
    });
  },
  
  getProjectCompanies: (projectId: string) => {
    return get().companies.filter((c) => c.project_id === projectId);
  },
}));
