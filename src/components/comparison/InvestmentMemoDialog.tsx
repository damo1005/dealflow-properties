import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileText, Download, Mail } from "lucide-react";
import type { ComparisonProperty } from "@/types/comparison";
import { formatCurrency } from "@/services/propertyDataApi";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvestmentMemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: ComparisonProperty[];
  chosenPropertyId?: string;
}

const MEMO_TYPES = [
  { id: "internal", label: "Internal Review", description: "For yourself" },
  { id: "partner", label: "Partner Presentation", description: "For JV partner" },
  { id: "lender", label: "Lender Submission", description: "For mortgage broker" },
  { id: "full", label: "Full Due Diligence", description: "Comprehensive report" },
];

export function InvestmentMemoDialog({
  open,
  onOpenChange,
  properties,
  chosenPropertyId,
}: InvestmentMemoDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "customize" | "generating" | "preview">("select");
  const [selectedProperty, setSelectedProperty] = useState(chosenPropertyId || properties[0]?.id);
  const [memoType, setMemoType] = useState("internal");
  const [includeOptions, setIncludeOptions] = useState({
    comparison: true,
    runnerUp: true,
    risk: true,
  });
  const [customSections, setCustomSections] = useState("");
  const [generatedMemo, setGeneratedMemo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedPropertyData = properties.find((p) => p.id === selectedProperty);

  const handleGenerate = async () => {
    if (!selectedPropertyData) return;

    setStep("generating");
    setIsGenerating(true);

    try {
      const otherProperties = properties.filter((p) => p.id !== selectedProperty);
      
      const { data, error } = await supabase.functions.invoke("generate-investment-memo", {
        body: {
          property: selectedPropertyData,
          otherProperties,
          memoType,
          includeComparison: includeOptions.comparison,
          includeRunnerUp: includeOptions.runnerUp,
          includeRisk: includeOptions.risk,
          customSections,
        },
      });

      if (error) throw error;

      setGeneratedMemo(data.memo);
      setStep("preview");
    } catch (error) {
      console.error("Failed to generate memo:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate memo. Please try again.",
        variant: "destructive",
      });
      setStep("customize");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    // For now, download as text - PDF generation would need @react-pdf/renderer
    const blob = new Blob([generatedMemo], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `investment-memo-${selectedPropertyData?.address.split(",")[0].replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Investment memo downloaded successfully.",
    });
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Investment Memo: ${selectedPropertyData?.address.split(",")[0]}`);
    const body = encodeURIComponent(generatedMemo);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const renderSelectStep = () => (
    <>
      <DialogDescription>
        Select the property you're recommending
      </DialogDescription>

      <div className="space-y-4 my-6">
        <RadioGroup value={selectedProperty} onValueChange={setSelectedProperty}>
          {properties.map((property) => (
            <div key={property.id} className="flex items-center space-x-3">
              <RadioGroupItem value={property.id} id={property.id} />
              <Label htmlFor={property.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{property.address.split(",")[0]}</span>
                  <span className="text-muted-foreground">{formatCurrency(property.price)}</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4 my-6">
        <Label>Memo Type</Label>
        <RadioGroup value={memoType} onValueChange={setMemoType}>
          {MEMO_TYPES.map((type) => (
            <div key={type.id} className="flex items-center space-x-3">
              <RadioGroupItem value={type.id} id={type.id} />
              <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                <div>
                  <span className="font-medium">{type.label}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({type.description})
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={() => setStep("customize")}>
          Continue
        </Button>
      </DialogFooter>
    </>
  );

  const renderCustomizeStep = () => (
    <>
      <DialogDescription>
        Customize your investment memo
      </DialogDescription>

      <div className="space-y-4 my-6">
        <Label>Include sections</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="comparison"
              checked={includeOptions.comparison}
              onCheckedChange={(checked) =>
                setIncludeOptions((prev) => ({ ...prev, comparison: !!checked }))
              }
            />
            <Label htmlFor="comparison">Comparison table</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="runnerUp"
              checked={includeOptions.runnerUp}
              onCheckedChange={(checked) =>
                setIncludeOptions((prev) => ({ ...prev, runnerUp: !!checked }))
              }
            />
            <Label htmlFor="runnerUp">Runner-up analysis</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="risk"
              checked={includeOptions.risk}
              onCheckedChange={(checked) =>
                setIncludeOptions((prev) => ({ ...prev, risk: !!checked }))
              }
            />
            <Label htmlFor="risk">Risk assessment</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom">Custom sections (optional)</Label>
          <Textarea
            id="custom"
            value={customSections}
            onChange={(e) => setCustomSections(e.target.value)}
            placeholder="Add any additional information you'd like included..."
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setStep("select")}>
          Back
        </Button>
        <Button onClick={handleGenerate}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Memo
        </Button>
      </DialogFooter>
    </>
  );

  const renderGeneratingStep = () => (
    <div className="py-12 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-lg font-medium">Generating Investment Memo...</p>
      <p className="text-sm text-muted-foreground mt-2">
        This may take a few seconds
      </p>
    </div>
  );

  const renderPreviewStep = () => (
    <>
      <DialogDescription>
        Review your generated investment memo
      </DialogDescription>

      <div className="my-4 max-h-96 overflow-y-auto rounded-lg border bg-muted/30 p-4">
        <pre className="whitespace-pre-wrap text-sm font-mono">
          {generatedMemo}
        </pre>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setStep("customize")}>
          Edit Options
        </Button>
        <Button variant="outline" onClick={handleEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate Investment Memo
          </DialogTitle>
        </DialogHeader>

        {step === "select" && renderSelectStep()}
        {step === "customize" && renderCustomizeStep()}
        {step === "generating" && renderGeneratingStep()}
        {step === "preview" && renderPreviewStep()}
      </DialogContent>
    </Dialog>
  );
}
