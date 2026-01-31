import { useCallback, useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { usePipelineStore } from "@/stores/pipelineStore";
import { PipelineColumn } from "./PipelineColumn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function PipelineBoard() {
  const { stages, properties, filters, moveProperty } = usePipelineStore();

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter((p) =>
        p.address.toLowerCase().includes(search) ||
        p.notes?.toLowerCase().includes(search)
      );
    }

    // Label filter
    if (filters.labels.length > 0) {
      result = result.filter((p) =>
        filters.labels.some((label) => p.labels.includes(label))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'days':
        result.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        break;
      case 'activity':
      default:
        result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
    }

    return result;
  }, [properties, filters]);

  // Group properties by stage
  const propertiesByStage = useMemo(() => {
    const grouped: Record<string, typeof properties> = {};
    stages.forEach((stage) => {
      grouped[stage.id] = filteredProperties
        .filter((p) => p.stage === stage.id)
        .sort((a, b) => a.position - b.position);
    });
    return grouped;
  }, [stages, filteredProperties]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid area
    if (!destination) return;

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveProperty(draggableId, destination.droppableId, destination.index);
  }, [moveProperty]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-h-[calc(100vh-16rem)]">
          {stages
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                properties={propertiesByStage[stage.id] || []}
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DragDropContext>
  );
}
