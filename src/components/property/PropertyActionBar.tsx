import { Calculator, Plus, Calendar, Phone, FileText, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMortgageStore } from "@/stores/mortgageStore";

interface PropertyActionBarProps {
  propertyId: string;
  agentPhone?: string;
  propertyPrice?: number;
}

export function PropertyActionBar({ propertyId, agentPhone, propertyPrice }: PropertyActionBarProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPropertyValue, setLoanAmount } = useMortgageStore();

  const handleCalculator = () => {
    navigate("/calculators");
  };

  const handleCompareMortgages = () => {
    if (propertyPrice) {
      setPropertyValue(propertyPrice);
      setLoanAmount(propertyPrice * 0.75); // Default 75% LTV
    }
    navigate("/mortgages");
  };

  const handleAddToPipeline = (stage: string) => {
    toast({
      title: "Added to pipeline",
      description: `Property added to ${stage} stage`,
    });
  };

  const handleScheduleViewing = () => {
    toast({
      title: "Viewing request sent",
      description: "The agent will contact you to confirm the viewing",
    });
  };

  const handleContactAgent = () => {
    if (agentPhone) {
      window.location.href = `tel:${agentPhone}`;
    } else {
      toast({
        title: "Contact request sent",
        description: "The agent will contact you shortly",
      });
    }
  };

  const handleGenerateDealPack = () => {
    navigate(`/deal-pack/${propertyId}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {/* Calculator */}
          <Button variant="outline" size="sm" className="gap-2" onClick={handleCalculator}>
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </Button>

          {/* Compare Mortgages */}
          <Button variant="outline" size="sm" className="gap-2" onClick={handleCompareMortgages}>
            <Percent className="h-4 w-4" />
            <span className="hidden sm:inline">Mortgages</span>
          </Button>

          {/* Add to Pipeline */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Pipeline</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Lead", "Analyzing", "Negotiating", "Due Diligence"].map((stage) => (
                <DropdownMenuItem
                  key={stage}
                  onClick={() => handleAddToPipeline(stage)}
                >
                  Add to {stage}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Schedule Viewing */}
          <Button variant="outline" size="sm" className="gap-2" onClick={handleScheduleViewing}>
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule Viewing</span>
          </Button>

          {/* Contact Agent */}
          <Button variant="outline" size="sm" className="gap-2" onClick={handleContactAgent}>
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact Agent</span>
          </Button>

          {/* Generate Deal Pack */}
          <Button size="sm" className="gap-2" onClick={handleGenerateDealPack}>
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Generate Deal Pack</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
