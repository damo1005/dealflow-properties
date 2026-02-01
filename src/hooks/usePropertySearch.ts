import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchStore, SearchFilters } from "@/stores/searchStore";

export interface PropertyListing {
  id: string;
  external_id: string;
  source: string;
  listing_url: string;
  address: string;
  postcode: string | null;
  outcode: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  receptions: number | null;
  property_type: string | null;
  tenure: string | null;
  price: number | null;
  price_qualifier: string | null;
  original_price: number | null;
  is_reduced: boolean;
  reduction_percent: number | null;
  first_listed: string | null;
  agent_name: string | null;
  agent_phone: string | null;
  thumbnail_url: string | null;
  images: string[] | null;
  summary: string | null;
  features: string[] | null;
  estimated_rent: number | null;
  gross_yield: number | null;
  status: string;
  created_at: string;
}

interface SearchResponse {
  success: boolean;
  data: PropertyListing[];
  fromCache: boolean;
  total: number;
  error?: string;
}

// Mutation to trigger a fresh search (scrapes portals)
export function usePropertySearchMutation() {
  const queryClient = useQueryClient();
  const { setLoading, setTotalResults } = useSearchStore();

  return useMutation({
    mutationFn: async (filters: SearchFilters): Promise<SearchResponse> => {
      if (!filters.location?.trim()) {
        throw new Error("Please enter a location to search");
      }

      setLoading(true);

      const { data, error } = await supabase.functions.invoke("search-properties", {
        body: {
          location: filters.location,
          radius: filters.radius || 10,
          minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
          maxPrice: filters.maxPrice < 1000000 ? filters.maxPrice : undefined,
          minBeds: filters.minBedrooms > 0 ? filters.minBedrooms : undefined,
          maxBeds: filters.maxBedrooms < 10 ? filters.maxBedrooms : undefined,
          propertyTypes: filters.propertyTypes.length > 0 ? filters.propertyTypes : undefined,
        },
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || "Search failed");

      return data;
    },
    onSuccess: (data) => {
      setTotalResults(data.total);
      queryClient.invalidateQueries({ queryKey: ["property-listings"] });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Query to fetch cached listings from database
export function usePropertyListings(filters: SearchFilters, sortBy: string) {
  return useQuery({
    queryKey: ["property-listings", filters.location, filters.minPrice, filters.maxPrice, filters.minBedrooms, filters.maxBedrooms, filters.propertyTypes, sortBy],
    queryFn: async (): Promise<PropertyListing[]> => {
      if (!filters.location?.trim()) return [];

      let query = supabase
        .from("property_listings")
        .select("*")
        .or(`outcode.ilike.%${filters.location}%,postcode.ilike.%${filters.location}%,address.ilike.%${filters.location}%`)
        .eq("status", "active");

      if (filters.minPrice > 0) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice < 1000000) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters.minBedrooms > 0) {
        query = query.gte("bedrooms", filters.minBedrooms);
      }
      if (filters.maxBedrooms < 10) {
        query = query.lte("bedrooms", filters.maxBedrooms);
      }
      if (filters.propertyTypes.length > 0) {
        query = query.in("property_type", filters.propertyTypes);
      }
      if (filters.priceReduced) {
        query = query.eq("is_reduced", true);
      }

      // Sort
      switch (sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "recent":
          query = query.order("first_listed", { ascending: false, nullsFirst: false });
          break;
        case "yield":
          query = query.order("gross_yield", { ascending: false, nullsFirst: false });
          break;
        case "reduced":
          query = query.order("reduction_percent", { ascending: false, nullsFirst: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return (data as PropertyListing[]) || [];
    },
    enabled: !!filters.location?.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation to save a property
export function useSaveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to save properties");

      const { error } = await supabase
        .from("user_saved_properties")
        .insert({ user_id: user.id, listing_id: listingId });

      // Ignore duplicate errors
      if (error && error.code !== "23505") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] });
    },
  });
}

// Query to get user's saved properties
export function useSavedProperties() {
  return useQuery({
    queryKey: ["saved-properties"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_saved_properties")
        .select("listing_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data?.map((d) => d.listing_id) || [];
    },
  });
}

// Mutation to remove a saved property
export function useRemoveSavedProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_saved_properties")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] });
    },
  });
}
