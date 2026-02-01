import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkStore } from "@/stores/networkStore";
import { POST_TYPES } from "@/types/network";
import { supabase } from "@/integrations/supabase/client";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Users,
  Edit,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreatePostDialog } from "./CreatePostDialog";

interface CommunityProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  investor_type: string | null;
  portfolio_size: string | null;
  experience_years: number | null;
  specialties: string[] | null;
  is_verified: boolean;
}

interface CommunityPost {
  id: string;
  content: string;
  post_type: string;
  images: string[] | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: CommunityProfile;
}

export function NetworkFeed() {
  const { currentProfile, posts, profiles, toggleLike } = useNetworkStore();
  const [filter, setFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<string | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityProfiles, setCommunityProfiles] = useState<CommunityProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch community demo data
  useEffect(() => {
    async function fetchCommunityData() {
      setIsLoading(true);
      try {
        // Fetch posts with authors using type assertion for new tables
        const { data: postsData } = await (supabase as any)
          .from('community_posts')
          .select(`
            *,
            author:community_profiles(*)
          `)
          .order('created_at', { ascending: false });

        // Fetch profiles for suggestions
        const { data: profilesData } = await (supabase as any)
          .from('community_profiles')
          .select('*')
          .limit(5);

        if (postsData) {
          setCommunityPosts(postsData);
        }
        if (profilesData) {
          setCommunityProfiles(profilesData);
        }
      } catch (error) {
        console.error('Failed to fetch community data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommunityData();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  // Use community posts if available, otherwise fall back to store posts
  const displayPosts = communityPosts.length > 0 ? communityPosts : posts;
  const displayProfiles = communityProfiles.length > 0 ? communityProfiles : profiles;

  const filteredPosts = displayPosts.filter((post: any) => {
    if (filter === "all") return true;
    if (filter === "deals") return post.post_type === "deal_share";
    if (filter === "questions") return post.post_type === "question";
    if (filter === "jv") return post.post_type === "jv_opportunity";
    if (filter === "success") return post.post_type === "success_story";
    if (filter === "market") return post.post_type === "market_update";
    return true;
  });

  const getPostTypeBadge = (type: string) => {
    const types: Record<string, { icon: string; label: string; color: string }> = {
      discussion: { icon: "💬", label: "Discussion", color: "secondary" },
      deal_share: { icon: "📊", label: "Deal Share", color: "default" },
      question: { icon: "❓", label: "Question", color: "outline" },
      success_story: { icon: "🎉", label: "Success Story", color: "default" },
      market_update: { icon: "📈", label: "Market Update", color: "secondary" },
      jv_opportunity: { icon: "🤝", label: "JV Opportunity", color: "default" },
    };
    return types[type] || types.discussion;
  };

  const openCreateDialog = (type: string) => {
    setSelectedPostType(type);
    setCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="w-64 shrink-0 hidden lg:block space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

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
                <p className="font-semibold">{currentProfile?.display_name || "Your Profile"}</p>
                <p className="text-xs text-muted-foreground">
                  {currentProfile?.properties_count || 0} properties
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
            {displayProfiles.slice(0, 3).map((profile: any) => (
              <div key={profile.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {profile.display_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium truncate">{profile.display_name}</p>
                    {profile.is_verified && (
                      <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.investor_type || profile.specialties?.join(", ")}
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
              <Button variant="outline" size="sm" onClick={() => openCreateDialog("success_story")}>
                🎉 Success Story
              </Button>
              <Button variant="outline" size="sm" onClick={() => openCreateDialog("jv_opportunity")}>
                🤝 JV Opportunity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="market">Market Updates</TabsTrigger>
            <TabsTrigger value="jv">JV</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post: any) => {
            const author = post.author || {};
            const postTypeBadge = getPostTypeBadge(post.post_type);

            return (
              <Card key={post.id}>
                {/* Author Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={author.avatar_url || undefined} />
                        <AvatarFallback>
                          {author.display_name?.slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{author.display_name}</p>
                          {author.is_verified && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {author.investor_type && (
                            <Badge variant="outline" className="text-xs h-5">
                              {author.investor_type}
                            </Badge>
                          )}
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                        {author.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{author.location}</span>
                          </div>
                        )}
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
                  <Badge variant={postTypeBadge.color as any}>
                    {postTypeBadge.icon} {postTypeBadge.label}
                  </Badge>

                  {/* Content */}
                  <p className="whitespace-pre-wrap">{post.content}</p>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <span>👍 {post.likes_count || post.like_count || 0} likes</span>
                    <span>💬 {post.comments_count || post.comment_count || 0} comments</span>
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
            );
          })}
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
