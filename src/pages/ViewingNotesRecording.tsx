import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Trash2, Sparkles, Edit } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { PropertyContextHeader } from "@/components/voicenotes/PropertyContextHeader";
import { RecordButton } from "@/components/voicenotes/RecordButton";
import { WaveformVisualizer } from "@/components/voicenotes/WaveformVisualizer";
import { TranscriptPreview } from "@/components/voicenotes/TranscriptPreview";
import { ManualTranscriptInput } from "@/components/voicenotes/ManualTranscriptInput";
import { mockPropertyDetail } from "@/data/mockPropertyDetail";
import { supabase } from "@/integrations/supabase/client";
import type { StructuredAnalysis } from "@/types/voiceNotes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ViewingNotesRecording() {
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    isRecording,
    transcript,
    interimTranscript,
    duration,
    isSupported,
    startRecording,
    stopRecording,
    resetRecording,
    formatDuration,
    setTranscript,
  } = useVoiceRecording();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState("");

  // Use mock data for now - in production this would fetch real property
  const property = mockPropertyDetail;

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDiscard = () => {
    if (transcript.length > 0) {
      if (window.confirm("Are you sure you want to discard your recording?")) {
        resetRecording();
      }
    } else {
      navigate(`/property/${propertyId}`);
    }
  };

  const handleSaveAndAnalyze = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No content",
        description: "Please record or type some notes before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call the AI analysis edge function
      const { data, error } = await supabase.functions.invoke("analyze-viewing-notes", {
        body: {
          transcript: transcript.trim(),
          propertyAddress: property.address,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      const analysis: StructuredAnalysis = data.analysis;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save to database if user is authenticated
      if (user) {
        const { data: savedNote, error: saveError } = await supabase
          .from("voice_notes")
          .insert([{
            user_id: user.id,
            property_id: propertyId,
            property_address: property.address,
            duration_seconds: duration,
            transcript: transcript.trim(),
            structured_analysis: JSON.parse(JSON.stringify(analysis)),
          }])
          .select()
          .single();

        if (saveError) {
          console.error("Save error:", saveError);
          // Still navigate with analysis even if save fails
        navigate(`/property/${propertyId}/viewing-notes/temp`, {
          state: { analysis, transcript: transcript.trim(), duration },
        });
          navigate(`/property/${propertyId}/viewing-notes/temp`, {
            state: { analysis, transcript: transcript.trim(), duration },
          });
          return;
        }

        toast({
          title: "Analysis complete!",
          description: "Your viewing notes have been analyzed and saved.",
        });

        navigate(`/property/${propertyId}/viewing-notes/${savedNote.id}`, {
          state: { analysis, transcript: transcript.trim(), duration },
        });
      } else {
        // Not authenticated - navigate with temp ID
        navigate(`/property/${propertyId}/viewing-notes/temp`, {
          state: { analysis, transcript: transcript.trim(), duration },
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEditTranscript = () => {
    setEditedTranscript(transcript);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    setTranscript(editedTranscript);
    setShowEditDialog(false);
    toast({
      title: "Transcript updated",
      description: "Your changes have been saved.",
    });
  };

  // Keyboard shortcut for recording
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.target?.toString().includes("Input")) {
        e.preventDefault();
        handleToggleRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecording]);

  return (
    <AppLayout title="Viewing Notes">
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
        {/* Property Context Header */}
        <PropertyContextHeader
          propertyId={propertyId || ""}
          address={property.address}
          price={property.price}
          image={property.images[0]}
        />

        {/* Main Recording Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          {/* Status Text */}
          <p className="text-lg text-muted-foreground">
            {isAnalyzing
              ? "Analyzing your notes..."
              : isRecording
              ? "Recording..."
              : transcript
              ? "Recording paused"
              : "Ready to record"}
          </p>

          {/* Waveform Visualization */}
          <WaveformVisualizer isActive={isRecording} />

          {/* Record Button */}
          <RecordButton
            isRecording={isRecording}
            onToggle={handleToggleRecording}
            disabled={isAnalyzing || !isSupported}
          />

          {/* Timer Display */}
          <p className="text-4xl font-mono text-foreground tabular-nums">
            {formatDuration(duration)}
          </p>

          {/* Transcript Preview or Manual Input */}
          {isSupported ? (
            <TranscriptPreview
              transcript={transcript}
              interimTranscript={interimTranscript}
              isRecording={isRecording}
            />
          ) : (
            <ManualTranscriptInput transcript={transcript} onChange={setTranscript} />
          )}

          {/* Edit button for transcript */}
          {transcript.length > 0 && !isRecording && (
            <Button variant="outline" size="sm" onClick={handleEditTranscript}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Transcript
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <Card className="sticky bottom-0 rounded-none border-t shadow-lg">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={isAnalyzing}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Discard
            </Button>

            <Button
              onClick={handleSaveAndAnalyze}
              disabled={isAnalyzing || isRecording || !transcript.trim()}
              className="flex-1 max-w-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save & Analyze
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Edit Transcript Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Transcript</DialogTitle>
            </DialogHeader>
            <Textarea
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              className="min-h-[300px]"
              placeholder="Edit your transcript..."
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
