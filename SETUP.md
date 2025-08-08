# Setup Guide

Complete setup guide for the Be Digital restaurant theme - a Next.js 15 application with Clean Architecture, multilingual support, and comprehensive e-commerce features.

## Prerequisites

- **Node.js 18+** and **pnpm** package manager
- **PostgreSQL database** (recommended: Neon)
- **Sanity CMS account** and project
- **Git** for version control

## 1. Environment Setup

Create a `.env.local` file in the project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secure-random-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-07-05"
SANITY_API_TOKEN="your_sanity_api_token_with_write_permissions"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Error Tracking (Optional)
SENTRY_DSN="your-sentry-dsn"
```

## 2. Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm dlx prisma generate

# Apply database schema
pnpm dlx prisma db push

# Seed database with test users and initial data
pnpm db:seed
```

## 3. Sanity CMS Setup

### Initial Configuration

```bash
# Initialize Sanity singletons (settings, home page content)
pnpm init-singletons

# Setup translation documents
pnpm init-translations

# Initialize hero banner content
pnpm init-hero-banner
```

### Sanity Studio Access

1. Start the development server: `pnpm dev`
2. Access Sanity Studio at `http://localhost:3000/studio`
3. Sign in with your Sanity account
4. Configure admin preferences in "Paramètres du site" (Settings)

## 4. Development Server

```bash
# Standard development server
pnpm dev

# Development server with Turbopack (faster)
pnpm dev:turbo
```

Your application will be available at `http://localhost:3000`

## 5. Admin Configuration

### Language Preferences

1. Navigate to `http://localhost:3000`
2. Click on the user menu → "Configuration linguistique"
3. Configure multilingual settings:
   - Enable/disable multilingual mode
   - Select supported languages
   - Set default language

### Authentication Settings

1. Go to Sanity Studio: `http://localhost:3000/studio`
2. Navigate to "Paramètres d'authentification"
3. Configure OAuth providers and authentication behavior
4. Publish the document

## 6. Database Schema

### Core Tables

- **users**: User accounts and profiles
- **sessions**: Authentication sessions (Better Auth)
- **accounts**: OAuth account linkings
- **admin_preferences**: Multilingual and admin settings

### Test Users (Development)

The system includes pre-seeded test users:

```
admin@test.local      / testpass123 (Admin)
employee@test.local   / testpass123 (Employee)  
user1@test.local      / testpass123 (User)
user2@test.local      / testpass123 (User)
user3@test.local      / testpass123 (User)
```

## 7. OAuth Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project and enable Google Identity API
3. Create OAuth 2.0 credentials:
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
4. Add Client ID and Secret to `.env.local`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app and add "Facebook Login" product
3. Set redirect URI: `http://localhost:3000/api/auth/callback/facebook`
4. Add App ID and Secret to `.env.local`

## 8. Testing Setup

```bash
# Install Playwright browsers
npx playwright install

# Validate test structure
pnpm test:validate

# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run only authentication tests
pnpm test:auth
```

## 9. Production Deployment

### Build Process

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables for Production

Update your production environment with:

```env
# Production URLs
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"

# Secure secrets (generate new ones)
BETTER_AUTH_SECRET="production-secure-secret"

# OAuth redirect URIs updated for production domain
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **Railway**: Good for full-stack applications
- **Docker**: Use the included configuration

## 10. Verification Checklist

After setup, verify these work:

- [ ] Development server starts (`pnpm dev`)
- [ ] Database connection established (check `/profile` page)
- [ ] Sanity Studio accessible (`/studio`)
- [ ] Authentication works (sign up/in/out)
- [ ] Admin preferences save correctly
- [ ] Multilingual content displays properly
- [ ] Tests pass (`pnpm test:validate` and `pnpm test`)

## 11. Troubleshooting

### Common Issues

**Database Connection Error**
- Verify `DATABASE_URL` is correct
- Ensure database exists and is accessible
- Run `pnpm dlx prisma db push` to sync schema

**Sanity Studio Not Loading**
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Verify `SANITY_API_TOKEN` has write permissions
- Ensure Next.js dev server is running on port 3000

**Authentication Issues**
- Verify `BETTER_AUTH_SECRET` is set and secure
- Check OAuth credentials are correct
- Clear browser cookies and try again

**Build Errors**
- Run `pnpm dlx prisma generate` before building
- Ensure all environment variables are set
- Check TypeScript compilation with `pnpm exec tsc --noEmit`

### Useful Debug Commands

```bash
# Check Prisma connection
pnpm dlx prisma studio

# Validate environment
node -e "console.log(process.env.DATABASE_URL ? 'DB configured' : 'DB missing')"

# Check Sanity connection
curl "https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${NEXT_PUBLIC_SANITY_DATASET}?query=*[_type=='settings'][0]"
```

## 12. Next Steps

1. **Content Creation**: Add your restaurant content in Sanity Studio
2. **Styling**: Customize themes in `app/globals.css` and Tailwind config
3. **Features**: Explore the Clean Architecture features in `features/` directory
4. **Testing**: Add tests for your custom features in `tests/features/`
5. **Deployment**: Deploy to your preferred platform

## 13. Support Resources

- **Architecture Documentation**: [`docs/architecture/README.md`](./docs/architecture/README.md)
- **Authentication Guide**: [`AUTH.md`](./AUTH.md) 
- **Testing Guide**: [`tests/README.md`](./tests/README.md)
- **Clean Architecture**: Review feature implementations in `features/` directory

---

For additional help, check the detailed documentation in the `docs/` directory or examine the existing feature implementations.