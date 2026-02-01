
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, TrendingUp, TrendingDown, Minus, MapPin, Download, Eye, Star } from "lucide-react";
import { useYieldMapStore } from "@/stores/yieldMapStore";

export default function YieldMap() {
  const { areas, filters, setFilters, getTopAreas, selectedArea, setSelectedArea, getYieldColor } = useYieldMapStore();
  const topAreas = getTopAreas(10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout title="Rental Yield Heatmap">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls & Map Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search city or postcode..."
                      value={filters.searchQuery}
                      onChange={(e) => setFilters({ searchQuery: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select
                  value={filters.viewType}
                  onValueChange={(value: 'gross_yield' | 'net_yield' | 'price_growth') => 
                    setFilters({ viewType: value })
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gross_yield">Gross Yield</SelectItem>
                    <SelectItem value="net_yield">Net Yield</SelectItem>
                    <SelectItem value="price_growth">Price Growth</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.propertyType}
                  onValueChange={(value: 'all' | 'houses' | 'flats') => 
                    setFilters({ propertyType: value })
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="houses">Houses</SelectItem>
                    <SelectItem value="flats">Flats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Yield Range</span>
                  <span className="text-sm font-medium">{filters.yieldRange[0]}% - {filters.yieldRange[1]}%</span>
                </div>
                <Slider
                  value={filters.yieldRange}
                  onValueChange={(value) => setFilters({ yieldRange: value as [number, number] })}
                  min={0}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[400px] bg-muted relative flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Interactive Yield Map</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Map visualization showing postcode areas colored by rental yield.
                    Click any area to view detailed statistics.
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    {[8, 7, 6, 5, 4].map((yield_val) => (
                      <div key={yield_val} className="flex items-center gap-1">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: getYieldColor(yield_val) }}
                        />
                        <span className="text-xs">{yield_val}%+</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Area Markers */}
                <div className="absolute inset-0 p-4">
                  {areas.slice(0, 6).map((area, index) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedArea(area)}
                      className="absolute p-2 rounded-lg bg-background/90 shadow-md hover:shadow-lg transition-shadow border text-xs"
                      style={{
                        left: `${15 + (index % 3) * 30}%`,
                        top: `${20 + Math.floor(index / 3) * 40}%`,
                      }}
                    >
                      <div className="font-medium">{area.postcode_district}</div>
                      <div 
                        className="font-bold"
                        style={{ color: getYieldColor(area.avg_gross_yield || 0) }}
                      >
                        {area.avg_gross_yield?.toFixed(1)}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Area Details */}
          {selectedArea && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {selectedArea.postcode_district}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedArea(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold" style={{ color: getYieldColor(selectedArea.avg_gross_yield || 0) }}>
                      {selectedArea.avg_gross_yield?.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Gross Yield</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{formatCurrency(selectedArea.avg_property_price || 0)}</p>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{formatCurrency(selectedArea.avg_rent_pcm || 0)}</p>
                    <p className="text-sm text-muted-foreground">Avg Rent/pcm</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Properties
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Star className="h-4 w-4 mr-2" />
                    Save to Watchlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Top Areas Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Yield Areas</CardTitle>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Yield</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAreas.map((area) => (
                    <TableRow 
                      key={area.postcode_district}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        const fullArea = areas.find(a => a.postcode_district === area.postcode_district);
                        if (fullArea) setSelectedArea(fullArea);
                      }}
                    >
                      <TableCell className="font-medium">{area.rank}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{area.postcode_district}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(area.avg_property_price)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: `${getYieldColor(area.avg_gross_yield)}20`, color: getYieldColor(area.avg_gross_yield) }}
                        >
                          {area.avg_gross_yield.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{getTrendIcon(area.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Yield Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { min: 8, label: 'Excellent', color: getYieldColor(8) },
                { min: 7, label: 'Very Good', color: getYieldColor(7) },
                { min: 6, label: 'Good', color: getYieldColor(6) },
                { min: 5, label: 'Average', color: getYieldColor(5) },
                { min: 0, label: 'Below Avg', color: getYieldColor(4) },
              ].map((item) => (
                <div key={item.min} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.min}%+ - {item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
