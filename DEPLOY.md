# Launchpad — Deploy to Vercel

## 1. Push to GitHub

```bash
# Create repo on GitHub: https://github.com/new — name it "launchpad-conference-platform"

# Add remote and push (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/launchpad-conference-platform.git
git branch -M main
git push -u origin main
```

Or with GitHub CLI:

```bash
gh repo create launchpad-conference-platform --private --source=. --push
```

## 2. Deploy to Vercel

```bash
npx vercel
```

Follow prompts (link to existing project or create new). On first deploy, you'll get a URL like `https://launchpad-xxx.vercel.app`.

## 3. Set Environment Variables in Vercel

Dashboard → Project → Settings → Environment Variables. Add:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | Your OpenAI key |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings > API |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://launchpad-xxx.vercel.app`) |

Optional (for Stripe):

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |

## 4. Production Deploy

```bash
npx vercel --prod
```

Your app is live. Share the URL with your client.
