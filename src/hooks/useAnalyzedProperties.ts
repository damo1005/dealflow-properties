import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DealAnalysis } from "@/types/dealAnalysis";

export interface AnalyzedProperty {
  id: string;
  user_id: string;
  source_url: string | null;
  source_type: string | null;
  address: string;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  receptions: number | null;
  property_type: string | null;
  tenure: string | null;
  floor_area_sqft: number | null;
  epc_rating: string | null;
  year_built: number | null;
  asking_price: number | null;
  offer_price: number | null;
  price_per_sqft: number | null;
  purchase_price: number | null;
  refurb_cost: number | null;
  legal_fees: number | null;
  stamp_duty: number | null;
  other_costs: number | null;
  deposit_percent: number | null;
  mortgage_rate: number | null;
  mortgage_term: number | null;
  interest_only: boolean | null;
  monthly_rent: number | null;
  annual_rent: number | null;
  total_investment: number | null;
  gross_yield: number | null;
  net_yield: number | null;
  roi: number | null;
  cash_on_cash: number | null;
  monthly_cashflow: number | null;
  annual_cashflow: number | null;
  deal_score: number | null;
  gdv: number | null;
  profit: number | null;
  profit_on_cost: number | null;
  strategy: string | null;
  images: string[] | null;
  thumbnail_url: string | null;
  features: string[] | null;
  description: string | null;
  agent_name: string | null;
  agent_phone: string | null;
  status: string | null;
  notes: string | null;
  analyzed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useAnalyzedProperties() {
  return useQuery({
    queryKey: ["analyzed-properties"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("analyzed_properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as AnalyzedProperty[];
    },
  });
}

export function useSaveAnalyzedProperty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (analysis: DealAnalysis & { 
      images?: string[]; 
      features?: string[];
      sourceUrl?: string;
      sourcePlatform?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const totalRefurb = (analysis.refurbLight || 0) + (analysis.refurbMedium || 0) + (analysis.refurbHeavy || 0);

      const { data, error } = await supabase
        .from("analyzed_properties")
        .insert({
          user_id: user.id,
          source_url: analysis.sourceUrl || null,
          source_type: analysis.sourcePlatform || "manual",
          address: analysis.propertyAddress || "Unknown Address",
          postcode: analysis.postcode || null,
          bedrooms: analysis.bedrooms || null,
          bathrooms: analysis.bathrooms || null,
          property_type: analysis.propertyType || null,
          floor_area_sqft: analysis.squareFootage || null,
          asking_price: analysis.askingPrice || null,
          offer_price: analysis.offerPrice || null,
          purchase_price: analysis.offerPrice || analysis.askingPrice || null,
          refurb_cost: totalRefurb || null,
          stamp_duty: analysis.costsBreakdown?.sdlt || null,
          legal_fees: analysis.costsBreakdown?.legalFees || null,
          deposit_percent: analysis.ltv ? (100 - analysis.ltv) : null,
          mortgage_rate: analysis.interestRate || null,
          mortgage_term: analysis.mortgageTerm || null,
          interest_only: analysis.interestOnly || true,
          monthly_rent: (analysis.strategyInputs as any)?.monthlyRent || null,
          annual_rent: (analysis.strategyInputs as any)?.monthlyRent 
            ? (analysis.strategyInputs as any).monthlyRent * 12 
            : null,
          total_investment: analysis.totalCashRequired || null,
          gross_yield: analysis.grossYield || null,
          net_yield: analysis.netYield || null,
          roi: analysis.roiYear1 || null,
          cash_on_cash: analysis.cashOnCash || null,
          monthly_cashflow: analysis.monthlyCashFlow || null,
          annual_cashflow: analysis.annualCashFlow || null,
          deal_score: analysis.dealScore || null,
          strategy: analysis.strategy || null,
          images: analysis.images || null,
          thumbnail_url: analysis.images?.[0] || null,
          features: analysis.features || null,
          status: "analyzed",
        })
        .select()
        .single();

      if (error) throw error;
      return data as AnalyzedProperty;
    },
    onSuccess: () => {
      toast({
        title: "Analysis Saved",
        description: "Property saved! You can now compare it with others.",
      });
      queryClient.invalidateQueries({ queryKey: ["analyzed-properties"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSavePropertyFromUrl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch property data from edge function
      const { data: fetchResult, error: fetchError } = await supabase.functions.invoke(
        "fetch-property-listing",
        { body: { url } }
      );

      if (fetchError) throw new Error(fetchError.message);
      if (!fetchResult?.success) throw new Error(fetchResult?.error || "Failed to fetch property");

      const propertyData = fetchResult.data;

      // Save to database
      const { data, error } = await supabase
        .from("analyzed_properties")
        .insert({
          user_id: user.id,
          source_url: url,
          source_type: propertyData.source,
          address: propertyData.address,
          postcode: propertyData.postcode,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          property_type: propertyData.propertyType,
          tenure: propertyData.tenure,
          floor_area_sqft: propertyData.floorArea,
          epc_rating: propertyData.epcRating,
          asking_price: propertyData.price,
          images: propertyData.images,
          thumbnail_url: propertyData.images?.[0],
          features: propertyData.features,
          agent_name: propertyData.agent,
          description: propertyData.description,
          status: "analyzed",
        })
        .select()
        .single();

      if (error) throw error;
      return data as AnalyzedProperty;
    },
    onSuccess: () => {
      toast({
        title: "Property Added",
        description: "Property fetched and saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["analyzed-properties"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteAnalyzedProperty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("analyzed_properties")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Property Deleted",
        description: "Property removed from your saved analyses.",
      });
      queryClient.invalidateQueries({ queryKey: ["analyzed-properties"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
