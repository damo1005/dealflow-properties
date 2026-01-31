import { useQuery, useMutation, UseQueryOptions } from "@tanstack/react-query";
import {
  searchProperties,
  getPropertyDetails,
  getComparables,
  getRentalEstimates,
  getAreaStatistics,
  PropertySearchFilters,
  Property,
  ComparablesResult,
  RentalEstimatesResult,
  AreaStatistics,
} from "@/services/propertyDataApi";

// Query keys
export const propertyQueryKeys = {
  all: ["properties"] as const,
  search: (filters: PropertySearchFilters) => ["properties", "search", filters] as const,
  details: (id: string) => ["properties", "details", id] as const,
  comparables: (postcode: string) => ["properties", "comparables", postcode] as const,
  rentals: (postcode: string) => ["properties", "rentals", postcode] as const,
  areaStats: (postcode: string) => ["properties", "areaStats", postcode] as const,
};

// Search properties hook
export function usePropertySearch(
  filters: PropertySearchFilters,
  options?: Omit<UseQueryOptions<{ success: boolean; data: Property[]; total: number; page: number; cached: boolean }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: propertyQueryKeys.search(filters),
    queryFn: () => searchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Property details hook
export function usePropertyDetails(
  propertyId: string,
  options?: Omit<UseQueryOptions<{ success: boolean; data: Property | null; cached: boolean }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: propertyQueryKeys.details(propertyId),
    queryFn: () => getPropertyDetails({ propertyId }),
    enabled: !!propertyId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

// Comparables hook
export function usePropertyComparables(
  postcode: string,
  params?: { radiusMiles?: number; propertyType?: string; bedrooms?: number; months?: number },
  options?: Omit<UseQueryOptions<{ success: boolean; data: ComparablesResult | null }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...propertyQueryKeys.comparables(postcode), params],
    queryFn: () => getComparables({ postcode, ...params }),
    enabled: !!postcode,
    staleTime: 60 * 60 * 1000, // 1 hour (data is cached for 7 days on server)
    ...options,
  });
}

// Rental estimates hook
export function useRentalEstimates(
  postcode: string,
  params?: { bedrooms?: number; propertyType?: string; purchasePrice?: number },
  options?: Omit<UseQueryOptions<{ success: boolean; data: RentalEstimatesResult | null }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: [...propertyQueryKeys.rentals(postcode), params],
    queryFn: () => getRentalEstimates({ postcode, ...params }),
    enabled: !!postcode,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Area statistics hook
export function useAreaStatistics(
  postcode: string,
  options?: Omit<UseQueryOptions<{ success: boolean; data: AreaStatistics | null }>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: propertyQueryKeys.areaStats(postcode),
    queryFn: () => getAreaStatistics({ postcode }),
    enabled: !!postcode,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (data is cached for 30 days on server)
    ...options,
  });
}

// Prefetch helpers
export function prefetchPropertyDetails(queryClient: any, propertyId: string) {
  return queryClient.prefetchQuery({
    queryKey: propertyQueryKeys.details(propertyId),
    queryFn: () => getPropertyDetails({ propertyId }),
  });
}

export function prefetchComparables(queryClient: any, postcode: string) {
  return queryClient.prefetchQuery({
    queryKey: propertyQueryKeys.comparables(postcode),
    queryFn: () => getComparables({ postcode }),
  });
}
