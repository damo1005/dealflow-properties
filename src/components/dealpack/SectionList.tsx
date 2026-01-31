import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDealPackStore, DealPackSection } from "@/stores/dealPackStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sectionIcons: Record<string, string> = {
  cover: "📄",
  "executive-summary": "📊",
  "property-details": "🏠",
  "financial-analysis": "💰",
  "market-analysis": "📈",
  "supporting-docs": "📎",
  custom: "✏️",
};

export function SectionList() {
  const { currentPack, reorderSections, toggleSection, removeSection, addCustomSection, activeSection, setActiveSection } = useDealPackStore();
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!currentPack) return null;

  const sections = [...currentPack.sections].sort((a, b) => a.order - b.order);

  const handleDragEnd = (result: { destination?: { index: number }; source: { index: number } }) => {
    if (!result.destination) return;

    const reordered = Array.from(sections);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    reorderSections(reordered);
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addCustomSection(newSectionTitle.trim());
      setNewSectionTitle("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Sections</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Section title..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
              />
              <Button onClick={handleAddSection} className="w-full">
                Add Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border bg-background transition-all",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary",
                        activeSection === section.id && "border-primary bg-primary/5",
                        !section.enabled && "opacity-50"
                      )}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <span className="text-xl">{sectionIcons[section.type]}</span>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium truncate",
                          !section.enabled && "text-muted-foreground"
                        )}>
                          {section.title}
                        </p>
                      </div>

                      <Switch
                        checked={section.enabled}
                        onCheckedChange={() => toggleSection(section.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      {section.type === "custom" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSection(section.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
