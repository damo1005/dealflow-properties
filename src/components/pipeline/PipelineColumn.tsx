import { memo } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PipelineStage, PipelineProperty, usePipelineStore } from "@/stores/pipelineStore";
import { PipelineCard } from "./PipelineCard";
import { cn } from "@/lib/utils";

interface PipelineColumnProps {
  stage: PipelineStage;
  properties: PipelineProperty[];
}

export const PipelineColumn = memo(function PipelineColumn({ stage, properties }: PipelineColumnProps) {
  const { deleteStage } = usePipelineStore();

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
      notation: properties.reduce((sum, p) => sum + (p.price || 0), 0) > 999999 ? "compact" : "standard",
    }).format(value);
  };

  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {properties.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {totalValue > 0 && formatValue(totalValue)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings2 className="mr-2 h-4 w-4" />
                Edit Stage
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteStage(stage.id)}
                className="text-destructive"
                disabled={properties.length > 0}
              >
                Delete Stage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 min-h-[200px] p-2 rounded-lg transition-colors",
              snapshot.isDraggingOver ? "bg-primary/5 border-2 border-dashed border-primary/30" : "bg-muted/30"
            )}
          >
            {properties.map((property, index) => (
              <PipelineCard key={property.id} property={property} index={index} />
            ))}
            {provided.placeholder}
            
            {properties.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-sm text-muted-foreground">No properties</p>
                <p className="text-xs text-muted-foreground">Drag cards here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
});
