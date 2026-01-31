import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, MessageSquare, Paperclip, Flag, Calendar, Bed, Percent, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PipelineProperty, usePipelineStore } from "@/stores/pipelineStore";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface PipelineCardProps {
  property: PipelineProperty;
  index: number;
}

export const PipelineCard = memo(function PipelineCard({ property, index }: PipelineCardProps) {
  const { stages, availableLabels, setSelectedPropertyId, moveProperty, updateProperty, deleteProperty } = usePipelineStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const daysInStage = Math.floor(
    (Date.now() - new Date(property.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const propertyLabels = availableLabels.filter((l) => property.labels.includes(l.id));

  const handleMoveToStage = (stageId: string) => {
    moveProperty(property.id, stageId, 0);
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high' | null) => {
    updateProperty(property.id, { priority });
  };

  const priorityColors = {
    low: "text-muted-foreground",
    medium: "text-yellow-500",
    high: "text-destructive",
  };

  return (
    <Draggable draggableId={property.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-3 cursor-pointer transition-all hover:shadow-md group",
            snapshot.isDragging && "shadow-xl rotate-2 scale-105"
          )}
          onClick={() => setSelectedPropertyId(property.id)}
        >
          <CardContent className="p-3 space-y-3">
            {/* Image */}
            {property.image_url && (
              <div className="relative aspect-video rounded-md overflow-hidden">
                <img
                  src={property.image_url}
                  alt={property.address}
                  className="w-full h-full object-cover"
                />
                {property.priority && (
                  <div className={cn("absolute top-2 right-2", priorityColors[property.priority])}>
                    <Flag className="h-4 w-4 fill-current" />
                  </div>
                )}
              </div>
            )}

            {/* Labels */}
            {propertyLabels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {propertyLabels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="secondary"
                    className="text-xs px-1.5 py-0"
                    style={{ backgroundColor: label.color, color: 'white' }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Address */}
            <p className="font-medium text-sm line-clamp-2">{property.address}</p>

            {/* Price */}
            {property.price && (
              <p className="text-lg font-bold text-primary">
                {formatCurrency(property.price)}
              </p>
            )}

            {/* Metrics */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  {property.bedrooms}
                </span>
              )}
              {property.estimated_yield && (
                <span className="flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  {property.estimated_yield.toFixed(1)}%
                </span>
              )}
              {property.roi_potential && (
                <span className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-3 w-3" />
                  {property.roi_potential.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {daysInStage}d
                </span>
                {property.comments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {property.comments.length}
                  </span>
                )}
                {property.documents.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {property.documents.length}
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Move to Stage</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {stages.map((stage) => (
                        <DropdownMenuItem
                          key={stage.id}
                          onClick={() => handleMoveToStage(stage.id)}
                          disabled={stage.id === property.stage}
                        >
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Set Priority</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
                        <Flag className="h-4 w-4 mr-2 text-destructive" />
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange('medium')}>
                        <Flag className="h-4 w-4 mr-2 text-yellow-500" />
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
                        <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                        Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange(null)}>
                        Clear
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => deleteProperty(property.id)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
});
