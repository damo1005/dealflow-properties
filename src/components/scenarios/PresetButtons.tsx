import { TrendingUp, TrendingDown, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PresetScenario } from "@/types/scenario";
import { presetScenarios } from "@/lib/scenarioConfig";

interface PresetButtonsProps {
  onApply: (preset: PresetScenario) => void;
}

const iconMap = {
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
};

const colorMap = {
  green: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
  red: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300",
  yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300",
  orange: "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300",
};

export function PresetButtons({ onApply }: PresetButtonsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Stress Test Presets</p>
      <div className="grid grid-cols-2 gap-2">
        {presetScenarios.map((preset) => {
          const Icon = iconMap[preset.icon as keyof typeof iconMap];
          
          return (
            <Button
              key={preset.id}
              variant="outline"
              className={cn("justify-start h-auto py-3", colorMap[preset.color])}
              onClick={() => onApply(preset)}
            >
              <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">{preset.name}</p>
                <p className="text-xs opacity-75">{preset.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
