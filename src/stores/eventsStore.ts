import { create } from 'zustand';
import { NetworkingEvent, EventRegistration } from '@/types/events';

interface EventsState {
  events: NetworkingEvent[];
  registrations: EventRegistration[];
  isLoading: boolean;
  
  registerForEvent: (eventId: string) => void;
  cancelRegistration: (eventId: string) => void;
  getMyEvents: () => NetworkingEvent[];
}

// Mock events for demo
const mockEvents: NetworkingEvent[] = [
  {
    id: '1',
    title: 'Manchester Property Investor Meetup',
    description: 'Join 50+ local investors for networking, a guest speaker on HMO strategies, and deal sharing. Free drinks and nibbles provided.',
    event_type: 'meetup',
    is_virtual: false,
    venue_name: 'The Alchemist, Spinningfields',
    venue_address: '1 Hardman Square',
    city: 'Manchester',
    postcode: 'M3 3EB',
    virtual_link: null,
    start_datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
    timezone: 'Europe/London',
    max_attendees: 60,
    current_attendees: 42,
    is_free: true,
    ticket_price: null,
    member_price: null,
    organiser_id: null,
    organiser_name: 'PropertyPro Manchester',
    status: 'upcoming',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Section 24 Tax Planning Webinar',
    description: 'Learn how to mitigate the effects of Section 24 on your portfolio. Includes Q&A session with property tax specialist.',
    event_type: 'webinar',
    is_virtual: true,
    venue_name: null,
    venue_address: null,
    city: null,
    postcode: null,
    virtual_link: 'https://zoom.us/j/123456789',
    start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
    timezone: 'Europe/London',
    max_attendees: 200,
    current_attendees: 156,
    is_free: true,
    ticket_price: null,
    member_price: null,
    organiser_id: null,
    organiser_name: 'Property Tax Experts',
    status: 'upcoming',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Property Networking Birmingham',
    description: 'Monthly networking event for property investors in the Midlands. Great for deal sourcing and JV opportunities.',
    event_type: 'networking',
    is_virtual: false,
    venue_name: 'The Grand Hotel',
    venue_address: 'Colmore Row',
    city: 'Birmingham',
    postcode: 'B3 2DA',
    virtual_link: null,
    start_datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
    timezone: 'Europe/London',
    max_attendees: 40,
    current_attendees: 28,
    is_free: false,
    ticket_price: 10,
    member_price: null,
    organiser_id: null,
    organiser_name: 'Midlands Property Group',
    status: 'upcoming',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'BTL Deal Analysis Workshop',
    description: 'Full-day workshop covering how to analyse buy-to-let deals. Includes templates and case studies. Lunch provided.',
    event_type: 'workshop',
    is_virtual: false,
    venue_name: 'WeWork London',
    venue_address: '1 Poultry',
    city: 'London',
    postcode: 'EC2R 8EJ',
    virtual_link: null,
    start_datetime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    timezone: 'Europe/London',
    max_attendees: 20,
    current_attendees: 12,
    is_free: false,
    ticket_price: 49,
    member_price: 39,
    organiser_id: null,
    organiser_name: 'Property Academy',
    status: 'upcoming',
    image_url: null,
    created_at: new Date().toISOString(),
  },
];

export const useEventsStore = create<EventsState>((set, get) => ({
  events: mockEvents,
  registrations: [],
  isLoading: false,

  registerForEvent: (eventId) => {
    const registration: EventRegistration = {
      id: crypto.randomUUID(),
      event_id: eventId,
      user_id: 'current-user',
      ticket_type: 'standard',
      amount_paid: null,
      status: 'registered',
      checked_in_at: null,
      created_at: new Date().toISOString(),
    };
    
    set((state) => ({
      registrations: [...state.registrations, registration],
      events: state.events.map(e => 
        e.id === eventId 
          ? { ...e, current_attendees: e.current_attendees + 1 }
          : e
      ),
    }));
  },

  cancelRegistration: (eventId) => {
    set((state) => ({
      registrations: state.registrations.filter(r => r.event_id !== eventId),
      events: state.events.map(e => 
        e.id === eventId 
          ? { ...e, current_attendees: Math.max(0, e.current_attendees - 1) }
          : e
      ),
    }));
  },

  getMyEvents: () => {
    const { events, registrations } = get();
    const registeredEventIds = registrations.map(r => r.event_id);
    return events.filter(e => registeredEventIds.includes(e.id));
  },
}));
