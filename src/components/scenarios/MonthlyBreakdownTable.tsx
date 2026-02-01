import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import type { MonthlyForecast } from "@/types/scenario";
import { CONFIDENCE_STYLES } from "@/types/scenario";

interface MonthlyBreakdownTableProps {
  forecasts: MonthlyForecast[];
  onExport?: () => void;
}

export function MonthlyBreakdownTable({ forecasts, onExport }: MonthlyBreakdownTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Net CF</TableHead>
                <TableHead className="text-right">Cumulative</TableHead>
                <TableHead className="text-center">Confidence</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.map((forecast, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{forecast.month}</TableCell>
                  <TableCell className="text-right text-green-600">
                    £{forecast.income.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-orange-600">
                    £{forecast.expenses.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    forecast.netCashFlow >= 0 ? "text-primary" : "text-red-600"
                  }`}>
                    {forecast.netCashFlow >= 0 ? "+" : ""}£{forecast.netCashFlow.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    £{forecast.cumulative.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={CONFIDENCE_STYLES[forecast.confidence]}>
                      {forecast.confidence === 'high' && '🟢'}
                      {forecast.confidence === 'medium' && '🟡'}
                      {forecast.confidence === 'low' && '⚪'}
                      {' '}{forecast.confidence.charAt(0).toUpperCase() + forecast.confidence.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {forecast.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
