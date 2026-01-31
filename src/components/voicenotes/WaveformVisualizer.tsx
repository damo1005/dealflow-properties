import { cn } from "@/lib/utils";

interface WaveformVisualizerProps {
  isActive: boolean;
}

export function WaveformVisualizer({ isActive }: WaveformVisualizerProps) {
  const bars = 20;

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-primary rounded-full transition-all",
            isActive ? "animate-waveform" : "h-2 opacity-30"
          )}
          style={{
            animationDelay: isActive ? `${i * 0.05}s` : undefined,
            height: isActive ? undefined : "8px",
          }}
        />
      ))}
    </div>
  );
}
