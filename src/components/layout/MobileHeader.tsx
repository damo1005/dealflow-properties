import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">PropertyTracker Pro</h2>
          </div>
          <nav className="p-4 space-y-2">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Properties", path: "/search" },
              { label: "Portfolio", path: "/portfolio" },
              { label: "Pipeline", path: "/pipeline" },
              { label: "Calculators", path: "/calculators" },
              { label: "Deal Analyser", path: "/tools/deal-analyser" },
              { label: "Mortgages", path: "/mortgages" },
              { label: "Settings", path: "/settings" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1 text-center">
        <h1 className="font-semibold truncate">{title || "PropertyTracker"}</h1>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/alerts" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
