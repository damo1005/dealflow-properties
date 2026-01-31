import { useDealPackStore } from "@/stores/dealPackStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function DealPackPreview() {
  const { currentPack } = useDealPackStore();

  if (!currentPack) return null;

  const enabledSections = currentPack.sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderCover = () => (
    <div className="relative h-[600px] bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
      {currentPack.property?.images[0] && (
        <div className="absolute inset-0">
          <img
            src={currentPack.property.images[0]}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {/* Header with branding */}
        <div className="flex items-center justify-between">
          {currentPack.branding.logoUrl ? (
            <img src={currentPack.branding.logoUrl} alt="Logo" className="h-12" />
          ) : (
            <div className="text-2xl font-bold">{currentPack.branding.companyName}</div>
          )}
          <div className="text-sm opacity-80">
            {format(new Date(), "MMMM yyyy")}
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <div>
            <p className="text-lg opacity-80 mb-2">Investment Opportunity</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {currentPack.headline || "Property Investment"}
            </h1>
          </div>
          
          <p className="text-xl opacity-90">
            {currentPack.property?.address}
          </p>

          <div className="flex gap-6">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <p className="text-sm opacity-80">Price</p>
              <p className="text-2xl font-bold">
                {formatCurrency(currentPack.property?.price || 0)}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <p className="text-sm opacity-80">Yield</p>
              <p className="text-2xl font-bold">
                {currentPack.property?.estimatedYield}%
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <p className="text-sm opacity-80">ROI</p>
              <p className="text-2xl font-bold">
                {currentPack.property?.roiPotential}%
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm opacity-60">
          {currentPack.branding.customFooter}
        </div>
      </div>
    </div>
  );

  const renderExecutiveSummary = () => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4" style={{ borderColor: currentPack.branding.primaryColor }}>
        Executive Summary
      </h2>

      <div className="prose max-w-none">
        <p className="text-muted-foreground">{currentPack.property?.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Investment Highlights</h3>
        <ul className="space-y-2">
          {currentPack.investmentHighlights?.map((highlight, index) => (
            <li key={index} className="flex items-start gap-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mt-0.5 shrink-0"
                style={{ backgroundColor: currentPack.branding.primaryColor }}
              >
                ✓
              </div>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Financial Snapshot */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg">Financial Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Purchase Price</p>
            <p className="text-xl font-bold">{formatCurrency(currentPack.financials?.purchasePrice || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Cashflow</p>
            <p className="text-xl font-bold text-success">
              {formatCurrency(currentPack.financials?.monthlyCashflow || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Yield</p>
            <p className="text-xl font-bold">{currentPack.financials?.annualYield}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="text-xl font-bold">{currentPack.financials?.roi}%</p>
          </div>
        </div>
      </div>

      {currentPack.recommendation && (
        <div className="border-l-4 pl-4" style={{ borderColor: currentPack.branding.primaryColor }}>
          <h3 className="font-semibold mb-2">Recommendation</h3>
          <p className="text-muted-foreground">{currentPack.recommendation}</p>
        </div>
      )}
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4" style={{ borderColor: currentPack.branding.primaryColor }}>
        Property Details
      </h2>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold">{currentPack.property?.bedrooms}</p>
          <p className="text-sm text-muted-foreground">Bedrooms</p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold">{currentPack.property?.bathrooms}</p>
          <p className="text-sm text-muted-foreground">Bathrooms</p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-xl font-bold">{currentPack.property?.propertyType}</p>
          <p className="text-sm text-muted-foreground">Type</p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-xl font-bold">{formatCurrency(currentPack.property?.price || 0)}</p>
          <p className="text-sm text-muted-foreground">Price</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Description</h3>
        <p className="text-muted-foreground">{currentPack.property?.description}</p>
      </div>

      {/* Features */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Key Features</h3>
        <div className="flex flex-wrap gap-2">
          {currentPack.property?.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Image Gallery */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentPack.property?.images.map((img, index) => (
            <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialAnalysis = () => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4" style={{ borderColor: currentPack.branding.primaryColor }}>
        Financial Analysis
      </h2>

      {/* Main Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Investment Structure</h3>
          <table className="w-full">
            <tbody className="divide-y">
              <tr className="py-2">
                <td className="py-2 text-muted-foreground">Purchase Price</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(currentPack.financials?.purchasePrice || 0)}</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Deposit (25%)</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(currentPack.financials?.deposit || 0)}</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Mortgage Amount</td>
                <td className="py-2 text-right font-semibold">{formatCurrency(currentPack.financials?.mortgageAmount || 0)}</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Interest Rate</td>
                <td className="py-2 text-right font-semibold">{currentPack.financials?.interestRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Monthly Cash Flow</h3>
          <table className="w-full">
            <tbody className="divide-y">
              <tr>
                <td className="py-2 text-muted-foreground">Monthly Rent</td>
                <td className="py-2 text-right font-semibold text-success">+{formatCurrency(currentPack.financials?.monthlyRent || 0)}</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Mortgage Payment</td>
                <td className="py-2 text-right font-semibold text-destructive">-{formatCurrency(currentPack.financials?.monthlyMortgage || 0)}</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="py-2 font-semibold">Net Cashflow</td>
                <td className="py-2 text-right font-bold text-success">{formatCurrency(currentPack.financials?.monthlyCashflow || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Assumptions</h3>
        <div className="bg-muted/50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(currentPack.financials?.assumptions || {}).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{key}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Returns Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-success/10 p-6 rounded-lg text-center">
          <p className="text-4xl font-bold text-success">{currentPack.financials?.annualYield}%</p>
          <p className="text-sm text-muted-foreground mt-1">Gross Yield</p>
        </div>
        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <p className="text-4xl font-bold text-primary">{currentPack.financials?.roi}%</p>
          <p className="text-sm text-muted-foreground mt-1">Cash on Cash ROI</p>
        </div>
        <div className="bg-chart-4/10 p-6 rounded-lg text-center">
          <p className="text-4xl font-bold text-chart-4">{formatCurrency((currentPack.financials?.monthlyCashflow || 0) * 12)}</p>
          <p className="text-sm text-muted-foreground mt-1">Annual Cashflow</p>
        </div>
      </div>
    </div>
  );

  const renderMarketAnalysis = () => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4" style={{ borderColor: currentPack.branding.primaryColor }}>
        Market Analysis
      </h2>

      <div className="text-center py-12 text-muted-foreground">
        <p>Market analysis data will be populated based on property location</p>
        <p className="text-sm mt-2">Including: comparable sales, rental data, and market trends</p>
      </div>
    </div>
  );

  const renderSupportingDocs = () => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4" style={{ borderColor: currentPack.branding.primaryColor }}>
        Supporting Documents
      </h2>

      <div className="text-center py-12 text-muted-foreground">
        <p>No documents attached</p>
        <p className="text-sm mt-2">Upload EPC certificates, floor plans, and other relevant documents</p>
      </div>
    </div>
  );

  const renderCustomSection = (section: { title: string }) => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4" style={{ borderColor: currentPack.branding.primaryColor }}>
        {section.title}
      </h2>

      <div className="text-center py-12 text-muted-foreground">
        <p>Custom section content</p>
      </div>
    </div>
  );

  const sectionRenderers: Record<string, (section?: any) => JSX.Element> = {
    cover: renderCover,
    "executive-summary": renderExecutiveSummary,
    "property-details": renderPropertyDetails,
    "financial-analysis": renderFinancialAnalysis,
    "market-analysis": renderMarketAnalysis,
    "supporting-docs": renderSupportingDocs,
    custom: renderCustomSection,
  };

  return (
    <div className="bg-white text-foreground shadow-xl rounded-lg overflow-hidden">
      {enabledSections.map((section) => (
        <div key={section.id} className="border-b border-border last:border-b-0">
          {sectionRenderers[section.type]?.(section)}
        </div>
      ))}

      {/* Footer */}
      <div className="p-6 bg-muted/30 text-center text-sm text-muted-foreground">
        <p>{currentPack.branding.companyName}</p>
        <p>{currentPack.branding.contactEmail} | {currentPack.branding.contactPhone}</p>
        <p>{currentPack.branding.website}</p>
      </div>
    </div>
  );
}
