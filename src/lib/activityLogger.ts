import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 
  | 'property_added'
  | 'alert_triggered'
  | 'scout_discovery'
  | 'document_uploaded'
  | 'calculation_saved'
  | 'property_viewed'
  | 'offer_made'
  | 'pipeline_updated'
  | 'mortgage_applied'
  | 'comparison_saved';

export type EntityType = 
  | 'property'
  | 'alert'
  | 'scout'
  | 'document'
  | 'calculation'
  | 'pipeline'
  | 'mortgage'
  | 'comparison';

interface LogActivityParams {
  type: ActivityType;
  title: string;
  description?: string;
  entityType?: EntityType;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity({
  type,
  title,
  description,
  entityType,
  entityId,
  metadata = {}
}: LogActivityParams): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user, skipping activity log');
      return false;
    }

    // Use raw SQL via RPC or direct insert with type assertion
    // The user_activity table was just created, types will regenerate
    const { error } = await (supabase as any)
      .from('user_activity')
      .insert({
        user_id: user.id,
        activity_type: type,
        title,
        description,
        entity_type: entityType,
        entity_id: entityId,
        metadata
      });

    if (error) {
      console.error('Failed to log activity:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error logging activity:', err);
    return false;
  }
}

// Convenience functions for common activities
export const logPropertyAdded = (propertyAddress: string, propertyId: string) =>
  logActivity({
    type: 'property_added',
    title: 'Property added to pipeline',
    description: propertyAddress,
    entityType: 'property',
    entityId: propertyId
  });

export const logAlertTriggered = (alertName: string, alertId: string, matchCount: number) =>
  logActivity({
    type: 'alert_triggered',
    title: 'Alert triggered',
    description: `${alertName} found ${matchCount} matches`,
    entityType: 'alert',
    entityId: alertId,
    metadata: { matchCount }
  });

export const logScoutDiscovery = (scoutName: string, scoutId: string, propertyCount: number) =>
  logActivity({
    type: 'scout_discovery',
    title: 'New deals discovered',
    description: `${scoutName} found ${propertyCount} properties`,
    entityType: 'scout',
    entityId: scoutId,
    metadata: { propertyCount }
  });

export const logDocumentUploaded = (documentName: string, documentId: string) =>
  logActivity({
    type: 'document_uploaded',
    title: 'Document uploaded',
    description: documentName,
    entityType: 'document',
    entityId: documentId
  });

export const logCalculationSaved = (calculatorType: string, propertyAddress?: string) =>
  logActivity({
    type: 'calculation_saved',
    title: 'Calculation saved',
    description: `${calculatorType}${propertyAddress ? ` for ${propertyAddress}` : ''}`,
    entityType: 'calculation',
    metadata: { calculatorType }
  });

export const logPropertyViewed = (propertyAddress: string, propertyId: string) =>
  logActivity({
    type: 'property_viewed',
    title: 'Property viewed',
    description: propertyAddress,
    entityType: 'property',
    entityId: propertyId
  });

export const logOfferMade = (propertyAddress: string, propertyId: string, offerAmount: number) =>
  logActivity({
    type: 'offer_made',
    title: 'Offer submitted',
    description: `£${offerAmount.toLocaleString()} for ${propertyAddress}`,
    entityType: 'property',
    entityId: propertyId,
    metadata: { offerAmount }
  });

export const logPipelineUpdated = (propertyAddress: string, propertyId: string, newStage: string) =>
  logActivity({
    type: 'pipeline_updated',
    title: 'Pipeline updated',
    description: `${propertyAddress} moved to ${newStage}`,
    entityType: 'pipeline',
    entityId: propertyId,
    metadata: { stage: newStage }
  });

export const logComparisonSaved = (comparisonName: string, comparisonId: string, propertyCount: number) =>
  logActivity({
    type: 'comparison_saved',
    title: 'Comparison saved',
    description: `${comparisonName} with ${propertyCount} properties`,
    entityType: 'comparison',
    entityId: comparisonId,
    metadata: { propertyCount }
  });
