import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Send } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { AccommodationRequest } from "@/types/accommodation";
import { cn } from "@/lib/utils";

interface SendEnquiryDialogProps {
  open: boolean;
  onClose: () => void;
  request: AccommodationRequest;
}

export function SendEnquiryDialog({ open, onClose, request }: SendEnquiryDialogProps) {
  const { toast } = useToast();
  const [hasProperty, setHasProperty] = useState<string>("no");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState<Date | undefined>();
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [shareContactDetails, setShareContactDetails] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please write a message to send with your enquiry.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save to Supabase
    toast({
      title: "Enquiry Sent!",
      description: `${request.contact_name} will see your message and can respond.`,
    });
    onClose();
    // Reset form
    setMessage("");
    setHasProperty("no");
  };

  const templateMessages = [
    "I have a property that matches your requirements and would love to discuss further.",
    "When would you be available for a viewing?",
    "Are you flexible on the move-in date?",
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Send Enquiry to {request.contact_name}</DialogTitle>
          <DialogDescription>
            Respond to: {request.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Has Property */}
            {request.request_type === "seeking" && (
              <div className="space-y-3">
                <Label className="font-medium">Do you have a property to offer?</Label>
                <RadioGroup value={hasProperty} onValueChange={setHasProperty}>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="has-property" />
                      <Label htmlFor="has-property" className="font-normal">Yes, I have a property</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="no-property" />
                      <Label htmlFor="no-property" className="font-normal">No, just enquiring</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Property Details (if offering) */}
            {hasProperty === "yes" && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm">Your Offer</h4>
                
                <div className="space-y-2">
                  <Label>Offered Price (per month)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input
                      type="number"
                      placeholder={String(request.budget_max)}
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {availableFrom ? format(availableFrom, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={availableFrom} onSelect={setAvailableFrom} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder={`Hi ${request.contact_name}, I saw your accommodation request and...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              
              <div className="flex flex-wrap gap-2 mt-2">
                <p className="text-xs text-muted-foreground w-full">Quick templates:</p>
                {templateMessages.map((template, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setMessage((prev) => prev + (prev ? " " : "") + template)}
                  >
                    {template.substring(0, 30)}...
                  </Button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <Label className="font-medium">Your Contact Details</Label>
              
              <div className="space-y-2">
                <Label className="text-sm">Name</Label>
                <Input
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Phone (optional)</Label>
                <Input
                  type="tel"
                  placeholder="+44 7XXX XXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="share-contact"
                  checked={shareContactDetails}
                  onCheckedChange={(c) => setShareContactDetails(!!c)}
                />
                <div>
                  <Label htmlFor="share-contact" className="font-normal text-sm">
                    Share my contact details with {request.contact_name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    They'll be able to contact you directly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Send Enquiry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
