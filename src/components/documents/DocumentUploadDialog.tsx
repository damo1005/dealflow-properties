import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FileUpload {
  file: File;
  category: string;
  property_id: string;
  tags: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
}

const CATEGORIES = [
  { value: "tenancy_agreements", label: "Tenancy Agreements" },
  { value: "certificates", label: "Certificates" },
  { value: "invoices", label: "Invoices & Receipts" },
  { value: "photos", label: "Photos" },
  { value: "insurance", label: "Insurance" },
  { value: "mortgages", label: "Mortgages" },
  { value: "legal", label: "Legal Documents" },
  { value: "tax", label: "Tax Documents" },
  { value: "other", label: "Other" },
];

const MOCK_PROPERTIES = [
  { id: "1", address: "123 High Street, EN3" },
  { id: "2", address: "45 Oak Road, N17" },
  { id: "3", address: "67 Elm Street, E17" },
];

export function DocumentUploadDialog({ open, onOpenChange }: DocumentUploadDialogProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileUploads: FileUpload[] = newFiles.map((file) => ({
      file,
      category: "",
      property_id: "",
      tags: "",
      progress: 0,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...fileUploads]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFile = (index: number, updates: Partial<FileUpload>) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = async () => {
    setIsUploading(true);

    // Simulate upload for each file
    for (let i = 0; i < files.length; i++) {
      updateFile(i, { status: "uploading" });

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((r) => setTimeout(r, 100));
        updateFile(i, { progress });
      }

      updateFile(i, { status: "complete", progress: 100 });
    }

    setIsUploading(false);
    toast.success(`${files.length} document${files.length > 1 ? "s" : ""} uploaded successfully`);
    
    setTimeout(() => {
      onOpenChange(false);
      setFiles([]);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Documents
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium mb-1">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button asChild>
              <label className="cursor-pointer">
                Browse Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported: PDF, JPG, PNG, DOCX, XLSX • Max 50 MB per file
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((fileUpload, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-3"
                >
                  {/* File Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{fileUpload.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(fileUpload.file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {fileUpload.status === "complete" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {fileUpload.status === "uploading" && (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      )}
                      {fileUpload.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileUpload.status === "uploading" && (
                    <Progress value={fileUpload.progress} className="h-1" />
                  )}

                  {/* File Details */}
                  {fileUpload.status === "pending" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={fileUpload.category}
                          onValueChange={(v) => updateFile(index, { category: v })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Property</Label>
                        <Select
                          value={fileUpload.property_id}
                          onValueChange={(v) => updateFile(index, { property_id: v })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_PROPERTIES.map((prop) => (
                              <SelectItem key={prop.id} value={prop.id}>
                                {prop.address}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Tags (comma separated)</Label>
                        <Input
                          value={fileUpload.tags}
                          onChange={(e) => updateFile(index, { tags: e.target.value })}
                          placeholder="e.g., tenancy, 2026, important"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload All ({files.length} file{files.length !== 1 ? "s" : ""})</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
