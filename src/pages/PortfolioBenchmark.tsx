import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Download, Star, Lightbulb } from "lucide-react";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { REGIONS } from "@/types/benchmark";

export default function PortfolioBenchmark() {
  const { 
    selectedRegion, 
    selectedPropertyType, 
    setSelectedRegion, 
    setSelectedPropertyType,
    getScorecard 
  } = useBenchmarkStore();
  
  const scorecard = getScorecard();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-green-500 bg-green-50';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'below_average': return 'text-orange-600 bg-orange-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 80) return `Top ${100 - percentile}%`;
    if (percentile >= 50) return `Top ${100 - percentile}%`;
    if (percentile >= 20) return 'Below Average';
    return 'Poor';
  };

  return (
    <AppLayout title="Portfolio Benchmarking">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">Houses</SelectItem>
            <SelectItem value="flat">Flats</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overall Score */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(scorecard.overall_score / 100) * 352} 352`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold">{scorecard.overall_score}</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(scorecard.overall_score / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="text-lg font-medium mt-2">{scorecard.rating}</p>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Portfolio vs Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scorecard.metrics.map((metric) => (
                <div key={metric.name} className="flex items-center gap-4">
                  <div className="w-32 flex-shrink-0">
                    <p className="font-medium text-sm">{metric.name}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{metric.yourValue.toFixed(1)}%</span>
                      <span className="text-sm text-muted-foreground">{metric.marketValue.toFixed(1)}%</span>
                    </div>
                    <Progress value={metric.percentile} className="h-2" />
                  </div>
                  <div className="w-20 flex items-center gap-1">
                    {metric.difference > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : metric.difference < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${metric.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.difference > 0 ? '+' : ''}{metric.difference.toFixed(1)}%
                    </span>
                  </div>
                  <Badge className={`w-24 justify-center ${getStatusColor(metric.status)}`}>
                    {getPercentileLabel(metric.percentile)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scorecard.metrics.filter(m => m.status === 'below_average' || m.status === 'poor').map((metric) => (
              <div key={metric.name} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-orange-500">💡</span>
                <p className="text-sm">
                  Your <strong>{metric.name}</strong> is {Math.abs(metric.difference).toFixed(1)}% 
                  {metric.difference < 0 ? ' below' : ' above'} market average. 
                  {metric.name === 'Expense Ratio' && ' Consider reviewing management costs.'}
                  {metric.name === 'Capital Growth' && ' Consider areas with better growth fundamentals.'}
                </p>
              </div>
            ))}
            {scorecard.metrics.filter(m => m.status === 'excellent').map((metric) => (
              <div key={metric.name} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-500">✓</span>
                <p className="text-sm">
                  Excellent <strong>{metric.name}</strong> - you're in the top {100 - metric.percentile}% of landlords.
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
