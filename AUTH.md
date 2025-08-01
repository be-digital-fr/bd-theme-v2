# Authentication System Documentation

This document provides comprehensive information about the authentication system implemented in this Next.js 15 application using Better Auth.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup Guide](#setup-guide)
- [OAuth Configuration](#oauth-configuration)
- [Components](#components)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Overview

The authentication system provides:

- **Email/Password Authentication**: Traditional sign up/sign in flow
- **OAuth Social Login**: Google and Facebook integration (configurable)
- **Password Reset**: Forgot password and reset functionality
- **Session Management**: Secure server-side sessions with 7-day expiration
- **Multi-modal UI**: Both page-based and modal authentication flows
- **Admin Configuration**: Sanity CMS settings for authentication behavior
- **Enhanced Error Tracking**: Sentry integration for monitoring auth issues
- **Comprehensive Testing**: Playwright E2E tests for all auth flows

## Architecture

### Tech Stack

- **Better Auth v1.3.4**: Modern authentication framework for Next.js
- **Prisma ORM**: Database management with PostgreSQL
- **Sanity CMS**: Admin configuration for auth settings
- **Zod**: Schema validation for forms
- **React Hook Form**: Form management
- **Shadcn/UI**: UI components
- **Sentry**: Error tracking and monitoring

### Database Schema

The authentication system uses the following Prisma models:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  accounts      Account[]
  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  sessionToken String @unique
  userId    String
  expires   DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("sessions")
}

model Account {
  id                String  @id @default(cuid())
  accountId         String
  providerId        String
  userId            String
  accessToken       String?
  refreshToken      String?
  idToken           String?
  accessTokenExpiresAt DateTime?
  refreshTokenExpiresAt DateTime?
  scope             String?
  password          String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("accounts")
}
```

## Setup Guide

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-07-05"

# Sentry
SENTRY_DSN="your-sentry-dsn"
```

### 2. Database Setup

```bash
# Generate Prisma client
pnpm dlx prisma generate

# Apply database schema
pnpm dlx prisma db push

# Seed test users (optional)
pnpm db:seed
```

### 3. Sanity Configuration

Configure authentication settings in Sanity Studio:
1. Navigate to "Paramètres d'authentification" (Auth Settings)
2. Configure behavior, OAuth providers, and UI settings
3. Publish the document

## OAuth Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API or Google Identity API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret to your `.env.local`

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://yourdomain.com/api/auth/callback/facebook`
5. Copy App ID and App Secret to your `.env.local`

### Enabling OAuth in Admin Panel

1. Set environment variables for the providers you want to enable
2. In Sanity Studio, go to Auth Settings
3. Enable the desired providers (Google, Facebook, etc.)
4. The OAuth buttons will automatically appear in auth forms

## Components

### Core Components

#### AuthButton (`components/auth/auth-button.tsx`)
Shows user icon when not authenticated. Handles modal vs page redirection based on admin settings.

```tsx
<AuthButton 
  authSettings={authSettings}
  isHeaderLoading={isLoading}
/>
```

#### UserMenu (`components/auth/user-menu.tsx`)
Shows user avatar/initials and dropdown menu when authenticated.

```tsx
<UserMenu />
```

### Form Components

#### SignInForm (`components/auth/sign-in-form.tsx`)
Email/password sign in with OAuth options.

```tsx
<SignInForm 
  authSettings={authSettings}
  callbackUrl="/dashboard"
  onSuccess={() => console.log('Success')}
/>
```

#### SignUpForm (`components/auth/sign-up-form.tsx`)
User registration with validation.

```tsx
<SignUpForm 
  authSettings={authSettings}
  callbackUrl="/dashboard"
/>
```

#### ForgotPasswordForm (`components/auth/forgot-password-form.tsx`)
Password reset request form.

#### ResetPasswordForm (`components/auth/reset-password-form.tsx`)
New password setting form (accessed via reset link).

### Utility Components

#### SocialAuthButtons (`components/auth/social-auth-buttons.tsx`)
OAuth provider buttons with loading states.

#### AuthErrorBoundary (`components/auth/auth-error-boundary.tsx`)
Error boundary for auth-related errors with Sentry integration.

#### AuthModal (`components/auth/auth-modal.tsx`)
Modal wrapper for authentication forms.

### Guards

#### AuthGuard (`components/auth/auth-guard.tsx`)
Protects routes that require authentication.

```tsx
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

#### GuestGuard (`components/auth/auth-guard.tsx`)
Redirects authenticated users away from auth pages.

```tsx
<GuestGuard>
  <AuthComponent />
</GuestGuard>
```

## API Reference

### Client-Side Functions

```typescript
import { 
  authClient, 
  signInWithGoogle, 
  signInWithFacebook,
  useSession 
} from '@/lib/auth-client';

// Email/Password Sign In
const { data, error } = await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password123',
  callbackURL: '/dashboard'
});

// OAuth Sign In
await signInWithGoogle();
await signInWithFacebook();

// Sign Up
const { data, error } = await authClient.signUp.email({
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123',
  callbackURL: '/dashboard'
});

// Sign Out
await authClient.signOut();

// Password Reset
const { error } = await authClient.forgetPassword({
  email: 'user@example.com',
  redirectTo: '/auth/reset-password'
});

// Reset Password
const { error } = await authClient.resetPassword({
  newPassword: 'newpassword123',
  token: 'reset-token'
});

// Use Session Hook
const { data: session, isPending } = useSession();
```

### Server-Side Functions

```typescript
import { getCurrentSession, requireAuth } from '@/lib/auth-actions';

// Get current session
const session = await getCurrentSession();

// Require authentication (throws if not authenticated)
const user = await requireAuth();

// Sign out action
await signOutAction();
```

### Validation Schemas

```typescript
import { 
  signInSchema, 
  signUpSchema, 
  forgotPasswordSchema,
  resetPasswordSchema 
} from '@/lib/auth-schemas';

// All schemas include comprehensive validation with French error messages
```

## Testing

### Test Users

The system includes 5 pre-seeded test users:

```typescript
const TEST_USERS = {
  admin: {
    email: 'admin@test.local',
    password: 'testpass123',
    name: 'Admin User',
    role: 'admin'
  },
  employee: {
    email: 'employee@test.local', 
    password: 'testpass123',
    name: 'Employee User',
    role: 'employee'
  },
  user1: {
    email: 'user1@test.local',
    password: 'testpass123',
    name: 'John Doe',
    role: 'user'
  },
  user2: {
    email: 'user2@test.local',
    password: 'testpass123', 
    name: 'Jane Smith',
    role: 'user'
  },
  user3: {
    email: 'user3@test.local',
    password: 'testpass123',
    name: 'Bob Johnson', 
    role: 'user'
  }
};
```

### Running Tests

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
npx playwright install

# Seed test users
pnpm db:seed

# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in headed mode
pnpm test:headed
```

### Test Utilities

```typescript
import { 
  signInWithPage,
  signInWithModal, 
  signUp,
  signOut,
  clearAuth,
  isAuthenticated,
  waitForAuthState
} from '@/tests/utils/auth';

// Example usage in tests
await signInWithPage(page, TEST_USERS.admin);
await signOut(page);
```

## Error Handling

### Sentry Integration

The system includes comprehensive error tracking:

```typescript
import { 
  captureAuthError, 
  AuthErrorType,
  setAuthUserContext,
  clearAuthUserContext,
  trackOAuthAttempt,
  trackSessionEvent
} from '@/lib/sentry-auth';

// Capture auth-specific errors
captureAuthError(
  error,
  AuthErrorType.SIGNIN_FAILED,
  { email: 'user@example.com', provider: 'google' }
);

// Set user context
setAuthUserContext({
  id: user.id,
  email: user.email,
  name: user.name
});

// Track OAuth attempts
trackOAuthAttempt('google', true);
trackOAuthAttempt('facebook', false, 'Access denied');

// Track session events
trackSessionEvent('created', userId);
trackSessionEvent('expired', userId);
```

### Error Types

- `SIGNIN_FAILED`: Login attempt failed
- `SIGNUP_FAILED`: Registration failed
- `OAUTH_FAILED`: Social login failed
- `TOKEN_EXPIRED`: Session/token expired
- `SESSION_ERROR`: Session management error
- `PASSWORD_RESET_FAILED`: Password reset failed
- `UNAUTHORIZED_ACCESS`: Access to protected resource denied

### Error Boundary

Wrap auth components with `AuthErrorBoundary` for graceful error handling:

```tsx
<AuthErrorBoundary>
  <AuthComponent />
</AuthErrorBoundary>
```

## Security

### Session Management

- **Server-side sessions**: Sessions are stored server-side for security
- **7-day expiration**: Sessions expire after 7 days of inactivity
- **Auto-refresh**: Sessions refresh automatically with activity
- **Secure cookies**: HTTPONLY, Secure, SameSite cookies

### Password Security

- **Minimum 8 characters**: Enforced client and server-side
- **Complexity requirements**: Must include uppercase, lowercase, and number
- **Bcrypt hashing**: Passwords hashed with bcrypt (12 rounds)
- **No plain text storage**: Passwords never stored in plain text

### OAuth Security

- **State parameter**: CSRF protection for OAuth flows
- **Secure redirects**: Whitelist of allowed redirect URLs
- **Token validation**: OAuth tokens validated server-side
- **Scope limitation**: Minimal required scopes requested

### Data Protection

- **Input validation**: All inputs validated with Zod schemas
- **SQL injection protection**: Prisma ORM prevents SQL injection
- **XSS protection**: Next.js built-in XSS protection
- **CSRF protection**: Better Auth includes CSRF protection

## Troubleshooting

### Common Issues

#### 1. "Database connection failed"
- Check `DATABASE_URL` environment variable
- Ensure PostgreSQL is running
- Verify database exists and credentials are correct

#### 2. "OAuth redirect_uri_mismatch"
- Verify OAuth provider redirect URLs match exactly
- Check both development and production URLs
- Ensure no trailing slashes in URLs

#### 3. "Session not found"
- Clear browser cookies and localStorage
- Check `BETTER_AUTH_SECRET` environment variable
- Restart development server

#### 4. "Social login buttons not showing"
- Verify OAuth environment variables are set
- Check Sanity admin settings for enabled providers
- Ensure both client ID and secret are configured

#### 5. "Email already exists"
- User trying to sign up with existing email
- Direct them to sign in page instead
- Check for account linking if using OAuth

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=better-auth:*
```

### Monitoring

Sentry provides real-time error monitoring and alerts:

1. **Error Tracking**: All auth errors automatically captured
2. **Performance Monitoring**: Track auth operation performance
3. **User Context**: Errors include user information for debugging
4. **Custom Tags**: Auth-specific tags for filtering and alerting

### Support

For additional support:

1. Check [Better Auth Documentation](https://better-auth.com)
2. Review [Playwright Testing Guide](https://playwright.dev/docs/intro)
3. Consult [Sentry Integration Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
4. Check application logs and Sentry dashboard for specific errors

---

*This documentation covers the complete authentication system. For component-specific details, refer to the inline code documentation and TypeScript definitions.*