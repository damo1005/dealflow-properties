import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Mail, 
  Eye, 
  RefreshCw,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import type { GeneratedReport, QuickReport } from "@/types/reports";

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quickReport?: QuickReport | null;
  isGenerating: boolean;
  progress: number;
  generatedReport?: GeneratedReport | null;
  onDownload: () => void;
  onEmail: () => void;
  onPreview: () => void;
  onRegenerate: () => void;
}

export function GenerateReportDialog({
  open,
  onOpenChange,
  quickReport,
  isGenerating,
  progress,
  generatedReport,
  onDownload,
  onEmail,
  onPreview,
  onRegenerate,
}: GenerateReportDialogProps) {
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isGenerating ? 'Generating Report' : 'Report Generated'}
          </DialogTitle>
        </DialogHeader>

        {isGenerating ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="font-medium">{quickReport?.title || 'Report'}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'MMMM yyyy')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {progress >= 20 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>Fetching data...</span>
              </div>
              <div className="flex items-center gap-2">
                {progress >= 40 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : progress >= 20 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className={progress < 20 ? 'text-muted-foreground' : ''}>
                  Calculating metrics...
                </span>
              </div>
              <div className="flex items-center gap-2">
                {progress >= 60 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : progress >= 40 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className={progress < 40 ? 'text-muted-foreground' : ''}>
                  Generating charts...
                </span>
              </div>
              <div className="flex items-center gap-2">
                {progress >= 100 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : progress >= 60 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className={progress < 60 ? 'text-muted-foreground' : ''}>
                  Creating PDF...
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Estimated time: {Math.max(1, Math.ceil((100 - progress) / 10))} seconds
            </p>
          </div>
        ) : generatedReport ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <p className="font-medium">{generatedReport.report_name}</p>
              {generatedReport.period_start && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(generatedReport.period_start), 'MMMM yyyy')}
                </p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">File size:</span>
                <span>{formatFileSize(generatedReport.file_size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Generated:</span>
                <span>{format(new Date(generatedReport.generated_at), 'PPp')}</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium mb-2">Summary:</p>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Properties:</span>
                <span>{generatedReport.properties_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Income:</span>
                <span>{formatCurrency(generatedReport.total_income)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Expenses:</span>
                <span>{formatCurrency(generatedReport.total_expenses)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Profit:</span>
                <span className="text-green-600">
                  {formatCurrency(generatedReport.net_profit)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={onDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={onEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onPreview} className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={onRegenerate} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
