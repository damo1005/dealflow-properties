import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function RecordButton({ isRecording, onToggle, disabled }: RecordButtonProps) {
  return (
    <Button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative h-[150px] w-[150px] rounded-full transition-all duration-300",
        "flex items-center justify-center",
        "md:h-[150px] md:w-[150px] h-[180px] w-[180px]",
        isRecording
          ? "bg-destructive hover:bg-destructive/90 animate-pulse-record"
          : "bg-gradient-to-br from-primary to-primary/80 hover:scale-105"
      )}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? (
        <Square className="h-12 w-12 fill-current" />
      ) : (
        <Mic className="h-12 w-12" />
      )}
      
      {/* Pulsing ring animation when recording */}
      {isRecording && (
        <>
          <span className="absolute inset-0 rounded-full bg-destructive/50 animate-ping" />
          <span className="absolute inset-[-8px] rounded-full border-4 border-destructive/30 animate-pulse" />
        </>
      )}
    </Button>
  );
}
