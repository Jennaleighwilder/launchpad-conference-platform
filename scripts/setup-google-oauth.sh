#!/bin/bash
# Google OAuth setup for Supabase Auth (Launchpad)
# Run: ./scripts/setup-google-oauth.sh

set -e
PROJECT_ID="money-penyy-bot"
SUPABASE_REF="kzfdxrncortatzrfoxbd"
REDIRECT_URI="https://${SUPABASE_REF}.supabase.co/auth/v1/callback"

echo "=== Google OAuth Setup for Launchpad ==="
echo ""

# 1. Check gcloud auth
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
  echo ">>> Step 1: Authenticate with Google Cloud"
  echo "Opening browser for gcloud login..."
  gcloud auth login
  echo ""
fi

# 2. Set project and enable APIs
echo ">>> Step 2: Configuring project and enabling APIs"
gcloud config set project $PROJECT_ID
gcloud services enable iap.googleapis.com --project=$PROJECT_ID 2>/dev/null || true
gcloud services enable people.googleapis.com --project=$PROJECT_ID 2>/dev/null || true
echo "APIs enabled."
echo ""

# 3. Print instructions for OAuth client (must be done in Console)
echo ">>> Step 3: Create OAuth Client ID (manual - open in browser)"
echo ""
echo "Redirect URI to use: $REDIRECT_URI"
echo ""
echo "Opening Google Cloud Console Credentials page..."
open "https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID" 2>/dev/null || \
  echo "Open: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "In the Console:"
echo "  1. Click '+ CREATE CREDENTIALS' → 'OAuth client ID'"
echo "  2. If prompted, configure OAuth consent screen first (External, App name: Launchpad)"
echo "  3. Application type: Web application"
echo "  4. Name: Launchpad Supabase Auth"
echo "  5. Authorized redirect URIs: $REDIRECT_URI"
echo "  6. Create → Copy Client ID and Client Secret"
echo ""

# 4. Supabase instructions
echo ">>> Step 4: Configure Supabase"
echo "Open: https://supabase.com/dashboard"
echo ""
echo "  1. Authentication → Providers → Google → Enable"
echo "  2. Paste Client ID and Client Secret"
echo "  3. Authentication → URL Configuration → Redirect URLs:"
echo "     - https://launchpad-conference-platform.vercel.app"
echo "     - https://launchpad-conference-platform.vercel.app/**"
echo "     - http://localhost:3000"
echo "     - http://localhost:3000/**"
echo ""
echo "Done! Test 'Sign up with Google' on your app."
