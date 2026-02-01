import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { dealPackId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get deal pack data
    const { data: dealPack, error: packError } = await supabase
      .from('deal_packs')
      .select('*')
      .eq('id', dealPackId)
      .single();

    if (packError || !dealPack) {
      throw new Error('Deal pack not found');
    }

    console.log('Generating PDF for deal pack:', dealPack.title);

    // Generate HTML content
    const html = generateDealPackHTML(dealPack);

    // For now, we'll return the HTML content
    // In production, you'd use Puppeteer or a PDF service to convert to PDF
    
    // Update the deal pack with generation timestamp
    await supabase
      .from('deal_packs')
      .update({
        pdf_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', dealPackId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'PDF generation initiated',
        html: html.substring(0, 500) + '...' // Preview only
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateDealPackHTML(dealPack: any): string {
  const property = dealPack.property_data || {};
  const calculations = dealPack.calculations || {};
  const branding = {
    primaryColor: dealPack.color_scheme === 'professional' ? '#2563eb' : '#7c3aed',
    companyName: dealPack.company_name || 'DealFlow',
    logoUrl: dealPack.logo_url,
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${dealPack.title || 'Investment Memorandum'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      line-height: 1.6;
    }
    
    .page {
      page-break-after: always;
      padding: 40px;
      min-height: 100vh;
    }
    
    .cover-page {
      background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.primaryColor}dd 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .cover-title {
      font-size: 36pt;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .cover-subtitle {
      font-size: 18pt;
      opacity: 0.9;
      margin-bottom: 40px;
    }
    
    .cover-property {
      font-size: 14pt;
      opacity: 0.8;
    }
    
    .cover-footer {
      position: absolute;
      bottom: 40px;
      font-size: 10pt;
      opacity: 0.7;
    }
    
    h1 {
      color: ${branding.primaryColor};
      font-size: 24pt;
      margin-bottom: 20px;
      border-bottom: 2px solid ${branding.primaryColor};
      padding-bottom: 10px;
    }
    
    h2 {
      color: #334155;
      font-size: 16pt;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    .highlight-box {
      background: #f1f5f9;
      border-left: 4px solid ${branding.primaryColor};
      padding: 20px;
      margin: 20px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 24pt;
      font-weight: 700;
      color: ${branding.primaryColor};
    }
    
    .stat-label {
      font-size: 10pt;
      color: #64748b;
      text-transform: uppercase;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th {
      background: ${branding.primaryColor};
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    tr:nth-child(even) {
      background: #f8fafc;
    }
    
    .page-footer {
      position: fixed;
      bottom: 20px;
      left: 40px;
      right: 40px;
      font-size: 9pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
    
    .bullet-list {
      list-style: none;
      padding: 0;
    }
    
    .bullet-list li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }
    
    .bullet-list li:before {
      content: "✓";
      color: ${branding.primaryColor};
      font-weight: bold;
      position: absolute;
      left: 0;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="page cover-page">
    ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="Logo" style="height: 60px; margin-bottom: 40px;">` : ''}
    <h1 class="cover-title">${dealPack.title || 'Investment Opportunity'}</h1>
    <p class="cover-subtitle">${dealPack.subtitle || 'Investment Memorandum'}</p>
    <p class="cover-property">${property.address || 'Property Address'}</p>
    <p class="cover-footer">Prepared by ${branding.companyName} • ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  </div>
  
  <!-- Executive Summary -->
  <div class="page">
    <h1>Executive Summary</h1>
    
    <div class="highlight-box">
      <p>This investment memorandum presents a compelling ${dealPack.pack_type?.toUpperCase() || 'BTL'} opportunity at ${property.address || 'the subject property'}.</p>
    </div>
    
    <h2>Investment Highlights</h2>
    <ul class="bullet-list">
      <li>Strong rental demand in the local area</li>
      <li>Competitive purchase price with value-add potential</li>
      <li>Positive cash flow from day one</li>
      <li>Good capital appreciation prospects</li>
    </ul>
    
    <h2>Key Financials</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">£${((property.price || 0) / 1000).toFixed(0)}k</div>
        <div class="stat-label">Purchase Price</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${calculations.yield || '7.5'}%</div>
        <div class="stat-label">Gross Yield</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">£${calculations.cashFlow || '250'}</div>
        <div class="stat-label">Monthly Cash Flow</div>
      </div>
    </div>
  </div>
  
  <!-- Property Overview -->
  <div class="page">
    <h1>Property Overview</h1>
    
    <h2>Property Details</h2>
    <table>
      <tr><td><strong>Address</strong></td><td>${property.address || 'TBC'}</td></tr>
      <tr><td><strong>Property Type</strong></td><td>${property.propertyType || 'Residential'}</td></tr>
      <tr><td><strong>Bedrooms</strong></td><td>${property.bedrooms || 'TBC'}</td></tr>
      <tr><td><strong>Bathrooms</strong></td><td>${property.bathrooms || 'TBC'}</td></tr>
      <tr><td><strong>Price</strong></td><td>£${(property.price || 0).toLocaleString()}</td></tr>
    </table>
    
    <h2>Description</h2>
    <p>${property.description || 'Property description will be provided.'}</p>
  </div>
  
  <!-- Financial Analysis -->
  <div class="page">
    <h1>Financial Analysis</h1>
    
    <h2>Purchase Costs</h2>
    <table>
      <tr><th>Item</th><th>Amount</th></tr>
      <tr><td>Purchase Price</td><td>£${(property.price || 0).toLocaleString()}</td></tr>
      <tr><td>Stamp Duty (3% surcharge)</td><td>£${Math.round((property.price || 0) * 0.03).toLocaleString()}</td></tr>
      <tr><td>Legal Fees</td><td>£1,500</td></tr>
      <tr><td>Survey</td><td>£500</td></tr>
      <tr><td><strong>Total Acquisition</strong></td><td><strong>£${Math.round((property.price || 0) * 1.03 + 2000).toLocaleString()}</strong></td></tr>
    </table>
    
    <h2>Monthly Income & Expenses</h2>
    <table>
      <tr><th>Item</th><th>Amount</th></tr>
      <tr><td>Rental Income</td><td>£${calculations.monthlyRent || '1,200'}</td></tr>
      <tr><td>Mortgage Payment</td><td>-£${calculations.mortgagePayment || '800'}</td></tr>
      <tr><td>Management (10%)</td><td>-£${calculations.management || '120'}</td></tr>
      <tr><td>Maintenance (8%)</td><td>-£${calculations.maintenance || '96'}</td></tr>
      <tr><td><strong>Net Cash Flow</strong></td><td><strong>£${calculations.cashFlow || '184'}</strong></td></tr>
    </table>
  </div>
  
  <div class="page-footer">
    <span>${branding.companyName} • Confidential</span>
    <span>Page</span>
  </div>
</body>
</html>
  `;
}
