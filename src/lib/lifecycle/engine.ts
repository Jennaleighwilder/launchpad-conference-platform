/**
 * Event Lifecycle Engine
 * Runs hourly. Queries events, checks conditions, transitions status, triggers automations.
 * The system — not the UI — controls event progression.
 */

import { createServiceClient } from '@/lib/supabase';
import * as actions from '@/lib/lifecycle/actions';

type LifecycleStatus = 'draft' | 'planning' | 'announcing' | 'ticket_sales' | 'live' | 'completed';

interface EventRow {
  id: string;
  slug: string;
  name: string;
  date: string;
  city: string;
  venue: Record<string, unknown>;
  speakers: unknown[];
  pricing: Record<string, unknown>;
  status: string;
  description: string | null;
  tagline: string | null;
  organizer_email: string | null;
  speakers_confirmed_count?: number;
  start_date?: string | null;
  end_date?: string | null;
}

function getStartDate(row: EventRow): Date {
  if (row.start_date) return new Date(row.start_date);
  return new Date(row.date + 'T09:00:00Z');
}

function getEndDate(row: EventRow): Date {
  if (row.end_date) return new Date(row.end_date);
  const d = new Date(row.date + 'T18:00:00Z');
  d.setDate(d.getDate() + 1);
  return d;
}

function getSpeakersConfirmedCount(row: EventRow): number {
  return row.speakers_confirmed_count ?? (Array.isArray(row.speakers) ? row.speakers.length : 0);
}

function eventDateStarted(row: EventRow): boolean {
  const start = getStartDate(row);
  return new Date() >= start;
}

function eventEnded24hAgo(row: EventRow): boolean {
  const end = getEndDate(row);
  const cutoff = new Date(end);
  cutoff.setHours(cutoff.getHours() + 24);
  return new Date() >= cutoff;
}

function hasCoreDetails(row: EventRow): boolean {
  return !!(row.name && row.date && row.city && row.venue && Object.keys(row.venue || {}).length > 0);
}

async function ensureActionRun(supabase: ReturnType<typeof createServiceClient>, eventId: string, actionKey: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('lifecycle_log')
    .select('id')
    .eq('event_id', eventId)
    .eq('action_key', actionKey)
    .single();
  if (error) return true; // Table may not exist yet, proceed
  return !data;
}

async function logAction(supabase: ReturnType<typeof createServiceClient>, eventId: string, fromStatus: string, toStatus: string, actionKey: string): Promise<void> {
  await supabase.from('lifecycle_log').insert({
    event_id: eventId,
    from_status: fromStatus,
    to_status: toStatus,
    action_key: actionKey,
  });
  // Ignore insert errors (lifecycle_log may not exist before migration)
}

async function transitionAndRun(
  supabase: ReturnType<typeof createServiceClient>,
  event: EventRow,
  toStatus: LifecycleStatus,
  actionKey: string,
  runAutomation: () => Promise<void>
): Promise<boolean> {
  const shouldRun = await ensureActionRun(supabase, event.id, actionKey);
  if (!shouldRun) return false;

  await supabase.from('events').update({ status: toStatus, updated_at: new Date().toISOString() }).eq('id', event.id);
  await logAction(supabase, event.id, event.status, toStatus, actionKey);
  await runAutomation();
  console.log(`[lifecycle] ${event.slug}: ${event.status} → ${toStatus}`);
  return true;
}

export async function runLifecycleEngine(): Promise<{ processed: number; transitions: number }> {
  const supabase = createServiceClient();
  let transitions = 0;

  const { data: events, error } = await supabase
    .from('events')
    .select('id, slug, name, date, city, venue, speakers, pricing, status, description, tagline, organizer_email')
    .in('status', ['draft', 'planning', 'announcing', 'ticket_sales', 'live']);

  if (error) {
    console.error('[lifecycle] Query error:', error);
    return { processed: 0, transitions: 0 };
  }

  const rows = (events || []) as EventRow[];

  for (const event of rows) {
    const status = event.status as LifecycleStatus;

    // draft → planning: title, date, location populated
    if (status === 'draft' && hasCoreDetails(event)) {
      const did = await transitionAndRun(supabase, event, 'planning', 'draft-to-planning', async () => {
        // No automation for draft → planning
      });
      if (did) transitions++;
    }

    // planning → announcing: at least 2 speakers confirmed
    // Bootstrap: generated events have speakers in JSONB; treat as pre-confirmed
    else if (status === 'planning') {
      const speakerCount = Array.isArray(event.speakers) ? event.speakers.length : 0;
      let confirmedCount = getSpeakersConfirmedCount(event);
      if (confirmedCount === 0 && speakerCount >= 2) confirmedCount = speakerCount;
      if (confirmedCount >= 2) {
        const did = await transitionAndRun(supabase, event, 'announcing', 'planning-to-announcing', async () => {
          const ev: actions.EventForActions = { id: event.id, slug: event.slug, name: event.name, date: event.date, city: event.city, description: event.description };
          await actions.generateEventDescription(ev);
          await actions.generateSocialAnnouncement(ev);
          await actions.sendSpeakerEmails(ev);
        });
        if (did) transitions++;
      }
    }

    // announcing → ticket_sales: tickets exist (tickets table) or pricing configured
    else if (status === 'announcing') {
      const { count } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('event_id', event.id);
      const hasPricing = !!(event.pricing && (event.pricing.early_bird || event.pricing.regular || event.pricing.vip));
      const ticketsExist = (count ?? 0) > 0 || hasPricing;
      if (ticketsExist) {
        const did = await transitionAndRun(supabase, event, 'ticket_sales', 'announcing-to-ticket_sales', async () => {
          // Ticket sales enabled
        });
        if (did) transitions++;
      }
    }

    // ticket_sales → live: current time >= start_date
    else if (status === 'ticket_sales' && eventDateStarted(event)) {
      const did = await transitionAndRun(supabase, event, 'live', 'ticket_sales-to-live', async () => {
        const ev: actions.EventForActions = { id: event.id, slug: event.slug, name: event.name, date: event.date, city: event.city };
        await actions.sendAttendeeReminder(ev);
      });
      if (did) transitions++;
    }

    // live → completed: current time >= end_date + 24 hours
    else if (status === 'live' && eventEnded24hAgo(event)) {
      const did = await transitionAndRun(supabase, event, 'completed', 'live-to-completed', async () => {
        const ev: actions.EventForActions = { id: event.id, slug: event.slug, name: event.name, date: event.date, city: event.city };
        await actions.sendPostEventSummary(ev);
      });
      if (did) transitions++;
    }
  }

  return { processed: rows.length, transitions };
}
