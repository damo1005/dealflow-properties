import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Clock, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { StructuredAnalysis } from "@/types/voiceNotes";

interface ViewingNotesTabProps {
  propertyId: string;
}

interface VoiceNote {
  id: string;
  recording_date: string;
  duration_seconds: number | null;
  transcript: string | null;
  structured_analysis: StructuredAnalysis | null;
}

export function ViewingNotesTab({ propertyId }: ViewingNotesTabProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [propertyId]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("voice_notes")
        .select("id, recording_date, duration_seconds, transcript, structured_analysis")
        .eq("property_id", propertyId)
        .order("recording_date", { ascending: false });

      if (error) throw error;
      setNotes((data || []) as unknown as VoiceNote[]);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSentimentColor = (sentiment?: string): string => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-500/10 text-green-700";
      case "Negative":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-yellow-500/10 text-yellow-700";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Viewing Notes</CardTitle>
        <Button onClick={() => navigate(`/property/${propertyId}/viewing-notes`)}>
          <Mic className="h-4 w-4 mr-2" />
          Record New Notes
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <Mic className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-2">No viewing notes yet</p>
            <p className="text-sm text-muted-foreground">
              Record your observations during property viewings and get AI-powered insights
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => navigate(`/property/${propertyId}/viewing-notes/${note.id}`)}
                className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(note.recording_date)}</span>
                      {note.duration_seconds && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(note.duration_seconds)}
                        </span>
                      )}
                    </div>
                    {note.transcript && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {note.transcript.slice(0, 150)}
                        {note.transcript.length > 150 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  {note.structured_analysis?.overall_impression && (
                    <Badge
                      className={getSentimentColor(
                        note.structured_analysis.overall_impression.sentiment
                      )}
                    >
                      {note.structured_analysis.overall_impression.sentiment}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
