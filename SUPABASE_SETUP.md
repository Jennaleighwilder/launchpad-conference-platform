# Supabase Setup — Step by Step

Your project URL is already in `.env.local`. Do these 2 things:

---

## Step 1: Get your Service Role Key

1. Go to: **https://supabase.com/dashboard/project/kzfdxrncortatzrfoxbd/settings/api**
2. Scroll to **Project API keys**
3. You’ll see two keys:
   - **anon** (public) — you already added this
   - **service_role** (secret) — you need this one
4. Click **Reveal** next to `service_role`
5. Click the copy icon to copy it
6. Open `.env.local` in this project
7. Paste it after `SUPABASE_SERVICE_ROLE_KEY=` (replace the empty value)

---

## Step 2: Run the SQL (create tables)

1. Go to: **https://supabase.com/dashboard/project/kzfdxrncortatzrfoxbd/sql/new**
2. Open the file `supabase-schema.sql` in this project
3. Copy **all** of its contents
4. Paste into the Supabase SQL Editor
5. Click **Run** (or press Cmd+Enter)
6. You should see “Success. No rows returned”

---

## Step 3: Restart your dev server

```bash
npm run dev
```

---

## For Vercel deployment

Add these in Vercel → Project → Settings → Environment Variables:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kzfdxrncortatzrfoxbd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (your anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (your service_role key from Step 1) |

Then redeploy.
