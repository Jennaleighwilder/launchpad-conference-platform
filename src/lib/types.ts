export type HeroMediaType = 'image' | 'video' | 'none';

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
  /** Unique hero media — every event MUST have its own. No reuse across events. */
  hero_image_url?: string | null;
  hero_video_url?: string | null;
  hero_media_type?: HeroMediaType;
  /** When 'abstract' or 'minimal', use CSS gradient instead of image */
  hero_style?: string;
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
  /** Link to speaker's website or profile */
  url?: string;
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

/** Speaker slot for custom speaker input during event creation */
export interface SpeakerSlotInput {
  day: number;
  time: string;
  title: string;
}

/** Custom speaker input during event creation */
export interface SpeakerInput {
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  url?: string;
  slots?: SpeakerSlotInput[];
}

export interface CreateEventInput {
  topic: string;
  city: string;
  date: string;
  capacity: number;
  budget: string;
  vibe: string;
  speakers_hint?: string;
  days?: 1 | 2 | 3;
  enhanced?: boolean;
  hero_style?: string;
  hero_prompt?: string;
  /** Optional: override AI-generated venue name */
  venue_name?: string;
  /** Optional: override AI-generated venue address */
  venue_address?: string;
  /** Optional: URL to scrape — import speakers, schedule, venue, pricing from existing event site */
  existing_url?: string;
  /** Optional: custom speakers with bios, photos, links, and speaking slots */
  speakers?: SpeakerInput[];
}
