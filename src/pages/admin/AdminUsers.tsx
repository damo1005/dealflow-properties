import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/stores/adminStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { UserWithProfile } from "@/types/admin";

export default function AdminUsers() {
  const { users, isLoadingUsers, setUsers, setIsLoadingUsers, setSelectedUser } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map to UserWithProfile type
      const usersData: UserWithProfile[] = (data || []).map((profile: any) => ({
        id: profile.id,
        email: profile.email || `user-${profile.id.substring(0, 8)}@example.com`,
        full_name: profile.full_name,
        created_at: profile.created_at,
        last_sign_in_at: profile.updated_at,
        plan: "free",
        is_active: true,
        total_revenue: 0,
      }));

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleViewUser = (user: UserWithProfile) => {
    setSelectedUser(user);
    toast.info(`Viewing ${user.full_name || user.email}`);
  };

  const handleSuspendUser = async (userId: string) => {
    toast.info("Suspend user functionality coming soon");
  };

  const handleDeleteUser = async (userId: string) => {
    toast.info("Delete user functionality coming soon");
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active !== false).length,
    pro: users.filter((u) => u.plan === "pro").length,
    premium: users.filter((u) => u.plan === "premium").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active:</span>
            <Badge className="bg-emerald-500">{stats.active}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Pro:</span>
            <Badge className="bg-blue-500">{stats.pro}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Premium:</span>
            <Badge className="bg-purple-500">{stats.premium}</Badge>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="pt-6">
            <AdminUsersTable
              users={users}
              isLoading={isLoadingUsers}
              onViewUser={handleViewUser}
              onSuspendUser={handleSuspendUser}
              onDeleteUser={handleDeleteUser}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
