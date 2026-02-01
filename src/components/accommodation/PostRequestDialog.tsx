import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PostRequestDialogProps {
  open: boolean;
  onClose: () => void;
}

const propertyTypeOptions = [
  { id: "studio", label: "Studio" },
  { id: "1-bed", label: "1 Bed" },
  { id: "2-bed", label: "2 Bed" },
  { id: "3-bed", label: "3+ Bed" },
  { id: "house", label: "House" },
];

export function PostRequestDialog({ open, onClose }: PostRequestDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form state
  const [requestType, setRequestType] = useState<"seeking" | "offering">("seeking");
  const [location, setLocation] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState<Date | undefined>();
  const [moveOutDate, setMoveOutDate] = useState<Date | undefined>();
  const [isAsap, setIsAsap] = useState(false);
  const [isLongTerm, setIsLongTerm] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState("1");
  const [hasChildren, setHasChildren] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [budgetMax, setBudgetMax] = useState("");
  const [selfContained, setSelfContained] = useState(false);
  const [noSharing, setNoSharing] = useState(false);
  const [parkingRequired, setParkingRequired] = useState(false);
  const [furnished, setFurnished] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactMethod, setContactMethod] = useState<string>("platform");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [expiresIn, setExpiresIn] = useState("30");

  const togglePropertyType = (type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Auto-generate title
  const generateTitle = () => {
    const guests = parseInt(numberOfGuests);
    const guestText = guests === 1 ? "Single person" : guests === 2 ? "1 couple" : `${guests} people`;
    const types = propertyTypes.length > 0 ? propertyTypes.join(" or ") : "any property";
    const budget = budgetMax ? `£${parseInt(budgetMax).toLocaleString()}` : "";
    const dateText = moveOutDate ? `(till ${format(moveOutDate, "MMMM yyyy")})` : isLongTerm ? "(long-term)" : "";
    
    return `${guestText} — ${types} — budget ${budget} ${dateText}`.trim();
  };

  const handleSubmit = () => {
    // TODO: Save to Supabase
    toast({
      title: "Request Posted Successfully!",
      description: "Your request is now live and visible to others.",
    });
    onClose();
    // Reset form
    setStep(1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return location.length > 0 && propertyTypes.length > 0;
      case 3: return true;
      case 4: return budgetMax.length > 0;
      case 5: return description.length > 0;
      case 6: return contactName.length > 0;
      default: return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Post Accommodation Request</DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <ScrollArea className="flex-1 pr-4">
          {/* Step 1: Request Type */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">What type of request?</h3>
              <RadioGroup value={requestType} onValueChange={(v) => setRequestType(v as typeof requestType)}>
                <div className="grid gap-3">
                  <Label
                    htmlFor="seeking"
                    className={cn(
                      "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      requestType === "seeking" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="seeking" id="seeking" />
                    <div>
                      <p className="font-medium">I'm seeking accommodation</p>
                      <p className="text-sm text-muted-foreground">I'm a tenant/guest looking for a place</p>
                    </div>
                  </Label>
                  <Label
                    htmlFor="offering"
                    className={cn(
                      "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      requestType === "offering" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="offering" id="offering" />
                    <div>
                      <p className="font-medium">I'm offering accommodation</p>
                      <p className="text-sm text-muted-foreground">I'm a landlord with a property to let</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Location & Property Details</h3>
              
              <div className="space-y-2">
                <Label>Location / Postcode Area *</Label>
                <Input
                  placeholder="e.g. Enfield EN3, Camden NW1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type *</Label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypeOptions.map((option) => (
                    <Badge
                      key={option.id}
                      variant={propertyTypes.includes(option.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePropertyType(option.id)}
                    >
                      {propertyTypes.includes(option.id) && <Check className="h-3 w-3 mr-1" />}
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Move-in Date</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left" disabled={isAsap}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {moveInDate ? format(moveInDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={moveInDate} onSelect={setMoveInDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="asap" checked={isAsap} onCheckedChange={(c) => setIsAsap(!!c)} />
                    <Label htmlFor="asap" className="text-sm font-normal">ASAP / Flexible</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Move-out Date</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left" disabled={isLongTerm}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {moveOutDate ? format(moveOutDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={moveOutDate} onSelect={setMoveOutDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="longterm" checked={isLongTerm} onCheckedChange={(c) => setIsLongTerm(!!c)} />
                    <Label htmlFor="longterm" className="text-sm font-normal">Long-term / Ongoing</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Guest Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Guest / Tenant Details</h3>

              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <Select value={numberOfGuests} onValueChange={setNumberOfGuests}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "person" : "people"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="children" checked={hasChildren} onCheckedChange={(c) => setHasChildren(!!c)} />
                  <Label htmlFor="children" className="font-normal">With children</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="pets" checked={hasPets} onCheckedChange={(c) => setHasPets(!!c)} />
                  <Label htmlFor="pets" className="font-normal">With pets</Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Requirements */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Budget & Requirements</h3>

              <div className="space-y-2">
                <Label>Maximum Budget (per month) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    type="number"
                    placeholder="1,300"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="font-medium">Requirements</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="self-contained" checked={selfContained} onCheckedChange={(c) => setSelfContained(!!c)} />
                    <Label htmlFor="self-contained" className="font-normal text-sm">Self-contained required</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="no-sharing" checked={noSharing} onCheckedChange={(c) => setNoSharing(!!c)} />
                    <Label htmlFor="no-sharing" className="font-normal text-sm">No sharing</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="parking" checked={parkingRequired} onCheckedChange={(c) => setParkingRequired(!!c)} />
                    <Label htmlFor="parking" className="font-normal text-sm">Parking required</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Furnishing</Label>
                <RadioGroup
                  value={furnished === null ? "" : furnished ? "furnished" : "unfurnished"}
                  onValueChange={(v) => setFurnished(v === "furnished" ? true : v === "unfurnished" ? false : null)}
                >
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="furnished" id="furnished" />
                      <Label htmlFor="furnished" className="font-normal">Furnished</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="unfurnished" id="unfurnished" />
                      <Label htmlFor="unfurnished" className="font-normal">Unfurnished</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="" id="any-furnishing" />
                      <Label htmlFor="any-furnishing" className="font-normal">Either</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 5: Description */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Description</h3>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Auto-generated from your details"
                  value={title || generateTitle()}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This will be the headline of your request</p>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe your situation, what you're looking for, any special requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
              </div>

              <div className="space-y-2">
                <Label>Special Requirements (optional)</Label>
                <Textarea
                  placeholder="Any other specific needs? (e.g., ground floor, wheelchair accessible)"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 6: Contact & Visibility */}
          {step === 6 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Contact Details</h3>

              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input
                  placeholder="Full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Contact Method</Label>
                <RadioGroup value={contactMethod} onValueChange={setContactMethod}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="platform" id="platform" />
                      <Label htmlFor="platform" className="font-normal">Through platform</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="email" id="email-method" />
                      <Label htmlFor="email-method" className="font-normal">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="phone" id="phone-method" />
                      <Label htmlFor="phone-method" className="font-normal">Phone</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp-method" />
                      <Label htmlFor="whatsapp-method" className="font-normal">WhatsApp</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {contactMethod === "email" && (
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                </div>
              )}

              {(contactMethod === "phone" || contactMethod === "whatsapp") && (
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" placeholder="+44 7XXX XXXXXX" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox id="show-contact" checked={showContactDetails} onCheckedChange={(c) => setShowContactDetails(!!c)} />
                  <div>
                    <Label htmlFor="show-contact" className="font-normal">Show my contact details publicly</Label>
                    <p className="text-xs text-muted-foreground">Your details will be visible to all users</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Request expires in</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onClose()}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()}>
              Post Request
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
