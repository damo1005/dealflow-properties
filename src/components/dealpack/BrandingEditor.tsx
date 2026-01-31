import { Upload, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDealPackStore } from "@/stores/dealPackStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function BrandingEditor() {
  const { currentPack, updateBranding } = useDealPackStore();

  if (!currentPack) return null;

  const { branding } = currentPack;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="branding">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Branding Settings</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-3">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Logo"
                  className="h-12 w-12 object-contain rounded border"
                />
              ) : (
                <div className="h-12 w-12 rounded border border-dashed flex items-center justify-center bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <Button variant="outline" size="sm">
                Upload Logo
              </Button>
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={branding.companyName}
              onChange={(e) => updateBranding({ companyName: e.target.value })}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={branding.contactEmail}
              onChange={(e) => updateBranding({ contactEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={branding.contactPhone}
              onChange={(e) => updateBranding({ contactPhone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={branding.website}
              onChange={(e) => updateBranding({ website: e.target.value })}
            />
          </div>

          {/* Custom Footer */}
          <div className="space-y-2">
            <Label htmlFor="customFooter">Footer Text</Label>
            <Textarea
              id="customFooter"
              value={branding.customFooter}
              onChange={(e) => updateBranding({ customFooter: e.target.value })}
              rows={2}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
