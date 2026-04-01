import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Target, GitBranch, BedDouble, Radar, Briefcase, HardHat, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Target, label: "Deals", path: "/tools/deal-analyser" },
  { icon: GitBranch, label: "Pipeline", path: "/pipeline" },
  { icon: BedDouble, label: "STR", path: "/str" },
  { icon: Radar, label: "Airbnb", path: "/airbnb-radar" },
  { icon: Briefcase, label: "Portfolio", path: "/portfolio" },
  { icon: MessageSquare, label: "Requests", path: "/accommodation-requests" },
  { icon: HardHat, label: "Demand", path: "/contractor-demand" },
];

export function MobileNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <ScrollArea className="w-full">
        <div className="flex items-center h-16 px-1 min-w-max">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-3 h-full py-2 transition-colors shrink-0",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1 leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-0" />
      </ScrollArea>
    </nav>
  );
}
