import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { CrimeStatistics, CrimeBreakdown } from "@/types/crime";
import { SAFETY_RATING_COLORS, CRIME_CATEGORIES } from "@/types/crime";
import {
  RefreshCw,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Check,
  ExternalLink,
  Loader2,
  BarChart3,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CrimeTabProps {
  propertyAddress: string;
  postcode: string;
}

function SafetyRatingBadge({ rating, score }: { rating: string | null; score: number | null }) {
  if (!rating) return <Badge variant="secondary">Unknown</Badge>;
  const colors = SAFETY_RATING_COLORS[rating] || { bg: "bg-gray-100", text: "text-gray-800", icon: "❓" };
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg}`}>
      <span className="text-2xl">{colors.icon}</span>
      <div>
        <span className={`font-bold ${colors.text}`}>{rating}</span>
        {score !== null && (
          <span className={`ml-2 text-sm ${colors.text}`}>({score}/100)</span>
        )}
      </div>
    </div>
  );
}

function TrendIndicator({ trend, percentage }: { trend: string | null; percentage: number | null }) {
  if (!trend) return null;
  
  const icons = {
    increasing: <TrendingUp className="h-4 w-4 text-red-500" />,
    stable: <Minus className="h-4 w-4 text-yellow-500" />,
    decreasing: <TrendingDown className="h-4 w-4 text-green-500" />,
  };

  const colors = {
    increasing: "text-red-600",
    stable: "text-yellow-600",
    decreasing: "text-green-600",
  };

  return (
    <div className="flex items-center gap-1">
      {icons[trend as keyof typeof icons]}
      <span className={colors[trend as keyof typeof colors]}>
        {trend.charAt(0).toUpperCase() + trend.slice(1)}
        {percentage && ` (${percentage}%)`}
      </span>
    </div>
  );
}

function CrimeBreakdownBar({ category, count, total }: { category: string; count: number; total: number }) {
  const categoryInfo = CRIME_CATEGORIES[category];
  if (!categoryInfo || count === 0) return null;
  
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>{categoryInfo.icon}</span>
          <span>{categoryInfo.label}</span>
        </div>
        <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export function CrimeTab({ propertyAddress, postcode }: CrimeTabProps) {
  const [data, setData] = useState<CrimeStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(false);
  }, [propertyAddress, postcode]);

  const fetchData = async (forceRefresh: boolean) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("crime-data-fetch", {
        body: { address: propertyAddress, postcode, forceRefresh },
      });

      if (error) throw error;

      if (response.success) {
        setData(response.data);
        if (response.source === "mock") {
          toast.info("Using demo data", { description: response.message });
        }
      } else {
        toast.error("Failed to fetch crime data", { description: response.error });
      }
    } catch (error) {
      console.error("Error fetching crime data:", error);
      toast.error("Failed to fetch crime data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    toast.info("Checking crime statistics...");
  };

  if (isLoading && !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading crime statistics...</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Crime Data</h3>
          <p className="text-muted-foreground mb-4">
            Click below to check crime statistics for this area
          </p>
          <Button onClick={() => fetchData(false)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Check Crime Statistics
          </Button>
        </CardContent>
      </Card>
    );
  }

  const safetyColors = SAFETY_RATING_COLORS[data.safety_rating || "Average"];
  const isHighCrime = data.safety_rating === "High Crime" || data.safety_rating === "Below Average";

  // Prepare crime breakdown for display
  const crimeCategories = [
    { key: "antisocial_behaviour", count: data.antisocial_behaviour },
    { key: "violence_sexual_offences", count: data.violence_sexual_offences },
    { key: "vehicle_crime", count: data.vehicle_crime },
    { key: "burglary", count: data.burglary },
    { key: "criminal_damage", count: data.criminal_damage },
    { key: "other_theft", count: data.other_theft },
    { key: "public_order", count: data.public_order },
    { key: "drugs", count: data.drugs },
    { key: "bicycle_theft", count: data.bicycle_theft },
    { key: "robbery", count: data.robbery },
    { key: "shoplifting", count: data.shoplifting },
    { key: "theft_from_person", count: data.theft_from_person },
    { key: "possession_weapons", count: data.possession_weapons },
    { key: "other_crime", count: data.other_crime },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Crime & Safety Statistics
          </h3>
          {data.last_updated_at && (
            <p className="text-sm text-muted-foreground">
              Data period: {data.data_period_start} to {data.data_period_end}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Check Crime Data
        </Button>
      </div>

      {/* Safety Rating Card */}
      <Card className={`${safetyColors.bg} border-2 ${isHighCrime ? "border-red-300" : "border-green-300"}`}>
        <CardContent className="py-6">
          <div className="text-center">
            <SafetyRatingBadge rating={data.safety_rating} score={data.safety_score} />
            <p className="text-muted-foreground mt-2">
              {isHighCrime
                ? "This area has higher crime rates than average"
                : "This area has lower crime rates than average"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Crime Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{data.total_crimes}</p>
            <p className="text-sm text-muted-foreground">Total Crimes (12 months)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendIndicator trend={data.crime_trend} percentage={data.trend_percentage} />
            <p className="text-sm text-muted-foreground mt-1">Crime Trend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-medium">
              {data.vs_national_average === "below" && "📉 25% below"}
              {data.vs_national_average === "average" && "➖ Average"}
              {data.vs_national_average === "above" && "📈 Above"}
            </p>
            <p className="text-sm text-muted-foreground">vs National Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      {data.monthly_data && data.monthly_data.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Monthly Trend (Last 12 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthly_data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCrimes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    tickFormatter={(value) => value.split("-")[1]}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Crimes"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorCrimes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crime Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Crime Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {crimeCategories.slice(0, 8).map(({ key, count }) => (
            <CrimeBreakdownBar
              key={key}
              category={key}
              count={count}
              total={data.total_crimes}
            />
          ))}
        </CardContent>
      </Card>

      {/* Police Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Police Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Police Force</span>
            <span className="font-medium">{data.police_force || "Unknown"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Neighbourhood</span>
            <span className="font-medium">{data.neighbourhood_name || "Unknown"}</span>
          </div>
          <div className="pt-2 space-y-2">
            <p className="text-sm text-muted-foreground">Contact:</p>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>Non-emergency: 101 | Emergency: 999</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Recommendations */}
      <Card className={isHighCrime ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {isHighCrime ? (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            ) : (
              <Check className="h-4 w-4 text-green-600" />
            )}
            Safety Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isHighCrime ? (
            <div className="space-y-3">
              <p className="font-medium text-yellow-800">Enhanced security recommended:</p>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Professional alarm system</li>
                <li>CCTV cameras</li>
                <li>Security lighting</li>
                <li>Reinforced doors & windows</li>
                <li>Join Neighbourhood Watch</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-medium text-green-800">✅ This is a safe area overall</p>
              <p className="text-sm text-green-700">Standard precautions recommended:</p>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                <li>Lock doors and windows</li>
                <li>Install good quality locks</li>
                <li>Keep valuables out of sight</li>
                <li>Good exterior lighting</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Useful Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Useful Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://www.police.uk/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Police.uk - View Crime Map
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://www.ourwatch.org.uk/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Neighbourhood Watch
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="https://www.immobilise.com/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Register Property (Immobilise)
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
