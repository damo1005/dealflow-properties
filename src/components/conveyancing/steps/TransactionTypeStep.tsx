import { Card, CardContent } from "@/components/ui/card";
import { useConveyancingStore } from "@/stores/conveyancingStore";
import { Home, PoundSterling, ArrowLeftRight, Building, Users } from "lucide-react";

interface TransactionTypeStepProps {
  onNext: () => void;
}

const transactionTypes = [
  {
    value: 'purchase',
    label: 'Buying a Property',
    description: 'Purchase conveyancing',
    price: 'From £599 + disbursements',
    icon: Home,
  },
  {
    value: 'sale',
    label: 'Selling a Property',
    description: 'Sale conveyancing',
    price: 'From £599 + disbursements',
    icon: PoundSterling,
  },
  {
    value: 'purchase_and_sale',
    label: 'Buying & Selling',
    description: 'Combined service (save £££)',
    price: 'From £999 + disbursements',
    icon: ArrowLeftRight,
  },
  {
    value: 'remortgage',
    label: 'Remortgaging',
    description: 'Remortgage conveyancing',
    price: 'From £299 + disbursements',
    icon: Building,
  },
  {
    value: 'transfer_equity',
    label: 'Transfer of Equity',
    description: 'Adding/removing from title',
    price: 'From £399 + disbursements',
    icon: Users,
  },
];

export function TransactionTypeStep({ onNext }: TransactionTypeStepProps) {
  const { wizardData, updateWizardData, setCurrentStep } = useConveyancingStore();

  const handleSelect = (type: string) => {
    updateWizardData({ transactionType: type as typeof wizardData.transactionType });
    setCurrentStep(2);
  };

  return (
    <div className="grid gap-4">
      {transactionTypes.map((type) => (
        <Card
          key={type.value}
          className={`cursor-pointer transition-all hover:border-primary ${
            wizardData.transactionType === type.value ? 'border-primary border-2' : ''
          }`}
          onClick={() => handleSelect(type.value)}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <type.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{type.label}</h3>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary">{type.price}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
