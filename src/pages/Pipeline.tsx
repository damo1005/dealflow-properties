import { AppLayout } from "@/components/layout/AppLayout";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { PipelineHeader } from "@/components/pipeline/PipelineHeader";
import { PipelineActivitySidebar } from "@/components/pipeline/PipelineActivitySidebar";
import { PropertyDetailModal } from "@/components/pipeline/PropertyDetailModal";
import { usePipelineStore } from "@/stores/pipelineStore";
import { cn } from "@/lib/utils";

export default function Pipeline() {
  const { showActivitySidebar } = usePipelineStore();

  return (
    <AppLayout title="My Pipeline">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Content */}
        <div className={cn("flex-1 space-y-6 transition-all", showActivitySidebar && "pr-0")}>
          <PipelineHeader />
          <PipelineBoard />
        </div>

        {/* Activity Sidebar */}
        {showActivitySidebar && <PipelineActivitySidebar />}
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal />
    </AppLayout>
  );
}
