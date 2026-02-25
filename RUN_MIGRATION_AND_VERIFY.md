# Run migration and verify — do these in order

## 1. Run the migration (Supabase)

1. Open https://supabase.com/dashboard/project/kzfdxrncortatzrfoxbd/sql/new
2. Open `supabase/migrations/002_event_lifecycle.sql` locally
3. Copy ALL of it
4. Paste into Supabase SQL Editor
5. Click **Run**
6. Expect: `Success. No rows returned`
7. If you see red error text, copy it exactly and stop.

## 2. Confirm new columns (Supabase)

Table Editor → **events** → check these columns exist:

- `status`
- `start_date`
- `end_date`
- `ai_description`
- `social_announcement_text`

## 3. Add CRON_SECRET (Vercel)

1. Vercel → Project → Settings → Environment Variables
2. Add: `CRON_SECRET` = (generate a long random string, e.g. `openssl rand -hex 32`)
3. Apply to **Production** and **Preview**
4. Redeploy (or wait for the next deploy)

## 4. Call the lifecycle endpoint

After deploy and CRON_SECRET are set:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://launchpad-conference-platform.vercel.app/api/lifecycle/run
```

Expected JSON:

```json
{"ok":true,"processed":N,"transitions":N}
```

## 5. Check a state change

1. Create a new event in the UI
2. In Supabase → events → find that row → `status` should be `draft`
3. Ensure name, date, city, venue are set (they usually are from generation)
4. Run the curl command again
5. Refresh the row → `status` should be `planning`
