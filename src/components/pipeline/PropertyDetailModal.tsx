import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  X,
  Calendar,
  Bed,
  Percent,
  TrendingUp,
  MessageSquare,
  Send,
  FileText,
  Bell,
  Check,
  Tag,
  Phone,
  Clock,
  PoundSterling,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePipelineStore } from "@/stores/pipelineStore";
import { cn } from "@/lib/utils";

export function PropertyDetailModal() {
  const {
    properties,
    stages,
    availableLabels,
    selectedPropertyId,
    setSelectedPropertyId,
    updateProperty,
    addComment,
    addReminder,
    toggleReminder,
    moveProperty,
  } = usePipelineStore();

  const [newComment, setNewComment] = useState("");
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");

  const property = properties.find((p) => p.id === selectedPropertyId);
  const currentStage = stages.find((s) => s.id === property?.stage);
  const propertyLabels = availableLabels.filter((l) => property?.labels.includes(l.id));

  if (!property) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(property.id, {
      id: `comment-${Date.now()}`,
      content: newComment,
      user_name: "You",
      created_at: new Date().toISOString(),
    });
    setNewComment("");
  };

  const handleAddReminder = () => {
    if (!newReminderTitle || !newReminderDate) return;

    addReminder(property.id, {
      id: `reminder-${Date.now()}`,
      title: newReminderTitle,
      due_date: newReminderDate,
      completed: false,
    });
    setNewReminderTitle("");
    setNewReminderDate("");
  };

  const handleLabelToggle = (labelId: string) => {
    const newLabels = property.labels.includes(labelId)
      ? property.labels.filter((l) => l !== labelId)
      : [...property.labels, labelId];
    updateProperty(property.id, { labels: newLabels });
  };

  return (
    <Dialog open={!!selectedPropertyId} onOpenChange={() => setSelectedPropertyId(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <DialogTitle className="text-xl">{property.address}</DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentStage && (
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: currentStage.color, color: 'white' }}
                    >
                      {currentStage.name}
                    </Badge>
                  )}
                  {propertyLabels.map((label) => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      style={{ borderColor: label.color, color: label.color }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {property.price && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(property.price)}
                  </p>
                  {property.offer_amount && (
                    <p className="text-sm text-muted-foreground">
                      Offer: {formatCurrency(property.offer_amount)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="details" className="h-full flex flex-col">
              <TabsList className="px-6 justify-start border-b rounded-none">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="comments">
                  Comments ({property.comments.length})
                </TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                {/* Details Tab */}
                <TabsContent value="details" className="p-6 space-y-6 mt-0">
                  {/* Image */}
                  {property.image_url && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={property.image_url}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {property.bedrooms && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Bed className="h-4 w-4" />
                          <span className="text-xs">Bedrooms</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold">{property.bedrooms}</p>
                      </div>
                    )}
                    {property.estimated_yield && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Percent className="h-4 w-4" />
                          <span className="text-xs">Est. Yield</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold">{property.estimated_yield}%</p>
                      </div>
                    )}
                    {property.roi_potential && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-success">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">ROI Potential</span>
                        </div>
                        <p className="mt-1 text-lg font-semibold text-success">
                          {property.roi_potential}%
                        </p>
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs">Added</span>
                      </div>
                      <p className="mt-1 text-lg font-semibold">
                        {formatDistanceToNow(new Date(property.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Stage-Specific Fields */}
                  {(property.stage === 'viewing-booked' || property.viewing_date) && (
                    <div className="p-4 rounded-lg border border-border space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Viewing Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={property.viewing_date || ""}
                            onChange={(e) =>
                              updateProperty(property.id, { viewing_date: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={property.viewing_time || ""}
                            onChange={(e) =>
                              updateProperty(property.id, { viewing_time: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Agent Contact</Label>
                        <Input
                          placeholder="Agent name & phone"
                          value={property.agent_contact || ""}
                          onChange={(e) =>
                            updateProperty(property.id, { agent_contact: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {(property.stage === 'offer-made' || property.offer_amount) && (
                    <div className="p-4 rounded-lg border border-border space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <PoundSterling className="h-4 w-4" />
                        Offer Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Offer Amount</Label>
                          <Input
                            type="number"
                            placeholder="125000"
                            value={property.offer_amount || ""}
                            onChange={(e) =>
                              updateProperty(property.id, { offer_amount: parseInt(e.target.value) || undefined })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Offer Date</Label>
                          <Input
                            type="date"
                            value={property.offer_date || ""}
                            onChange={(e) =>
                              updateProperty(property.id, { offer_date: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(property.stage === 'under-offer' || property.stage === 'solicitors') && (
                    <div className="p-4 rounded-lg border border-border space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Solicitor Details
                      </h4>
                      <div className="space-y-1">
                        <Label>Solicitor Info</Label>
                        <Textarea
                          placeholder="Solicitor name, contact, reference..."
                          value={property.solicitor_details || ""}
                          onChange={(e) =>
                            updateProperty(property.id, { solicitor_details: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Target Exchange Date</Label>
                        <Input
                          type="date"
                          value={property.exchange_target_date || ""}
                          onChange={(e) =>
                            updateProperty(property.id, { exchange_target_date: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {property.stage === 'completed' && (
                    <div className="p-4 rounded-lg border border-success/20 bg-success/5 space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-success">
                        <Check className="h-4 w-4" />
                        Completed Deal
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Purchase Date</Label>
                          <Input
                            type="date"
                            value={property.purchase_date || ""}
                            onChange={(e) =>
                              updateProperty(property.id, { purchase_date: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Actual Price Paid</Label>
                          <Input
                            type="number"
                            value={property.actual_price || ""}
                            onChange={(e) =>
                              updateProperty(property.id, { actual_price: parseInt(e.target.value) || undefined })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Labels */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Labels
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableLabels.map((label) => (
                        <Badge
                          key={label.id}
                          variant={property.labels.includes(label.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          style={{
                            backgroundColor: property.labels.includes(label.id) ? label.color : 'transparent',
                            borderColor: label.color,
                            color: property.labels.includes(label.id) ? 'white' : label.color,
                          }}
                          onClick={() => handleLabelToggle(label.id)}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Move to Stage */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Move to Stage</h4>
                    <div className="flex flex-wrap gap-2">
                      {stages.map((stage) => (
                        <Button
                          key={stage.id}
                          variant={stage.id === property.stage ? "default" : "outline"}
                          size="sm"
                          onClick={() => moveProperty(property.id, stage.id, 0)}
                          style={{
                            backgroundColor: stage.id === property.stage ? stage.color : 'transparent',
                            borderColor: stage.color,
                          }}
                        >
                          {stage.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="p-6 mt-0">
                  <Textarea
                    placeholder="Add your private notes about this property..."
                    className="min-h-[300px]"
                    value={property.notes || ""}
                    onChange={(e) => updateProperty(property.id, { notes: e.target.value })}
                  />
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="p-6 mt-0 space-y-4">
                  <div className="space-y-4">
                    {property.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {comment.user_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.user_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <Button size="icon" onClick={handleAddComment}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="p-6 mt-0">
                  {property.documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No documents attached</p>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {property.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.type}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Reminders Tab */}
                <TabsContent value="reminders" className="p-6 mt-0 space-y-4">
                  <div className="space-y-2">
                    {property.reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          reminder.completed ? "bg-muted/50 border-muted" : "border-border"
                        )}
                      >
                        <Checkbox
                          checked={reminder.completed}
                          onCheckedChange={() => toggleReminder(property.id, reminder.id)}
                        />
                        <div className="flex-1">
                          <p className={cn("text-sm", reminder.completed && "line-through text-muted-foreground")}>
                            {reminder.title}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(reminder.due_date), "PPP")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Add Reminder</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Reminder title..."
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="date"
                        value={newReminderDate}
                        onChange={(e) => setNewReminderDate(e.target.value)}
                        className="w-40"
                      />
                      <Button onClick={handleAddReminder} disabled={!newReminderTitle || !newReminderDate}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="p-6 mt-0">
                  <div className="space-y-4">
                    {property.activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
