-- Copilot conversations
CREATE TABLE copilot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  context_property_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copilot messages
CREATE TABLE copilot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES copilot_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copilot knowledge base
CREATE TABLE copilot_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_copilot_conversations_user ON copilot_conversations(user_id);
CREATE INDEX idx_copilot_messages_conversation ON copilot_messages(conversation_id);
CREATE INDEX idx_copilot_knowledge_category ON copilot_knowledge(category);
CREATE INDEX idx_copilot_knowledge_keywords ON copilot_knowledge USING GIN(keywords);

-- Enable RLS
ALTER TABLE copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE copilot_knowledge ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own conversations"
  ON copilot_conversations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own messages"
  ON copilot_messages FOR ALL
  USING (conversation_id IN (
    SELECT id FROM copilot_conversations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Knowledge base is public"
  ON copilot_knowledge FOR SELECT
  USING (true);

-- Insert seed knowledge data
INSERT INTO copilot_knowledge (category, title, content, keywords, source_url) VALUES
('tax', 'Rental Income Tax', 'Rental income is taxed as property income in the UK. You can deduct allowable expenses including repairs, letting agent fees, and insurance. Mortgage interest relief is limited to 20% tax credit only (no longer deductible from income). You must report rental income over £1,000 through Self Assessment.', ARRAY['tax', 'rental income', 'property income', 'deductions'], 'gov.uk/rental-income'),
('tax', 'Stamp Duty Additional Property', 'Additional properties (including buy-to-let) attract a 3% surcharge on top of standard SDLT rates. The surcharge applies to the entire purchase price, not just the amount above thresholds. First-time buyers purchasing BTL pay the surcharge.', ARRAY['stamp duty', 'sdlt', 'additional property', 'surcharge'], 'gov.uk/stamp-duty-land-tax'),
('law', 'Section 21 No-Fault Eviction', 'Section 21 allows landlords to regain possession without giving a reason. Requirements: 2 months minimum notice, tenancy must be out of fixed term (or use break clause), deposit must be protected in scheme, all required documents provided (gas cert, EPC, How to Rent guide). Note: Section 21 is being abolished under the Renters Reform Bill.', ARRAY['section 21', 'eviction', 'notice', 'possession'], 'gov.uk/evicting-tenants'),
('law', 'Section 8 Eviction for Breach', 'Section 8 is used when tenant has breached the tenancy. Common grounds: rent arrears (2 months+), antisocial behaviour, property damage. Court order usually required. Notice period varies by ground (14 days to 2 months).', ARRAY['section 8', 'eviction', 'arrears', 'breach'], 'gov.uk/evicting-tenants'),
('compliance', 'Gas Safety Certificate', 'Annual gas safety check is mandatory for all rented properties with gas appliances. Must be done by Gas Safe registered engineer. Provide copy to existing tenants within 28 days of check, new tenants before move-in. Keep records for 2 years. Failure to comply: up to £6,000 fine per offence.', ARRAY['gas safety', 'gas certificate', 'cp12', 'compliance'], 'hse.gov.uk/gas'),
('compliance', 'EPC Requirements', 'Energy Performance Certificate required for all rentals. Minimum rating: E (C from 2028 for new tenancies). Valid for 10 years. Must provide to tenants before they rent. Cannot let property below minimum rating without valid exemption.', ARRAY['epc', 'energy performance', 'efficiency', 'rating'], 'gov.uk/epc-certificate'),
('compliance', 'Electrical Safety (EICR)', 'Electrical Installation Condition Report required every 5 years for all private rentals. Must provide copy to tenants within 28 days. Report any unsafe conditions to local authority within 28 days. Remedial work must be completed within 28 days of inspection.', ARRAY['eicr', 'electrical', 'safety', 'inspection'], 'gov.uk/private-renting'),
('compliance', 'HMO Licensing', 'Houses in Multiple Occupation require licence if 5+ tenants from 2+ households sharing facilities. Some councils have Additional Licensing schemes for smaller HMOs. Check with local council. Penalties for unlicensed HMO: unlimited fine + rent repayment order.', ARRAY['hmo', 'licence', 'multiple occupation', 'shared house'], 'gov.uk/house-in-multiple-occupation-licence'),
('law', 'Rent Increases', 'During fixed term: only if tenancy agreement includes rent review clause. After fixed term (periodic): use Section 13 notice with minimum 1 month notice. Landlord can only increase rent once per year. Tenant can challenge excessive increases at tribunal.', ARRAY['rent increase', 'section 13', 'rent review'], 'gov.uk/private-renting-tenancy-agreements'),
('law', 'Deposit Protection', 'Tenancy deposits must be protected in government-approved scheme within 30 days. Provide prescribed information to tenant. Schemes: DPS, MyDeposits, TDS. Failure to protect: tenant can claim 1-3x deposit value. Cannot serve valid Section 21 if deposit not protected.', ARRAY['deposit', 'protection', 'scheme', 'dps'], 'gov.uk/tenancy-deposit-protection');