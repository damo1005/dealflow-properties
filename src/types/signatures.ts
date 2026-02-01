export interface SignatureRequest {
  id: string;
  user_id: string;
  document_id: string | null;
  document_name: string;
  document_url: string;
  portfolio_property_id: string | null;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'completed' | 'declined' | 'expired';
  expires_at: string | null;
  created_at: string;
  // Virtual fields
  signers?: SignatureSigner[];
  property_address?: string;
}

export interface SignatureSigner {
  id: string;
  request_id: string;
  name: string;
  email: string;
  role: 'landlord' | 'tenant' | 'guarantor' | 'witness' | null;
  sign_order: number;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  signature_data: string | null;
  ip_address: string | null;
  user_agent: string | null;
  decline_reason: string | null;
  created_at: string;
}

export interface SignatureAuditLog {
  id: string;
  request_id: string;
  signer_id: string | null;
  action: 'created' | 'sent' | 'viewed' | 'signed' | 'declined' | 'reminded' | 'expired';
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
}
