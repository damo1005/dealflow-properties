import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNetworkStore } from "@/stores/networkStore";
import { POST_TYPES } from "@/types/network";
import type { NetworkPost } from "@/types/network";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: string | null;
}

export function CreatePostDialog({ open, onOpenChange, initialType }: CreatePostDialogProps) {
  const { currentProfile, addPost } = useNetworkStore();
  const [postType, setPostType] = useState(initialType || "insight");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dealType, setDealType] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [locationArea, setLocationArea] = useState("");
  const [jvInvestment, setJvInvestment] = useState("");
  const [jvSplit, setJvSplit] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newPost: NetworkPost = {
      id: crypto.randomUUID(),
      user_id: currentProfile?.user_id || "user1",
      post_type: postType as NetworkPost["post_type"],
      title: title || null,
      content,
      images: [],
      deal_type: dealType || null,
      asking_price: askingPrice ? parseInt(askingPrice) : null,
      location_area: locationArea || null,
      jv_structure: null,
      jv_equity_split: jvSplit || null,
      jv_investment_required: jvInvestment ? parseInt(jvInvestment) : null,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      share_count: 0,
      visibility: "public",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: currentProfile || undefined,
    };

    addPost(newPost);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setDealType("");
    setAskingPrice("");
    setLocationArea("");
    setJvInvestment("");
    setJvSplit("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Post Type Selection */}
          <div className="space-y-2">
            <Label>Post Type</Label>
            <RadioGroup value={postType} onValueChange={setPostType} className="grid grid-cols-2 gap-2">
              {POST_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="cursor-pointer">
                    {type.icon} {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title (optional)</Label>
            <Input
              placeholder="Give your post a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          {/* Deal-specific fields */}
          {postType === "deal_share" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-sm">Deal Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Deal Type</Label>
                  <Input
                    placeholder="e.g., BTL, BRR"
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Location Area</Label>
                  <Input
                    placeholder="e.g., EN3"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs">Purchase Price</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 180000"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* JV-specific fields */}
          {postType === "jv_opportunity" && (
            <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
              <p className="font-medium text-sm">JV Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Investment Required</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 50000"
                    value={jvInvestment}
                    onChange={(e) => setJvInvestment(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Equity Split</Label>
                  <Input
                    placeholder="e.g., 50/50"
                    value={jvSplit}
                    onChange={(e) => setJvSplit(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Location</Label>
                  <Input
                    placeholder="e.g., Manchester"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Strategy</Label>
                  <Input
                    placeholder="e.g., BRR"
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!content.trim()}>
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
