import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AddPropertySlotProps {
  onClick: () => void;
  slotNumber: number;
}

export function AddPropertySlot({ onClick, slotNumber }: AddPropertySlotProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-0">
        <button
          onClick={onClick}
          className="w-full aspect-square flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors rounded-lg p-4"
        >
          <div className="h-14 w-14 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">Add Property</p>
            <p className="text-sm text-muted-foreground">Slot {slotNumber}</p>
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
