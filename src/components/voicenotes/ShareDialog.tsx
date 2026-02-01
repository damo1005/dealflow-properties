import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Copy, Link } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
  propertyAddress: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  noteId,
  propertyAddress,
}: ShareDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [includeOptions, setIncludeOptions] = useState({
    impression: true,
    condition: true,
    costs: true,
    prosCons: true,
    transcript: false,
  });

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/shared-note/${noteId}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard.",
    });
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to share");
      }

      // Create share record
      const { error } = await supabase.from("voice_note_shares").insert({
        voice_note_id: noteId,
        shared_by: user.id,
        shared_with_email: email.trim(),
      });

      if (error) throw error;

      toast({
        title: "Share recorded",
        description: `Viewing notes shared with ${email}`,
      });

      setEmail("");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Share failed",
        description: "Could not share viewing notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Viewing Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Share your viewing notes for{" "}
            <span className="font-medium text-foreground">{propertyAddress}</span>
          </div>

          {/* Quick copy link */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopyLink}
            >
              <Link className="h-4 w-4 mr-2" />
              Copy Share Link
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or email directly
              </span>
            </div>
          </div>

          {/* Email form */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Include in email</Label>
              <div className="space-y-2">
                {[
                  { id: "impression", label: "Overall impression" },
                  { id: "condition", label: "Condition summary" },
                  { id: "costs", label: "Cost estimates" },
                  { id: "prosCons", label: "Pros & cons" },
                  { id: "transcript", label: "Full transcript" },
                ].map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      id={option.id}
                      checked={includeOptions[option.id as keyof typeof includeOptions]}
                      onCheckedChange={(checked) =>
                        setIncludeOptions((prev) => ({
                          ...prev,
                          [option.id]: checked === true,
                        }))
                      }
                    />
                    <label htmlFor={option.id} className="text-sm">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a note for the recipient..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
