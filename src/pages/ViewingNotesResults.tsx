import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw, Edit, Share2, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StructuredAnalysis } from "@/types/voiceNotes";
import { ConditionAssessmentCard } from "@/components/voicenotes/results/ConditionAssessmentCard";
import { CostEstimatesCard } from "@/components/voicenotes/results/CostEstimatesCard";
import { ProsConsCards } from "@/components/voicenotes/results/ProsConsCards";
import { KeyQuotesCard } from "@/components/voicenotes/results/KeyQuotesCard";
import { OverallImpressionCard } from "@/components/voicenotes/results/OverallImpressionCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function ViewingNotesResults() {
  const { id: propertyId, noteId } = useParams<{ id: string; noteId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [analysis, setAnalysis] = useState<StructuredAnalysis | null>(
    location.state?.analysis || null
  );
  const [transcript, setTranscript] = useState<string>(location.state?.transcript || "");
  const [isLoading, setIsLoading] = useState(!location.state?.analysis);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState("");

  useEffect(() => {
    if (!location.state?.analysis && noteId && noteId !== "temp") {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from("voice_notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) throw error;

      setTranscript(data.transcript || "");
      setAnalysis(data.structured_analysis as unknown as StructuredAnalysis);
    } catch (error) {
      console.error("Failed to fetch note:", error);
      toast({
        title: "Error",
        description: "Failed to load viewing notes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!transcript) return;

    setIsReanalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-viewing-notes", {
        body: { transcript },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setAnalysis(data.analysis);

      // Update in database if not temp
      if (noteId && noteId !== "temp") {
        await supabase
          .from("voice_notes")
          .update({ structured_analysis: data.analysis })
          .eq("id", noteId);
      }

      toast({
        title: "Re-analysis complete",
        description: "Your notes have been analyzed again.",
      });
    } catch (error) {
      console.error("Re-analysis error:", error);
      toast({
        title: "Re-analysis failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleEditTranscript = () => {
    setEditedTranscript(transcript);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    setTranscript(editedTranscript);
    setShowEditDialog(false);

    if (noteId && noteId !== "temp") {
      await supabase
        .from("voice_notes")
        .update({ transcript: editedTranscript })
        .eq("id", noteId);
    }

    toast({
      title: "Transcript updated",
      description: "Re-analyze to update the insights.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export started",
      description: "PDF download will begin shortly.",
    });
    // TODO: Implement PDF generation
  };

  const handleAddToPipeline = async () => {
    toast({
      title: "Added to pipeline",
      description: "Property has been added to your pipeline.",
    });
    navigate("/pipeline");
  };

  if (isLoading) {
    return (
      <AppLayout title="Viewing Notes">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!analysis) {
    return (
      <AppLayout title="Viewing Notes">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The viewing notes analysis could not be loaded.
          </p>
          <Button onClick={() => navigate(`/property/${propertyId}`)}>
            Back to Property
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Viewing Notes Analysis">
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/property/${propertyId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Viewing Notes Analysis</h1>
            <p className="text-muted-foreground">AI-powered insights from your viewing</p>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid gap-6">
          <ConditionAssessmentCard assessment={analysis.condition_assessment} />

          <CostEstimatesCard estimates={analysis.cost_estimates} />

          <ProsConsCards pros={analysis.pros} cons={analysis.cons} />

          <KeyQuotesCard quotes={analysis.key_quotes} />

          <OverallImpressionCard
            impression={analysis.overall_impression}
            onAddToPipeline={handleAddToPipeline}
          />
        </div>

        {/* Original Transcript */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Original Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{transcript}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Actions Bar */}
      <Card className="fixed bottom-0 left-0 right-0 rounded-none border-t shadow-lg z-50">
        <CardContent className="flex items-center justify-center gap-3 p-4 max-w-4xl mx-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={handleEditTranscript}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReanalyze}
            disabled={isReanalyzing}
          >
            {isReanalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Re-analyze
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Transcript</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            className="min-h-[300px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
