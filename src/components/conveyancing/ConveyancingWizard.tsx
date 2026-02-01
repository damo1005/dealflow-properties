import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useConveyancingStore, generateConveyancingQuotes } from "@/stores/conveyancingStore";
import { supabase } from "@/integrations/supabase/client";
import { TransactionTypeStep } from "./steps/TransactionTypeStep";
import { PurchaseDetailsStep } from "./steps/PurchaseDetailsStep";
import { ConveyancingQuoteResults } from "./ConveyancingQuoteResults";
import { Scale, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Transaction Type", description: "What do you need help with?" },
  { id: 2, title: "Property Details", description: "Tell us about the property" },
  { id: 3, title: "Your Quotes", description: "Compare and instruct" },
];

export function ConveyancingWizard() {
  const {
    currentStep,
    setCurrentStep,
    wizardData,
    firms,
    setFirms,
    setGeneratedQuotes,
    setIsLoading,
    isGeneratingQuotes,
    setIsGeneratingQuotes,
    resetWizard,
  } = useConveyancingStore();

  useEffect(() => {
    loadFirms();
  }, []);

  const loadFirms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conveyancing_firms')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      setFirms((data || []) as any);
    } catch (error) {
      console.error('Error loading firms:', error);
      toast.error('Failed to load conveyancing firms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      if (currentStep === 2) {
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
    setTimeout(() => {
      const quotes = generateConveyancingQuotes(firms, wizardData);
      setGeneratedQuotes(quotes);
      setIsGeneratingQuotes(false);
    }, 1500);
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
            <Scale className="h-5 w-5 text-primary" />
            {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <TransactionTypeStep onNext={handleNext} />}
          {currentStep === 2 && <PurchaseDetailsStep />}
          {currentStep === 3 && (
            isGeneratingQuotes ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Finding the best quotes...</p>
                <p className="text-muted-foreground">Comparing {firms.length} conveyancing firms</p>
              </div>
            ) : (
              <ConveyancingQuoteResults />
            )
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep > 1 && currentStep < 3 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext}>
            Get Quotes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={resetWizard}>
            Start New Quote
          </Button>
        </div>
      )}
    </div>
  );
}
