import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Receipt, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface ExpenseBreakdown {
  mortgages: number;
  maintenance: number;
  management: number;
  insurance: number;
  utilities: number;
  other: number;
}

interface ExpensesWidgetProps {
  totalExpenses: number;
  breakdown: ExpenseBreakdown;
  budget?: number;
  previousMonth?: ExpenseBreakdown;
}

export function ExpensesWidget({
  totalExpenses,
  breakdown,
  budget = totalExpenses * 1.05,
  previousMonth,
}: ExpensesWidgetProps) {
  const budgetPercentage = budget > 0 ? (totalExpenses / budget) * 100 : 100;
  const underBudget = totalExpenses < budget;
  const budgetDiff = Math.abs(budget - totalExpenses);

  const categories = [
    { key: "mortgages", label: "Mortgages", value: breakdown.mortgages },
    { key: "maintenance", label: "Maintenance", value: breakdown.maintenance },
    { key: "management", label: "Management", value: breakdown.management },
    { key: "insurance", label: "Insurance", value: breakdown.insurance },
    { key: "utilities", label: "Utilities", value: breakdown.utilities },
    { key: "other", label: "Other", value: breakdown.other },
  ].filter((c) => c.value > 0);

  const getChange = (key: keyof ExpenseBreakdown) => {
    if (!previousMonth) return null;
    const current = breakdown[key];
    const prev = previousMonth[key];
    if (prev === 0) return null;
    const change = current - prev;
    return { change, percentage: ((change / prev) * 100).toFixed(0) };
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Receipt className="h-4 w-4 text-orange-500" />
          Expenses This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl font-bold">£{totalExpenses.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Budget: £{budget.toLocaleString()}</span>
          </div>
          <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
          <p className={`text-xs mt-1 ${underBudget ? "text-green-600" : "text-red-600"}`}>
            {underBudget ? "Under" : "Over"} budget: £{budgetDiff.toLocaleString()} {underBudget ? "✅" : "⚠️"}
          </p>
        </div>

        <div className="space-y-2">
          {categories.map((category) => {
            const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0;
            const change = getChange(category.key as keyof ExpenseBreakdown);

            return (
              <div key={category.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{category.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      £{category.value.toLocaleString()} ({percentage.toFixed(0)}%)
                    </span>
                    {change && change.change !== 0 && (
                      <span
                        className={`text-xs flex items-center ${
                          change.change > 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {change.change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={percentage} className="h-1.5 bg-muted" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
