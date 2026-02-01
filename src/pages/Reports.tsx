import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search,
  FileText
} from "lucide-react";
import { QuickReportCard } from "@/components/reports/QuickReportCard";
import { ScheduledReportCard } from "@/components/reports/ScheduledReportCard";
import { GeneratedReportRow } from "@/components/reports/GeneratedReportRow";
import { ReportTemplateCard } from "@/components/reports/ReportTemplateCard";
import { GenerateReportDialog } from "@/components/reports/GenerateReportDialog";
import { CreateScheduleDialog } from "@/components/reports/CreateScheduleDialog";
import { useReportsStore } from "@/stores/reportsStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { 
  QuickReport, 
  ReportTemplate, 
  ScheduledReport, 
  GeneratedReport 
} from "@/types/reports";

const quickReports: QuickReport[] = [
  {
    id: '1',
    title: 'Monthly Performance',
    description: "Last month's portfolio performance",
    icon: 'bar-chart',
    template_type: 'monthly_performance',
    includes: ['Income & expenses', 'Cash flow analysis', 'Property performance', 'Occupancy status'],
  },
  {
    id: '2',
    title: 'Tax Year-End Report',
    description: '6 Apr 2025 - 5 Apr 2026',
    icon: 'receipt',
    template_type: 'tax_year_end',
    includes: ['Annual income statement', 'Deductible expenses', 'Mortgage interest relief', 'Capital gains summary'],
    badge: 'For accountant',
  },
  {
    id: '3',
    title: 'Investor Report',
    description: 'Quarterly performance update',
    icon: 'trending-up',
    template_type: 'investor_report',
    includes: ['Portfolio valuation', 'ROI analysis', 'Market performance', 'Future outlook'],
  },
  {
    id: '4',
    title: 'Lender Report',
    description: 'For mortgage/refinance applications',
    icon: 'building',
    template_type: 'lender_report',
    includes: ['Portfolio overview', 'Rental income proof', 'Compliance certificates', 'Property valuations'],
  },
  {
    id: '5',
    title: 'Compliance Report',
    description: 'All certificates and compliance',
    icon: 'shield-check',
    template_type: 'compliance_report',
    includes: ['Gas Safety certificates', 'EPC ratings', 'EICR certificates', 'Insurance policies'],
  },
];

export default function Reports() {
  const { toast } = useToast();
  const {
    templates,
    scheduledReports,
    generatedReports,
    isGenerating,
    generationProgress,
    activeTab,
    setTemplates,
    setScheduledReports,
    setGeneratedReports,
    setIsGenerating,
    setGenerationProgress,
    setActiveTab,
  } = useReportsStore();

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedQuickReport, setSelectedQuickReport] = useState<QuickReport | null>(null);
  const [currentGeneratedReport, setCurrentGeneratedReport] = useState<GeneratedReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('30');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load templates
      const { data: templatesData } = await supabase
        .from('report_templates')
        .select('*')
        .order('is_system_template', { ascending: false });
      
      if (templatesData) {
        setTemplates(templatesData as unknown as ReportTemplate[]);
      }

      // Load scheduled reports
      const { data: scheduledData } = await supabase
        .from('scheduled_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (scheduledData) {
        setScheduledReports(scheduledData as unknown as ScheduledReport[]);
      }

      // Load generated reports
      const { data: generatedData } = await supabase
        .from('generated_reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(50);
      
      if (generatedData) {
        setGeneratedReports(generatedData as unknown as GeneratedReport[]);
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
    }
  };

  const handleGenerateQuickReport = async (report: QuickReport) => {
    setSelectedQuickReport(report);
    setGenerateDialogOpen(true);
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setGenerationProgress(100);
      } else {
        setGenerationProgress(currentProgress);
      }
    }, 300);

    // Simulate completion
    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);
      
      const mockReport: GeneratedReport = {
        id: crypto.randomUUID(),
        user_id: '',
        report_name: report.title,
        report_type: report.template_type,
        period_start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(),
        period_end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString(),
        file_size: 2457600,
        properties_count: 12,
        total_income: 18500,
        total_expenses: 14250,
        net_profit: 4250,
        generated_at: new Date().toISOString(),
        generation_time_ms: 3200,
        was_sent: false,
        download_count: 0,
        created_at: new Date().toISOString(),
      };
      
      setCurrentGeneratedReport(mockReport);
    }, 3500);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded...",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email Sent",
      description: "Report has been sent to your email.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "Report preview would open in a new tab.",
    });
  };

  const handleRegenerate = () => {
    if (selectedQuickReport) {
      handleGenerateQuickReport(selectedQuickReport);
    }
  };

  const handleEditSchedule = (report: ScheduledReport) => {
    toast({ title: "Edit", description: "Edit schedule dialog would open." });
  };

  const handleToggleSchedule = async (report: ScheduledReport) => {
    try {
      await supabase
        .from('scheduled_reports')
        .update({ is_active: !report.is_active })
        .eq('id', report.id);
      
      loadData();
      toast({
        title: report.is_active ? "Paused" : "Resumed",
        description: `Schedule has been ${report.is_active ? 'paused' : 'resumed'}.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update schedule.", variant: "destructive" });
    }
  };

  const handleDeleteSchedule = async (report: ScheduledReport) => {
    try {
      await supabase.from('scheduled_reports').delete().eq('id', report.id);
      loadData();
      toast({ title: "Deleted", description: "Schedule has been deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete schedule.", variant: "destructive" });
    }
  };

  const handleSendNow = (report: ScheduledReport) => {
    toast({ title: "Sending", description: "Report is being generated and sent..." });
  };

  const handleSaveSchedule = async (data: any) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      await supabase.from('scheduled_reports').insert({
        user_id: userData.user.id,
        report_name: data.report_name,
        template_id: data.template_id,
        frequency: data.frequency,
        schedule_day: data.schedule_day,
        schedule_time: data.schedule_time,
        recipients: data.recipients.map((email: string) => ({ email })),
        email_subject: data.email_subject,
        email_message: data.email_message,
        date_range_type: data.date_range_type,
        is_active: true,
      });

      loadData();
      toast({ title: "Created", description: "Scheduled report has been created." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create schedule.", variant: "destructive" });
    }
  };

  const handleUseTemplate = (template: ReportTemplate) => {
    const quickReport: QuickReport = {
      id: template.id,
      title: template.template_name,
      description: '',
      icon: 'file-text',
      template_type: template.template_type,
      includes: [],
    };
    handleGenerateQuickReport(quickReport);
  };

  const handlePreviewTemplate = (template: ReportTemplate) => {
    toast({ title: "Preview", description: "Template preview would open." });
  };

  const filteredGeneratedReports = generatedReports.filter(report =>
    report.report_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const systemTemplates = templates.filter(t => t.is_system_template);
  const userTemplates = templates.filter(t => !t.is_system_template);

  return (
    <AppLayout title="Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and schedule professional landlord reports
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Quick Reports</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Pre-configured reports ready to generate:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickReports.map(report => (
                  <QuickReportCard
                    key={report.id}
                    report={report}
                    onGenerate={handleGenerateQuickReport}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Automated Reports</h2>
                <p className="text-sm text-muted-foreground">
                  Reports that are generated and sent automatically
                </p>
              </div>
              <Button onClick={() => setScheduleDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </div>

            {scheduledReports.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No scheduled reports</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a schedule to automatically generate and send reports
                </p>
                <Button onClick={() => setScheduleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledReports.map(report => (
                  <ScheduledReportCard
                    key={report.id}
                    report={report}
                    onEdit={handleEditSchedule}
                    onToggle={handleToggleSchedule}
                    onDelete={handleDeleteSchedule}
                    onSendNow={handleSendNow}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredGeneratedReports.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No reports generated</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a report to see it here
                </p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGeneratedReports.map(report => (
                      <GeneratedReportRow
                        key={report.id}
                        report={report}
                        onDownload={handleDownload}
                        onEmail={handleEmail}
                        onPreview={handlePreview}
                        onDelete={() => {}}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">System Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemTemplates.map(template => (
                  <ReportTemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                    onPreview={handlePreviewTemplate}
                  />
                ))}
              </div>
            </div>

            {userTemplates.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">My Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTemplates.map(template => (
                    <ReportTemplateCard
                      key={template.id}
                      template={template}
                      onUse={handleUseTemplate}
                      onPreview={handlePreviewTemplate}
                      onEdit={() => {}}
                      onDuplicate={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <GenerateReportDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        quickReport={selectedQuickReport}
        isGenerating={isGenerating}
        progress={generationProgress}
        generatedReport={currentGeneratedReport}
        onDownload={handleDownload}
        onEmail={handleEmail}
        onPreview={handlePreview}
        onRegenerate={handleRegenerate}
      />

      <CreateScheduleDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        templates={templates}
        onSave={handleSaveSchedule}
      />
    </AppLayout>
  );
}
