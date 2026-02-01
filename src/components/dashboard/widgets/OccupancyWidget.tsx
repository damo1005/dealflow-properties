import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Home, AlertTriangle, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VacantProperty {
  address: string;
  vacantSince: Date;
  listed: boolean;
  viewings: number;
}

interface UpcomingEnd {
  address: string;
  endDate: Date;
}

interface OccupancyWidgetProps {
  occupancyRate: number;
  targetRate?: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  avgVoidDays: number;
  industryAvg?: number;
  vacantProperties: VacantProperty[];
  upcomingEnds: UpcomingEnd[];
  monthlyData: { month: string; rate: number }[];
}

export function OccupancyWidget({
  occupancyRate,
  targetRate = 97,
  totalUnits,
  occupiedUnits,
  vacantUnits,
  avgVoidDays,
  industryAvg = 18,
  vacantProperties,
  upcomingEnds,
  monthlyData,
}: OccupancyWidgetProps) {
  const belowTarget = occupancyRate < targetRate;
  const betterThanIndustry = avgVoidDays < industryAvg;

  const getDaysVacant = (date: Date) => {
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          Occupancy Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="h-24 w-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${occupancyRate * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Target: {targetRate}%
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-lg font-bold">{totalUnits}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <p className="text-lg font-bold text-green-600">{occupiedUnits}</p>
            <p className="text-xs text-muted-foreground">Occupied</p>
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">{vacantUnits}</p>
            <p className="text-xs text-muted-foreground">Vacant</p>
          </div>
        </div>

        {vacantProperties.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              Vacant Properties
            </p>
            {vacantProperties.slice(0, 2).map((prop, i) => (
              <div key={i} className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-sm">
                <p className="font-medium truncate">{prop.address}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{getDaysVacant(prop.vacantSince)} days vacant</span>
                  <span>{prop.viewings} viewings</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`flex items-center justify-between p-2 rounded-lg ${betterThanIndustry ? "bg-green-50 dark:bg-green-950/30" : "bg-yellow-50 dark:bg-yellow-950/30"}`}>
          <div>
            <p className="text-sm font-medium">Avg Void: {avgVoidDays.toFixed(0)} days</p>
            <p className="text-xs text-muted-foreground">Industry: {industryAvg} days</p>
          </div>
          {betterThanIndustry ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          )}
        </div>

        {upcomingEnds.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Upcoming Tenancy Ends
            </p>
            {upcomingEnds.slice(0, 2).map((end, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{end.address}</span>
                <Badge variant="outline" className="ml-2">
                  {getDaysUntil(end.endDate)} days
                </Badge>
              </div>
            ))}
          </div>
        )}

        {monthlyData.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Trend (12 months)</p>
            <div className="h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" hide />
                  <YAxis domain={[80, 100]} hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Occupancy"]}
                  />
                  <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
