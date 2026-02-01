import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { MapPin, Users, Baby, PawPrint, Calendar, Eye, MessageSquare, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { AccommodationRequest } from "@/types/accommodation";
import { cn } from "@/lib/utils";

interface AccommodationRequestCardProps {
  request: AccommodationRequest;
  isSaved?: boolean;
  onView: (id: string) => void;
  onEnquire: (request: AccommodationRequest) => void;
  onToggleSave: (id: string) => void;
}

export function AccommodationRequestCard({
  request,
  isSaved = false,
  onView,
  onEnquire,
  onToggleSave,
}: AccommodationRequestCardProps) {
  const expiresInDays = request.expires_at
    ? differenceInDays(new Date(request.expires_at), new Date())
    : null;

  const formatBudget = (amount: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={request.request_type === "seeking" ? "default" : "secondary"}>
              {request.request_type === "seeking" ? "SEEKING" : "OFFERING"}
            </Badge>
            {request.status === "active" && expiresInDays !== null && expiresInDays <= 7 ? (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Expires in {expiresInDays} days
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-300">
                Active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(request.id);
            }}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">{request.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{request.location}</span>
        </div>

        {/* Guest Details */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{request.number_of_guests} {request.number_of_guests === 1 ? "person" : "people"}</span>
          </div>
          {request.has_children && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Baby className="h-4 w-4" />
              <span>With children</span>
            </div>
          )}
          {request.has_pets && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <PawPrint className="h-4 w-4" />
              <span>With pets</span>
            </div>
          )}
          {!request.has_pets && (
            <span className="text-muted-foreground">No pets</span>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Move-in: {request.move_in_date ? format(new Date(request.move_in_date), "MMM d, yyyy") : "ASAP"}
            {request.move_out_date && ` | Till: ${format(new Date(request.move_out_date), "MMM yyyy")}`}
          </span>
        </div>

        {/* Budget */}
        <p className="text-2xl font-bold text-primary">
          {formatBudget(request.budget_max)}
          <span className="text-sm font-normal text-muted-foreground">/month</span>
        </p>

        {/* Requirements */}
        <div className="flex flex-wrap gap-1.5">
          {request.self_contained && (
            <Badge variant="outline" className="text-xs">Self-contained ✓</Badge>
          )}
          {request.no_sharing && (
            <Badge variant="outline" className="text-xs">No sharing ✓</Badge>
          )}
          {request.furnished && (
            <Badge variant="outline" className="text-xs">Furnished</Badge>
          )}
          {request.parking_required && (
            <Badge variant="outline" className="text-xs">Parking needed</Badge>
          )}
        </div>

        {/* Description Preview */}
        {request.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{request.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{request.enquiry_count}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(request.id)}>
            View
          </Button>
          <Button size="sm" onClick={() => onEnquire(request)}>
            Enquire
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
