import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNetworkStore } from "@/stores/networkStore";
import { SPECIALTIES, LOOKING_FOR, INVESTOR_TYPES } from "@/types/network";
import type { UserProfile } from "@/types/network";
import {
  Edit,
  MapPin,
  Linkedin,
  Twitter,
  Globe,
  Check,
  Camera,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NetworkProfile() {
  const { currentProfile, setCurrentProfile, posts } = useNetworkStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: currentProfile?.display_name || "",
    bio: currentProfile?.bio || "",
    location_city: currentProfile?.location_city || "",
    investor_type: currentProfile?.investor_type || "beginner",
    years_investing: currentProfile?.years_investing || 0,
    specialties: currentProfile?.specialties || [],
    looking_for: currentProfile?.looking_for || [],
    open_to_jv: currentProfile?.open_to_jv || false,
    open_to_mentor: currentProfile?.open_to_mentor || false,
    linkedin_url: currentProfile?.linkedin_url || "",
    twitter_handle: currentProfile?.twitter_handle || "",
    website: currentProfile?.website || "",
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const userPosts = posts.filter((p) => p.user_id === currentProfile?.user_id);

  const toggleSpecialty = (specialty: string) => {
    setEditData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const toggleLookingFor = (item: string) => {
    setEditData((prev) => ({
      ...prev,
      looking_for: prev.looking_for.includes(item)
        ? prev.looking_for.filter((l) => l !== item)
        : [...prev.looking_for, item],
    }));
  };

  const handleSave = () => {
    if (currentProfile) {
      setCurrentProfile({
        ...currentProfile,
        ...editData,
        investor_type: editData.investor_type as UserProfile["investor_type"],
      });
    }
    setIsEditing(false);
  };

  if (!currentProfile) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 relative">
          {isEditing && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-2"
            >
              <Camera className="h-4 w-4 mr-1" />
              Change Cover
            </Button>
          )}
        </div>

        <CardContent className="pt-0 -mt-12 pb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {currentProfile.display_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{currentProfile.display_name}</h1>
                  <p className="text-muted-foreground">{currentProfile.bio}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {currentProfile.location_city}
                    </span>
                    <span className="capitalize">{currentProfile.investor_type}</span>
                  </div>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold">{currentProfile.properties_count}</p>
                  <p className="text-sm text-muted-foreground">Properties</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {currentProfile.portfolio_value
                      ? formatCurrency(currentProfile.portfolio_value)
                      : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {currentProfile.portfolio_yield || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Yield</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form or Profile Content */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={editData.display_name}
                  onChange={(e) =>
                    setEditData({ ...editData, display_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={editData.location_city}
                  onChange={(e) =>
                    setEditData({ ...editData, location_city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select
                  value={editData.investor_type}
                  onValueChange={(v) => setEditData({ ...editData, investor_type: v as 'beginner' | 'intermediate' | 'experienced' | 'professional' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTOR_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Years Investing</Label>
                <Input
                  type="number"
                  value={editData.years_investing}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      years_investing: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((specialty) => (
                  <Badge
                    key={specialty}
                    variant={editData.specialties.includes(specialty) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSpecialty(specialty)}
                  >
                    {editData.specialties.includes(specialty) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Looking For</Label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR.map((item) => (
                  <Badge
                    key={item}
                    variant={editData.looking_for.includes(item) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleLookingFor(item)}
                  >
                    {editData.looking_for.includes(item) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editData.open_to_jv}
                  onCheckedChange={(c) => setEditData({ ...editData, open_to_jv: c })}
                />
                <Label>Open to JV</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editData.open_to_mentor}
                  onCheckedChange={(c) => setEditData({ ...editData, open_to_mentor: c })}
                />
                <Label>Open to Mentor</Label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={editData.linkedin_url}
                  onChange={(e) =>
                    setEditData({ ...editData, linkedin_url: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input
                  value={editData.twitter_handle}
                  onChange={(e) =>
                    setEditData({ ...editData, twitter_handle: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={editData.website}
                  onChange={(e) =>
                    setEditData({ ...editData, website: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Years Investing</p>
                <p className="font-medium">{currentProfile.years_investing} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialties</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentProfile.specialties.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Looking For</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentProfile.looking_for.map((l) => (
                    <Badge key={l} variant="outline">
                      {l}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4 border-t">
                {currentProfile.open_to_jv && (
                  <Badge className="bg-green-500">✓ Open to JV</Badge>
                )}
                {currentProfile.open_to_mentor && (
                  <Badge className="bg-blue-500">✓ Open to Mentor</Badge>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-2 pt-4 border-t">
                {currentProfile.linkedin_url && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={currentProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {currentProfile.twitter_handle && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://twitter.com/${currentProfile.twitter_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {currentProfile.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={currentProfile.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div key={post.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {post.post_type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {post.title && (
                        <p className="font-medium mb-1">{post.title}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>👍 {post.like_count}</span>
                        <span>💬 {post.comment_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No posts yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
