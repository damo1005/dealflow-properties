import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  description?: string;
  className?: string;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  prefix = "£",
  suffix,
  min = 0,
  max,
  step = 1,
  showSlider = false,
  sliderMin = 0,
  sliderMax = 100,
  description,
  className,
}: CurrencyInputProps) {
  const formatValue = (val: number) => {
    if (suffix === "%") return val.toString();
    return val.toLocaleString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(raw) || 0;
    onChange(Math.max(min, max ? Math.min(parsed, max) : parsed));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {showSlider && (
          <span className="text-sm font-medium text-primary">
            {prefix !== "£" ? "" : prefix}
            {formatValue(value)}
            {suffix}
          </span>
        )}
      </div>
      
      {showSlider ? (
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={sliderMin}
          max={sliderMax}
          step={step}
          className="py-2"
        />
      ) : (
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {prefix}
            </span>
          )}
          <Input
            id={id}
            type="text"
            value={formatValue(value)}
            onChange={handleInputChange}
            className={cn(
              prefix && "pl-7",
              suffix && "pr-10"
            )}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
      )}
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
