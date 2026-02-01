import { create } from "zustand";
import type { UserProfile, NetworkPost, PostComment, UserMessage, NetworkGroup, UserConnection } from "@/types/network";

interface NetworkState {
  currentProfile: UserProfile | null;
  profiles: UserProfile[];
  posts: NetworkPost[];
  comments: PostComment[];
  messages: UserMessage[];
  groups: NetworkGroup[];
  connections: UserConnection[];
  isLoading: boolean;

  setCurrentProfile: (profile: UserProfile | null) => void;
  setProfiles: (profiles: UserProfile[]) => void;
  setPosts: (posts: NetworkPost[]) => void;
  addPost: (post: NetworkPost) => void;
  setComments: (comments: PostComment[]) => void;
  addComment: (comment: PostComment) => void;
  setMessages: (messages: UserMessage[]) => void;
  addMessage: (message: UserMessage) => void;
  setGroups: (groups: NetworkGroup[]) => void;
  setConnections: (connections: UserConnection[]) => void;
  addConnection: (connection: UserConnection) => void;
  removeConnection: (followingId: string) => void;
  toggleLike: (postId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  currentProfile: null,
  profiles: [],
  posts: [],
  comments: [],
  messages: [],
  groups: [],
  connections: [],
  isLoading: false,

  setCurrentProfile: (currentProfile) => set({ currentProfile }),
  setProfiles: (profiles) => set({ profiles }),
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setComments: (comments) => set({ comments }),
  addComment: (comment) => set((state) => ({ 
    comments: [...state.comments, comment],
    posts: state.posts.map((p) => 
      p.id === comment.post_id 
        ? { ...p, comment_count: p.comment_count + 1 } 
        : p
    ),
  })),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setGroups: (groups) => set({ groups }),
  setConnections: (connections) => set({ connections }),
  addConnection: (connection) => set((state) => ({ 
    connections: [...state.connections, connection] 
  })),
  removeConnection: (followingId) => set((state) => ({ 
    connections: state.connections.filter((c) => c.following_id !== followingId) 
  })),
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map((p) =>
      p.id === postId
        ? { ...p, like_count: p.like_count + 1 }
        : p
    ),
  })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Mock data
export const mockProfiles: UserProfile[] = [
  {
    id: "p1",
    user_id: "user1",
    display_name: "Sarah Johnson",
    bio: "Full-time BTL investor specializing in London and South East. 15 properties and counting!",
    profile_photo_url: null,
    cover_photo_url: null,
    investor_type: "experienced",
    years_investing: 8,
    specialties: ["BTL", "BRR"],
    properties_count: 15,
    portfolio_value: 3500000,
    portfolio_yield: 7.8,
    location_city: "London",
    location_country: "UK",
    linkedin_url: "https://linkedin.com/in/sarahjohnson",
    twitter_handle: "sarahjinvests",
    website: null,
    looking_for: ["JV Partners", "Deals"],
    open_to_jv: true,
    open_to_mentor: true,
    profile_visibility: "public",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p2",
    user_id: "user2",
    display_name: "Michael Chen",
    bio: "BRR specialist in Manchester. Turned £50K into £500K equity in 3 years.",
    profile_photo_url: null,
    cover_photo_url: null,
    investor_type: "experienced",
    years_investing: 5,
    specialties: ["BRR", "HMO"],
    properties_count: 8,
    portfolio_value: 1800000,
    portfolio_yield: 9.2,
    location_city: "Manchester",
    location_country: "UK",
    linkedin_url: null,
    twitter_handle: null,
    website: "https://michaelcheninvests.com",
    looking_for: ["JV Partners", "Networking"],
    open_to_jv: true,
    open_to_mentor: false,
    profile_visibility: "public",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p3",
    user_id: "user3",
    display_name: "David Martinez",
    bio: "New to property investing. Recently completed my first HMO conversion.",
    profile_photo_url: null,
    cover_photo_url: null,
    investor_type: "beginner",
    years_investing: 1,
    specialties: ["HMO"],
    properties_count: 1,
    portfolio_value: 280000,
    portfolio_yield: 12.5,
    location_city: "Birmingham",
    location_country: "UK",
    linkedin_url: null,
    twitter_handle: null,
    website: null,
    looking_for: ["Mentors", "Knowledge"],
    open_to_jv: false,
    open_to_mentor: false,
    profile_visibility: "public",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockPosts: NetworkPost[] = [
  {
    id: "post1",
    user_id: "user1",
    post_type: "deal_share",
    title: "High-Yield BTL in EN3",
    content: "Found this gem at auction yesterday:\n\n📍 2-bed flat, Enfield EN3\n💰 Purchase: £188,000\n💵 Rent: £1,350/mo\n📊 Yield: 8.6%\n⚡ Cash flow: +£280/mo\n\nBelow market by 12%. Needs light refurb (£5K). Perfect BTL.\n\nAnyone else bidding on EN3 auctions?",
    images: [],
    deal_type: "BTL",
    asking_price: 188000,
    location_area: "EN3",
    jv_structure: null,
    jv_equity_split: null,
    jv_investment_required: null,
    view_count: 127,
    like_count: 24,
    comment_count: 8,
    share_count: 3,
    visibility: "public",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: mockProfiles[0],
  },
  {
    id: "post2",
    user_id: "user2",
    post_type: "jv_opportunity",
    title: "Looking for JV Partner - Manchester BRR",
    content: "I have: £50K capital + refurb skills\nLooking for: Someone with £50K\n\nDeal: 3-bed semi, Manchester\nPurchase: £180K\nARV: £240K\nRefurb: £30K\nStrategy: BRR (refinance & hold)\n\nSplit: 50/50 equity\n\nInterested? DM me.",
    images: [],
    deal_type: "BRR",
    asking_price: 180000,
    location_area: "Manchester",
    jv_structure: "50/50 equity split",
    jv_equity_split: "50/50",
    jv_investment_required: 50000,
    view_count: 89,
    like_count: 15,
    comment_count: 12,
    share_count: 2,
    visibility: "public",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: mockProfiles[1],
  },
  {
    id: "post3",
    user_id: "user3",
    post_type: "question",
    title: "First HMO - any tips?",
    content: "Just bought 5-bed near Birmingham University. Planning HMO conversion.\n\nWhat should I watch out for?\nBest management companies?\nLicense requirements?\n\n#HMO #Birmingham #Advice",
    images: [],
    deal_type: null,
    asking_price: null,
    location_area: "Birmingham",
    jv_structure: null,
    jv_equity_split: null,
    jv_investment_required: null,
    view_count: 56,
    like_count: 8,
    comment_count: 23,
    share_count: 0,
    visibility: "public",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: mockProfiles[2],
  },
];

export const mockComments: PostComment[] = [
  {
    id: "c1",
    post_id: "post3",
    user_id: "user1",
    parent_comment_id: null,
    content: "Get your Article 4 check done ASAP. Birmingham has restrictions.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: mockProfiles[0],
  },
  {
    id: "c2",
    post_id: "post3",
    user_id: "user2",
    parent_comment_id: null,
    content: "I use ABC Management. Been great for my HMOs.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: mockProfiles[1],
  },
];

export const mockGroups: NetworkGroup[] = [
  {
    id: "g1",
    created_by: "user1",
    name: "London BTL Investors",
    description: "A community for Buy-to-Let investors in London and the South East.",
    cover_image_url: null,
    group_type: "location_based",
    location_area: "London",
    member_count: 2345,
    visibility: "public",
    created_at: new Date().toISOString(),
  },
  {
    id: "g2",
    created_by: "user2",
    name: "BRR Strategy Mastermind",
    description: "Share BRR deals, tips, and success stories.",
    cover_image_url: null,
    group_type: "strategy_based",
    location_area: null,
    member_count: 890,
    visibility: "public",
    created_at: new Date().toISOString(),
  },
  {
    id: "g3",
    created_by: "user1",
    name: "HMO Landlords UK",
    description: "Everything HMO - licensing, management, and more.",
    cover_image_url: null,
    group_type: "strategy_based",
    location_area: null,
    member_count: 1567,
    visibility: "public",
    created_at: new Date().toISOString(),
  },
];

export const mockMessages: UserMessage[] = [
  {
    id: "m1",
    sender_id: "user2",
    recipient_id: "user1",
    content: "Hi Sarah! I saw your EN3 deal post. I'm interested in the area too. Would love to chat!",
    read: false,
    read_at: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sender: mockProfiles[1],
  },
  {
    id: "m2",
    sender_id: "user1",
    recipient_id: "user2",
    content: "Hi Michael! Yes, EN3 has been great for yields. Happy to share what I've learned.",
    read: true,
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    sender: mockProfiles[0],
  },
];
