import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CCSProject {
  id: string;
  ccs_project_id: string;
  project_name: string | null;
  project_description: string | null;
  project_category: string | null;
  address_line1: string | null;
  town: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  local_authority: string | null;
  client_name: string | null;
  contractor_name: string | null;
  site_manager_name: string | null;
  site_manager_phone: string | null;
  site_manager_email: string | null;
  overall_score: number | null;
  community_score: number | null;
  environment_score: number | null;
  workforce_score: number | null;
  is_ultra_site: boolean;
  has_award: boolean;
  award_details: string | null;
  visit_count: number;
  last_synced: string;
  distance_miles?: number;
}

export interface CCSMetadata {
  id: string;
  metadata_type: string;
  code: string | null;
  name: string;
  parent_code: string | null;
}

export interface ContractorStats {
  contractor_name: string;
  total_projects: number;
  active_projects: number;
  avg_score: number | null;
  best_score: number | null;
  ultra_sites: number;
  awards: number;
  regions: string[];
  categories: string[];
}

export interface TrackedCCSProject {
  id: string;
  user_id: string;
  ccs_project_id: string;
  notes: string | null;
  alert_on_score_change: boolean;
  alert_on_completion: boolean;
  created_at: string;
  project?: CCSProject;
}

export interface SavedContractor {
  id: string;
  user_id: string;
  contractor_name: string;
  ccs_entity_id: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  avg_ccs_score: number | null;
  total_projects: number | null;
  active_projects: number | null;
  status: string;
  user_rating: number | null;
  notes: string | null;
  last_contact_date: string | null;
  created_at: string;
}

// Geocode UK postcode to lat/lng
async function geocodePostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.status === 200 && data.result) {
      return { lat: data.result.latitude, lng: data.result.longitude };
    }
    return null;
  } catch {
    return null;
  }
}

// Sync CCS data from API
export function useSyncCCSProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-ccs-projects', {
        method: 'POST',
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Sync failed');
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ccs-projects'] });
      queryClient.invalidateQueries({ queryKey: ['ccs-metadata'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-stats'] });
      toast({ 
        title: 'CCS Data Synced', 
        description: `${data.synced} projects synced successfully.` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Sync Failed', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

// Search CCS projects by location
export function useCCSProjectsNear(postcode: string | null, radius: number = 5, minScore: number = 0, category?: string) {
  return useQuery({
    queryKey: ['ccs-projects-near', postcode, radius, minScore, category],
    queryFn: async () => {
      if (!postcode) {
        // Return all projects if no postcode
        const { data, error } = await supabase
          .from('ccs_projects')
          .select('*')
          .order('overall_score', { ascending: false, nullsFirst: false })
          .limit(200);
        
        if (error) throw error;
        return (data || []) as CCSProject[];
      }

      const coords = await geocodePostcode(postcode);
      if (!coords) {
        throw new Error('Could not geocode postcode');
      }

      const { data, error } = await supabase.rpc('find_ccs_projects_near', {
        search_lat: coords.lat,
        search_lng: coords.lng,
        radius_miles: radius,
        min_score: minScore,
        category_filter: category || null,
      });

      if (error) throw error;
      return (data || []) as CCSProject[];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get all CCS projects (with optional filters)
export function useCCSProjects(filters?: {
  region?: string;
  category?: string;
  minScore?: number;
  ultraSitesOnly?: boolean;
  hasAward?: boolean;
}) {
  return useQuery({
    queryKey: ['ccs-projects', filters],
    queryFn: async () => {
      let query = supabase
        .from('ccs_projects')
        .select('*')
        .order('overall_score', { ascending: false, nullsFirst: false });

      if (filters?.region) {
        query = query.eq('region', filters.region);
      }
      if (filters?.category) {
        query = query.eq('project_category', filters.category);
      }
      if (filters?.minScore) {
        query = query.gte('overall_score', filters.minScore);
      }
      if (filters?.ultraSitesOnly) {
        query = query.eq('is_ultra_site', true);
      }
      if (filters?.hasAward) {
        query = query.eq('has_award', true);
      }

      const { data, error } = await query.limit(500);
      if (error) throw error;
      return (data || []) as CCSProject[];
    },
  });
}

// Get CCS metadata (regions, categories, local authorities)
export function useCCSMetadata(type: 'region' | 'local_authority' | 'project_category') {
  return useQuery({
    queryKey: ['ccs-metadata', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccs_metadata')
        .select('*')
        .eq('metadata_type', type)
        .order('name');

      if (error) throw error;
      return (data || []) as CCSMetadata[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Get contractor statistics
export function useContractorStats(limit: number = 50) {
  return useQuery({
    queryKey: ['contractor-stats', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_stats')
        .select('*')
        .limit(limit);

      if (error) throw error;
      return (data || []) as ContractorStats[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Track a CCS project
export function useTrackCCSProject() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ccsProjectId, notes }: { ccsProjectId: string; notes?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tracked_ccs_projects')
        .insert({
          user_id: user.id,
          ccs_project_id: ccsProjectId,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-ccs-projects'] });
      toast({ title: 'Project Tracked', description: "You'll receive updates on this project." });
    },
    onError: (error: Error & { code?: string }) => {
      if (error.code === '23505') {
        toast({ title: 'Already Tracked', description: "You're already tracking this project.", variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to track project', variant: 'destructive' });
      }
    },
  });
}

// Get user's tracked CCS projects
export function useTrackedCCSProjects() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tracked-ccs-projects', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('tracked_ccs_projects')
        .select(`
          *,
          project:ccs_projects(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as TrackedCCSProject[];
    },
    enabled: !!user,
  });
}

// Untrack a CCS project
export function useUntrackCCSProject() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ccsProjectId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('tracked_ccs_projects')
        .delete()
        .eq('user_id', user.id)
        .eq('ccs_project_id', ccsProjectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-ccs-projects'] });
      toast({ title: 'Project Untracked' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to untrack project', variant: 'destructive' });
    },
  });
}

// Save a contractor
export function useSaveCCSContractor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<SavedContractor> & { contractor_name: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: result, error } = await supabase
        .from('saved_contractors')
        .insert({
          user_id: user.id,
          ...data,
          status: data.status || 'saved',
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-contractors'] });
      toast({ title: 'Contractor Saved', description: 'Added to your contractors list.' });
    },
    onError: (error: Error & { code?: string }) => {
      if (error.code === '23505') {
        toast({ title: 'Already Saved', description: 'This contractor is already in your list.', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to save contractor', variant: 'destructive' });
      }
    },
  });
}

// Get user's saved contractors
export function useSavedContractors() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['saved-contractors', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_contractors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as SavedContractor[];
    },
    enabled: !!user,
  });
}

// Update a saved contractor
export function useUpdateSavedContractor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SavedContractor> & { id: string }) => {
      const { data, error } = await supabase
        .from('saved_contractors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-contractors'] });
      toast({ title: 'Contractor Updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update contractor', variant: 'destructive' });
    },
  });
}

// Delete a saved contractor
export function useDeleteSavedContractor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_contractors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-contractors'] });
      toast({ title: 'Contractor Removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to remove contractor', variant: 'destructive' });
    },
  });
}

// Get last sync time
export function useCCSSyncStatus() {
  return useQuery({
    queryKey: ['ccs-sync-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccs_projects')
        .select('last_synced')
        .order('last_synced', { ascending: false })
        .limit(1)
        .single();

      if (error) return null;
      return data?.last_synced ? new Date(data.last_synced) : null;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}