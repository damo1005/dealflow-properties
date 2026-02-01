import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CCS_API_BASE = 'https://insightsapi.ccscheme.org.uk'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const CCS_API_KEY = Deno.env.get('CCS_API_KEY')
  
  if (!CCS_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'CCS_API_KEY not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    console.log('Starting CCS sync...')
    
    // 1. Sync metadata first (regions, categories, local authorities)
    await syncMetadata(supabase, CCS_API_KEY)
    
    // 2. Fetch all live public projects
    const projects = await fetchAllProjects(CCS_API_KEY)
    console.log(`Fetched ${projects.length} projects from CCS API`)
    
    // 3. Upsert to database in batches
    let synced = 0
    let errors = 0
    const batchSize = 50
    
    for (let i = 0; i < projects.length; i += batchSize) {
      const batch = projects.slice(i, i + batchSize)
      const mappedBatch = batch.map(mapProjectToRecord)
      
      const { error } = await supabase
        .from('ccs_projects')
        .upsert(mappedBatch, { 
          onConflict: 'ccs_project_id',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error('Batch upsert error:', error)
        errors += batch.length
      } else {
        synced += batch.length
      }
    }
    
    console.log(`Sync complete: ${synced} synced, ${errors} errors`)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        synced,
        errors,
        total: projects.length 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Sync error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function fetchAllProjects(apiKey: string): Promise<any[]> {
  const allProjects: any[] = []
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    console.log(`Fetching page ${page}...`)
    
    const response = await fetch(
      `${CCS_API_BASE}/v1/projects/livePubliclyAvailableProjectData?page=${page}&pageSize=100`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      const text = await response.text()
      console.error(`CCS API error: ${response.status} - ${text}`)
      throw new Error(`CCS API error: ${response.status}`)
    }
    
    const data = await response.json()
    const projects = data.data || data.projects || data.items || []
    
    if (Array.isArray(projects)) {
      allProjects.push(...projects)
    } else if (typeof projects === 'object') {
      // If API returns a single object with projects
      const projectList = Object.values(projects)
      allProjects.push(...projectList)
    }
    
    // Check pagination - adjust based on actual API response structure
    const pagination = data.pagination || data.meta || {}
    hasMore = pagination.hasMore || 
              pagination.hasNextPage || 
              (projects.length === 100)
    
    // Safety limit
    if (page >= 50) {
      console.log('Reached page limit, stopping')
      hasMore = false
    }
    
    page++
    
    // Rate limiting - be nice to their API
    await new Promise(r => setTimeout(r, 500))
  }
  
  return allProjects
}

async function syncMetadata(supabase: any, apiKey: string) {
  console.log('Syncing metadata...')
  
  // Sync regions
  try {
    const regionsRes = await fetch(`${CCS_API_BASE}/v1/metaData/regions`, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' }
    })
    
    if (regionsRes.ok) {
      const regions = await regionsRes.json()
      const regionList = regions.data || regions || []
      
      for (const region of Array.isArray(regionList) ? regionList : Object.values(regionList)) {
        await supabase.from('ccs_metadata').upsert({
          metadata_type: 'region',
          code: region.code || region.id || region.regionId,
          name: region.name || region.regionName,
          last_synced: new Date().toISOString()
        }, { onConflict: 'metadata_type,code' })
      }
      console.log('Regions synced')
    }
  } catch (e) {
    console.error('Region sync error:', e)
  }
  
  // Sync project categories
  try {
    const categoriesRes = await fetch(`${CCS_API_BASE}/v1/metaData/projectCategories`, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' }
    })
    
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json()
      const catList = categories.data || categories || []
      
      for (const cat of Array.isArray(catList) ? catList : Object.values(catList)) {
        await supabase.from('ccs_metadata').upsert({
          metadata_type: 'project_category',
          code: cat.code || cat.id || cat.categoryId,
          name: cat.name || cat.categoryName,
          last_synced: new Date().toISOString()
        }, { onConflict: 'metadata_type,code' })
      }
      console.log('Categories synced')
    }
  } catch (e) {
    console.error('Category sync error:', e)
  }
  
  // Sync local authorities
  try {
    const laRes = await fetch(`${CCS_API_BASE}/v1/metaData/localAuthorities`, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' }
    })
    
    if (laRes.ok) {
      const localAuthorities = await laRes.json()
      const laList = localAuthorities.data || localAuthorities || []
      
      for (const la of Array.isArray(laList) ? laList : Object.values(laList)) {
        await supabase.from('ccs_metadata').upsert({
          metadata_type: 'local_authority',
          code: la.code || la.id || la.localAuthorityId,
          name: la.name || la.localAuthorityName,
          parent_code: la.regionCode || la.region,
          last_synced: new Date().toISOString()
        }, { onConflict: 'metadata_type,code' })
      }
      console.log('Local authorities synced')
    }
  } catch (e) {
    console.error('Local authority sync error:', e)
  }
}

function mapProjectToRecord(project: any): Record<string, any> {
  // Map CCS API response to our table structure
  // Handle various possible field name formats from the API
  const address = project.address || project.siteAddress || {}
  const scores = project.averageScores || project.scores || {}
  const client = project.client || {}
  const contractor = project.contractor || project.mainContractor || {}
  const siteManager = project.siteManager || project.siteContact || {}
  
  return {
    ccs_project_id: String(project.id || project.projectId || project.siteId),
    project_name: project.name || project.projectName || project.siteName,
    project_description: project.description || project.projectDescription,
    project_category: project.category || project.projectCategory || project.categoryName,
    
    address_line1: address.line1 || address.addressLine1 || project.addressLine1,
    address_line2: address.line2 || address.addressLine2 || project.addressLine2,
    address_line3: address.line3 || address.addressLine3 || project.addressLine3,
    town: address.town || address.city || project.town,
    county: address.county || project.county,
    postcode: address.postcode || project.postcode,
    latitude: parseFloat(address.latitude || project.latitude) || null,
    longitude: parseFloat(address.longitude || project.longitude) || null,
    region: project.region || project.regionName || address.region,
    local_authority: project.localAuthority || project.localAuthorityName,
    
    client_name: client.name || project.clientName || project.client,
    client_contact: client.contact || client.email,
    contractor_name: contractor.name || project.contractorName || project.contractor,
    contractor_contact: contractor.contact || contractor.email,
    
    site_manager_name: siteManager.name || project.siteManagerName,
    site_manager_phone: siteManager.phone || siteManager.telephone || siteManager.mobile || project.siteManagerPhone,
    site_manager_email: siteManager.email || project.siteManagerEmail,
    
    overall_score: parseFloat(scores.overall || project.overallScore) || null,
    community_score: parseFloat(scores.community || project.communityScore) || null,
    environment_score: parseFloat(scores.environment || project.environmentScore) || null,
    workforce_score: parseFloat(scores.workforce || project.workforceScore) || null,
    last_visit_date: project.lastVisitDate || project.lastVisit || null,
    visit_count: parseInt(project.visitCount) || 0,
    
    is_ultra_site: Boolean(project.isUltraSite || project.ultraSite),
    has_award: Boolean(project.hasAward || project.award || project.awardWinner),
    award_details: project.awardDetails || project.awardName,
    registration_start: project.registrationStart || project.startDate || project.registrationStartDate,
    registration_end: project.registrationEnd || project.endDate || project.registrationEndDate,
    
    last_synced: new Date().toISOString(),
    raw_data: project
  }
}