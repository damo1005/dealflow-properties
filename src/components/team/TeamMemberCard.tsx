import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Trash2, MoreVertical, Mail, Shield } from "lucide-react";
import { TeamMember, ROLE_PERMISSIONS } from "@/types/team";

interface TeamMemberCardProps {
  member: TeamMember;
  isOwner: boolean;
  isSelf: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function TeamMemberCard({
  member,
  isOwner,
  isSelf,
  onEdit,
  onRemove,
}: TeamMemberCardProps) {
  const roleInfo = ROLE_PERMISSIONS[member.role];
  const initials = member.profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.profile?.avatar_url} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">
                {member.profile?.full_name || "Unknown User"}
                {isSelf && (
                  <span className="text-muted-foreground ml-1">(You)</span>
                )}
              </p>
              <Badge variant="secondary" className="shrink-0">
                {roleInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {member.profile?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {roleInfo.description}
            </p>
          </div>

          {!isSelf && isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Permissions
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onRemove}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
