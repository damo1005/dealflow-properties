import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Phone,
  Mail,
  Star,
  Building2,
  Trash2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMyContractors, useSaveContractor, useUpdateContractor, useDeleteContractor } from '@/hooks/useConstructionData';
import { CONTRACTOR_STATUS_CONFIG } from '@/types/construction';

export function MyContractorsTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: contractors = [], isLoading } = useMyContractors();
  const saveContractor = useSaveContractor();
  const updateContractor = useUpdateContractor();
  const deleteContractor = useDeleteContractor();
  
  const filteredContractors = statusFilter === 'all'
    ? contractors
    : contractors.filter(c => c.status === statusFilter);
  
  const handleAddContractor = (data: {
    manual_company_name: string;
    manual_contact_name: string;
    manual_phone: string;
    manual_email: string;
    manual_trades: string[];
    notes: string;
  }) => {
    saveContractor.mutate(data);
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex items-center justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="quoted">Quoted</TabsTrigger>
            <TabsTrigger value="hired">Hired</TabsTrigger>
            <TabsTrigger value="do_not_use">Do Not Use</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Contractor</DialogTitle>
            </DialogHeader>
            <AddContractorForm
              onSubmit={handleAddContractor}
              isLoading={saveContractor.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Contractor List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-4">
                <div className="h-5 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContractors.length === 0 ? (
        <Card className="p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No contractors yet</h3>
          <p className="text-muted-foreground mb-4">
            Save contractors from projects or add them manually
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Contractor
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredContractors.map((contractor) => {
            const companyName = contractor.company?.company_name || contractor.manual_company_name || 'Unknown';
            const statusConfig = CONTRACTOR_STATUS_CONFIG[contractor.status as keyof typeof CONTRACTOR_STATUS_CONFIG];
            
            return (
              <Card key={contractor.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-medium">{companyName}</h3>
                      {contractor.manual_contact_name && (
                        <p className="text-sm text-muted-foreground">
                          {contractor.manual_contact_name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig?.color}>
                        {statusConfig?.label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateContractor.mutate({
                              id: contractor.id,
                              status: 'contacted',
                            })}
                          >
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateContractor.mutate({
                              id: contractor.id,
                              status: 'quoted',
                            })}
                          >
                            Mark as Quoted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateContractor.mutate({
                              id: contractor.id,
                              status: 'hired',
                            })}
                          >
                            Mark as Hired
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateContractor.mutate({
                              id: contractor.id,
                              status: 'do_not_use',
                            })}
                            className="text-destructive"
                          >
                            Mark as Do Not Use
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteContractor.mutate(contractor.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* CCS/Ratings */}
                  {contractor.company?.is_ccs_registered && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        CCS {contractor.company.ccs_rating?.toFixed(1)}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-3 text-sm mb-3">
                    {(contractor.manual_phone || contractor.company?.site_phone) && (
                      <a
                        href={`tel:${contractor.manual_phone || contractor.company?.site_phone}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {contractor.manual_phone || contractor.company?.site_phone}
                      </a>
                    )}
                    {(contractor.manual_email || contractor.company?.site_email) && (
                      <a
                        href={`mailto:${contractor.manual_email || contractor.company?.site_email}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        Email
                      </a>
                    )}
                  </div>
                  
                  {/* Trades */}
                  {contractor.manual_trades && contractor.manual_trades.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {contractor.manual_trades.map((trade, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {trade}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Notes */}
                  {contractor.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {contractor.notes}
                    </p>
                  )}
                  
                  {/* Rating */}
                  {contractor.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= contractor.rating!
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AddContractorFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

function AddContractorForm({ onSubmit, isLoading }: AddContractorFormProps) {
  const [formData, setFormData] = useState({
    manual_company_name: '',
    manual_contact_name: '',
    manual_phone: '',
    manual_email: '',
    manual_trades: [] as string[],
    notes: '',
  });
  const [tradesInput, setTradesInput] = useState('');
  
  const handleAddTrade = () => {
    if (tradesInput.trim()) {
      setFormData({
        ...formData,
        manual_trades: [...formData.manual_trades, tradesInput.trim()],
      });
      setTradesInput('');
    }
  };
  
  const handleRemoveTrade = (index: number) => {
    setFormData({
      ...formData,
      manual_trades: formData.manual_trades.filter((_, i) => i !== index),
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company_name">Company Name *</Label>
        <Input
          id="company_name"
          value={formData.manual_company_name}
          onChange={(e) => setFormData({ ...formData, manual_company_name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="contact_name">Contact Name</Label>
        <Input
          id="contact_name"
          value={formData.manual_contact_name}
          onChange={(e) => setFormData({ ...formData, manual_contact_name: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.manual_phone}
            onChange={(e) => setFormData({ ...formData, manual_phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.manual_email}
            onChange={(e) => setFormData({ ...formData, manual_email: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label>Trades</Label>
        <div className="flex gap-2">
          <Input
            value={tradesInput}
            onChange={(e) => setTradesInput(e.target.value)}
            placeholder="e.g., Plumber, Electrician"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTrade())}
          />
          <Button type="button" variant="outline" onClick={handleAddTrade}>
            Add
          </Button>
        </div>
        {formData.manual_trades.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.manual_trades.map((trade, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleRemoveTrade(i)}
              >
                {trade} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading || !formData.manual_company_name}>
        {isLoading ? 'Saving...' : 'Add Contractor'}
      </Button>
    </form>
  );
}
