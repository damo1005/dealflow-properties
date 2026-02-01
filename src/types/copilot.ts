export interface ChatConversation {
  id: string;
  user_id: string;
  title: string | null;
  context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CopilotKnowledge {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  source_url: string | null;
}

export interface AIActionLog {
  id: string;
  user_id: string;
  conversation_id: string | null;
  action_type: string;
  action_details: Record<string, unknown>;
  created_at: string;
}
