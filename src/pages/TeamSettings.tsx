import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Plus, Settings, Shield } from "lucide-react";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { PendingInvitationCard } from "@/components/team/PendingInvitationCard";
import { InviteMemberDialog } from "@/components/team/InviteMemberDialog";
import { useTeamStore, mockTeam, mockMembers, mockInvitations } from "@/stores/teamStore";
import { useToast } from "@/hooks/use-toast";

const TeamSettings = () => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { team, members, invitations, setTeam, setMembers, setInvitations } = useTeamStore();
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data
    setTeam(mockTeam);
    setMembers(mockMembers);
    setInvitations(mockInvitations);
  }, [setTeam, setMembers, setInvitations]);

  const currentUserId = "user-1"; // Mock current user
  const isOwner = team?.owner_id === currentUserId;
  const pendingInvitations = invitations.filter((i) => i.status === "pending");
  const activeMembers = members.filter((m) => m.status === "active");

  const handleResendInvitation = (invitationId: string) => {
    toast({
      title: "Invitation resent",
      description: "A new invitation email has been sent",
    });
  };

  const handleCancelInvitation = (invitationId: string) => {
    toast({
      title: "Invitation cancelled",
      description: "The invitation has been cancelled",
    });
  };

  const handleRemoveMember = (memberId: string) => {
    toast({
      title: "Member removed",
      description: "The team member has been removed",
    });
  };

  // Mock properties for partner invitation
  const mockProperties = [
    { id: "prop-1", address: "14 Oak Street, M14 5AB" },
    { id: "prop-2", address: "28 Victoria Road, M20 1AA" },
    { id: "prop-3", address: "7 Park Avenue, SK1 2AB" },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team & Partners</h1>
            <p className="text-muted-foreground">
              Manage who has access to your portfolio
            </p>
          </div>
          {isOwner && (
            <Button onClick={() => setShowInviteDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>

        {/* Team Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  {activeMembers.length} of {team?.max_members || 5} seats used
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isOwner={isOwner}
                isSelf={member.user_id === currentUserId}
                onRemove={() => handleRemoveMember(member.id)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <PendingInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onResend={() => handleResendInvitation(invitation.id)}
                  onCancel={() => handleCancelInvitation(invitation.id)}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Role Permissions Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>
                  Understand what each role can do
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-3 rounded-lg border">
                <p className="font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">Full access including billing and team management</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="font-medium">Admin</p>
                <p className="text-sm text-muted-foreground">Full access except billing settings</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="font-medium">Editor</p>
                <p className="text-sm text-muted-foreground">Can add/edit properties and transactions</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="font-medium">Viewer</p>
                <p className="text-sm text-muted-foreground">Read-only access to all data</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="font-medium">Accountant</p>
                <p className="text-sm text-muted-foreground">Read-only access with financial exports</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="font-medium">Partner (JV)</p>
                <p className="text-sm text-muted-foreground">Access to specific properties only</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <InviteMemberDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          properties={mockProperties}
        />
      </div>
    </AppLayout>
  );
};

export default TeamSettings;
