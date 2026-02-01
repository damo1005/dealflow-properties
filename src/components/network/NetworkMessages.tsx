import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNetworkStore } from "@/stores/networkStore";
import { Send, Search, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function NetworkMessages() {
  const { messages, profiles, addMessage, currentProfile } = useNetworkStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>("user2");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Group messages by conversation partner
  const getConversations = () => {
    const conversationMap = new Map<string, typeof messages>();
    
    messages.forEach((msg) => {
      const partnerId = msg.sender_id === "user1" ? msg.recipient_id : msg.sender_id;
      const existing = conversationMap.get(partnerId) || [];
      conversationMap.set(partnerId, [...existing, msg]);
    });

    return Array.from(conversationMap.entries()).map(([partnerId, msgs]) => {
      const partner = profiles.find((p) => p.user_id === partnerId);
      const lastMessage = msgs.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      const unreadCount = msgs.filter(
        (m) => !m.read && m.recipient_id === "user1"
      ).length;

      return {
        partnerId,
        partner,
        lastMessage,
        unreadCount,
        messages: msgs.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      };
    });
  };

  const conversations = getConversations();
  const selectedConvo = conversations.find((c) => c.partnerId === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    addMessage({
      id: crypto.randomUUID(),
      sender_id: "user1",
      recipient_id: selectedConversation,
      content: newMessage,
      read: false,
      read_at: null,
      created_at: new Date().toISOString(),
      sender: currentProfile || undefined,
    });

    setNewMessage("");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[450px]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              conversations.map((convo) => (
                <div
                  key={convo.partnerId}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 border-b ${
                    selectedConversation === convo.partnerId ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(convo.partnerId)}
                >
                  <Avatar>
                    <AvatarFallback>
                      {convo.partner?.display_name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {convo.partner?.display_name || "Unknown"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(convo.lastMessage.created_at), {
                          addSuffix: false,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {convo.lastMessage.sender_id === "user1" ? "You: " : ""}
                      {convo.lastMessage.content}
                    </p>
                  </div>
                  {convo.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {convo.unreadCount}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2">
        {selectedConvo ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConvo.partner?.display_name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedConvo.partner?.display_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConvo.partner?.specialties.join(", ")}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {selectedConvo.messages.map((msg) => {
                    const isOwn = msg.sender_id === "user1";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDistanceToNow(new Date(msg.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Select a conversation to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
