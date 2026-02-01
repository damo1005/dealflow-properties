import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  Pause,
  Play,
  Trash2,
  Send,
  Edit
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { ScheduledReport } from "@/types/reports";

interface ScheduledReportCardProps {
  report: ScheduledReport;
  onEdit: (report: ScheduledReport) => void;
  onToggle: (report: ScheduledReport) => void;
  onDelete: (report: ScheduledReport) => void;
  onSendNow: (report: ScheduledReport) => void;
}

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
  one_time: 'One-time',
};

export function ScheduledReportCard({ 
  report, 
  onEdit, 
  onToggle, 
  onDelete,
  onSendNow 
}: ScheduledReportCardProps) {
  const getScheduleDescription = () => {
    const freq = frequencyLabels[report.frequency] || report.frequency;
    if (report.frequency === 'weekly' && report.schedule_day) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${freq} on ${days[report.schedule_day - 1]}`;
    }
    if (report.frequency === 'monthly' && report.schedule_day) {
      return `${freq} on ${report.schedule_day}${getOrdinalSuffix(report.schedule_day)}`;
    }
    return freq;
  };

  const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{report.report_name}</h3>
            <p className="text-sm text-muted-foreground">
              Template: {report.template_id ? 'Custom' : 'Default'}
            </p>
          </div>
          <Badge variant={report.is_active ? "default" : "secondary"}>
            {report.is_active ? 'Active' : 'Paused'}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {getScheduleDescription()}
              {report.schedule_time && `, ${report.schedule_time.slice(0, 5)}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}</span>
          </div>

          {report.last_sent_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last sent: {format(new Date(report.last_sent_at), 'PP')}</span>
            </div>
          )}

          {report.next_send_at && report.is_active && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Send className="h-4 w-4" />
              <span>
                Next: {formatDistanceToNow(new Date(report.next_send_at), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => onEdit(report)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onToggle(report)}>
            {report.is_active ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Resume
              </>
            )}
          </Button>
          {report.is_active && (
            <Button variant="outline" size="sm" onClick={() => onSendNow(report)}>
              <Send className="h-4 w-4 mr-1" />
              Send Now
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(report)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
