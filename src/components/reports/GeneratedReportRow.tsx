import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Mail, 
  Eye, 
  Trash2,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import type { GeneratedReport } from "@/types/reports";

interface GeneratedReportRowProps {
  report: GeneratedReport;
  onDownload: (report: GeneratedReport) => void;
  onEmail: (report: GeneratedReport) => void;
  onPreview: (report: GeneratedReport) => void;
  onDelete: (report: GeneratedReport) => void;
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const typeLabels: Record<string, string> = {
  monthly_performance: 'Monthly',
  quarterly_review: 'Quarterly',
  annual_summary: 'Annual',
  tax_year_end: 'Tax',
  investor_report: 'Investor',
  lender_report: 'Lender',
  compliance_report: 'Compliance',
  custom: 'Custom',
};

export function GeneratedReportRow({ 
  report, 
  onDownload, 
  onEmail, 
  onPreview, 
  onDelete 
}: GeneratedReportRowProps) {
  const formatPeriod = () => {
    if (report.period_start && report.period_end) {
      return `${format(new Date(report.period_start), 'MMM yyyy')} - ${format(new Date(report.period_end), 'MMM yyyy')}`;
    }
    if (report.period_start) {
      return format(new Date(report.period_start), 'MMM yyyy');
    }
    return '-';
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(report.generated_at), 'PP')}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{report.report_name}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {typeLabels[report.report_type || ''] || report.report_type || 'Report'}
        </Badge>
      </TableCell>
      <TableCell>{formatPeriod()}</TableCell>
      <TableCell>
        {report.was_sent ? (
          <Badge variant="secondary">
            {report.sent_to?.length || 0} sent
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatFileSize(report.file_size)}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onDownload(report)}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onEmail(report)}
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onPreview(report)}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(report)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
