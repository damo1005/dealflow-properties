import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import {
  detectCheckedItems,
  type ViewingTemplate,
} from "@/data/viewingTemplates";

interface TemplateChecklistProps {
  template: ViewingTemplate;
  transcript: string;
  manualChecks: string[];
  onManualCheck: (itemId: string, checked: boolean) => void;
}

export function TemplateChecklist({
  template,
  transcript,
  manualChecks,
  onManualCheck,
}: TemplateChecklistProps) {
  const [isOpen, setIsOpen] = useState(true);

  const autoCheckedItems = useMemo(
    () => detectCheckedItems(transcript, template),
    [transcript, template]
  );

  const allCheckedItems = useMemo(() => {
    const combined = new Set([...autoCheckedItems, ...manualChecks]);
    return Array.from(combined);
  }, [autoCheckedItems, manualChecks]);

  const progress = Math.round(
    (allCheckedItems.length / template.checklist.length) * 100
  );

  return (
    <Card className="w-full max-w-2xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">
                {template.name} Checklist
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={progress === 100 ? "default" : "secondary"}
                className="text-xs"
              >
                {allCheckedItems.length}/{template.checklist.length} covered
              </Badge>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground mb-3">
              Items auto-check when keywords are detected. You can also check
              manually.
            </p>
            <div className="space-y-2">
              {template.checklist.map((item) => {
                const isAutoChecked = autoCheckedItems.includes(item.id);
                const isManualChecked = manualChecks.includes(item.id);
                const isChecked = isAutoChecked || isManualChecked;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (!isAutoChecked) {
                          onManualCheck(item.id, checked === true);
                        }
                      }}
                      disabled={isAutoChecked}
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm flex-1 cursor-pointer ${
                        isChecked
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </label>
                    {isAutoChecked && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-500/10 text-green-700 border-green-500/20"
                      >
                        Detected
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
