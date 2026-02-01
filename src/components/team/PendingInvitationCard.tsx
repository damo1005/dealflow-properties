import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, RefreshCw, X } from "lucide-react";
import { TeamInvitation, ROLE_PERMISSIONS } from "@/types/team";
import { formatDistanceToNow } from "date-fns";

interface PendingInvitationCardProps {
  invitation: TeamInvitation;
  onResend?: () => void;
  onCancel?: () => void;
}

export function PendingInvitationCard({
  invitation,
  onResend,
  onCancel,
}: PendingInvitationCardProps) {
  const roleInfo = ROLE_PERMISSIONS[invitation.role];
  const sentAgo = formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true });

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{invitation.email}</p>
              <Badge variant="outline">{roleInfo.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Sent {sentAgo}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onResend}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Resend
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
