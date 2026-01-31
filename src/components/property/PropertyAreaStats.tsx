import { TrendingUp, Users, Shield, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyDetail } from "@/data/mockPropertyDetail";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PropertyAreaStatsProps {
  property: PropertyDetail;
}

// Mock price trend data
const priceTrendData = [
  { date: "Jul 23", price: 420000 },
  { date: "Aug 23", price: 425000 },
  { date: "Sep 23", price: 430000 },
  { date: "Oct 23", price: 435000 },
  { date: "Nov 23", price: 440000 },
  { date: "Dec 23", price: 445000 },
  { date: "Jan 24", price: 450000 },
  { date: "Feb 24", price: 448000 },
];

const deprivationLabels: Record<number, string> = {
  1: "Least Deprived",
  2: "Low Deprivation",
  3: "Below Average",
  4: "Average",
  5: "Above Average",
  6: "Moderate",
  7: "High Deprivation",
  8: "Very Deprived",
  9: "Severely Deprived",
  10: "Most Deprived",
};

export function PropertyAreaStats({ property }: PropertyAreaStatsProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Area Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Price */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Area Price</p>
              <p className="font-semibold text-foreground">
                {formatPrice(property.averageAreaPrice)}
              </p>
            </div>
          </div>
          <Badge variant={property.price < property.averageAreaPrice ? "default" : "secondary"}>
            {property.price < property.averageAreaPrice ? "Below Average" : "Above Average"}
          </Badge>
        </div>

        {/* Price Trends Chart */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground text-sm">Price Trends (6 months)</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Avg Price"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deprivation Index</p>
              <p className="font-semibold text-foreground">
                {deprivationLabels[property.areaDeprivationIndex]}
              </p>
            </div>
          </div>
          <Badge variant="outline">{property.areaDeprivationIndex}/10</Badge>
        </div>

        {/* Safety */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Crime Rate</p>
              <p className="font-semibold text-foreground">{property.crimeRate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
