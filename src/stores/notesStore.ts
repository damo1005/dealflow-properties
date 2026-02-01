import { create } from 'zustand';
import { Note, NoteComment } from '@/types/notes';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  
  setNotes: (notes: Note[]) => void;
  setIsLoading: (loading: boolean) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  addComment: (noteId: string, comment: NoteComment) => void;
  togglePin: (noteId: string) => void;
  toggleResolved: (noteId: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoading: false,
  
  setNotes: (notes) => set({ notes }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  addNote: (note) => set((state) => ({
    notes: [note, ...state.notes],
  })),
  
  updateNote: (noteId, updates) => set((state) => ({
    notes: state.notes.map((n) => n.id === noteId ? { ...n, ...updates } : n),
  })),
  
  deleteNote: (noteId) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== noteId),
  })),
  
  addComment: (noteId, comment) => set((state) => ({
    notes: state.notes.map((n) => 
      n.id === noteId 
        ? { ...n, comments: [...(n.comments || []), comment] }
        : n
    ),
  })),
  
  togglePin: (noteId) => set((state) => ({
    notes: state.notes.map((n) => 
      n.id === noteId ? { ...n, is_pinned: !n.is_pinned } : n
    ),
  })),
  
  toggleResolved: (noteId) => set((state) => ({
    notes: state.notes.map((n) => 
      n.id === noteId ? { ...n, is_resolved: !n.is_resolved } : n
    ),
  })),
}));

// Mock data
export const mockNotes: Note[] = [
  {
    id: 'note-1',
    user_id: 'user-1',
    team_id: 'team-1',
    entity_type: 'property',
    entity_id: 'prop-1',
    content: 'Tenant mentioned damp in bathroom. Need inspection before renewal.',
    note_type: 'important',
    is_pinned: true,
    is_resolved: false,
    visibility: 'team',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      full_name: 'John Smith',
    },
    comments: [
      {
        id: 'comment-1',
        note_id: 'note-1',
        user_id: 'user-2',
        content: 'Keep receipts for tax if repair needed.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: { full_name: 'Sarah Johnson' },
      },
    ],
  },
  {
    id: 'note-2',
    user_id: 'user-1',
    team_id: 'team-1',
    entity_type: 'property',
    entity_id: 'prop-1',
    content: 'Rent review in March. Market suggests £900. @Mike?',
    note_type: 'general',
    is_pinned: false,
    is_resolved: false,
    visibility: 'team',
    mentioned_users: ['user-3'],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      full_name: 'John Smith',
    },
    comments: [
      {
        id: 'comment-2',
        note_id: 'note-2',
        user_id: 'user-3',
        content: 'Agreed, £900 fair after damp sorted.',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        author: { full_name: 'Mike Williams' },
      },
    ],
  },
  {
    id: 'note-3',
    user_id: 'user-1',
    team_id: 'team-1',
    entity_type: 'property',
    entity_id: 'prop-1',
    content: 'Get new EPC before April',
    note_type: 'action_item',
    is_pinned: false,
    is_resolved: true,
    due_date: '2026-03-15',
    assigned_to: 'user-1',
    visibility: 'team',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      full_name: 'John Smith',
    },
    assignee: {
      full_name: 'John Smith',
    },
  },
];
