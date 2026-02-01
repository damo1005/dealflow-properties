import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface ForecastSummaryCardProps {
  projectedIncome: number;
  projectedExpenses: number;
  projectedNetCashFlow: number;
  averageMonthly: number;
  highConfidenceMonths: number;
  mediumConfidenceMonths: number;
}

export function ForecastSummaryCard({
  projectedIncome,
  projectedExpenses,
  projectedNetCashFlow,
  averageMonthly,
  highConfidenceMonths,
  mediumConfidenceMonths,
}: ForecastSummaryCardProps) {
  const isPositive = projectedNetCashFlow >= 0;

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            FORECAST SUMMARY (Next 12 Months)
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Projected Income</p>
            <p className="text-2xl font-bold text-green-600">
              £{projectedIncome.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Projected Expenses</p>
            <p className="text-2xl font-bold text-orange-600">
              £{projectedExpenses.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Net Cash Flow</p>
            <p className={`text-2xl font-bold ${isPositive ? "text-primary" : "text-red-600"}`}>
              {isPositive ? "+" : ""}£{projectedNetCashFlow.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average Monthly</p>
            <p className="text-2xl font-bold">
              £{averageMonthly.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <Badge variant="default" className="bg-green-600">
            🟢 High ({highConfidenceMonths} months)
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            🟡 Medium ({mediumConfidenceMonths} months)
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
