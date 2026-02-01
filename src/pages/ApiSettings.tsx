import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Key, Webhook, Copy, ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { useApiStore } from "@/stores/apiStore";
import { WEBHOOK_EVENTS } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function ApiSettings() {
  const { toast } = useToast();
  const { apiKeys, webhooks, addApiKey, addWebhook, deleteApiKey, deleteWebhook, updateWebhook } = useApiStore();
  
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);

  const handleCreateKey = () => {
    const keyPrefix = `pk_${newKeyPermissions.includes('write') ? 'live' : 'test'}_`;
    const keyValue = keyPrefix + crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    
    addApiKey({
      id: crypto.randomUUID(),
      user_id: 'current-user',
      name: newKeyName,
      key_hash: 'hashed_' + keyValue,
      key_prefix: keyValue.slice(0, 12),
      permissions: newKeyPermissions,
      rate_limit: 1000,
      is_active: true,
      created_at: new Date().toISOString(),
    });
    
    setGeneratedKey(keyValue);
    setNewKeyName('');
    setNewKeyPermissions(['read']);
  };

  const handleAddWebhook = () => {
    addWebhook({
      id: crypto.randomUUID(),
      user_id: 'current-user',
      name: newWebhookName,
      url: newWebhookUrl,
      events: newWebhookEvents,
      secret: 'whsec_' + crypto.randomUUID().replace(/-/g, '').slice(0, 24),
      is_active: true,
      total_deliveries: 0,
      failed_deliveries: 0,
      created_at: new Date().toISOString(),
    });
    
    setShowAddWebhook(false);
    setNewWebhookName('');
    setNewWebhookUrl('');
    setNewWebhookEvents([]);
    toast({ title: 'Webhook created successfully' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <AppLayout title="API & Integrations">
      <div className="space-y-8">
        {/* API Documentation Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              API Documentation
            </CardTitle>
            <CardDescription>
              Access our API to build custom integrations with your systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Base URL</p>
                <code className="bg-muted px-3 py-2 rounded text-sm block">
                  https://api.propertytracker.com/v1
                </code>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">View Docs</Button>
                <Button variant="outline">API Playground</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateKey(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys yet. Create one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <code className="text-sm">{key.key_prefix}...</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(key.key_prefix)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {key.permissions.map((p) => (
                            <Badge key={p} variant="secondary">{p}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.is_active ? 'default' : 'secondary'}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteApiKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Webhooks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhooks
                </CardTitle>
                <CardDescription>
                  Receive real-time notifications when events occur
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddWebhook(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {webhooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No webhooks configured yet.
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{webhook.name}</h4>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {webhook.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.is_active}
                          onCheckedChange={(checked) => updateWebhook(webhook.id, { is_active: checked })}
                        />
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Deliveries: {webhook.total_deliveries}</span>
                      <span className={webhook.failed_deliveries > 0 ? 'text-destructive' : ''}>
                        Failed: {webhook.failed_deliveries}
                      </span>
                      {webhook.last_triggered_at && (
                        <span>Last: {new Date(webhook.last_triggered_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{generatedKey ? 'API Key Created' : 'Create API Key'}</DialogTitle>
          </DialogHeader>
          
          {generatedKey ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your API Key (copy now - won't be shown again)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm break-all">{generatedKey}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={() => { setGeneratedKey(null); setShowCreateKey(false); }} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  {['read', 'write', 'delete'].map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Checkbox
                        id={permission}
                        checked={newKeyPermissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKeyPermissions([...newKeyPermissions, permission]);
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
                          }
                        }}
                      />
                      <Label htmlFor={permission} className="capitalize">{permission}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateKey(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName} className="flex-1">
                  Create Key
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={showAddWebhook} onOpenChange={setShowAddWebhook}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookName">Name</Label>
              <Input
                id="webhookName"
                value={newWebhookName}
                onChange={(e) => setNewWebhookName(e.target.value)}
                placeholder="e.g., Rent Notifications"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL</Label>
              <Input
                id="webhookUrl"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-server.com/webhook"
              />
            </div>

            <div className="space-y-2">
              <Label>Events</Label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-4">
                {WEBHOOK_EVENTS.map((category) => (
                  <div key={category.category}>
                    <p className="text-sm font-medium mb-2">{category.category}</p>
                    <div className="space-y-1 pl-2">
                      {category.events.map((event) => (
                        <div key={event.value} className="flex items-center gap-2">
                          <Checkbox
                            id={event.value}
                            checked={newWebhookEvents.includes(event.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewWebhookEvents([...newWebhookEvents, event.value]);
                              } else {
                                setNewWebhookEvents(newWebhookEvents.filter(e => e !== event.value));
                              }
                            }}
                          />
                          <Label htmlFor={event.value} className="text-sm">{event.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddWebhook(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleAddWebhook} 
                disabled={!newWebhookName || !newWebhookUrl || newWebhookEvents.length === 0}
                className="flex-1"
              >
                Add Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
