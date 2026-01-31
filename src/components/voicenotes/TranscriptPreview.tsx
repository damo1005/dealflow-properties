import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TranscriptPreviewProps {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
}

export function TranscriptPreview({
  transcript,
  interimTranscript,
  isRecording,
}: TranscriptPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  const hasContent = transcript.length > 0 || interimTranscript.length > 0;

  return (
    <div className="w-full max-w-2xl">
      <ScrollArea className="h-[200px] w-full rounded-lg border bg-muted/50 p-4">
        <div ref={scrollRef} className="space-y-1">
          {!hasContent ? (
            <p className="text-muted-foreground text-center italic">
              {isRecording
                ? "Listening... start speaking about the property"
                : "Press the record button to start dictating your viewing notes"}
            </p>
          ) : (
            <p className="text-foreground leading-relaxed">
              {transcript}
              <span className={cn("text-muted-foreground", interimTranscript && "italic")}>
                {interimTranscript}
              </span>
              {isRecording && (
                <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse" />
              )}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
