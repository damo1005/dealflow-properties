export type NoteType = 'general' | 'action_item' | 'question' | 'important';
export type NoteVisibility = 'team' | 'private';
export type EntityType = 'property' | 'tenant' | 'deal' | 'transaction';

export interface Note {
  id: string;
  user_id: string;
  team_id?: string;
  entity_type: EntityType;
  entity_id: string;
  content: string;
  note_type: NoteType;
  is_pinned: boolean;
  is_resolved: boolean;
  due_date?: string;
  assigned_to?: string;
  visibility: NoteVisibility;
  mentioned_users?: string[];
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  assignee?: {
    full_name: string;
  };
  comments?: NoteComment[];
}

export interface NoteComment {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
}

export const NOTE_TYPE_CONFIG: Record<NoteType, { label: string; icon: string; color: string }> = {
  general: { label: 'General', icon: '💬', color: 'bg-gray-100 text-gray-800' },
  action_item: { label: 'Action Item', icon: '✅', color: 'bg-blue-100 text-blue-800' },
  question: { label: 'Question', icon: '❓', color: 'bg-purple-100 text-purple-800' },
  important: { label: 'Important', icon: '⚠️', color: 'bg-red-100 text-red-800' },
};
