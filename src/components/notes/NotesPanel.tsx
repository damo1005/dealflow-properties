import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Plus,
  Pin,
  CheckCircle,
  Reply,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note, NOTE_TYPE_CONFIG } from "@/types/notes";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NotesPanelProps {
  notes: Note[];
  entityType: string;
  entityId: string;
  onAddNote?: () => void;
  onTogglePin?: (noteId: string) => void;
  onToggleResolved?: (noteId: string) => void;
  onAddComment?: (noteId: string, content: string) => void;
}

export function NotesPanel({
  notes,
  entityType,
  entityId,
  onAddNote,
  onTogglePin,
  onToggleResolved,
  onAddComment,
}: NotesPanelProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const pinnedNotes = notes.filter((n) => n.is_pinned);
  const recentNotes = notes.filter((n) => !n.is_pinned);

  const handleSubmitReply = (noteId: string) => {
    if (!replyContent.trim()) return;
    onAddComment?.(noteId, replyContent);
    setReplyContent("");
    setReplyingTo(null);
  };

  const renderNote = (note: Note) => {
    const typeConfig = NOTE_TYPE_CONFIG[note.note_type];
    const timeAgo = formatDistanceToNow(new Date(note.created_at), { addSuffix: false });

    return (
      <div
        key={note.id}
        className={cn(
          "p-4 rounded-lg border",
          note.is_pinned && "border-primary/50 bg-primary/5",
          note.is_resolved && "opacity-60"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {note.is_pinned && <Pin className="h-4 w-4 text-primary" />}
            {!note.is_pinned && (
              <span className="text-lg">{typeConfig.icon}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={cn("text-sm", note.is_resolved && "line-through")}>
                {note.content}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onTogglePin?.(note.id)}>
                    <Pin className="mr-2 h-4 w-4" />
                    {note.is_pinned ? "Unpin" : "Pin"}
                  </DropdownMenuItem>
                  {note.note_type === "action_item" && (
                    <DropdownMenuItem onClick={() => onToggleResolved?.(note.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {note.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {note.author?.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <span>{note.author?.full_name}</span>
              <span>•</span>
              <span>{timeAgo}</span>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setReplyingTo(replyingTo === note.id ? null : note.id)}
              >
                <Reply className="mr-1 h-3 w-3" />
                Reply
              </Button>
              
              {note.note_type === "action_item" && !note.is_resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => onToggleResolved?.(note.id)}
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Resolve
                </Button>
              )}
            </div>

            {/* Comments */}
            {note.comments && note.comments.length > 0 && (
              <div className="mt-3 ml-4 space-y-2">
                {note.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2 text-sm">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {comment.author?.full_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{comment.author?.full_name}:</span>
                      <span className="ml-1 text-muted-foreground">{comment.content}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: false })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            {replyingTo === note.id && (
              <div className="mt-3 flex gap-2">
                <Textarea
                  placeholder="Add a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex flex-col gap-1">
                  <Button size="sm" onClick={() => handleSubmitReply(note.id)}>
                    Send
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Notes & Activity
        </CardTitle>
        <Button size="sm" onClick={onAddNote}>
          <Plus className="mr-1 h-4 w-4" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {pinnedNotes.length > 0 && (
          <>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pinned
            </div>
            <div className="space-y-3">
              {pinnedNotes.map(renderNote)}
            </div>
            <Separator />
          </>
        )}

        {recentNotes.length > 0 && (
          <>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent
            </div>
            <div className="space-y-3">
              {recentNotes.map(renderNote)}
            </div>
          </>
        )}

        {notes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notes yet</p>
            <p className="text-sm">Add a note to start collaborating</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
