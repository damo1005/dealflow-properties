import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, RotateCcw } from "lucide-react";
import { useDealAnalysisStore } from "@/stores/dealAnalysisStore";
import { PropertyInputStep } from "@/components/dealAnalyser/PropertyInputStep";
import { FinancialsStep } from "@/components/dealAnalyser/FinancialsStep";
import { StrategyStep } from "@/components/dealAnalyser/StrategyStep";
import { AnalysisResults } from "@/components/dealAnalyser/AnalysisResults";

const steps = [
  { number: 1, label: "Property" },
  { number: 2, label: "Financials" },
  { number: 3, label: "Strategy" },
  { number: 4, label: "Results" },
];

const DealAnalyser = () => {
  const { currentStep, resetWizard } = useDealAnalysisStore();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Deal Analyser</h1>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI-Powered
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Get instant investment analysis on any UK property
            </p>
          </div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={resetWizard}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>

        {/* Progress Steps */}
        {currentStep < 4 && (
          <div className="space-y-2">
            <div className="flex justify-between">
              {steps.slice(0, 3).map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-2 ${
                    step.number <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.number === currentStep
                        ? "border-2 border-primary text-primary"
                        : "border-2 border-muted text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="hidden sm:inline font-medium">{step.label}</span>
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && <PropertyInputStep />}
        {currentStep === 2 && <FinancialsStep />}
        {currentStep === 3 && <StrategyStep />}
        {currentStep === 4 && <AnalysisResults />}
      </div>
    </AppLayout>
  );
};

export default DealAnalyser;
