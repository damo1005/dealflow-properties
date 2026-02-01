import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  PlanningApplication, 
  EPCProperty, 
  AreaContractor, 
  DemandScore,
  CCSProject 
} from '@/types/contractorDemand';

interface SearchCoordinates {
  lat: number;
  lng: number;
}

export function useContractorDemand() {
  const [isLoading, setIsLoading] = useState(false);
  const [planningApplications, setPlanningApplications] = useState<PlanningApplication[]>([]);
  const [epcProperties, setEpcProperties] = useState<EPCProperty[]>([]);
  const [contractors, setContractors] = useState<AreaContractor[]>([]);
  const [ccsProjects, setCcsProjects] = useState<CCSProject[]>([]);
  const [demandScore, setDemandScore] = useState<DemandScore | null>(null);
  const [coordinates, setCoordinates] = useState<SearchCoordinates | null>(null);

  const geocodePostcode = async (postcode: string): Promise<SearchCoordinates | null> => {
    try {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
      );
      const data = await response.json();
      
      if (data.status === 200 && data.result) {
        return {
          lat: data.result.latitude,
          lng: data.result.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const searchArea = async (postcode: string, radius: number = 5) => {
    setIsLoading(true);
    
    try {
      const coords = await geocodePostcode(postcode);
      if (!coords) {
        throw new Error('Could not geocode postcode');
      }
      setCoordinates(coords);

      // Parallel queries for all data
      const [planningRes, epcRes, contractorRes, ccsRes, demandRes] = await Promise.all([
        supabase.rpc('find_planning_near', {
          search_lat: coords.lat,
          search_lng: coords.lng,
          radius_miles: radius,
          status_filter: null
        }),
        supabase.rpc('find_epc_near', {
          search_lat: coords.lat,
          search_lng: coords.lng,
          radius_miles: radius,
          rating_filter: ['D', 'E', 'F', 'G']
        }),
        supabase.rpc('find_contractors_near', {
          search_lat: coords.lat,
          search_lng: coords.lng,
          radius_miles: radius * 5, // Contractors have wider service area
          trade_filter: null
        }),
        supabase.rpc('find_ccs_projects_near', {
          search_lat: coords.lat,
          search_lng: coords.lng,
          radius_miles: radius,
          min_score: 0,
          category_filter: null
        }),
        supabase
          .from('demand_scores')
          .select('*')
          .eq('postcode_district', postcode.split(' ')[0])
          .single()
      ]);

      setPlanningApplications((planningRes.data as PlanningApplication[]) || []);
      setEpcProperties((epcRes.data as EPCProperty[]) || []);
      setContractors((contractorRes.data as AreaContractor[]) || []);
      setCcsProjects((ccsRes.data as CCSProject[]) || []);
      setDemandScore(demandRes.data as DemandScore | null);

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickStats = () => {
    const approvedPlanning = planningApplications.filter(p => p.status === 'approved').length;
    const pendingPlanning = planningApplications.filter(p => p.status === 'pending').length;
    const activeSites = ccsProjects.length;
    const lowEpcCount = epcProperties.length;
    const verifiedContractors = contractors.filter(c => c.is_verified).length;

    return {
      approvedPlanning,
      pendingPlanning,
      activeSites,
      lowEpcCount,
      verifiedContractors,
      demandLevel: demandScore?.overall_demand_score 
        ? demandScore.overall_demand_score >= 75 ? 'High' 
          : demandScore.overall_demand_score >= 50 ? 'Medium' 
          : 'Low'
        : 'Unknown'
    };
  };

  return {
    isLoading,
    planningApplications,
    epcProperties,
    contractors,
    ccsProjects,
    demandScore,
    coordinates,
    searchArea,
    getQuickStats
  };
}
