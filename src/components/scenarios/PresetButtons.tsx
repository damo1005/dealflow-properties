import { TrendingUp, TrendingDown, Zap, AlertTriangle, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PresetScenario } from "@/types/scenario";
import { presetScenarios } from "@/lib/scenarioConfig";

interface PresetButtonsProps {
  onApply: (preset: PresetScenario) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Flame,
  Sparkles,
};

const colorMap = {
  green: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900",
  red: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900",
  yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900",
  orange: "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:hover:bg-orange-900",
};

export function PresetButtons({ onApply }: PresetButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Stress Test Presets</p>
        <p className="text-xs text-muted-foreground">One-click scenarios</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presetScenarios.map((preset) => {
          const Icon = iconMap[preset.icon] || TrendingUp;
          
          return (
            <Button
              key={preset.id}
              variant="outline"
              className={cn("justify-start h-auto py-2.5 px-3", colorMap[preset.color])}
              onClick={() => onApply(preset)}
            >
              <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="font-medium text-sm truncate">{preset.name}</p>
                <p className="text-xs opacity-75 truncate">{preset.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
