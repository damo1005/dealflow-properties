import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ManualTranscriptInputProps {
  transcript: string;
  onChange: (value: string) => void;
}

export function ManualTranscriptInput({ transcript, onChange }: ManualTranscriptInputProps) {
  return (
    <div className="w-full max-w-2xl space-y-2">
      <Label htmlFor="manual-transcript">
        Speech recognition not available. Type your notes manually:
      </Label>
      <Textarea
        id="manual-transcript"
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what you observed during the property viewing..."
        className="min-h-[200px] resize-none"
      />
    </div>
  );
}
