import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { EPCCertificate, EPCImprovement } from "@/types/epc";
import { EPC_RATING_COLORS, EPC_RATING_RANGES, EFFICIENCY_LABELS } from "@/types/epc";
import {
  RefreshCw,
  Zap,
  Leaf,
  Home,
  Flame,
  Droplets,
  Lightbulb,
  PoundSterling,
  TrendingDown,
  AlertTriangle,
  Check,
  FileText,
  ExternalLink,
  Loader2,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { format, addYears, isBefore } from "date-fns";

interface EPCTabProps {
  propertyAddress: string;
  postcode: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

function EPCRatingChart({
  currentRating,
  currentScore,
  potentialRating,
  potentialScore,
}: {
  currentRating: string;
  currentScore: number;
  potentialRating: string;
  potentialScore: number;
}) {
  const ratings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="space-y-1">
      {ratings.map((rating) => {
        const isCurrentRating = rating === currentRating;
        const isPotentialRating = rating === potentialRating;
        const width = 100 - (ratings.indexOf(rating) * 10);

        return (
          <div key={rating} className="flex items-center gap-2">
            <div
              className="h-8 flex items-center px-3 text-white font-bold text-sm rounded-r-lg transition-all"
              style={{
                backgroundColor: EPC_RATING_COLORS[rating],
                width: `${width}%`,
                minWidth: '60px',
              }}
            >
              {rating}
              {isCurrentRating && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">
                  Current ({currentScore})
                </span>
              )}
              {isPotentialRating && !isCurrentRating && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">
                  Potential ({potentialScore})
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground w-16">
              {EPC_RATING_RANGES[rating]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function EfficiencyBadge({ efficiency }: { efficiency: string | null }) {
  if (!efficiency) return <span className="text-muted-foreground">-</span>;
  
  const colorClass = EFFICIENCY_LABELS[efficiency] || 'text-muted-foreground';
  return <span className={`font-medium ${colorClass}`}>{efficiency}</span>;
}

export function EPCTab({ propertyAddress, postcode }: EPCTabProps) {
  const [data, setData] = useState<EPCCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);

  useEffect(() => {
    fetchData(false);
  }, [propertyAddress, postcode]);

  const fetchData = async (forceRefresh: boolean) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("epc-fetch", {
        body: { address: propertyAddress, postcode, forceRefresh },
      });

      if (error) throw error;

      if (response.success) {
        setData(response.data);
        if (response.source === "mock") {
          toast.info("Using demo data", { description: response.message });
        }
      } else {
        toast.error("Failed to fetch EPC data", { description: response.error });
      }
    } catch (error) {
      console.error("Error fetching EPC data:", error);
      toast.error("Failed to fetch EPC data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    toast.info("Refreshing EPC data...");
  };

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading EPC data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No EPC Data</h3>
          <p className="text-muted-foreground mb-4">
            Click below to fetch the Energy Performance Certificate
          </p>
          <Button onClick={() => fetchData(false)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Fetch EPC Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  const expiryDate = data.lodgement_date ? addYears(new Date(data.lodgement_date), 10) : null;
  const isExpired = expiryDate ? isBefore(expiryDate, new Date()) : false;
  const isCompliant = data.current_energy_rating && ['A', 'B', 'C', 'D', 'E'].includes(data.current_energy_rating);
  const potentialSaving = (data.current_energy_cost || 0) - (data.potential_energy_cost || 0);

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Energy Performance Certificate
          </h3>
          {data.lodgement_date && (
            <p className="text-sm text-muted-foreground">
              Issued: {format(new Date(data.lodgement_date), "dd MMM yyyy")}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Rating Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Energy Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <EPCRatingChart
            currentRating={data.current_energy_rating}
            currentScore={data.current_energy_efficiency}
            potentialRating={data.potential_energy_rating}
            potentialScore={data.potential_energy_efficiency}
          />
        </CardContent>
      </Card>

      {/* Energy Costs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PoundSterling className="h-4 w-4" />
            Energy Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Annual Cost</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(data.current_energy_cost || 0)}/year
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Annual Cost</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.potential_energy_cost || 0)}/year
              </p>
            </div>
          </div>

          {potentialSaving > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-center gap-3">
              <TrendingDown className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Potential Saving: {formatCurrency(potentialSaving)}/year
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  With recommended improvements
                </p>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Cost Breakdown</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" /> Heating
                </span>
                <span>
                  {formatCurrency(data.heating_cost_current || 0)} → {formatCurrency(data.heating_cost_potential || 0)}
                  <span className="text-green-600 ml-2">
                    (-{formatCurrency((data.heating_cost_current || 0) - (data.heating_cost_potential || 0))})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" /> Hot Water
                </span>
                <span>
                  {formatCurrency(data.hot_water_cost_current || 0)} → {formatCurrency(data.hot_water_cost_potential || 0)}
                  <span className="text-green-600 ml-2">
                    (-{formatCurrency((data.hot_water_cost_current || 0) - (data.hot_water_cost_potential || 0))})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" /> Lighting
                </span>
                <span>
                  {formatCurrency(data.lighting_cost_current || 0)} → {formatCurrency(data.lighting_cost_potential || 0)}
                  <span className="text-green-600 ml-2">
                    (-{formatCurrency((data.lighting_cost_current || 0) - (data.lighting_cost_potential || 0))})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current CO₂ Emissions</p>
              <p className="font-medium">{data.current_co2_emissions?.toFixed(1) || "-"} tonnes/year</p>
              <Badge variant="secondary" className="mt-1">{data.current_co2_emissions_rating}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential CO₂ Emissions</p>
              <p className="font-medium text-green-600">{data.potential_co2_emissions?.toFixed(1) || "-"} tonnes/year</p>
              <Badge variant="secondary" className="mt-1">{data.potential_co2_emissions_rating}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Characteristics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Home className="h-4 w-4" />
            Property Characteristics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium">{data.built_form} {data.property_type?.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Floor Area</p>
              <p className="font-medium">{data.total_floor_area} m²</p>
            </div>
            <div>
              <p className="text-muted-foreground">Habitable Rooms</p>
              <p className="font-medium">{data.number_habitable_rooms}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Heated Rooms</p>
              <p className="font-medium">{data.number_heated_rooms}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Walls</span>
              <span className="flex items-center gap-2">
                {data.walls_description}
                <EfficiencyBadge efficiency={data.walls_energy_efficiency} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Roof</span>
              <span className="flex items-center gap-2">
                {data.roof_description}
                <EfficiencyBadge efficiency={data.roof_energy_efficiency} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Windows</span>
              <span className="flex items-center gap-2">
                {data.windows_description}
                <EfficiencyBadge efficiency={data.windows_energy_efficiency} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heating</span>
              <span className="flex items-center gap-2">
                {data.main_heating_description}
                <EfficiencyBadge efficiency={data.main_heating_energy_efficiency} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Main Fuel</span>
              <span>{data.main_fuel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hot Water</span>
              <span className="flex items-center gap-2">
                {data.hot_water_description}
                <EfficiencyBadge efficiency={data.hot_water_energy_efficiency} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lighting</span>
              <span className="flex items-center gap-2">
                {data.lighting_description}
                <EfficiencyBadge efficiency={data.lighting_energy_efficiency} />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Improvements */}
      {data.improvements && data.improvements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Recommended Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.improvements.slice(0, 3).map((improvement, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{improvement.description}</h4>
                  <Badge variant="outline">{improvement.energyPerformanceRating}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="ml-2 font-medium">{improvement.indicativeCost}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Saving:</span>
                    <span className="ml-2 font-medium text-green-600">£{improvement.typicalSaving}/year</span>
                  </div>
                </div>
              </div>
            ))}

            {data.improvements.length > 3 && (
              <Button variant="outline" className="w-full" onClick={() => setShowImprovements(true)}>
                View All Recommendations ({data.improvements.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certificate Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Certificate Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Issued</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {data.lodgement_date ? format(new Date(data.lodgement_date), "dd MMM yyyy") : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Valid Until</p>
              <p className={`font-medium flex items-center gap-2 ${isExpired ? "text-destructive" : ""}`}>
                <Calendar className="h-4 w-4" />
                {expiryDate ? format(expiryDate, "dd MMM yyyy") : "-"}
                {isExpired && <Badge variant="destructive">Expired</Badge>}
              </p>
            </div>
          </div>
          {data.assessor_name && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Assessor: {data.assessor_name}</span>
              {data.assessor_company && <span className="text-muted-foreground">({data.assessor_company})</span>}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on EPC Register
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Card className={isCompliant ? "bg-green-50 dark:bg-green-950/20 border-green-200" : "bg-red-50 dark:bg-red-950/20 border-red-200"}>
        <CardContent className="py-4">
          <div className="flex gap-3">
            {isCompliant ? (
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className={`font-medium ${isCompliant ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                Landlord Legal Requirement
              </p>
              <p className={`mt-1 ${isCompliant ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                Rental properties must have a valid EPC with minimum rating of E.
                This property: {isCompliant ? "✅ Compliant" : "❌ Non-Compliant"} ({data.current_energy_rating})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvements Dialog */}
      <Dialog open={showImprovements} onOpenChange={setShowImprovements}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Recommended Improvements</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {data.improvements?.map((improvement, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{index + 1}. {improvement.description}</h4>
                  <Badge variant="outline">{improvement.energyPerformanceRating}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{improvement.summary}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">💰 Cost:</span>
                    <span className="ml-2 font-medium">{improvement.indicativeCost}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">💡 Saving:</span>
                    <span className="ml-2 font-medium text-green-600">£{improvement.typicalSaving}/year</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
