
DROP FUNCTION IF EXISTS public.find_planning_near(numeric, numeric, integer, text);

CREATE OR REPLACE FUNCTION public.find_planning_near(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INTEGER DEFAULT 5,
  status_filter TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  reference TEXT,
  address TEXT,
  postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  local_authority TEXT,
  description TEXT,
  application_type TEXT,
  development_type TEXT,
  proposed_units INTEGER,
  status TEXT,
  submitted_date DATE,
  decision_date DATE,
  applicant_name TEXT,
  agent_company TEXT,
  source_url TEXT,
  data_source TEXT,
  last_synced TIMESTAMPTZ,
  distance_miles DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.application_reference,
    p.property_address,
    p.postcode,
    p.latitude,
    p.longitude,
    p.local_authority_name,
    p.proposal_description,
    p.application_type,
    p.development_type,
    p.number_of_units_proposed,
    p.status,
    p.received_date,
    p.decision_date,
    p.applicant_name,
    p.agent_company,
    p.source_url,
    p.data_source,
    p.last_synced,
    (3959 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(search_lat)) * cos(radians(p.latitude)) *
        cos(radians(p.longitude) - radians(search_lng)) +
        sin(radians(search_lat)) * sin(radians(p.latitude))
      ))
    ))::DECIMAL as distance_miles
  FROM public.planning_applications p
  WHERE
    p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND (status_filter IS NULL OR p.status = status_filter)
    AND (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(search_lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(search_lng)) +
          sin(radians(search_lat)) * sin(radians(p.latitude))
        ))
      )
    ) <= radius_miles
  ORDER BY p.received_date DESC NULLS LAST, distance_miles ASC
  LIMIT 100;
END;
$$;
