import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  radius: number;
  min_price: number | null;
  max_price: number | null;
  min_beds: number | null;
  max_beds: number | null;
  property_types: string[] | null;
  include_sstc: boolean;
  alert_enabled: boolean;
  alert_frequency: string;
  alert_email: boolean;
  alert_push: boolean;
  alert_in_app: boolean;
  last_checked: string | null;
  last_alerted: string | null;
  new_listings_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface CreateSavedSearchInput {
  name: string;
  location: string;
  radius?: number;
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  max_beds?: number;
  property_types?: string[];
  alert_enabled?: boolean;
  alert_frequency?: string;
  alert_email?: boolean;
  alert_push?: boolean;
  alert_in_app?: boolean;
}

export function useSavedSearches() {
  return useQuery({
    queryKey: ["saved-searches"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as SavedSearch[];
    },
  });
}

export function useCreateSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSavedSearchInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_saved_searches")
        .insert({
          user_id: user.id,
          name: input.name || input.location,
          location: input.location,
          radius: input.radius || 10,
          min_price: input.min_price || null,
          max_price: input.max_price || null,
          min_beds: input.min_beds || null,
          max_beds: input.max_beds || null,
          property_types: input.property_types || null,
          alert_enabled: input.alert_enabled ?? true,
          alert_frequency: input.alert_frequency || "instant",
          alert_email: input.alert_email ?? true,
          alert_push: input.alert_push ?? true,
          alert_in_app: input.alert_in_app ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Saved search created!");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create saved search");
    },
  });
}

export function useToggleSearchAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("user_saved_searches")
        .update({ alert_enabled: enabled })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Alert settings updated");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    },
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_saved_searches")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved search deleted");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    },
  });
}

export function useUpdateSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SavedSearch> }) => {
      const { error } = await supabase
        .from("user_saved_searches")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved search updated");
      queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    },
  });
}

// Trigger alert check for a specific search
export function useCheckAlerts() {
  return useMutation({
    mutationFn: async (searchId?: string) => {
      const response = await supabase.functions.invoke("check-property-alerts", {
        body: searchId ? { searchId } : { checkAll: true },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.results?.length > 0) {
        const totalNew = data.results.reduce((sum: number, r: any) => sum + (r.newListings || 0), 0);
        if (totalNew > 0) {
          toast.success(`Found ${totalNew} new listings!`);
        } else {
          toast.info("No new listings found");
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to check alerts");
    },
  });
}
