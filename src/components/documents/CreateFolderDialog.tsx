import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "gray", label: "Gray", class: "bg-gray-500" },
];

const ICONS = ["📁", "🏠", "💰", "📋", "📊", "🗂️", "📄", "📸", "🔒", "⭐"];

export function CreateFolderDialog({ open, onOpenChange }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [color, setColor] = useState("blue");
  const [icon, setIcon] = useState("📁");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    
    toast.success(`Folder "${folderName}" created`);
    onOpenChange(false);
    setFolderName("");
    setColor("blue");
    setIcon("📁");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Create Folder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder_name">Folder Name</Label>
            <Input
              id="folder_name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="My Documents"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.class} ${
                    color === c.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 text-xl rounded-lg border flex items-center justify-center transition-colors ${
                    icon === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Preview</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium">{folderName || "Folder Name"}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!folderName.trim() || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Folder"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
