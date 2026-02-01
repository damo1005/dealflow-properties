import { create } from 'zustand';
import { Team, TeamMember, TeamInvitation, PropertyAccess } from '@/types/team';

interface TeamState {
  team: Team | null;
  members: TeamMember[];
  invitations: TeamInvitation[];
  propertyAccess: PropertyAccess[];
  isLoading: boolean;
  
  setTeam: (team: Team | null) => void;
  setMembers: (members: TeamMember[]) => void;
  setInvitations: (invitations: TeamInvitation[]) => void;
  setPropertyAccess: (access: PropertyAccess[]) => void;
  setIsLoading: (loading: boolean) => void;
  addMember: (member: TeamMember) => void;
  removeMember: (memberId: string) => void;
  updateMember: (memberId: string, updates: Partial<TeamMember>) => void;
  addInvitation: (invitation: TeamInvitation) => void;
  removeInvitation: (invitationId: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  team: null,
  members: [],
  invitations: [],
  propertyAccess: [],
  isLoading: false,
  
  setTeam: (team) => set({ team }),
  setMembers: (members) => set({ members }),
  setInvitations: (invitations) => set({ invitations }),
  setPropertyAccess: (propertyAccess) => set({ propertyAccess }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  addMember: (member) => set((state) => ({ 
    members: [...state.members, member] 
  })),
  
  removeMember: (memberId) => set((state) => ({
    members: state.members.filter((m) => m.id !== memberId)
  })),
  
  updateMember: (memberId, updates) => set((state) => ({
    members: state.members.map((m) => 
      m.id === memberId ? { ...m, ...updates } : m
    )
  })),
  
  addInvitation: (invitation) => set((state) => ({
    invitations: [...state.invitations, invitation]
  })),
  
  removeInvitation: (invitationId) => set((state) => ({
    invitations: state.invitations.filter((i) => i.id !== invitationId)
  })),
}));

// Mock data for development
export const mockTeam: Team = {
  id: 'team-1',
  name: 'My Property Business',
  slug: 'my-property-business',
  owner_id: 'user-1',
  settings: {},
  subscription_tier: 'pro',
  max_members: 5,
  created_at: new Date().toISOString(),
};

export const mockMembers: TeamMember[] = [
  {
    id: 'member-1',
    team_id: 'team-1',
    user_id: 'user-1',
    role: 'owner',
    custom_permissions: {},
    status: 'active',
    invited_at: new Date().toISOString(),
    accepted_at: new Date().toISOString(),
    profile: {
      full_name: 'John Smith',
      email: 'john@email.com',
    },
  },
  {
    id: 'member-2',
    team_id: 'team-1',
    user_id: 'user-2',
    role: 'accountant',
    custom_permissions: {},
    status: 'active',
    invited_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    invited_by: 'user-1',
    accepted_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      full_name: 'Sarah Johnson',
      email: 'sarah@accountant.co.uk',
    },
  },
  {
    id: 'member-3',
    team_id: 'team-1',
    user_id: 'user-3',
    role: 'partner',
    custom_permissions: {},
    status: 'active',
    invited_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    invited_by: 'user-1',
    accepted_at: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      full_name: 'Mike Williams',
      email: 'mike@email.com',
    },
  },
];

export const mockInvitations: TeamInvitation[] = [
  {
    id: 'invite-1',
    team_id: 'team-1',
    email: 'david@lawyer.co.uk',
    role: 'viewer',
    property_ids: [],
    invitation_token: 'abc123',
    status: 'pending',
    expires_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    invited_by: 'user-1',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
