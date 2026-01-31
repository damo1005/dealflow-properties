import { Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeyQuotesCardProps {
  quotes: string[];
}

export function KeyQuotesCard({ quotes }: KeyQuotesCardProps) {
  if (quotes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Quote className="h-5 w-5 text-primary" />
          Key Quotes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotes.map((quote, index) => (
          <blockquote
            key={index}
            className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
          >
            "{quote}"
          </blockquote>
        ))}
      </CardContent>
    </Card>
  );
}
