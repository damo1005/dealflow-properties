import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ConditionAssessment } from "@/types/voiceNotes";
import { cn } from "@/lib/utils";

interface ConditionAssessmentCardProps {
  assessment: ConditionAssessment;
}

const conditionColors: Record<string, string> = {
  Good: "bg-green-500/10 text-green-700 border-green-500/20",
  Fair: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Poor: "bg-red-500/10 text-red-700 border-red-500/20",
};

const conditionIcons: Record<string, React.ReactNode> = {
  Good: <CheckCircle className="h-4 w-4 text-green-600" />,
  Fair: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
  Poor: <XCircle className="h-4 w-4 text-red-600" />,
};

export function ConditionAssessmentCard({ assessment }: ConditionAssessmentCardProps) {
  return (
    <Card>
      <Accordion type="single" collapsible defaultValue="condition">
        <AccordionItem value="condition" className="border-none">
          <CardHeader className="pb-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Condition Assessment</CardTitle>
                <Badge className={cn("ml-2", conditionColors[assessment.overall])}>
                  {assessment.overall}
                </Badge>
              </div>
            </AccordionTrigger>
          </CardHeader>

          <AccordionContent>
            <CardContent className="pt-4 space-y-4">
              {/* Room by Room Table */}
              {assessment.rooms.length > 0 && (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead className="text-center">Condition</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessment.rooms.map((room, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{room.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              {conditionIcons[room.condition]}
                              <Badge
                                variant="outline"
                                className={conditionColors[room.condition]}
                              >
                                {room.condition}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {room.notes}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Urgent Issues */}
              {assessment.urgent_issues.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h4 className="font-semibold text-destructive">Urgent Issues</h4>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {assessment.urgent_issues.map((issue, index) => (
                      <li key={index} className="text-sm text-destructive/90">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
