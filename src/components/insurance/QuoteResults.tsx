import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { QuoteCard } from "./QuoteCard";
import { QuoteComparisonTable } from "./QuoteComparisonTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Save, Mail, Edit, ExternalLink, Check, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function QuoteResults() {
  const { wizardData, generatedQuotes, providers, setCurrentStep } = useInsuranceStore();
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);
  const [redirectProvider, setRedirectProvider] = useState<{name: string, id: string} | null>(null);

  const handleGetQuote = (providerId: string, providerName: string) => {
    setRedirectProvider({ name: providerName, id: providerId });
    setShowRedirectDialog(true);
  };

  const handleConfirmRedirect = () => {
    if (redirectProvider) {
      // Generate tracking ID
      const trackingId = `df_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In real app, store this in database and redirect to affiliate link
      toast.success(`Opening ${redirectProvider.name}...`, {
        description: "Tracking ID: " + trackingId,
      });
      
      // Close dialog
      setShowRedirectDialog(false);
    }
  };

  const handleSaveQuote = () => {
    toast.success("Quote saved successfully!", {
      description: "Valid for 14 days. View in your saved quotes.",
    });
  };

  const handleEmailQuotes = () => {
    toast.success("Quotes sent to your email", {
      description: "Check your inbox for the quote comparison.",
    });
  };

  if (generatedQuotes.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No quotes available</h3>
        <p className="text-muted-foreground">
          Please complete all steps to get your quotes
        </p>
      </div>
    );
  }

  const bestPrice = generatedQuotes[0];
  const bestRated = [...generatedQuotes].sort((a, b) => {
    const provA = providers.find(p => p.id === a.provider_id);
    const provB = providers.find(p => p.id === b.provider_id);
    return (provB?.trustpilot_rating || 0) - (provA?.trustpilot_rating || 0);
  })[0];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Property</p>
              <p className="font-medium">
                {wizardData.propertyAddress || wizardData.postcode}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Buildings Cover</p>
              <p className="font-medium">{formatCurrency(wizardData.buildingsCoverAmount)}</p>
            </div>
            <div className="flex gap-2">
              {wizardData.needsRentGuarantee && <Badge variant="secondary">Rent Guarantee</Badge>}
              {wizardData.needsLegalExpenses && <Badge variant="secondary">Legal Expenses</Badge>}
              {wizardData.needsEmergencyCover && <Badge variant="secondary">Emergency</Badge>}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{generatedQuotes.length} quotes found</p>
              <p className="text-lg font-bold text-primary">
                Best price: {formatCurrency(bestPrice.annual_premium)}/year
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
        <Button variant="outline" size="sm" onClick={handleSaveQuote}>
          <Save className="h-4 w-4 mr-2" />
          Save Quote
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmailQuotes}>
          <Mail className="h-4 w-4 mr-2" />
          Email Quotes
        </Button>
      </div>

      {/* Quote Cards */}
      <div className="space-y-4">
        {generatedQuotes.map((quote, index) => {
          const provider = providers.find(p => p.id === quote.provider_id);
          const isBestPrice = index === 0;
          const isBestRated = quote.provider_id === bestRated.provider_id && !isBestPrice;
          
          return (
            <QuoteCard
              key={quote.provider_id}
              quote={quote}
              provider={provider}
              isBestPrice={isBestPrice}
              isBestRated={isBestRated}
              onGetQuote={() => handleGetQuote(quote.provider_id, quote.provider_name)}
            />
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteComparisonTable quotes={generatedQuotes} providers={providers} />
        </CardContent>
      </Card>

      {/* Decision Helper */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Lightbulb className="h-5 w-5" />
            Which Should You Choose?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Choose {generatedQuotes[0]?.provider_name} if:
            </p>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 mt-1">
              <li>Price is your priority</li>
              <li>Standard AST tenancy</li>
              <li>Low claims risk</li>
            </ul>
          </div>
          {bestRated.provider_id !== bestPrice.provider_id && (
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Choose {bestRated.provider_name} if:
              </p>
              <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 mt-1">
                <li>You want maximum protection</li>
                <li>Higher value property or tenants</li>
                <li>Want peace of mind</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Redirect Dialog */}
      <Dialog open={showRedirectDialog} onOpenChange={setShowRedirectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opening {redirectProvider?.name}...</DialogTitle>
            <DialogDescription>
              We're redirecting you to {redirectProvider?.name} to complete your purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              Your quote details have been saved
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-600" />
              You can return to compare more quotes anytime
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedirectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRedirect}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Continue to {redirectProvider?.name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
