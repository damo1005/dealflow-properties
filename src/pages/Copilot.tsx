import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Loader2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const QUICK_QUESTIONS = [
  "Can I increase rent mid-tenancy?",
  "What tax deductions can I claim?",
  "How do I serve a Section 21 notice?",
  "When does my gas safety expire?",
  "Do I need an HMO licence?",
  "How much deposit can I take?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-copilot`;

export default function Copilot() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const createNewConversation = () => {
    const newConvo: Conversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveConversation(newConvo);
    setInput("");
    inputRef.current?.focus();
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(null);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Create conversation if none exists
    let convo = activeConversation;
    if (!convo) {
      convo = {
        id: crypto.randomUUID(),
        title: messageText.slice(0, 50),
        messages: [],
        createdAt: new Date(),
      };
      setConversations((prev) => [convo!, ...prev]);
      setActiveConversation(convo);
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    const updatedMessages = [...convo.messages, userMessage];
    const updatedConvo = {
      ...convo,
      messages: updatedMessages,
      title: convo.messages.length === 0 ? messageText.slice(0, 50) : convo.title,
    };
    
    setActiveConversation(updatedConvo);
    setConversations((prev) =>
      prev.map((c) => (c.id === updatedConvo.id ? updatedConvo : c))
    );
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationId: updatedConvo.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              
              // Update message in real-time
              setActiveConversation((prev) => {
                if (!prev) return prev;
                const lastMessage = prev.messages[prev.messages.length - 1];
                if (lastMessage?.role === "assistant") {
                  return {
                    ...prev,
                    messages: prev.messages.map((m, i) =>
                      i === prev.messages.length - 1
                        ? { ...m, content: assistantContent }
                        : m
                    ),
                  };
                }
                return {
                  ...prev,
                  messages: [
                    ...prev.messages,
                    {
                      id: crypto.randomUUID(),
                      role: "assistant" as const,
                      content: assistantContent,
                      timestamp: new Date(),
                    },
                  ],
                };
              });
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Update conversations list
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === updatedConvo.id) {
            const finalMessages = [
              ...updatedMessages,
              {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: assistantContent,
                timestamp: new Date(),
              },
            ];
            return { ...c, messages: finalMessages };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <div className="p-4">
            <Button onClick={createNewConversation} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 px-2">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer mb-1 ${
                  activeConversation?.id === convo.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => setActiveConversation(convo)}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate flex-1 text-sm">{convo.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(convo.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Landlord Co-Pilot</h1>
                <p className="text-muted-foreground mb-8">
                  Your AI assistant for UK property law, tax, and compliance.
                  Ask me anything about being a landlord!
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {QUICK_QUESTIONS.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      className="h-auto py-3 px-4 text-left justify-start"
                      onClick={() => sendMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">📋 Tenancy Law</Badge>
                  <Badge variant="secondary">💰 Tax Advice</Badge>
                  <Badge variant="secondary">🔧 Compliance</Badge>
                  <Badge variant="secondary">📊 Portfolio Help</Badge>
                </div>
              </div>
            </div>
          ) : (
            // Chat Messages
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <Card
                      className={`max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}

                        {message.role === "assistant" && (
                          <div className="flex gap-2 mt-4 pt-3 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Helpful
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && activeConversation.messages[activeConversation.messages.length - 1]?.role === "user" && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about UK property law, tax, compliance..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Co-Pilot provides guidance, not legal or financial advice. For complex matters, consult a professional.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
