import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Handshake,
  TicketCheck,
  Megaphone,
  BarChart3,
  Shield,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/stores/adminStore";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Revenue", url: "/admin/revenue", icon: DollarSign },
  { title: "Affiliates", url: "/admin/affiliates", icon: Handshake },
  { title: "Support", url: "/admin/support", icon: TicketCheck, badge: true },
  { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Moderation", url: "/admin/moderation", icon: Shield, badge: true },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const { stats, moderationQueue } = useAdminStore();

  const getBadgeCount = (item: typeof navItems[0]) => {
    if (item.title === "Support") return stats?.openTickets || 0;
    if (item.title === "Moderation") {
      return moderationQueue.filter((m) => m.status === "pending").length;
    }
    return 0;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
            <Shield className="h-5 w-5 text-destructive-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.url === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.url);
          const badgeCount = item.badge ? getBadgeCount(item) : 0;

          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </div>
              {badgeCount > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 min-w-[20px] justify-center text-xs"
                >
                  {badgeCount}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Back to App */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <NavLink to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to App</span>
          </NavLink>
        </Button>
      </div>
    </aside>
  );
}
