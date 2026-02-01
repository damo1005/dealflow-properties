import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMortgageTrackerStore } from "@/stores/mortgageTrackerStore";
import { Mortgage } from "@/types/mortgage";

interface AddMortgageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMortgageDialog({ open, onOpenChange }: AddMortgageDialogProps) {
  const { addMortgage } = useMortgageTrackerStore();
  const [formData, setFormData] = useState<{
    lender_name: string;
    account_number: string;
    mortgage_type: 'btl' | 'residential' | 'commercial';
    repayment_type: 'interest_only' | 'repayment';
    original_amount: string;
    current_balance: string;
    rate_type: 'fixed' | 'variable' | 'tracker';
    current_rate: string;
    svr_rate: string;
    deal_start_date: string;
    deal_end_date: string;
    term_years: string;
    monthly_payment: string;
    erc_percent: string;
    is_portable: boolean;
    overpayment_allowance: string;
  }>({
    lender_name: '',
    account_number: '',
    mortgage_type: 'btl',
    repayment_type: 'interest_only',
    original_amount: '',
    current_balance: '',
    rate_type: 'fixed',
    current_rate: '',
    svr_rate: '',
    deal_start_date: '',
    deal_end_date: '',
    term_years: '25',
    monthly_payment: '',
    erc_percent: '',
    is_portable: false,
    overpayment_allowance: '10',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMortgage: Mortgage = {
      id: crypto.randomUUID(),
      user_id: 'current-user',
      lender_name: formData.lender_name,
      account_number: formData.account_number || undefined,
      mortgage_type: formData.mortgage_type,
      repayment_type: formData.repayment_type,
      original_amount: parseFloat(formData.original_amount),
      current_balance: parseFloat(formData.current_balance),
      rate_type: formData.rate_type,
      current_rate: parseFloat(formData.current_rate),
      svr_rate: formData.svr_rate ? parseFloat(formData.svr_rate) : undefined,
      deal_start_date: formData.deal_start_date || undefined,
      deal_end_date: formData.deal_end_date || undefined,
      term_years: parseInt(formData.term_years),
      monthly_payment: formData.monthly_payment ? parseFloat(formData.monthly_payment) : undefined,
      erc_percent: formData.erc_percent ? parseFloat(formData.erc_percent) : undefined,
      is_portable: formData.is_portable,
      overpayment_allowance: parseFloat(formData.overpayment_allowance),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addMortgage(newMortgage);
    onOpenChange(false);
    setFormData({
      lender_name: '',
      account_number: '',
      mortgage_type: 'btl',
      repayment_type: 'interest_only',
      original_amount: '',
      current_balance: '',
      rate_type: 'fixed',
      current_rate: '',
      svr_rate: '',
      deal_start_date: '',
      deal_end_date: '',
      term_years: '25',
      monthly_payment: '',
      erc_percent: '',
      is_portable: false,
      overpayment_allowance: '10',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Mortgage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lender_name">Lender *</Label>
              <Input
                id="lender_name"
                value={formData.lender_name}
                onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                placeholder="e.g., NatWest"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mortgage Type</Label>
              <Select
                value={formData.mortgage_type}
                onValueChange={(value) => 
                  setFormData({ ...formData, mortgage_type: value as 'btl' | 'residential' | 'commercial' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btl">Buy-to-Let</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Repayment Type</Label>
              <Select
                value={formData.repayment_type}
                onValueChange={(value) => 
                  setFormData({ ...formData, repayment_type: value as 'interest_only' | 'repayment' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interest_only">Interest Only</SelectItem>
                  <SelectItem value="repayment">Repayment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="original_amount">Original Amount *</Label>
              <Input
                id="original_amount"
                type="number"
                value={formData.original_amount}
                onChange={(e) => setFormData({ ...formData, original_amount: e.target.value })}
                placeholder="150000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_balance">Current Balance *</Label>
              <Input
                id="current_balance"
                type="number"
                value={formData.current_balance}
                onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                placeholder="148500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Rate Type</Label>
              <Select
                value={formData.rate_type}
                onValueChange={(value) => 
                  setFormData({ ...formData, rate_type: value as 'fixed' | 'variable' | 'tracker' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                  <SelectItem value="tracker">Tracker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_rate">Current Rate (%) *</Label>
              <Input
                id="current_rate"
                type="number"
                step="0.01"
                value={formData.current_rate}
                onChange={(e) => setFormData({ ...formData, current_rate: e.target.value })}
                placeholder="5.29"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svr_rate">SVR Rate (%)</Label>
              <Input
                id="svr_rate"
                type="number"
                step="0.01"
                value={formData.svr_rate}
                onChange={(e) => setFormData({ ...formData, svr_rate: e.target.value })}
                placeholder="7.99"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal_start_date">Deal Start Date</Label>
              <Input
                id="deal_start_date"
                type="date"
                value={formData.deal_start_date}
                onChange={(e) => setFormData({ ...formData, deal_start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deal_end_date">Deal End Date</Label>
              <Input
                id="deal_end_date"
                type="date"
                value={formData.deal_end_date}
                onChange={(e) => setFormData({ ...formData, deal_end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="term_years">Term (Years)</Label>
              <Input
                id="term_years"
                type="number"
                value={formData.term_years}
                onChange={(e) => setFormData({ ...formData, term_years: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_payment">Monthly Payment</Label>
              <Input
                id="monthly_payment"
                type="number"
                value={formData.monthly_payment}
                onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
                placeholder="654"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="erc_percent">ERC (%)</Label>
              <Input
                id="erc_percent"
                type="number"
                step="0.1"
                value={formData.erc_percent}
                onChange={(e) => setFormData({ ...formData, erc_percent: e.target.value })}
                placeholder="2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_portable"
                checked={formData.is_portable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_portable: checked })}
              />
              <Label htmlFor="is_portable">Portable</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="overpayment_allowance">Overpayment Allowance (%)</Label>
              <Input
                id="overpayment_allowance"
                type="number"
                className="w-20"
                value={formData.overpayment_allowance}
                onChange={(e) => setFormData({ ...formData, overpayment_allowance: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Mortgage</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
