import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Home, Trash2, Copy, Eye, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useComparisonStore } from "@/stores/comparisonStore";
import type { ComparisonProperty, CalculatorInputs } from "@/types/comparison";

interface SavedComparison {
  id: string;
  name: string;
  property_ids: string[];
  property_data: ComparisonProperty[];
  calculator_inputs: CalculatorInputs;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function MyComparisons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadComparison } = useComparisonStore();

  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    try {
      const { data, error } = await supabase
        .from("comparisons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComparisons((data || []) as unknown as SavedComparison[]);
    } catch (error) {
      console.error("Failed to fetch comparisons:", error);
      toast({
        title: "Error",
        description: "Failed to load saved comparisons.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (comparison: SavedComparison) => {
    loadComparison(comparison.property_data, comparison.calculator_inputs);
    navigate("/compare");
  };

  const handleDuplicate = async (comparison: SavedComparison) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("comparisons").insert([{
        user_id: user.id,
        name: `${comparison.name} (Copy)`,
        property_ids: comparison.property_ids,
        property_data: JSON.parse(JSON.stringify(comparison.property_data)),
        calculator_inputs: JSON.parse(JSON.stringify(comparison.calculator_inputs)),
        notes: comparison.notes,
      }]);

      if (error) throw error;

      toast({
        title: "Duplicated",
        description: "Comparison has been duplicated.",
      });

      fetchComparisons();
    } catch (error) {
      console.error("Duplicate error:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate comparison.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("comparisons")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setComparisons(comparisons.filter((c) => c.id !== deleteId));
      toast({
        title: "Deleted",
        description: "Comparison has been deleted.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete comparison.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AppLayout title="My Comparisons">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Comparisons</h1>
            <p className="text-muted-foreground">
              Your saved property comparisons
            </p>
          </div>
          <Button onClick={() => navigate("/compare")}>
            <Plus className="h-4 w-4 mr-2" />
            New Comparison
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comparisons.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No saved comparisons</h3>
              <p className="text-muted-foreground text-center mb-4">
                Compare properties and save them here for future reference
              </p>
              <Button onClick={() => navigate("/compare")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Comparison
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comparison) => (
              <Card key={comparison.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="truncate">{comparison.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Property thumbnails */}
                  <div className="flex gap-1">
                    {comparison.property_data.slice(0, 4).map((property, idx) => (
                      <img
                        key={idx}
                        src={property.images?.[0] || "/placeholder.svg"}
                        alt={property.address}
                        className="h-12 w-12 object-cover rounded flex-1"
                      />
                    ))}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {comparison.property_ids.length} properties
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(comparison.created_at)}
                    </div>
                  </div>

                  {/* Notes */}
                  {comparison.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {comparison.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleView(comparison)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(comparison)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(comparison.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Comparison?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                comparison.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
