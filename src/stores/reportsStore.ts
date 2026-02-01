import { create } from 'zustand';
import type { ReportTemplate, ScheduledReport, GeneratedReport, ReportSectionConfig } from '@/types/reports';

interface ReportsState {
  templates: ReportTemplate[];
  scheduledReports: ScheduledReport[];
  generatedReports: GeneratedReport[];
  sections: ReportSectionConfig[];
  isLoading: boolean;
  isGenerating: boolean;
  generationProgress: number;
  activeTab: string;
  setTemplates: (templates: ReportTemplate[]) => void;
  setScheduledReports: (reports: ScheduledReport[]) => void;
  setGeneratedReports: (reports: GeneratedReport[]) => void;
  setSections: (sections: ReportSectionConfig[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setActiveTab: (tab: string) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  templates: [],
  scheduledReports: [],
  generatedReports: [],
  sections: [],
  isLoading: false,
  isGenerating: false,
  generationProgress: 0,
  activeTab: 'generate',
  setTemplates: (templates) => set({ templates }),
  setScheduledReports: (scheduledReports) => set({ scheduledReports }),
  setGeneratedReports: (generatedReports) => set({ generatedReports }),
  setSections: (sections) => set({ sections }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (generationProgress) => set({ generationProgress }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
