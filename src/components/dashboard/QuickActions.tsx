import { Search, Plus, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "New Search",
    description: "Find investment properties",
    icon: Search,
    href: "/search",
    variant: "default" as const,
  },
  {
    title: "Add Property",
    description: "Add to your pipeline",
    icon: Plus,
    href: "/pipeline",
    variant: "outline" as const,
  },
  {
    title: "Run Calculator",
    description: "Analyze a deal",
    icon: Calculator,
    href: "/calculators",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto justify-start gap-4 p-4"
            onClick={() => navigate(action.href)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <action.icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">{action.title}</p>
              <p className="text-sm text-muted-foreground font-normal">
                {action.description}
              </p>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
