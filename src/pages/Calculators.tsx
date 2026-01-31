import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const calculators = [
  {
    id: "roi",
    title: "ROI Calculator",
    description: "Calculate return on investment for rental properties",
    icon: TrendingUp,
  },
  {
    id: "mortgage",
    title: "Mortgage Calculator",
    description: "Estimate monthly payments and total costs",
    icon: DollarSign,
  },
  {
    id: "cap-rate",
    title: "Cap Rate Calculator",
    description: "Determine capitalization rate for properties",
    icon: Percent,
  },
  {
    id: "cash-flow",
    title: "Cash Flow Analysis",
    description: "Analyze monthly and annual cash flow projections",
    icon: Calculator,
  },
];

export default function Calculators() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Calculators">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Analyze potential deals with our investment calculators
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {calculators.map((calc) => (
            <Card
              key={calc.id}
              className="shadow-card card-hover cursor-pointer"
              onClick={() => navigate(`/calculators/${calc.id}`)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <calc.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{calc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{calc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
