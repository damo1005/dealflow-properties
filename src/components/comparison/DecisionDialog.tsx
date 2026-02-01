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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trophy,
  Medal,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
} from "lucide-react";
import type { ComparisonProperty } from "@/types/comparison";
import { formatCurrency } from "@/services/propertyDataApi";
import { calculateWinnerScores } from "@/lib/comparisonUtils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: ComparisonProperty[];
  comparisonId?: string;
  onDecisionMade?: (chosenId: string, ranking: string[], reasons: string[]) => void;
}

const DECISION_REASONS = [
  { id: "best_cashflow", label: "Best cash flow" },
  { id: "lowest_price", label: "Lowest price" },
  { id: "best_location", label: "Best location" },
  { id: "least_work", label: "Least work needed" },
  { id: "gut_feeling", label: "Gut feeling" },
  { id: "growth_potential", label: "Higher growth potential" },
  { id: "partner_preference", label: "Partner preferred it" },
];

export function DecisionDialog({
  open,
  onOpenChange,
  properties,
  comparisonId,
  onDecisionMade,
}: DecisionDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"rank" | "compare" | "confirm">("rank");
  const [ranking, setRanking] = useState<string[]>(properties.map((p) => p.id));
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate AI recommendation based on scores
  const scores = calculateWinnerScores(properties);
  const aiRanking = [...properties]
    .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
    .map((p) => p.id);

  const getPropertyById = (id: string) => properties.find((p) => p.id === id);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRanking = [...ranking];
    [newRanking[index - 1], newRanking[index]] = [newRanking[index], newRanking[index - 1]];
    setRanking(newRanking);
  };

  const moveDown = (index: number) => {
    if (index === ranking.length - 1) return;
    const newRanking = [...ranking];
    [newRanking[index], newRanking[index + 1]] = [newRanking[index + 1], newRanking[index]];
    setRanking(newRanking);
  };

  const handleConfirm = async () => {
    const chosenId = ranking[0];
    setIsSubmitting(true);

    try {
      if (comparisonId) {
        const { error } = await supabase
          .from("comparisons")
          .update({
            user_ranking: ranking,
            ai_recommendation: aiRanking,
            decision_made: true,
            chosen_property_id: chosenId,
            decision_date: new Date().toISOString(),
            decision_notes: notes || null,
            decision_reasons: selectedReasons,
          })
          .eq("id", comparisonId);

        if (error) throw error;
      }

      onDecisionMade?.(chosenId, ranking, selectedReasons);
      
      toast({
        title: "Decision recorded!",
        description: `You chose ${getPropertyById(chosenId)?.address.split(",")[0]}`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save decision:", error);
      toast({
        title: "Error",
        description: "Failed to save decision. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userChoice = getPropertyById(ranking[0]);
  const aiChoice = getPropertyById(aiRanking[0]);
  const isAgreement = ranking[0] === aiRanking[0];

  const renderRankingStep = () => (
    <>
      <DialogDescription>
        Drag or use arrows to rank these properties from best to worst
      </DialogDescription>

      <div className="space-y-3 my-6">
        {ranking.map((id, index) => {
          const property = getPropertyById(id);
          if (!property) return null;

          const medalColors = [
            "text-yellow-500",
            "text-gray-400",
            "text-amber-600",
            "text-muted-foreground",
          ];

          return (
            <Card
              key={id}
              className={cn(
                "transition-all",
                index === 0 && "border-2 border-primary shadow-md"
              )}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveDown(index)}
                      disabled={index === ranking.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {index < 3 ? (
                    <Medal className={cn("h-5 w-5", medalColors[index])} />
                  ) : (
                    <span className="w-5 text-center text-sm text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">
                    {property.address.split(",")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(property.price)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">
                    {(property.calculatedYield || 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">yield</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={() => setStep("compare")}>
          Continue
        </Button>
      </DialogFooter>
    </>
  );

  const renderCompareStep = () => (
    <>
      <DialogDescription>
        See how your ranking compares to our AI analysis
      </DialogDescription>

      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Your Choice</Badge>
          </div>
          <Card className="border-2 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-sm">
                  {userChoice?.address.split(",")[0]}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>Cash flow: {formatCurrency(userChoice?.calculatedCashFlow || 0)}/mo</p>
                <p>Yield: {(userChoice?.calculatedYield || 0).toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Suggests
            </Badge>
          </div>
          <Card className={cn(isAgreement && "border-2 border-green-500")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {isAgreement ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Sparkles className="h-5 w-5 text-purple-500" />
                )}
                <span className="font-medium text-sm">
                  {aiChoice?.address.split(",")[0]}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>Cash flow: {formatCurrency(aiChoice?.calculatedCashFlow || 0)}/mo</p>
                <p>Yield: {(aiChoice?.calculatedYield || 0).toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isAgreement ? (
        <p className="text-sm text-green-600 text-center mb-4">
          ✓ Great minds think alike! You and AI agree on the best choice.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center mb-4">
          Different perspectives! AI weighted overall metrics, you may have other priorities.
        </p>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={() => setStep("rank")}>
          Back
        </Button>
        <Button onClick={() => setStep("confirm")}>
          Continue with my choice
        </Button>
      </DialogFooter>
    </>
  );

  const renderConfirmStep = () => (
    <>
      <DialogDescription>
        Why did you choose {userChoice?.address.split(",")[0]}?
      </DialogDescription>

      <div className="space-y-4 my-6">
        <div className="space-y-2">
          <Label>Select your reasons (optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {DECISION_REASONS.map((reason) => (
              <div key={reason.id} className="flex items-center gap-2">
                <Checkbox
                  id={reason.id}
                  checked={selectedReasons.includes(reason.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedReasons([...selectedReasons, reason.id]);
                    } else {
                      setSelectedReasons(selectedReasons.filter((r) => r !== reason.id));
                    }
                  }}
                />
                <Label htmlFor={reason.id} className="text-sm cursor-pointer">
                  {reason.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other thoughts on this decision..."
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setStep("compare")}>
          Back
        </Button>
        <Button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Confirm Decision"}
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {step === "rank" && "Rank Your Properties"}
            {step === "compare" && "Your Choice vs AI"}
            {step === "confirm" && "Confirm Your Decision"}
          </DialogTitle>
        </DialogHeader>

        {step === "rank" && renderRankingStep()}
        {step === "compare" && renderCompareStep()}
        {step === "confirm" && renderConfirmStep()}
      </DialogContent>
    </Dialog>
  );
}
