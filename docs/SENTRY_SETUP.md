# Sentry Configuration for Next.js 15

This guide explains how to configure and use Sentry for error monitoring and performance tracking in your Next.js 15 application.

## 🚀 Installation

Dependencies are already installed:
```bash
pnpm add @sentry/nextjs @sentry/webpack-plugin
```

## 📝 Environment Variables Configuration

### 1. Create a Sentry Account

1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new organization and project
3. Get your DSN from Project Settings → Client Keys (DSN)

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Sentry Configuration (REQUIRED)
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# For source maps upload (OPTIONAL in dev)
SENTRY_ORG="your-org-slug"
SENTRY_PROJECT="your-project-name"
SENTRY_AUTH_TOKEN="your-auth-token"

# Release tracking (OPTIONAL)
SENTRY_RELEASE="v1.0.0"
NEXT_PUBLIC_SENTRY_RELEASE="v1.0.0"

# Control flags
ENABLE_SENTRY="true"                    # Enable Sentry server-side
NEXT_PUBLIC_ENABLE_SENTRY="true"        # Enable Sentry client-side
```

### 3. How to Find Your Sentry Information

#### SENTRY_ORG
- In URL: `https://sentry.io/organizations/[YOUR_ORG]/`
- Or: Organization Settings → General → Organization Slug

#### SENTRY_PROJECT
- Project Settings → General → Name
- Or in project URL

#### SENTRY_AUTH_TOKEN
1. User Settings → Auth Tokens → Create New Token
2. Required scopes:
   - `project:read`
   - `project:releases`
   - `project:write`
   - `org:read`

#### SENTRY_RELEASE
Release is a unique identifier for your deployment. Several options:

**Option 1 - Manual version:**
```env
SENTRY_RELEASE="v1.2.3"
```

**Option 2 - Git commit (recommended):**
```bash
# In your CI/CD or build script
export SENTRY_RELEASE=$(git rev-parse HEAD)
```

**Option 3 - Package.json version:**
```bash
export SENTRY_RELEASE=$(node -p "require('./package.json').version")
```

**Option 4 - Date/timestamp:**
```bash
export SENTRY_RELEASE="$(date +%Y%m%d-%H%M%S)"
```

**In Vercel/Netlify:**
- Vercel: `VERCEL_GIT_COMMIT_SHA` (automatic)
- Netlify: `COMMIT_REF` (automatic)

**Why it matters:**
- Associates errors with specific version
- Enables regression tracking
- Helps identify problematic releases

## 🔧 File Architecture

```
├── sentry.client.config.ts    # Client-side configuration
├── sentry.server.config.ts    # Server-side configuration
├── instrumentation.ts         # Next.js 15 hook
├── app/global-error.tsx       # Global error handling
└── lib/sentry-utils.ts        # Helper utilities
```

## 📊 Active Features

### Automatic Monitoring
- ✅ Client and server-side errors
- ✅ Server Actions errors
- ✅ API routes errors
- ✅ React component errors
- ✅ Performance monitoring
- ✅ Session replay (sampled)

### Build Optimizations
- ✅ Source maps uploaded in production only
- ✅ Tree-shaking (Sentry code excluded in dev)
- ✅ Optimized bundle
- ✅ Automatic file cleanup

## 🛠️ Usage in Your Code

### Manual Error Capture

```typescript
import { captureError } from '@/lib/sentry-utils';

try {
  // Your code
} catch (error) {
  captureError(error, { 
    userId: user.id,
    context: 'payment-processing' 
  });
}
```

### Messages and Breadcrumbs

```typescript
import { captureMessage, addBreadcrumb } from '@/lib/sentry-utils';

// Info logging
captureMessage('User logged in', 'info');

// Add context
addBreadcrumb('Button clicked', 'ui', { buttonId: 'submit' });
```

### User Context

```typescript
import { setUserContext } from '@/lib/sentry-utils';

setUserContext({
  id: user.id,
  email: user.email,
  username: user.username
});
```

### Performance Measurement

```typescript
import { measurePerformance } from '@/lib/sentry-utils';

const result = await measurePerformance('database-query', async () => {
  return await db.user.findMany();
});
```

## 🔄 Environment Management

### Development
- Sentry can be disabled with `ENABLE_SENTRY=false`
- Debug mode enabled for more logs
- Source maps not uploaded

### Production
- Performance sampling (10%)
- Source maps uploaded and deleted
- Session replay enabled
- Non-critical error filtering

## 🚨 Automatic Error Handling

### Global Error Boundary
The `app/global-error.tsx` file automatically captures all unhandled errors and sends them to Sentry.

### Server Actions
```typescript
// In your Server Actions
export async function createUser(formData: FormData) {
  try {
    // Business logic
  } catch (error) {
    // Automatically captured by Sentry
    throw error;
  }
}
```

### API Routes
```typescript
// In your API routes
export async function POST(request: Request) {
  try {
    // API logic
  } catch (error) {
    // Automatically captured by Sentry
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## 📈 Performance Monitoring

### Automatic Transactions
- Page navigation
- API requests
- Component rendering
- User interactions

### Collected Metrics
- Core Web Vitals (LCP, FID, CLS)
- Loading times
- JavaScript errors
- Network errors

## 🔒 Security and Privacy

### Automatically Filtered Data
- Passwords
- Authentication tokens
- Sensitive PII data

### Privacy Configuration
```typescript
// In sentry.client.config.ts
replaysSessionSampleRate: 0.1,  // 10% of sessions
maskAllText: true,              // Mask text in production
blockAllMedia: true,            // Block media in production
```

## 🐛 Troubleshooting

### Sentry Not Working
1. Check that `SENTRY_DSN` is correctly configured
2. Check that `ENABLE_SENTRY` is not set to `false`
3. Check console logs in debug mode

### Source Maps Not Uploaded
1. Check `SENTRY_AUTH_TOKEN`
2. Check `SENTRY_ORG` and `SENTRY_PROJECT`
3. Make sure you're in production mode

### Too Many Errors Captured
1. Adjust filters in `beforeSend`
2. Reduce `tracesSampleRate`
3. Configure alert rules in Sentry

## 📝 Integration Examples

### With React Hook Form
```typescript
const {
  handleSubmit,
  formState: { errors }
} = useForm({
  onError: (errors) => {
    captureMessage('Form validation failed', 'warning');
  }
});
```

### With TanStack Query
```typescript
const query = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  onError: (error) => {
    captureError(error, { query: 'fetchUsers' });
  }
});
```

### With Prisma
```typescript
try {
  const user = await prisma.user.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    captureError(error, { 
      operation: 'user.create',
      errorCode: error.code 
    });
  }
  throw error;
}
```

## 🚀 Deployment

### Required Environment Variables
```env
# Production only
SENTRY_DSN=your-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token
SENTRY_RELEASE=your-release
ENABLE_SENTRY=true
```

### Production Build
```bash
pnpm build
```

Source maps will be automatically uploaded if environment variables are configured.

## 📚 Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Advanced Configuration](https://docs.sentry.io/platforms/javascript/configuration/)
- [Sentry Dashboard](https://sentry.io)

---

**Note:** This configuration is optimized for Next.js 15 with App Router and follows performance and security best practices.