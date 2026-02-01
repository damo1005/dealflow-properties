import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/stores/portfolioStore";
import {
  Wrench,
  Plus,
  Calendar,
  Phone,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import { format } from "date-fns";
import type { MaintenanceJob } from "@/types/portfolio";

const STATUS_COLUMNS = [
  { id: "reported", label: "Reported", color: "bg-gray-500" },
  { id: "scheduled", label: "Scheduled", color: "bg-blue-500" },
  { id: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { id: "completed", label: "Completed", color: "bg-green-500" },
];

const PRIORITY_COLORS = {
  urgent: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-gray-500 text-white",
};

export function PortfolioMaintenance() {
  const { maintenance, properties, updateMaintenance } = usePortfolioStore();
  const [draggedJob, setDraggedJob] = useState<string | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const handleDragStart = (jobId: string) => {
    setDraggedJob(jobId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedJob) {
      updateMaintenance(draggedJob, { status: status as MaintenanceJob["status"] });
      setDraggedJob(null);
    }
  };

  const openJobs = maintenance.filter((j) => j.status !== "completed" && j.status !== "cancelled");
  const urgentJobs = openJobs.filter((j) => j.priority === "urgent" || j.priority === "high");
  const totalEstimatedCost = openJobs.reduce((sum, j) => sum + (j.estimated_cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span className="text-sm">Open Jobs</span>
            </div>
            <p className="text-2xl font-bold mt-1">{openJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Urgent/High</span>
            </div>
            <p className="text-2xl font-bold text-red-500 mt-1">{urgentJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Scheduled</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {maintenance.filter((j) => j.status === "scheduled").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">Est. Cost</span>
            </div>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalEstimatedCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule All
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map((column) => {
          const columnJobs = maintenance.filter((j) => j.status === column.id);

          return (
            <div
              key={column.id}
              className="bg-muted/30 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h3 className="font-semibold">{column.label}</h3>
                </div>
                <Badge variant="secondary">{columnJobs.length}</Badge>
              </div>

              <div className="space-y-3">
                {columnJobs.map((job) => {
                  const property = properties.find(
                    (p) => p.id === job.portfolio_property_id
                  );

                  return (
                    <Card
                      key={job.id}
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(job.id)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {job.title}
                          </h4>
                          <Badge
                            className={`text-xs shrink-0 ${PRIORITY_COLORS[job.priority]}`}
                          >
                            {job.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{property?.address}</span>
                        </div>

                        {job.category && (
                          <Badge variant="outline" className="text-xs">
                            {job.category}
                          </Badge>
                        )}

                        {job.scheduled_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(job.scheduled_date), "dd MMM")}</span>
                          </div>
                        )}

                        {job.contractor_name && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{job.contractor_name}</span>
                          </div>
                        )}

                        {job.estimated_cost && (
                          <p className="text-xs font-medium">
                            Est: {formatCurrency(job.estimated_cost)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {columnJobs.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No jobs
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Maintenance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Property</th>
                  <th className="text-center py-3 px-2 font-medium">Open</th>
                  <th className="text-center py-3 px-2 font-medium">Scheduled</th>
                  <th className="text-center py-3 px-2 font-medium">Completed (YTD)</th>
                  <th className="text-right py-3 px-2 font-medium">Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const propertyJobs = maintenance.filter(
                    (j) => j.portfolio_property_id === property.id
                  );
                  const openCount = propertyJobs.filter(
                    (j) => j.status === "reported"
                  ).length;
                  const scheduledCount = propertyJobs.filter(
                    (j) => j.status === "scheduled" || j.status === "in_progress"
                  ).length;
                  const completedCount = propertyJobs.filter(
                    (j) => j.status === "completed"
                  ).length;
                  const estCost = propertyJobs
                    .filter((j) => j.status !== "completed")
                    .reduce((sum, j) => sum + (j.estimated_cost || 0), 0);

                  return (
                    <tr key={property.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{property.address}</p>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {openCount > 0 ? (
                          <Badge variant="destructive">{openCount}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {scheduledCount > 0 ? (
                          <Badge variant="secondary">{scheduledCount}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="text-green-600">{completedCount}</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {estCost > 0 ? formatCurrency(estCost) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
