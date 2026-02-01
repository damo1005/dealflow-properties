import { 
  LayoutDashboard, 
  Search, 
  GitBranch, 
  Bookmark, 
  Calculator, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  Percent,
  MessageCircle,
  Briefcase,
  Gavel,
  Users,
  Bell,
  Radar,
  Plug,
  TrendingUp,
  BedDouble,
  FileText,
  Target,
  Map,
  CreditCard,
  Handshake,
  Key,
  UserCheck
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search Properties", url: "/search", icon: Search },
  { title: "Market Intel", url: "/market-intel", icon: TrendingUp },
  { title: "Yield Map", url: "/tools/yield-map", icon: Map },
  { title: "My Pipeline", url: "/pipeline", icon: GitBranch },
  { title: "Portfolio", url: "/portfolio", icon: Briefcase },
  { title: "Mortgage Tracker", url: "/portfolio/mortgages", icon: CreditCard },
  { title: "JV Deals", url: "/portfolio/jv-deals", icon: Handshake },
  { title: "STR Management", url: "/str", icon: BedDouble },
  { title: "Calculators", url: "/calculators", icon: Calculator },
  { title: "Deal Analyser", url: "/tools/deal-analyser", icon: Target },
  { title: "Mortgages", url: "/mortgages", icon: Percent },
  { title: "Deal Scout", url: "/deal-scout", icon: Radar },
  { title: "Auctions", url: "/auctions", icon: Gavel },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Network", url: "/network", icon: Users },
  { title: "Copilot", url: "/copilot", icon: MessageCircle },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Accommodation", url: "/accommodation", icon: Home },
  { title: "Saved Searches", url: "/saved-searches", icon: Bookmark },
  { title: "Team", url: "/settings/team", icon: UserCheck },
  { title: "API & Webhooks", url: "/settings/api", icon: Key },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

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
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/dashboard"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              sidebarCollapsed && "justify-center px-2"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && (
              <span className="animate-fade-in">{item.title}</span>
            )}
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
