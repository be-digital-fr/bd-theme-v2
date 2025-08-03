#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps set up environment variables for Vercel deployment

echo "Setting up Vercel environment variables..."

# Database
vercel env add DATABASE_URL production < /dev/null
vercel env add DIRECT_URL production < /dev/null

# Authentication
vercel env add BETTER_AUTH_SECRET production < /dev/null
vercel env add BETTER_AUTH_URL production < /dev/null

# OAuth (Optional)
vercel env add GOOGLE_CLIENT_ID production < /dev/null
vercel env add GOOGLE_CLIENT_SECRET production < /dev/null
vercel env add FACEBOOK_CLIENT_ID production < /dev/null
vercel env add FACEBOOK_CLIENT_SECRET production < /dev/null

# Sanity CMS
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production < /dev/null
vercel env add NEXT_PUBLIC_SANITY_DATASET production < /dev/null
vercel env add NEXT_PUBLIC_SANITY_API_VERSION production < /dev/null
vercel env add SANITY_API_TOKEN production < /dev/null

# OpenAI
vercel env add OPENAI_API_KEY production < /dev/null

# Sentry
vercel env add SENTRY_DSN production < /dev/null
vercel env add NEXT_PUBLIC_SENTRY_DSN production < /dev/null
vercel env add SENTRY_ORG production < /dev/null
vercel env add SENTRY_PROJECT production < /dev/null
vercel env add SENTRY_AUTH_TOKEN production < /dev/null

# Application
vercel env add NEXT_PUBLIC_BASE_URL production < /dev/null

# Site Verification (Optional)
vercel env add GOOGLE_SITE_VERIFICATION production < /dev/null

echo "Environment variables setup complete!"
echo ""
echo "IMPORTANT: You need to manually add the values for each variable in the Vercel dashboard:"
echo "https://vercel.com/seck-mamadous-projects/bd-theme/settings/environment-variables"
echo ""
echo "Critical variables to set:"
echo "1. DATABASE_URL - Your Neon PostgreSQL connection string"
echo "2. BETTER_AUTH_SECRET - Your authentication secret"
echo "3. NEXT_PUBLIC_BASE_URL - Your production URL (https://bd-theme.vercel.app)"
echo "4. Sanity variables - From your Sanity dashboard"