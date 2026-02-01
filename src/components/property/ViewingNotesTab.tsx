import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Mic,
  Clock,
  Star,
  TrendingUp,
  ChevronRight,
  FileText,
  MoreVertical,
  Trash2,
  Share2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  template_used: string | null;
}

const sentimentColors: Record<string, string> = {
  Positive: "bg-green-500/10 text-green-700 border-green-500/20",
  Neutral: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Negative: "bg-red-500/10 text-red-700 border-red-500/20",
};

const interestIcons: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function ViewingNotesTab({ propertyId }: ViewingNotesTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [propertyId]);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("voice_notes")
        .select("id, recording_date, duration_seconds, transcript, structured_analysis, template_used")
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

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from("voice_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast({
        title: "Note deleted",
        description: "Viewing note has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const renderStars = (level: string) => {
    const count = interestIcons[level] || 0;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i <= count
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Viewing Notes
        </CardTitle>
        <Button onClick={() => navigate(`/property/${propertyId}/record`)}>
          <Mic className="h-4 w-4 mr-2" />
          Record Viewing
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-medium mb-2">No viewing notes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Record your first viewing to track insights and impressions.
            </p>
            <Button onClick={() => navigate(`/property/${propertyId}/record`)}>
              <Mic className="h-4 w-4 mr-2" />
              Record Viewing
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => {
              const analysis = note.structured_analysis;
              const impression = analysis?.overall_impression;

              return (
                <Card
                  key={note.id}
                  className="group cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    navigate(`/property/${propertyId}/viewing-notes/${note.id}`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(note.recording_date), "dd MMM yyyy")}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(note.duration_seconds)}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => handleDeleteNote(note.id, e)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {note.template_used && (
                      <Badge variant="secondary" className="text-xs mb-3">
                        <FileText className="h-3 w-3 mr-1" />
                        {note.template_used}
                      </Badge>
                    )}

                    {impression && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={sentimentColors[impression.sentiment]}
                          >
                            {impression.sentiment}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {renderStars(impression.interest_level)}
                          </div>
                        </div>

                        {analysis?.cost_estimates && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>
                              Est. costs: £
                              {(analysis.cost_estimates.total || 0).toLocaleString()}
                            </span>
                          </div>
                        )}

                        {analysis?.condition_assessment && (
                          <Badge variant="outline" className="text-xs">
                            Condition: {analysis.condition_assessment.overall}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-end mt-3 text-sm text-primary">
                      View Analysis
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
