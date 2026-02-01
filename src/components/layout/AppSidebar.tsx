import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Search, 
  GitBranch, 
  Calculator, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Percent,
  MessageCircle,
  Briefcase,
  HardHat,
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
  Calendar,
  BarChart3,
  GitCompare,
  LucideIcon
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "FIND",
    icon: Search,
    items: [
      { title: "Search Properties", url: "/search", icon: Search },
      { title: "Market Intel", url: "/market-intel", icon: TrendingUp },
      { title: "Contractor Demand", url: "/contractor-demand", icon: HardHat },
      { title: "Deal Scout", url: "/deal-scout", icon: Radar },
      { title: "Construction Radar", url: "/construction-radar", icon: HardHat },
      { title: "Auctions", url: "/auctions", icon: Gavel },
      { title: "Yield Map", url: "/tools/yield-map", icon: Map },
    ],
  },
  {
    title: "ANALYSE",
    icon: Calculator,
    items: [
      { title: "Deal Analyser", url: "/tools/deal-analyser", icon: Target },
      { title: "Calculators", url: "/calculators", icon: Calculator },
      { title: "Compare", url: "/compare", icon: GitCompare },
      { title: "Mortgages", url: "/mortgages", icon: Percent },
    ],
  },
  {
    title: "PORTFOLIO",
    icon: Briefcase,
    items: [
      { title: "Properties", url: "/portfolio", icon: Building2 },
      { title: "Pipeline", url: "/pipeline", icon: GitBranch },
      { title: "Mortgage Tracker", url: "/portfolio/mortgages", icon: CreditCard },
      { title: "JV Deals", url: "/portfolio/jv-deals", icon: Handshake },
      { title: "STR Management", url: "/str", icon: BedDouble },
    ],
  },
  {
    title: "INSIGHTS",
    icon: BarChart3,
    items: [
      { title: "Reports", url: "/reports", icon: FileText },
      { title: "Alerts", url: "/alerts", icon: Bell, badge: 3 },
      { title: "Performance", url: "/performance", icon: BarChart3 },
    ],
  },
  {
    title: "MORE",
    icon: Settings,
    items: [
      { title: "Network", url: "/network", icon: Users },
      { title: "Events", url: "/events", icon: Calendar },
      { title: "Copilot", url: "/copilot", icon: MessageCircle },
      { title: "Integrations", url: "/integrations", icon: Plug },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

const STORAGE_KEY = "sidebar-collapsed-groups";

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();
  
  // Load collapsed state from localStorage
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedGroups));
  }, [collapsedGroups]);

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => location.pathname.startsWith(item.url));
  };

  const isItemActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
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
        {/* Dashboard - Always visible */}
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

        {/* Grouped Navigation */}
        {navGroups.map((group) => {
          const isOpen = !collapsedGroups[group.title];
          const groupActive = isGroupActive(group);

          if (sidebarCollapsed) {
            // In collapsed mode, show group icon that expands on hover or just show items
            return (
              <div key={group.title} className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={cn(
                      "flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all relative",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    activeClassName="bg-sidebar-accent text-sidebar-primary"
                    title={item.title}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px] justify-center"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          }

          return (
            <Collapsible
              key={group.title}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.title)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
                    "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    groupActive && "text-sidebar-primary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="h-4 w-4" />
                    <span>{group.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ml-2",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    activeClassName="bg-sidebar-accent text-sidebar-primary"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="h-5 min-w-[20px] px-1.5 text-xs justify-center"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
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
