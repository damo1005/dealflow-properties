import { FileText, Users, Building2, ClipboardList, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TemplateType } from "@/stores/dealPackStore";

interface TemplateSelectorProps {
  onSelect: (template: TemplateType) => void;
}

const templates = [
  {
    id: 'investor' as TemplateType,
    name: 'Investor Pitch',
    description: 'Professional pitch deck for potential investors with ROI focus',
    icon: FileText,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'jv-partner' as TemplateType,
    name: 'JV Partner',
    description: 'Joint venture proposal with profit sharing projections',
    icon: Users,
    color: 'bg-chart-4/10 text-chart-4',
  },
  {
    id: 'lender' as TemplateType,
    name: 'Lender Submission',
    description: 'Comprehensive pack for mortgage and bridging applications',
    icon: Building2,
    color: 'bg-success/10 text-success',
  },
  {
    id: 'internal' as TemplateType,
    name: 'Internal Analysis',
    description: 'Detailed analysis for your own records and decision making',
    icon: ClipboardList,
    color: 'bg-chart-3/10 text-chart-3',
  },
  {
    id: 'custom' as TemplateType,
    name: 'Custom Template',
    description: 'Start from scratch and build your own deal pack',
    icon: Palette,
    color: 'bg-muted text-muted-foreground',
  },
];

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose a Template</h2>
        <p className="text-muted-foreground mt-2">
          Select a template to get started with your deal pack
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
            )}
            onClick={() => onSelect(template.id)}
          >
            <CardHeader className="pb-3">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", template.color)}>
                <template.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
