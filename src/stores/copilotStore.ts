import { create } from 'zustand';
import { ChatConversation, ChatMessage } from '@/types/copilot';

interface CopilotState {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  
  // Actions
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  sendMessage: (content: string, portfolioContext?: unknown[]) => Promise<void>;
  startNewConversation: () => void;
  loadConversation: (id: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-copilot`;

export const useCopilotStore = create<CopilotState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isOpen: false,

  setOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  sendMessage: async (content, portfolioContext) => {
    const { messages } = get();
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      conversation_id: get().currentConversation?.id || 'temp',
      role: 'user',
      content,
      metadata: {},
      created_at: new Date().toISOString(),
    };

    set({ 
      messages: [...messages, userMessage],
      isLoading: true 
    });

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          portfolioContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let textBuffer = '';

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: get().currentConversation?.id || 'temp',
        role: 'assistant',
        content: '',
        metadata: {},
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
      }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              assistantContent += deltaContent;
              set((state) => ({
                messages: state.messages.map((m, i) =>
                  i === state.messages.length - 1
                    ? { ...m, content: assistantContent }
                    : m
                ),
              }));
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Copilot error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: get().currentConversation?.id || 'temp',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        metadata: { error: true },
        created_at: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages.slice(0, -1), errorMessage],
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  startNewConversation: () => {
    set({
      currentConversation: null,
      messages: [],
    });
  },

  loadConversation: (id) => {
    const conversation = get().conversations.find(c => c.id === id);
    if (conversation) {
      set({ currentConversation: conversation });
      // In real app, load messages from DB
    }
  },
}));
