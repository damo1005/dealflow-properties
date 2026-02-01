import { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Play, RotateCcw, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import type { BTLInputs } from "@/stores/calculatorStore";
import {
  runSimulation,
  getDefaultRanges,
  calculateProbabilities,
  type SimulationConfig,
  type SimulationResult,
  type SimulationStats,
  type VariableRange,
} from "@/lib/monteCarloSimulation";
import { formatCurrency } from "@/lib/scenarioConfig";
import { cn } from "@/lib/utils";

interface MonteCarloDialogProps {
  open: boolean;
  onClose: () => void;
  baseInputs: BTLInputs;
}

type DistributionType = "normal" | "uniform" | "triangular";

export function MonteCarloDialog({ open, onClose, baseInputs }: MonteCarloDialogProps) {
  const [step, setStep] = useState<"config" | "running" | "results">("config");
  const [iterations, setIterations] = useState(1000);
  const [progress, setProgress] = useState(0);
  const [ranges, setRanges] = useState<SimulationConfig["ranges"]>(() =>
    getDefaultRanges(baseInputs)
  );
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [stats, setStats] = useState<SimulationStats | null>(null);

  const updateRange = useCallback(
    (key: keyof SimulationConfig["ranges"], field: keyof VariableRange, value: number | DistributionType) => {
      setRanges((prev) => ({
        ...prev,
        [key]: { ...prev[key], [field]: value },
      }));
    },
    []
  );

  const applyPreset = useCallback(
    (preset: "conservative" | "moderate" | "optimistic") => {
      const multipliers = {
        conservative: { range: 0.25 },
        moderate: { range: 0.15 },
        optimistic: { range: 0.08 },
      };
      const m = multipliers[preset];

      setRanges({
        mortgageRate: {
          min: Math.max(2, baseInputs.mortgageRate - 1),
          max: baseInputs.mortgageRate + (preset === "conservative" ? 4 : preset === "moderate" ? 3 : 1.5),
          mostLikely: baseInputs.mortgageRate,
          distribution: "normal",
        },
        monthlyRent: {
          min: baseInputs.monthlyRent * (1 - m.range),
          max: baseInputs.monthlyRent * (1 + m.range),
          mostLikely: baseInputs.monthlyRent,
          distribution: "normal",
        },
        voidPercent: {
          min: 2,
          max: preset === "conservative" ? 20 : preset === "moderate" ? 15 : 8,
          mostLikely: baseInputs.voidPercent,
          distribution: "triangular",
        },
        maintenancePercent: {
          min: 5,
          max: preset === "conservative" ? 18 : preset === "moderate" ? 15 : 12,
          mostLikely: baseInputs.maintenancePercent,
          distribution: "normal",
        },
      });
    },
    [baseInputs]
  );

  const runSim = useCallback(() => {
    setStep("running");
    setProgress(0);

    // Use requestAnimationFrame for smooth progress updates
    setTimeout(() => {
      const { results, stats } = runSimulation(
        baseInputs,
        { iterations, ranges },
        (current, total) => {
          setProgress((current / total) * 100);
        }
      );
      setResults(results);
      setStats(stats);
      setProgress(100);
      setStep("results");
    }, 100);
  }, [baseInputs, iterations, ranges]);

  const reset = useCallback(() => {
    setStep("config");
    setResults(null);
    setStats(null);
    setProgress(0);
  }, []);

  // Generate histogram data
  const histogramData = useMemo(() => {
    if (!results) return [];

    const bins = 20;
    const min = Math.min(...results.cashFlows);
    const max = Math.max(...results.cashFlows);
    const binWidth = (max - min) / bins;

    const histogram: { range: string; count: number; min: number; max: number }[] = [];
    for (let i = 0; i < bins; i++) {
      const binMin = min + i * binWidth;
      const binMax = min + (i + 1) * binWidth;
      const count = results.cashFlows.filter((cf) => cf >= binMin && cf < binMax).length;
      histogram.push({
        range: `£${Math.round(binMin)}`,
        count,
        min: binMin,
        max: binMax,
      });
    }
    return histogram;
  }, [results]);

  // Calculate probabilities
  const probabilities = useMemo(() => {
    if (!results) return {};
    return calculateProbabilities(results.cashFlows, [0, 50, 100, 150, 200]);
  }, [results]);

  const renderRangeConfig = (
    label: string,
    key: keyof SimulationConfig["ranges"],
    unit: string,
    format: (v: number) => string
  ) => {
    const range = ranges[key];
    return (
      <div className="space-y-3 p-3 border rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="font-medium">{label}</Label>
          <Select
            value={range.distribution}
            onValueChange={(v) => updateRange(key, "distribution", v as DistributionType)}
          >
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="triangular">Triangular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">Min</Label>
            <Input
              type="number"
              value={range.min.toFixed(unit === "%" ? 1 : 0)}
              onChange={(e) => updateRange(key, "min", parseFloat(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Most Likely</Label>
            <Input
              type="number"
              value={range.mostLikely.toFixed(unit === "%" ? 1 : 0)}
              onChange={(e) => updateRange(key, "mostLikely", parseFloat(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Max</Label>
            <Input
              type="number"
              value={range.max.toFixed(unit === "%" ? 1 : 0)}
              onChange={(e) => updateRange(key, "max", parseFloat(e.target.value))}
              className="h-8"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Monte Carlo Simulation</DialogTitle>
          <DialogDescription>
            Test thousands of random scenarios to understand probability distributions
          </DialogDescription>
        </DialogHeader>

        {step === "config" && (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {/* Preset Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("conservative")}
                >
                  Conservative
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("moderate")}
                >
                  Moderate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset("optimistic")}
                >
                  Optimistic
                </Button>
              </div>

              {/* Variable Ranges */}
              <div className="grid gap-4 md:grid-cols-2">
                {renderRangeConfig("Interest Rate", "mortgageRate", "%", (v) => `${v.toFixed(2)}%`)}
                {renderRangeConfig("Monthly Rent", "monthlyRent", "£", (v) => formatCurrency(v))}
                {renderRangeConfig("Void Period", "voidPercent", "%", (v) => `${v.toFixed(1)}%`)}
                {renderRangeConfig("Maintenance", "maintenancePercent", "%", (v) => `${v.toFixed(1)}%`)}
              </div>

              {/* Iterations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Iterations: {iterations.toLocaleString()}</Label>
                  <span className="text-xs text-muted-foreground">
                    Est. time: ~{Math.ceil(iterations / 500)}s
                  </span>
                </div>
                <Slider
                  value={[iterations]}
                  onValueChange={([v]) => setIterations(v)}
                  min={100}
                  max={10000}
                  step={100}
                />
              </div>

              {/* Run Button */}
              <Button onClick={runSim} className="w-full" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </ScrollArea>
        )}

        {step === "running" && (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md space-y-4">
              <p className="text-center text-lg font-medium">
                Running simulation...
              </p>
              <Progress value={progress} className="h-3" />
              <p className="text-center text-sm text-muted-foreground">
                {Math.round((progress / 100) * iterations).toLocaleString()} of {iterations.toLocaleString()} iterations
              </p>
            </div>
          </div>
        )}

        {step === "results" && stats && results && (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Cash Flow Mean</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={cn(
                      "text-2xl font-bold",
                      stats.cashFlow.mean >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(stats.cashFlow.mean)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Std Dev: ±{formatCurrency(stats.cashFlow.stdDev)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">90% Confidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {formatCurrency(stats.cashFlow.percentile10)} to {formatCurrency(stats.cashFlow.percentile90)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Middle 80% of results
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Positive Probability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={cn(
                      "text-2xl font-bold",
                      probabilities[0] >= 90 ? "text-green-600" :
                      probabilities[0] >= 70 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {probabilities[0]?.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Chance of positive cash flow
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ROI Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {stats.roi.percentile10.toFixed(1)}% - {stats.roi.percentile90.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mean: {stats.roi.mean.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Histogram */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cash Flow Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={histogramData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="range"
                          tick={{ fontSize: 10 }}
                          interval={Math.floor(histogramData.length / 6)}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.[0]) return null;
                            const data = payload[0].payload;
                            const pct = ((data.count / iterations) * 100).toFixed(1);
                            return (
                              <div className="bg-background border rounded p-2 text-sm">
                                <p className="font-medium">
                                  {formatCurrency(data.min)} to {formatCurrency(data.max)}
                                </p>
                                <p className="text-muted-foreground">
                                  {data.count} scenarios ({pct}%)
                                </p>
                              </div>
                            );
                          }}
                        />
                        <ReferenceLine
                          x={`£${Math.round(stats.cashFlow.mean)}`}
                          stroke="hsl(var(--primary))"
                          strokeDasharray="5 5"
                        />
                        <Bar
                          dataKey="count"
                          fill="hsl(var(--primary))"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Probability Statements */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Probability Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { threshold: 0, label: "Positive cash flow" },
                    { threshold: 100, label: "Above £100/mo" },
                    { threshold: 200, label: "Above £200/mo" },
                  ].map(({ threshold, label }) => {
                    const prob = probabilities[threshold] || 0;
                    return (
                      <div key={threshold} className="flex items-center gap-3">
                        {prob >= 70 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : prob >= 40 ? (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{label}</span>
                            <Badge variant={prob >= 70 ? "default" : prob >= 40 ? "secondary" : "destructive"}>
                              {prob.toFixed(1)}%
                            </Badge>
                          </div>
                          <Progress value={prob} className="h-2 mt-1" />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Run Again
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
