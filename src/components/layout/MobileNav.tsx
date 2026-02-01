import { Link, useLocation } from "react-router-dom";
import { Home, Layers, Plus, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Layers, label: "Pipeline", path: "/pipeline" },
  { icon: Plus, label: "Add", path: "/portfolio" },
  { icon: BarChart3, label: "Analytics", path: "/portfolio/dashboard" },
  { icon: User, label: "Profile", path: "/settings" },
];

export function MobileNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label === "Add" ? (
                <div className="flex items-center justify-center w-12 h-12 -mt-6 bg-primary rounded-full shadow-lg">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
