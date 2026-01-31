import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useDealPackStore } from "@/stores/dealPackStore";

export function SectionEditor() {
  const { currentPack, activeSection, updatePack } = useDealPackStore();

  if (!currentPack || !activeSection) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Select a section to edit
      </div>
    );
  }

  const section = currentPack.sections.find((s) => s.id === activeSection);
  if (!section) return null;

  const renderCoverEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          placeholder="e.g., 15% NET Yield Opportunity"
          value={currentPack.headline || ""}
          onChange={(e) => updatePack({ headline: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Property Image</Label>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {currentPack.property?.images[0] && (
            <img
              src={currentPack.property.images[0]}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderExecutiveSummaryEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Investment Highlights</Label>
        <div className="space-y-2">
          {currentPack.investmentHighlights?.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={highlight}
                onChange={(e) => {
                  const updated = [...(currentPack.investmentHighlights || [])];
                  updated[index] = e.target.value;
                  updatePack({ investmentHighlights: updated });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const updated = currentPack.investmentHighlights?.filter((_, i) => i !== index);
                  updatePack({ investmentHighlights: updated });
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              const updated = [...(currentPack.investmentHighlights || []), ""];
              updatePack({ investmentHighlights: updated });
            }}
          >
            <Plus className="h-4 w-4" />
            Add Highlight
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recommendation">Recommendation</Label>
        <Textarea
          id="recommendation"
          value={currentPack.recommendation || ""}
          onChange={(e) => updatePack({ recommendation: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );

  const renderPropertyDetailsEditor = () => (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Property data auto-populated from:</p>
        <p className="font-medium">{currentPack.property?.address}</p>
      </div>

      <div className="space-y-2">
        <Label>Property Description</Label>
        <Textarea
          value={currentPack.property?.description || ""}
          onChange={(e) =>
            updatePack({
              property: { ...currentPack.property!, description: e.target.value },
            })
          }
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Key Features</Label>
        <div className="flex flex-wrap gap-2">
          {currentPack.property?.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {feature}
              <button
                onClick={() => {
                  const updated = currentPack.property?.features.filter((_, i) => i !== index);
                  updatePack({ property: { ...currentPack.property!, features: updated || [] } });
                }}
                className="hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images Gallery</Label>
        <div className="grid grid-cols-3 gap-2">
          {currentPack.property?.images.map((img, index) => (
            <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialAnalysisEditor = () => (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Financial data from calculator:</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Purchase Price</p>
            <p className="font-semibold">
              £{currentPack.financials?.purchasePrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Cashflow</p>
            <p className="font-semibold text-success">
              £{currentPack.financials?.monthlyCashflow.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Annual Yield</p>
            <p className="font-semibold">{currentPack.financials?.annualYield}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">ROI</p>
            <p className="font-semibold">{currentPack.financials?.roi}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assumptions</Label>
        <div className="space-y-2">
          {Object.entries(currentPack.financials?.assumptions || {}).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <Input value={key} disabled className="w-1/3" />
              <Input value={String(value)} disabled className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMarketAnalysisEditor = () => (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">
          Market analysis data will be auto-populated based on property location
        </p>
      </div>
    </div>
  );

  const renderSupportingDocsEditor = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
        <p className="text-muted-foreground mb-2">Drag & drop documents here</p>
        <Button variant="outline">Browse Files</Button>
      </div>
    </div>
  );

  const renderCustomSectionEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Content</Label>
        <Textarea placeholder="Enter your custom content..." rows={8} />
      </div>
    </div>
  );

  const editorMap: Record<string, () => JSX.Element> = {
    cover: renderCoverEditor,
    "executive-summary": renderExecutiveSummaryEditor,
    "property-details": renderPropertyDetailsEditor,
    "financial-analysis": renderFinancialAnalysisEditor,
    "market-analysis": renderMarketAnalysisEditor,
    "supporting-docs": renderSupportingDocsEditor,
    custom: renderCustomSectionEditor,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>{editorMap[section.type]?.() || renderCustomSectionEditor()}</CardContent>
    </Card>
  );
}
