import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Building2, LayoutDashboard, Target, GitBranch, BedDouble, Radar, Briefcase, HardHat, MessageSquare, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const menuItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Deal Analyser", path: "/tools/deal-analyser", icon: Target },
  { label: "Landlord Pipeline", path: "/pipeline", icon: GitBranch },
  { label: "STR Management", path: "/str", icon: BedDouble },
  { label: "Airbnb Radar", path: "/airbnb-radar", icon: Radar },
  { label: "Portfolio", path: "/portfolio", icon: Briefcase },
  { label: "Accommodation Requests", path: "/accommodation-requests", icon: MessageSquare },
  { label: "Contractor Demand", path: "/contractor-demand", icon: HardHat },
];

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (!isMobile) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-14 flex items-center px-4 safe-area-pt">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="font-bold text-lg">DealFlow</h2>
          </div>
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SA Operator Tools
            </p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1 text-center">
        <h1 className="font-semibold truncate">{title || "DealFlow"}</h1>
      </div>

      <div className="w-10" /> {/* Spacer for visual balance */}
    </header>
  );
}
