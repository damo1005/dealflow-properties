import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import type { ReportTemplate, ReportFrequency, DateRangeType } from "@/types/reports";

interface CreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ReportTemplate[];
  onSave: (data: ScheduleFormData) => void;
}

interface ScheduleFormData {
  report_name: string;
  template_id: string;
  frequency: ReportFrequency;
  schedule_day?: number;
  schedule_time: string;
  recipients: string[];
  email_subject: string;
  email_message: string;
  date_range_type: DateRangeType;
  include_me: boolean;
}

export function CreateScheduleDialog({
  open,
  onOpenChange,
  templates,
  onSave,
}: CreateScheduleDialogProps) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    report_name: '',
    template_id: '',
    frequency: 'monthly',
    schedule_day: 1,
    schedule_time: '09:00',
    recipients: [],
    email_subject: '',
    email_message: '',
    date_range_type: 'last_month',
    include_me: true,
  });
  const [newRecipient, setNewRecipient] = useState('');

  const handleAddRecipient = () => {
    if (newRecipient && !formData.recipients.includes(newRecipient)) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, newRecipient],
      }));
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Scheduled Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report_name">Report Name *</Label>
              <Input
                id="report_name"
                value={formData.report_name}
                onChange={(e) => setFormData(prev => ({ ...prev, report_name: e.target.value }))}
                placeholder="e.g., Weekly Property Update"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template *</Label>
              <Select
                value={formData.template_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.template_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium">Schedule</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: ReportFrequency) => 
                    setFormData(prev => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={formData.schedule_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule_time: e.target.value }))}
                />
              </div>
            </div>

            {formData.frequency === 'weekly' && (
              <div className="space-y-2">
                <Label>Day of Week *</Label>
                <Select
                  value={String(formData.schedule_day || 1)}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, schedule_day: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                    <SelectItem value="7">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.frequency === 'monthly' && (
              <div className="space-y-2">
                <Label>Day of Month *</Label>
                <Select
                  value={String(formData.schedule_day || 1)}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, schedule_day: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={String(day)}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <h4 className="font-medium">Recipients</h4>
            
            <div className="flex gap-2">
              <Input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="email@example.com"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRecipient())}
              />
              <Button type="button" variant="outline" onClick={handleAddRecipient}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.recipients.map(email => (
                <Badge key={email} variant="secondary" className="gap-1">
                  {email}
                  <button onClick={() => handleRemoveRecipient(email)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include_me"
                checked={formData.include_me}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, include_me: checked as boolean }))
                }
              />
              <Label htmlFor="include_me" className="text-sm font-normal">
                Include me as a recipient
              </Label>
            </div>
          </div>

          {/* Email Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Email Options</h4>
            
            <div className="space-y-2">
              <Label htmlFor="email_subject">Email Subject</Label>
              <Input
                id="email_subject"
                value={formData.email_subject}
                onChange={(e) => setFormData(prev => ({ ...prev, email_subject: e.target.value }))}
                placeholder="{report_name} - {date}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_message">Email Message</Label>
              <Textarea
                id="email_message"
                value={formData.email_message}
                onChange={(e) => setFormData(prev => ({ ...prev, email_message: e.target.value }))}
                placeholder="Please find attached..."
                rows={3}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h4 className="font-medium">Report Settings</h4>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select
                value={formData.date_range_type}
                onValueChange={(value: DateRangeType) => 
                  setFormData(prev => ({ ...prev, date_range_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.report_name || !formData.template_id}>
            Create Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
