import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSettingsPanel } from "@/components/admin/AdminSettingsPanel";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PlatformSetting } from "@/types/admin";

export default function AdminSettings() {
  const { settings, isLoadingSettings, setSettings, setIsLoadingSettings } = useAdminStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .order("category");

      if (error) throw error;
      setSettings((data || []) as PlatformSetting[]);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: any) => {
    try {
      const jsonValue = typeof value === "string" ? `"${value}"` : JSON.stringify(value);
      
      const { error } = await supabase
        .from("platform_settings")
        .update({ setting_value: jsonValue })
        .eq("setting_key", key);

      if (error) throw error;

      // Update local state
      setSettings(
        settings.map((s) =>
          s.setting_key === key ? { ...s, setting_value: jsonValue } : s
        )
      );
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure your platform settings and integrations
          </p>
        </div>

        {/* Settings Panel */}
        <AdminSettingsPanel
          settings={settings}
          onUpdateSetting={handleUpdateSetting}
          isLoading={isLoadingSettings}
        />
      </div>
    </AdminLayout>
  );
}
