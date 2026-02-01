import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { FloodRiskData, FloodRecommendation } from "@/types/floodRisk";
import { FLOOD_RISK_COLORS, FLOOD_RISK_DESCRIPTIONS } from "@/types/floodRisk";
import {
  RefreshCw,
  Droplets,
  AlertTriangle,
  Shield,
  Check,
  X,
  ExternalLink,
  Loader2,
  CloudRain,
  Waves,
  Building,
  FileText,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface FloodRiskTabProps {
  propertyAddress: string;
  postcode: string;
}

function RiskBadge({ risk }: { risk: string | null }) {
  if (!risk) return <Badge variant="secondary">Unknown</Badge>;
  const colors = FLOOD_RISK_COLORS[risk] || { bg: "bg-gray-100", text: "text-gray-800", icon: "❓" };
  return (
    <Badge className={`${colors.bg} ${colors.text} border-0`}>
      {colors.icon} {risk}
    </Badge>
  );
}

function RiskCard({
  title,
  icon: Icon,
  risk,
  annualChance,
}: {
  title: string;
  icon: React.ElementType;
  risk: string | null;
  annualChance: number | null;
}) {
  const colors = FLOOD_RISK_COLORS[risk || "Very Low"];
  
  return (
    <Card className={`${colors?.bg || "bg-gray-50"} border-0`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/50`}>
            <Icon className={`h-5 w-5 ${colors?.text || "text-gray-600"}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`font-semibold ${colors?.text || "text-gray-800"}`}>
              {risk || "Unknown"}
            </p>
            {annualChance !== null && (
              <p className="text-xs text-muted-foreground">
                {annualChance}% annual chance
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FloodRiskTab({ propertyAddress, postcode }: FloodRiskTabProps) {
  const [data, setData] = useState<FloodRiskData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(false);
  }, [propertyAddress, postcode]);

  const fetchData = async (forceRefresh: boolean) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("flood-risk-fetch", {
        body: { address: propertyAddress, postcode, forceRefresh },
      });

      if (error) throw error;

      if (response.success) {
        setData(response.data);
        if (response.source === "mock") {
          toast.info("Using demo data", { description: response.message });
        }
      } else {
        toast.error("Failed to fetch flood risk data", { description: response.error });
      }
    } catch (error) {
      console.error("Error fetching flood risk data:", error);
      toast.error("Failed to fetch flood risk data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    toast.info("Checking flood risk data...");
  };

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading flood risk data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Droplets className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Flood Risk Data</h3>
          <p className="text-muted-foreground mb-4">
            Click below to check the flood risk for this property
          </p>
          <Button onClick={() => fetchData(false)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Check Flood Risk
          </Button>
        </CardContent>
      </Card>
    );
  }

  const riskColors = FLOOD_RISK_COLORS[data.overall_flood_risk || "Very Low"];
  const isHighRisk = data.overall_flood_risk === "High" || data.overall_flood_risk === "Medium";

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Flood Risk Assessment
          </h3>
          {data.last_checked_at && (
            <p className="text-sm text-muted-foreground">
              Last checked: {format(new Date(data.last_checked_at), "dd MMM yyyy")}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Check Flood Risk
        </Button>
      </div>

      {/* Overall Risk Card */}
      <Card className={`${riskColors.bg} border-2 ${isHighRisk ? "border-red-300" : "border-green-300"}`}>
        <CardContent className="py-6">
          <div className="text-center">
            <span className="text-4xl">{riskColors.icon}</span>
            <h2 className={`text-2xl font-bold mt-2 ${riskColors.text}`}>
              {data.overall_flood_risk || "Unknown"} Risk
            </h2>
            <p className="text-muted-foreground mt-1">
              {FLOOD_RISK_DESCRIPTIONS[data.overall_flood_risk || "Very Low"]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        <RiskCard
          title="Rivers & Sea"
          icon={Waves}
          risk={data.rivers_and_sea_risk}
          annualChance={data.rivers_and_sea_annual_chance}
        />
        <RiskCard
          title="Surface Water"
          icon={CloudRain}
          risk={data.surface_water_risk}
          annualChance={data.surface_water_annual_chance}
        />
        <Card className={`${data.reservoir_risk ? "bg-yellow-50" : "bg-green-50"} border-0`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/50">
                <Building className={`h-5 w-5 ${data.reservoir_risk ? "text-yellow-600" : "text-green-600"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Reservoir Risk</p>
                <p className={`font-semibold ${data.reservoir_risk ? "text-yellow-800" : "text-green-800"}`}>
                  {data.reservoir_risk ? "At Risk" : "No Risk"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flood Zones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Flood Zones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🟢</span>
              <span>Flood Zone 1 (Low probability)</span>
            </div>
            <Badge variant={!data.in_flood_zone_2 && !data.in_flood_zone_3 ? "default" : "secondary"}>
              {!data.in_flood_zone_2 && !data.in_flood_zone_3 ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              {!data.in_flood_zone_2 && !data.in_flood_zone_3 ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🟡</span>
              <span>Flood Zone 2 (Medium - 0.1-1% annual)</span>
            </div>
            <Badge variant={data.in_flood_zone_2 ? "destructive" : "secondary"}>
              {data.in_flood_zone_2 ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              {data.in_flood_zone_2 ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <span>Flood Zone 3 (High - &gt;1% annual)</span>
            </div>
            <Badge variant={data.in_flood_zone_3 ? "destructive" : "secondary"}>
              {data.in_flood_zone_3 ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              {data.in_flood_zone_3 ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Flood Defenses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Flood Defenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.flood_defenses_present ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Flood defenses present</p>
                {data.defense_standard && (
                  <p className="text-sm text-green-700">Standard: {data.defense_standard}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">No flood defenses identified</p>
                <p className="text-sm text-yellow-700">Property may be unprotected from flooding</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Warnings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Current Flood Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!data.current_warnings || data.current_warnings.length === 0) ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <p className="font-medium text-green-800">No active flood warnings</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.current_warnings.map((warning, i) => (
                <div key={i} className="p-3 bg-red-50 rounded-lg">
                  <p className="font-medium text-red-800">{warning.severity}</p>
                  <p className="text-sm text-red-700">{warning.message}</p>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="mt-3 w-full" asChild>
            <a href="https://check-for-flooding.service.gov.uk/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Sign Up for Flood Warnings
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Insurance Implications */}
      <Card className={isHighRisk ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Insurance Implications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isHighRisk ? "text-yellow-800" : "text-green-800"}>
            {data.insurance_implications}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recommendations.map((rec: FloodRecommendation, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  rec.priority === "high"
                    ? "bg-red-50 border border-red-200"
                    : rec.priority === "medium"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Useful Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Useful Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://check-long-term-flood-risk.service.gov.uk/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Check Long-Term Flood Risk (Gov.uk)
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://www.floodre.co.uk/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Flood Re Insurance Scheme
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://www.gov.uk/prepare-for-flooding" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Prepare for Flooding (Gov.uk)
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
