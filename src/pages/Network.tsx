import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Users, UsersRound, MessageCircle, User, Search, Bell } from "lucide-react";
import { NetworkFeed } from "@/components/network/NetworkFeed";
import { NetworkPeople } from "@/components/network/NetworkPeople";
import { NetworkGroups } from "@/components/network/NetworkGroups";
import { NetworkMessages } from "@/components/network/NetworkMessages";
import { NetworkProfile } from "@/components/network/NetworkProfile";
import {
  useNetworkStore,
  mockProfiles,
  mockPosts,
  mockComments,
  mockGroups,
  mockMessages,
} from "@/stores/networkStore";

const Network = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    setCurrentProfile,
    setProfiles,
    setPosts,
    setComments,
    setGroups,
    setMessages,
    messages,
  } = useNetworkStore();

  useEffect(() => {
    // Load mock data
    setCurrentProfile(mockProfiles[0]);
    setProfiles(mockProfiles);
    setPosts(mockPosts);
    setComments(mockComments);
    setGroups(mockGroups);
    setMessages(mockMessages);
  }, [setCurrentProfile, setProfiles, setPosts, setComments, setGroups, setMessages]);

  const unreadCount = messages.filter((m) => !m.read && m.recipient_id === "user1").length;

  return (
    <AppLayout title="Deal Network">
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Deal Network</h1>
            <p className="text-muted-foreground">
              Connect with investors, share deals, find JV partners
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search people, posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                3
              </Badge>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="feed" className="gap-2">
              <Newspaper className="h-4 w-4 hidden sm:block" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="people" className="gap-2">
              <Users className="h-4 w-4 hidden sm:block" />
              People
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2">
              <UsersRound className="h-4 w-4 hidden sm:block" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2 relative">
              <MessageCircle className="h-4 w-4 hidden sm:block" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <NetworkFeed />
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <NetworkPeople />
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            <NetworkGroups />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <NetworkMessages />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <NetworkProfile />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Network;
