import { 
  LayoutDashboard, 
  ChevronLeft,
  ChevronRight,
  Building2,
  Target,
  GitBranch,
  BedDouble,
  Radar,
  Briefcase,
  HardHat,
  MessageSquare,
  LucideIcon
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Deal Analyser", url: "/tools/deal-analyser", icon: Target },
  { title: "Landlord Pipeline", url: "/pipeline", icon: GitBranch },
  { title: "STR Management", url: "/str", icon: BedDouble },
  { title: "Airbnb Radar", url: "/airbnb-radar", icon: Radar },
  { title: "Portfolio", url: "/portfolio", icon: Briefcase },
  { title: "Accommodation Requests", url: "/accommodation", icon: MessageSquare },
  { title: "Contractor Demand", url: "/contractor-demand", icon: HardHat },
];

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  const isItemActive = (url: string) => {
    if (url === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(url);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold text-foreground animate-fade-in">
              DealFlow
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            sidebarCollapsed && "justify-center px-2"
          )}
          activeClassName="bg-sidebar-accent text-sidebar-primary"
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span className="animate-fade-in">Dashboard</span>}
        </NavLink>

        {/* Section heading */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            SA Operator Tools
          </div>
        )}

        {/* Nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              sidebarCollapsed && "justify-center px-2"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary"
            title={sidebarCollapsed ? item.title : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span className="animate-fade-in">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent",
            !sidebarCollapsed && "justify-start gap-3 px-3"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
