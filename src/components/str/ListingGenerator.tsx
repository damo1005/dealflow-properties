import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Check, 
  RefreshCw, 
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { STRProperty, ListingGeneration } from "@/types/str";

interface ListingGeneratorProps {
  property: STRProperty;
  onSave: (data: Partial<STRProperty>) => void;
}

export function ListingGenerator({ property, onSave }: ListingGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generation, setGeneration] = useState<{
    titles: { text: string; score: number }[];
    descriptions: { text: string; score: number }[];
    house_rules: string;
    checkin_instructions: string;
  } | null>(null);
  
  const [selectedTitle, setSelectedTitle] = useState<number | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<number | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null);
  
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [editedHouseRules, setEditedHouseRules] = useState("");
  const [editedCheckinInstructions, setEditedCheckinInstructions] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-listing", {
        body: {
          property_type: property.property_type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sleeps: property.sleeps,
          amenities: property.amenities || [],
          unique_features: property.unique_features,
          target_guests: property.target_guests || [],
          location: property.address || property.postcode,
          nearby_attractions: property.nearby_attractions?.join(", ") || "",
          property_id: property.id,
          user_id: property.user_id,
        },
      });

      if (error) throw error;

      setGeneration(data);
      setEditedHouseRules(data.house_rules || "");
      setEditedCheckinInstructions(data.checkin_instructions || "");
      toast.success("Listing content generated!");
    } catch (error) {
      console.error("Error generating listing:", error);
      toast.error("Failed to generate listing content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const title = customTitle || (selectedTitle !== null && generation ? generation.titles[selectedTitle].text : property.title);
    const description = customDescription || (selectedDescription !== null && generation ? generation.descriptions[selectedDescription].text : property.description);

    onSave({
      title,
      description,
      house_rules: editedHouseRules || generation?.house_rules,
      checkin_instructions: editedCheckinInstructions || generation?.checkin_instructions,
    });

    toast.success("Listing content saved!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500/10 text-emerald-600";
    if (score >= 70) return "bg-amber-500/10 text-amber-600";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">AI Listing Generator</h2>
          <p className="text-muted-foreground">
            Generate optimized titles and descriptions for your listing
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {generation ? "Regenerate" : "Generate Content"}
            </>
          )}
        </Button>
      </div>

      {!generation && !isGenerating && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Generate Your Listing</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Our AI will create 3 compelling title and description variations 
              optimized for Airbnb, VRBO, and other platforms.
            </p>
            <Button onClick={handleGenerate}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Now
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium mb-2">Generating Your Content...</h3>
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      )}

      {generation && !isGenerating && (
        <>
          {/* Titles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose a Title</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generation.titles.map((title, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedTitle === index 
                      ? "ring-2 ring-primary" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedTitle(index);
                    setCustomTitle("");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getScoreColor(title.score)}>
                        {title.score}/100
                      </Badge>
                      {selectedTitle === index && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <p className="font-medium">{title.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {title.text.length} characters
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Or write a custom title</Label>
              <Textarea
                placeholder="Write your own title..."
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  if (e.target.value) setSelectedTitle(null);
                }}
                className="h-20"
              />
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose a Description</h3>
            <div className="space-y-4">
              {generation.descriptions.map((desc, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedDescription === index 
                      ? "ring-2 ring-primary" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedDescription(index);
                    setCustomDescription("");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getScoreColor(desc.score)}>
                          {desc.score}/100
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Version {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedDescription === index && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDescription(
                              expandedDescription === index ? null : index
                            );
                          }}
                        >
                          {expandedDescription === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className={`text-sm ${expandedDescription === index ? "" : "line-clamp-3"}`}>
                      {desc.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {desc.text.split(" ").length} words
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Or write a custom description</Label>
              <Textarea
                placeholder="Write your own description..."
                value={customDescription}
                onChange={(e) => {
                  setCustomDescription(e.target.value);
                  if (e.target.value) setSelectedDescription(null);
                }}
                className="min-h-[200px]"
              />
            </div>
          </div>

          {/* House Rules Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">House Rules</CardTitle>
              <CardDescription>Edit the generated house rules</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedHouseRules}
                onChange={(e) => setEditedHouseRules(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Check-in Instructions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Check-in Instructions</CardTitle>
              <CardDescription>Edit the check-in instructions template</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedCheckinInstructions}
                onChange={(e) => setEditedCheckinInstructions(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate All
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!selectedTitle && !customTitle && !selectedDescription && !customDescription}
            >
              <Check className="h-4 w-4 mr-2" />
              Save & Apply to Listing
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
