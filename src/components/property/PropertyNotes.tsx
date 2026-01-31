import { useState } from "react";
import { MessageSquare, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PropertyNotesProps {
  propertyId: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isPrivate: boolean;
}

const mockNotes: Note[] = [
  {
    id: "1",
    content: "Good potential for extension. Check planning history for rear extensions in the area.",
    author: "You",
    createdAt: "2024-02-01T14:30:00Z",
    isPrivate: true,
  },
  {
    id: "2",
    content: "Spoke with agent - seller motivated, open to offers below asking. Mentioned possible chain-free sale.",
    author: "You",
    createdAt: "2024-01-28T10:15:00Z",
    isPrivate: true,
  },
];

export function PropertyNotes({ propertyId }: PropertyNotesProps) {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async () => {
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: "You",
      createdAt: new Date().toISOString(),
      isPrivate: true,
    };

    setNotes([note, ...notes]);
    setNewNote("");
    setIsSubmitting(false);

    toast({
      title: "Note saved",
      description: "Your private note has been added",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Notes & Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note */}
        <div className="space-y-3">
          <Textarea
            placeholder="Add a private note about this property..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={!newNote.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Note"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div
                key={note.id}
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {note.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {note.author}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {note.content}
                    </p>
                  </div>
                </div>
                {index < notes.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet. Add your first note above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
