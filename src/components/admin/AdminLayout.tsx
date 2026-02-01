import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoadingAdmin, setAdminUser, setIsAdmin, setIsLoadingAdmin } = useAdminStore();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        setIsLoadingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();

        if (error || !data) {
          setIsAdmin(false);
          setAdminUser(null);
          navigate("/dashboard");
        } else {
          setIsAdmin(true);
          setAdminUser(data as any);
        }
      } catch (err) {
        console.error("Error checking admin access:", err);
        setIsAdmin(false);
        navigate("/dashboard");
      } finally {
        setIsLoadingAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  if (authLoading || isLoadingAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
