import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Download,
  Clock,
  Users,
  TrendingUp,
  Mail,
  MousePointer,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsPanelProps {
  packId: string;
  viewCount: number;
  downloadCount: number;
}

interface ViewRecord {
  id: string;
  viewer_email?: string;
  viewer_name?: string;
  viewed_at: string;
  duration_seconds?: number;
  downloaded: boolean;
}

export function AnalyticsPanel({
  packId,
  viewCount,
  downloadCount,
}: AnalyticsPanelProps) {
  const [views, setViews] = useState<ViewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadViews();
  }, [packId]);

  const loadViews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("deal_pack_views")
        .select("*")
        .eq("deal_pack_id", packId)
        .order("viewed_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setViews((data || []) as ViewRecord[]);
    } catch (error) {
      console.error("Error loading views:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const uniqueViewers = new Set(views.map((v) => v.viewer_email).filter(Boolean)).size;
  const avgDuration = views.length > 0
    ? Math.round(views.reduce((acc, v) => acc + (v.duration_seconds || 0), 0) / views.length)
    : 0;
  const downloadRate = viewCount > 0 ? Math.round((downloadCount / viewCount) * 100) : 0;

  // Group views by day for chart
  const viewsByDay = views.reduce((acc: Record<string, number>, view) => {
    const date = new Date(view.viewed_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(viewsByDay)
    .slice(0, 7)
    .reverse()
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      views: count,
    }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{viewCount}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Eye className="h-3 w-3" />
                Total Views
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{downloadCount}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Download className="h-3 w-3" />
                Downloads
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{uniqueViewers}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Unique Viewers
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{avgDuration}s</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Avg Duration
              </div>
            </div>
          </div>

          {/* Download Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Download Rate</span>
              <span className="font-medium">{downloadRate}%</span>
            </div>
            <Progress value={downloadRate} />
          </div>

          {/* Views Chart */}
          {chartData.length > 0 && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Viewers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recent Viewers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : views.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No views yet. Share your deal pack to start tracking engagement.
            </p>
          ) : (
            <div className="space-y-2">
              {views.slice(0, 5).map((view) => (
                <div
                  key={view.id}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {view.viewer_email || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(view.viewed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {view.downloaded && (
                      <Badge variant="outline" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Downloaded
                      </Badge>
                    )}
                    {view.duration_seconds && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(view.duration_seconds / 60)}m
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
