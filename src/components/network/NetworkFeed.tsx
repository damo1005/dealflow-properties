import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworkStore } from "@/stores/networkStore";
import { POST_TYPES } from "@/types/network";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Users,
  Edit,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreatePostDialog } from "./CreatePostDialog";

export function NetworkFeed() {
  const { currentProfile, posts, profiles, toggleLike } = useNetworkStore();
  const [filter, setFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<string | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "deals") return post.post_type === "deal_share";
    if (filter === "questions") return post.post_type === "question";
    if (filter === "jv") return post.post_type === "jv_opportunity";
    return true;
  });

  const getPostTypeIcon = (type: string) => {
    const postType = POST_TYPES.find((p) => p.value === type);
    return postType?.icon || "📝";
  };

  const getPostTypeLabel = (type: string) => {
    const postType = POST_TYPES.find((p) => p.value === type);
    return postType?.label || "Post";
  };

  const openCreateDialog = (type: string) => {
    setSelectedPostType(type);
    setCreateDialogOpen(true);
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 shrink-0 hidden lg:block space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentProfile?.display_name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{currentProfile?.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentProfile?.properties_count} properties | {currentProfile?.portfolio_value ? formatCurrency(currentProfile.portfolio_value) : "N/A"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Your Network</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Following</span>
              <span className="font-medium">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections</span>
              <span className="font-medium">23</span>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Who to Follow</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {profiles.slice(1, 3).map((profile) => (
              <div key={profile.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {profile.display_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile.display_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.specialties.join(", ")}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Follow
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Feed */}
      <div className="flex-1 space-y-4">
        {/* Post Composer */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentProfile?.display_name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Share a deal, ask a question, or celebrate a win..."
                className="resize-none"
                rows={2}
                onClick={() => setCreateDialogOpen(true)}
                readOnly
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => openCreateDialog("deal_share")}>
                📊 Share Deal
              </Button>
              <Button variant="outline" size="sm" onClick={() => openCreateDialog("question")}>
                ❓ Ask Question
              </Button>
              <Button variant="outline" size="sm" onClick={() => openCreateDialog("insight")}>
                💡 Share Insight
              </Button>
              <Button variant="outline" size="sm" onClick={() => openCreateDialog("jv_opportunity")}>
                🤝 JV Opportunity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="jv">JV Opportunities</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              {/* Author Header */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {post.author?.display_name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.author?.display_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>@{post.author?.display_name?.toLowerCase().replace(" ", "")}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{post.author?.location_city}</span>
                        <span>•</span>
                        <span>{post.author?.specialties.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="space-y-3">
                {/* Post Type Badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {getPostTypeIcon(post.post_type)} {getPostTypeLabel(post.post_type)}
                  </Badge>
                  {post.location_area && (
                    <Badge variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.location_area}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                {post.title && (
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                )}

                {/* Content */}
                <p className="whitespace-pre-wrap">{post.content}</p>

                {/* Deal Stats (if deal_share) */}
                {post.post_type === "deal_share" && post.asking_price && (
                  <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Purchase</p>
                      <p className="font-bold">{formatCurrency(post.asking_price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{post.deal_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Area</p>
                      <p className="font-medium">{post.location_area}</p>
                    </div>
                  </div>
                )}

                {/* JV Details (if jv_opportunity) */}
                {post.post_type === "jv_opportunity" && post.jv_investment_required && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">JV Opportunity</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Investment Required</p>
                        <p className="font-bold">{formatCurrency(post.jv_investment_required)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Equity Split</p>
                        <p className="font-medium">{post.jv_equity_split}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span>👍 {post.like_count} likes</span>
                  <span>💬 {post.comment_count} comments</span>
                  {post.share_count > 0 && <span>🔄 {post.share_count} shares</span>}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toggleLike(post.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        initialType={selectedPostType}
      />
    </div>
  );
}
