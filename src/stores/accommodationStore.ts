import { create } from "zustand";
import type { AccommodationRequest, AccommodationFilters } from "@/types/accommodation";

interface AccommodationState {
  requests: AccommodationRequest[];
  myRequests: AccommodationRequest[];
  savedRequests: AccommodationRequest[];
  filters: AccommodationFilters;
  isLoading: boolean;
  
  setRequests: (requests: AccommodationRequest[]) => void;
  setMyRequests: (requests: AccommodationRequest[]) => void;
  setSavedRequests: (requests: AccommodationRequest[]) => void;
  updateFilters: (filters: Partial<AccommodationFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultFilters: AccommodationFilters = {
  requestType: "all",
  location: "",
  budgetMin: 0,
  budgetMax: 5000,
  propertyTypes: [],
  moveInDate: null,
  duration: "any",
  selfContained: false,
  noSharing: false,
  parking: false,
  petFriendly: false,
  familyFriendly: false,
};

export const useAccommodationStore = create<AccommodationState>((set) => ({
  requests: [],
  myRequests: [],
  savedRequests: [],
  filters: defaultFilters,
  isLoading: false,

  setRequests: (requests) => set({ requests }),
  setMyRequests: (requests) => set({ myRequests: requests }),
  setSavedRequests: (requests) => set({ savedRequests: requests }),
  updateFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Mock data for development
export const mockAccommodationRequests: AccommodationRequest[] = [
  {
    id: "1",
    user_id: "user1",
    request_type: "seeking",
    status: "active",
    location: "Enfield EN3",
    postcode_area: "EN3",
    property_type: ["studio", "1-bed"],
    number_of_guests: 2,
    has_children: true,
    has_pets: false,
    budget_max: 1300,
    budget_min: 1000,
    move_in_date: null,
    move_out_date: "2025-10-01",
    duration_months: 8,
    self_contained: true,
    no_sharing: true,
    parking_required: false,
    furnished: true,
    title: "1 couple — 1 bed or studio — budget £1,300 (till October)",
    description: "Looking for a quiet self-contained studio or 1-bed in Enfield area. Professional couple with a toddler, no pets. We're tidy, respectful tenants with excellent references. Prefer furnished but can consider unfurnished.",
    special_requirements: "Ground floor or lift access preferred due to pushchair",
    contact_name: "Cheyenne Jade",
    contact_phone: "+44 7939 115953",
    contact_email: "cheyenne@example.com",
    preferred_contact_method: "whatsapp",
    whatsapp_number: "+44 7939 115953",
    is_public: true,
    show_contact_details: false,
    view_count: 45,
    enquiry_count: 7,
    expires_at: "2025-03-01T00:00:00Z",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_id: "user2",
    request_type: "offering",
    status: "active",
    location: "Hackney E8",
    postcode_area: "E8",
    property_type: ["2-bed"],
    number_of_guests: 4,
    has_children: true,
    has_pets: true,
    budget_max: 1800,
    budget_min: 1600,
    move_in_date: "2025-03-01",
    move_out_date: null,
    duration_months: null,
    self_contained: true,
    no_sharing: true,
    parking_required: false,
    furnished: true,
    title: "Spacious 2-bed flat available in Hackney — £1,650/mo",
    description: "Beautiful 2-bedroom flat in the heart of Hackney. Modern finish, fully furnished, pet-friendly. Close to transport links and local amenities. Ideal for professionals or small family.",
    special_requirements: null,
    contact_name: "James Wilson",
    contact_phone: "+44 7700 900123",
    contact_email: "james@example.com",
    preferred_contact_method: "platform",
    whatsapp_number: null,
    is_public: true,
    show_contact_details: true,
    view_count: 89,
    enquiry_count: 12,
    expires_at: "2025-04-01T00:00:00Z",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_id: "user3",
    request_type: "seeking",
    status: "active",
    location: "Camden NW1",
    postcode_area: "NW1",
    property_type: ["studio"],
    number_of_guests: 1,
    has_children: false,
    has_pets: false,
    budget_max: 1200,
    budget_min: 900,
    move_in_date: "2025-02-15",
    move_out_date: null,
    duration_months: null,
    self_contained: true,
    no_sharing: true,
    parking_required: false,
    furnished: true,
    title: "Single professional seeking studio in Camden — £1,200 max",
    description: "Young professional looking for a quiet studio flat in Camden or nearby areas. Non-smoker, no pets. Working in central London, need good transport links. Happy to pay 6 months upfront.",
    special_requirements: "Close to tube station preferred",
    contact_name: "Sarah Chen",
    contact_phone: null,
    contact_email: "sarah@example.com",
    preferred_contact_method: "email",
    whatsapp_number: null,
    is_public: true,
    show_contact_details: false,
    view_count: 23,
    enquiry_count: 3,
    expires_at: "2025-03-15T00:00:00Z",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];
