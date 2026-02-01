import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useInsuranceStore, generateQuotes } from "@/stores/insuranceStore";
import { supabase } from "@/integrations/supabase/client";
import { PropertyDetailsStep } from "./steps/PropertyDetailsStep";
import { CoverageStep } from "./steps/CoverageStep";
import { TenancyStep } from "./steps/TenancyStep";
import { QuoteResults } from "./QuoteResults";
import { Shield, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Property Details", description: "Tell us about your property" },
  { id: 2, title: "Coverage Needed", description: "What cover do you need?" },
  { id: 3, title: "Tenancy Details", description: "About your tenants" },
  { id: 4, title: "Your Quotes", description: "Compare and choose" },
];

export function InsuranceWizard() {
  const {
    currentStep,
    setCurrentStep,
    wizardData,
    providers,
    setProviders,
    setGeneratedQuotes,
    setIsLoadingProviders,
    isGeneratingQuotes,
    setIsGeneratingQuotes,
    resetWizard,
  } = useInsuranceStore();

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      setProviders((data || []) as any);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast.error('Failed to load insurance providers');
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      if (currentStep === 3) {
        // Generate quotes before showing results
        handleGenerateQuotes();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateQuotes = () => {
    setIsGeneratingQuotes(true);
    // Simulate API delay
    setTimeout(() => {
      const quotes = generateQuotes(providers, wizardData);
      setGeneratedQuotes(quotes);
      setIsGeneratingQuotes(false);
    }, 1500);
  };

  const handleStartOver = () => {
    resetWizard();
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block text-center max-w-[80px]">
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <PropertyDetailsStep />}
          {currentStep === 2 && <CoverageStep />}
          {currentStep === 3 && <TenancyStep />}
          {currentStep === 4 && (
            isGeneratingQuotes ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Generating your quotes...</p>
                <p className="text-muted-foreground">Comparing prices from {providers.length} insurers</p>
              </div>
            ) : (
              <QuoteResults />
            )
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === 3 ? 'Get Quotes' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleStartOver}>
            Start New Quote
          </Button>
        </div>
      )}
    </div>
  );
}
