import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProsConsCardsProps {
  pros: string[];
  cons: string[];
}

export function ProsConsCards({ pros, cons }: ProsConsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Pros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-700 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            Pros
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pros.length > 0 ? (
            <ul className="space-y-2">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm italic">No pros identified</p>
          )}
        </CardContent>
      </Card>

      {/* Cons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-red-700 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <X className="h-4 w-4 text-red-600" />
            </div>
            Cons
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cons.length > 0 ? (
            <ul className="space-y-2">
              {cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm italic">No cons identified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
