import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Edit, 
  Copy, 
  Trash2,
  Eye
} from "lucide-react";
import type { ReportTemplate } from "@/types/reports";

interface ReportTemplateCardProps {
  template: ReportTemplate;
  onUse: (template: ReportTemplate) => void;
  onPreview: (template: ReportTemplate) => void;
  onEdit?: (template: ReportTemplate) => void;
  onDuplicate?: (template: ReportTemplate) => void;
  onDelete?: (template: ReportTemplate) => void;
}

const typeLabels: Record<string, string> = {
  monthly_performance: 'Monthly Performance',
  quarterly_review: 'Quarterly Review',
  annual_summary: 'Annual Summary',
  tax_year_end: 'Tax Year-End',
  investor_report: 'Investor Report',
  lender_report: 'Lender Report',
  compliance_report: 'Compliance Report',
  property_analysis: 'Property Analysis',
  portfolio_valuation: 'Portfolio Valuation',
  custom: 'Custom',
};

export function ReportTemplateCard({ 
  template, 
  onUse, 
  onPreview,
  onEdit,
  onDuplicate,
  onDelete
}: ReportTemplateCardProps) {
  const sections = Array.isArray(template.sections) ? template.sections : [];
  const enabledSections = sections.filter(s => s.enabled).length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{template.template_name}</h3>
              {template.is_system_template && (
                <Badge variant="secondary" className="text-xs">
                  System
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {typeLabels[template.template_type] || template.template_type}
            </p>
            <p className="text-xs text-muted-foreground">
              Sections: {enabledSections}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2 flex-wrap">
        <Button variant="default" size="sm" onClick={() => onUse(template)}>
          Use Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPreview(template)}>
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        {!template.is_system_template && (
          <>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDuplicate && (
              <Button variant="outline" size="sm" onClick={() => onDuplicate(template)}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(template)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
