import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Trash2, Star, FileText, Image, Building2, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  category: string;
  title?: string;
  tags: string[];
  is_favorite: boolean;
  uploaded_at: string;
  property_address?: string;
}

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  tenancy_agreements: "Tenancy Agreements",
  certificates: "Certificates",
  invoices: "Invoices",
  receipts: "Receipts",
  insurance: "Insurance",
  mortgages: "Mortgages",
  photos: "Photos",
  legal: "Legal",
  tax: "Tax",
  other: "Other",
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentViewerDialog({ open, onOpenChange, document }: DocumentViewerDialogProps) {
  if (!document) return null;

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(document.file_type.toLowerCase());
  const isPdf = document.file_type.toLowerCase() === "pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            {isImage ? <Image className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            <span className="truncate">{document.title || document.file_name}</span>
            {document.is_favorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden gap-4">
          {/* Preview Area */}
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {isImage ? (
              <img
                src="/placeholder.svg"
                alt={document.file_name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            ) : isPdf ? (
              <div className="text-center p-8">
                <FileText className="h-24 w-24 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium mb-2">{document.file_name}</p>
                <p className="text-sm text-muted-foreground mb-4">PDF Preview</p>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download to View
                </Button>
              </div>
            ) : (
              <div className="text-center p-8">
                <FileText className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{document.file_name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Preview not available for this file type
                </p>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-72 flex-shrink-0 space-y-4 overflow-y-auto">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Details</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">File Name</p>
                    <p className="font-medium break-all">{document.file_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[document.category] || document.category}
                    </Badge>
                  </div>
                </div>

                {document.property_address && (
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Property</p>
                      <p className="font-medium">{document.property_address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Uploaded</p>
                    <p className="font-medium">
                      {format(new Date(document.uploaded_at), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{formatFileSize(document.file_size)}</p>
                </div>

                {document.tags.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
              <Button className="w-full" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                {document.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              <Button className="w-full" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
