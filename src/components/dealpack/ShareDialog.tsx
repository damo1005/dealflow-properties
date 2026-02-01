import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Mail,
  Link as LinkIcon,
  QrCode,
  Lock,
  Eye,
  Download,
  Check,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packId: string;
  packTitle: string;
  shareToken?: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  packId,
  packTitle,
  shareToken,
}: ShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);
  const [requireEmail, setRequireEmail] = useState(false);
  const [enableComments, setEnableComments] = useState(false);
  const [password, setPassword] = useState("");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailMessage, setEmailMessage] = useState(
    `I wanted to share this investment opportunity with you.\n\nPlease review the deal pack and let me know if you have any questions.`
  );

  const shareLink = shareToken
    ? `${window.location.origin}/pack/${shareToken}`
    : `${window.location.origin}/deal-pack/${packId}/share`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({ title: "Link Copied!", description: "Share link copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    }
  };

  const handleSendEmail = () => {
    toast({
      title: "Emails Sent!",
      description: `Sent to ${emailRecipients.split(",").length} recipient(s)`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Deal Pack</DialogTitle>
          <DialogDescription>
            Share "{packTitle}" with investors, partners, or lenders
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-4">
            {/* Share Link */}
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Scan to view</p>
              </div>
            </div>

            {/* Access Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Access Settings</h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Password Protection</p>
                    <p className="text-xs text-muted-foreground">Require password to view</p>
                  </div>
                </div>
                <Switch checked={requirePassword} onCheckedChange={setRequirePassword} />
              </div>

              {requirePassword && (
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Require Email</p>
                    <p className="text-xs text-muted-foreground">Collect viewer emails</p>
                  </div>
                </div>
                <Switch checked={requireEmail} onCheckedChange={setRequireEmail} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Enable Comments</p>
                    <p className="text-xs text-muted-foreground">Allow viewers to comment</p>
                  </div>
                </div>
                <Switch checked={enableComments} onCheckedChange={setEnableComments} />
              </div>
            </div>

            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Save Settings
            </Button>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input
                placeholder="john@email.com, sarah@email.com"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input defaultValue={`Investment Opportunity: ${packTitle}`} />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                rows={4}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">PDF Attached</Badge>
              <Badge variant="outline">View Link Included</Badge>
            </div>

            <Button className="w-full gap-2" onClick={handleSendEmail}>
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
