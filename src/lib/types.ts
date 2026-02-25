export interface EventData {
  id: string;
  slug: string;
  name: string;
  topic: string;
  city: string;
  date: string;
  capacity: number;
  budget: string;
  vibe: string;
  venue: VenueData;
  tracks: string[];
  speakers: SpeakerData[];
  schedule: ScheduleItem[];
  pricing: PricingData;
  description: string;
  tagline: string;
  topic_key: string;
  created_at: string;
  organizer_email?: string;
  status: 'draft' | 'planning' | 'announcing' | 'ticket_sales' | 'live' | 'completed' | 'sold_out' | 'past';
}

export interface VenueData {
  name: string;
  address: string;
  capacity_note?: string;
}

export interface SpeakerData {
  name: string;
  role: string;
  initials: string;
  bio?: string;
  photo_url?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker: string;
  track?: string;
}

export interface PricingData {
  early_bird: string;
  regular: string;
  vip?: string;
  currency: string;
}

export interface CreateEventInput {
  topic: string;
  city: string;
  date: string;
  capacity: number;
  budget: string;
  vibe: string;
  speakers_hint?: string;
}
