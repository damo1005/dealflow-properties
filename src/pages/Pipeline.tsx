import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { PipelineHeader } from "@/components/pipeline/PipelineHeader";
import { PipelineActivitySidebar } from "@/components/pipeline/PipelineActivitySidebar";
import { PropertyDetailModal } from "@/components/pipeline/PropertyDetailModal";
import { usePipelineStore } from "@/stores/pipelineStore";
import { cn } from "@/lib/utils";

export default function Pipeline() {
  const { showActivitySidebar, setSelectedPropertyId } = usePipelineStore();
  const location = useLocation();
  const highlightPropertyId = (location.state as any)?.highlightPropertyId;

  useEffect(() => {
    if (highlightPropertyId) {
      // Brief delay to let the board render, then highlight
      const timer = setTimeout(() => {
        setSelectedPropertyId(highlightPropertyId);
        const el = document.querySelector(`[data-rfd-draggable-id="${highlightPropertyId}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightPropertyId, setSelectedPropertyId]);

  return (
    <AppLayout title="Landlord Pipeline">
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
