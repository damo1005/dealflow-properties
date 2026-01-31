import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useComparisonStore } from "@/stores/comparisonStore";

interface SaveComparisonDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SaveComparisonDialog({ open, onClose }: SaveComparisonDialogProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { properties, calculatorInputs } = useComparisonStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this comparison.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to save comparisons.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("comparisons").insert([{
        user_id: user.id,
        name: name.trim(),
        property_ids: properties.map((p) => p.id),
        property_data: JSON.parse(JSON.stringify(properties)),
        calculator_inputs: JSON.parse(JSON.stringify(calculatorInputs)),
        notes: notes.trim() || null,
      }]);

      if (error) throw error;

      toast({
        title: "Comparison saved",
        description: "Your comparison has been saved successfully.",
      });

      onClose();
      navigate("/comparisons");
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: "Could not save comparison. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Comparison</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Comparison Name</Label>
            <Input
              id="name"
              placeholder="e.g., Sheffield BTL Options"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this comparison..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Saving {properties.length} properties with current calculator settings
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Comparison
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
