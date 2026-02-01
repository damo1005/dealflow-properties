import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ConstructionProject, ProjectCompany, MyContractor, TrackedProject } from '@/types/construction';

export function useConstructionProjects(postcode?: string, radius?: number) {
  return useQuery({
    queryKey: ['construction-projects', postcode, radius],
    queryFn: async () => {
      let query = supabase
        .from('construction_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postcode) {
        // For now, simple prefix match. Could be enhanced with PostGIS for radius search
        const prefix = postcode.split(' ')[0].toUpperCase();
        query = query.ilike('postcode', `${prefix}%`);
      }
      
      const { data, error } = await query.limit(200);
      if (error) throw error;
      return (data || []) as ConstructionProject[];
    },
  });
}

export function useProjectCompanies(projectIds?: string[]) {
  return useQuery({
    queryKey: ['project-companies', projectIds],
    queryFn: async () => {
      if (!projectIds || projectIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('project_companies')
        .select('*')
        .in('project_id', projectIds);
      
      if (error) throw error;
      return (data || []) as ProjectCompany[];
    },
    enabled: !!projectIds && projectIds.length > 0,
  });
}

export function useMyContractors() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-contractors', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('my_contractors')
        .select(`
          *,
          company:project_companies(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as MyContractor[];
    },
    enabled: !!user,
  });
}

export function useTrackedProjects() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['tracked-projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tracked_projects')
        .select(`
          *,
          project:construction_projects(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as TrackedProject[];
    },
    enabled: !!user,
  });
}

export function useTrackProject() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, notes }: { projectId: string; notes?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('tracked_projects')
        .insert({
          user_id: user.id,
          project_id: projectId,
          notes,
          alert_on_updates: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-projects'] });
      toast({ title: 'Project Tracked', description: 'You\'ll receive updates on this project.' });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({ title: 'Already Tracked', description: 'You\'re already tracking this project.', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to track project', variant: 'destructive' });
      }
    },
  });
}

export function useUntrackProject() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('tracked_projects')
        .delete()
        .eq('user_id', user.id)
        .eq('project_id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-projects'] });
      toast({ title: 'Project Untracked' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to untrack project', variant: 'destructive' });
    },
  });
}

export function useSaveContractor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      company_id?: string;
      manual_company_name?: string;
      manual_contact_name?: string;
      manual_phone?: string;
      manual_email?: string;
      manual_trades?: string[];
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data: result, error } = await supabase
        .from('my_contractors')
        .insert({
          user_id: user.id,
          ...data,
          status: 'saved',
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-contractors'] });
      toast({ title: 'Contractor Saved', description: 'Added to your contractors list.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save contractor', variant: 'destructive' });
    },
  });
}

export function useUpdateContractor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MyContractor> & { id: string }) => {
      const { data, error } = await supabase
        .from('my_contractors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-contractors'] });
      toast({ title: 'Contractor Updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update contractor', variant: 'destructive' });
    },
  });
}

export function useDeleteContractor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('my_contractors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-contractors'] });
      toast({ title: 'Contractor Removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to remove contractor', variant: 'destructive' });
    },
  });
}
