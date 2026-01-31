import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Save,
  Eye,
  EyeOff,
  Share2,
  Settings2,
  FileText,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useDealPackStore, TemplateType } from "@/stores/dealPackStore";
import { TemplateSelector } from "@/components/dealpack/TemplateSelector";
import { SectionList } from "@/components/dealpack/SectionList";
import { SectionEditor } from "@/components/dealpack/SectionEditor";
import { BrandingEditor } from "@/components/dealpack/BrandingEditor";
import { DealPackPreview } from "@/components/dealpack/DealPackPreview";
import { generatePDF } from "@/components/dealpack/DealPackPDF";
import { useToast } from "@/hooks/use-toast";

export default function DealPackGenerator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentPack,
    createNewPack,
    updatePack,
    savePack,
    resetPack,
    previewMode,
    setPreviewMode,
  } = useDealPackStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectTemplate = (template: TemplateType) => {
    createNewPack(template);
  };

  const handleExportPDF = async () => {
    if (!currentPack) return;
    
    setIsExporting(true);
    try {
      const blob = await generatePDF(currentPack);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentPack.name.replace(/\s+/g, "-").toLowerCase()}-deal-pack.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Exported",
        description: "Your deal pack has been downloaded",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    savePack();
    toast({
      title: "Deal Pack Saved",
      description: "Your deal pack has been saved",
    });
  };

  const handleBack = () => {
    resetPack();
    navigate(-1);
  };

  // Show template selector if no pack
  if (!currentPack) {
    return (
      <AppLayout title="Create Deal Pack">
        <div className="max-w-4xl mx-auto py-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <TemplateSelector onSelect={handleSelectTemplate} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Deal Pack Generator">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <Input
                value={currentPack.name}
                onChange={(e) => updatePack({ name: e.target.value })}
                className="text-lg font-semibold border-none bg-transparent h-auto p-0 focus-visible:ring-0 w-[300px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="gap-2"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Left Sidebar - Sections & Settings */}
            {!previewMode && (
              <>
                <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-6">
                      <SectionList />
                      <BrandingEditor />
                    </div>
                  </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            {/* Center - Editor */}
            {!previewMode && (
              <>
                <ResizablePanel defaultSize={35} minSize={25}>
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <SectionEditor />
                    </div>
                  </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            {/* Right - Preview */}
            <ResizablePanel defaultSize={previewMode ? 100 : 40} minSize={30}>
              <ScrollArea className="h-full bg-muted/30">
                <div className={previewMode ? "p-8 max-w-4xl mx-auto" : "p-4"}>
                  <DealPackPreview />
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </AppLayout>
  );
}
