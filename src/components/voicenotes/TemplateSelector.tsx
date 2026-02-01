import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Hammer,
  Building,
  CheckSquare,
  FileText,
} from "lucide-react";
import { viewingTemplates, type ViewingTemplate } from "@/data/viewingTemplates";

interface TemplateSelectorProps {
  selectedTemplate: ViewingTemplate | null;
  onSelectTemplate: (template: ViewingTemplate | null) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  Hammer,
  Building,
  CheckSquare,
};

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const handleValueChange = (value: string) => {
    if (value === "none") {
      onSelectTemplate(null);
    } else {
      const template = viewingTemplates.find((t) => t.id === value);
      onSelectTemplate(template || null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedTemplate?.id || "none"}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No template</SelectItem>
          {viewingTemplates.map((template) => {
            const IconComponent = iconMap[template.icon] || FileText;
            return (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span>{template.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {selectedTemplate && (
        <Badge variant="secondary" className="text-xs">
          {selectedTemplate.checklist.length} items
        </Badge>
      )}
    </div>
  );
}
