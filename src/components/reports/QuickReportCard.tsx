import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Receipt, 
  TrendingUp, 
  Building2, 
  ShieldCheck,
  FileText
} from "lucide-react";
import type { QuickReport } from "@/types/reports";

const iconMap: Record<string, React.ElementType> = {
  'bar-chart': BarChart3,
  'receipt': Receipt,
  'trending-up': TrendingUp,
  'building': Building2,
  'shield-check': ShieldCheck,
  'file-text': FileText,
};

interface QuickReportCardProps {
  report: QuickReport;
  onGenerate: (report: QuickReport) => void;
}

export function QuickReportCard({ report, onGenerate }: QuickReportCardProps) {
  const Icon = iconMap[report.icon] || FileText;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{report.title}</h3>
              {report.badge && (
                <Badge variant="secondary" className="text-xs">
                  {report.badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {report.description}
            </p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Includes:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {report.includes.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={() => onGenerate(report)} className="w-full">
          Generate Now
        </Button>
      </CardFooter>
    </Card>
  );
}
