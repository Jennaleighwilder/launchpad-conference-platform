# Event Lifecycle Engine

The lifecycle engine runs **hourly** via Vercel Cron. It advances events through states automatically.

## Run the migration

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/kzfdxrncortatzrfoxbd/sql/new)
2. Copy contents of `supabase/migrations/002_event_lifecycle.sql`
3. Paste and Run

## Event states

| State | Condition to advance |
|-------|----------------------|
| draft | Has name, date, city, venue |
| planning | 2+ speakers confirmed |
| announcing | Has pricing |
| ticket_sales | Event date begins |
| live | 24h after event date |
| completed | — |

## Flow

- **New events** start as `draft`
- **First cron run**: draft → planning (events have full details from generation)
- **Second run**: planning → announcing (generated speakers count as confirmed)
- **Third run**: announcing → ticket_sales (events have pricing)
- **On event date**: ticket_sales → live
- **24h after**: live → completed

## Manual trigger (testing)

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://launchpad-conference-platform.vercel.app/api/lifecycle/run
```

Add `CRON_SECRET` to Vercel env vars for production. Without it, the endpoint is open (Vercel Cron sends no auth by default).
