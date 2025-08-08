# CLAUDE.md

## Project Overview

**Be Digital** is a Next.js 15 restaurant theme with Clean Architecture (Hexagonal), featuring e-commerce, multilingual support, and comprehensive order management.

### Core Technologies

- **Next.js 15** (App Router) + **TypeScript**
- **PostgreSQL** via **Prisma ORM** + **Neon Database**
- **Better Auth** for authentication
- **Sanity CMS** for content management (multilingual)
- **Tailwind CSS v4** + **shadcn/ui**
- **TanStack React Query** for server state
- **Zod** for validation + **Playwright** for testing

### Main Features

- **E-commerce**: Click-and-collect, Stripe/SumUp payments, order tracking
- **Multilingual**: Admin-configurable language support with automatic translation
- **Clean Architecture**: Domain-driven design with dependency injection
- **Order Management**: Unified orders from website, Uber Eats, Deliveroo
- **Customer Profiles**: Complete user management with favorites and history
- **Analytics Dashboard**: Real-time sales, reviews, and traffic statistics


## Essential Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm dev:turbo             # Start with Turbopack (faster)
pnpm build                 # Build for production
pnpm lint                  # ESLint check

# Database
pnpm dlx prisma generate   # Generate Prisma client
pnpm dlx prisma db push    # Apply schema changes
pnpm db:seed              # Seed database

# Testing
pnpm test                 # Run Playwright tests
pnpm test:auth           # Auth tests only
pnpm test:validate       # Validate test structure

# Initialization
pnpm init-singletons     # Setup Sanity singletons
pnpm init-translations   # Setup translations
```

## Architecture

### Clean Architecture (Hexagonal)

The project follows Clean Architecture with 4 layers across multiple features:

```
features/
├── auth/       # Authentication & user management
├── admin/      # Admin preferences & configuration  
├── home/       # Homepage content management
├── locale/     # Internationalization
└── products/   # E-commerce catalog & favorites
```

**Layer Structure** (each feature):
- **Domain**: Business entities, schemas, repository interfaces
- **Application**: Use cases, business orchestration
- **Infrastructure**: External implementations (Prisma, Sanity, APIs)
- **Presentation**: React hooks, UI state management

**Dependency Injection**: Each feature uses singleton containers for dependency management.

> 📚 **Full Documentation**: [`docs/architecture/README.md`](./docs/architecture/README.md)

### Internationalization

**Dual-approach multilingual system**:
- **Client-side**: localStorage-based language management (App Router compatible)
- **Admin-configurable**: Database preferences control CMS behavior  
- **Dynamic CMS**: Sanity fields adapt to admin language settings

**Language Priority**: User preference → Admin default → System default (`fr`)

**Supported**: 🇫🇷 French, 🇬🇧 English, 🇪🇸 Spanish, 🇩🇪 German, 🇮🇹 Italian, 🇵🇹 Portuguese, 🇸🇦 Arabic

### Directory Structure

```
app/                    # Next.js App Router
components/             # React components
├── ui/                # shadcn/ui components
├── auth/              # Authentication forms
└── navigation/        # Header, mobile menu
features/              # Clean Architecture features
├── auth/              # User authentication
├── admin/             # Admin preferences
├── home/              # Homepage content
├── locale/            # Internationalization
└── products/          # E-commerce catalog
sanity/                # Sanity CMS configuration
├── schemaTypes/       # Content schemas
└── lib/               # CMS utilities
lib/                   # Utilities, Prisma client
tests/                 # Playwright tests by feature
scripts/               # Setup & maintenance
```

## Key Systems

### Sanity CMS
- **Custom Types**: `adaptiveString`, `multilingualText`, `autoMultilingualString`
- **Image Optimization**: WebP conversion, responsive variants, quality control
- **Dynamic Interface**: CMS fields adapt to admin language preferences

### Authentication (Better Auth)
- **Clean Architecture**: Repository pattern with dependency injection
- **Features**: Email/password, OAuth (Google/Facebook), password reset
- **Security**: Server-side sessions, bcrypt hashing, CSRF protection

### Database (PostgreSQL + Prisma)
- **Core Tables**: users, sessions, accounts, admin_preferences
- **Clean Architecture**: Repository interfaces with Prisma implementations

### Testing (Playwright)
- **Feature-based**: Tests organized by business domain
- **Test Users**: Pre-seeded users for development and testing
- **Comprehensive**: E2E testing across auth flows and features

## Development Standards

### Code Quality
- **TypeScript**: Strict mode with comprehensive validation
- **Components**: shadcn/ui patterns, `forwardRef`, optional `className?: string`
- **Architecture**: Clean Architecture with dependency injection
- **Validation**: Zod schemas for all data structures
- **Styling**: `cn()` utility for conditional classes, mobile-first responsive

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE`

### Quality Checks (Before Commit)
```bash
pnpm exec tsc --noEmit    # TypeScript check
pnpm lint                 # ESLint check  
pnpm test:validate        # Test structure validation
```

### Best Practices
- **Server Components**: Prefer over Client Components
- **Data Fetching**: Server Components for initial load, React Query for client state
- **Clean Architecture**: Use dependency injection containers for features
- **Error Handling**: Comprehensive with Sentry integration
- **Testing**: Feature-based organization with shared helpers

## Important Notes

- **Multilingual Support**: System works in both mono/multilingual modes
- **Sanity Integration**: Studio requires Next.js running on port 3000
- **Clean Architecture**: Maintain strict layer separation across features  
- **Testing**: Feature-based organization with shared test utilities
- **Performance**: Always optimize images, implement loading states
- **Accessibility**: Include ARIA labels, alt text, semantic HTML

---

## Instructions for Claude Code

- **Focus**: Prioritize existing file editing over creating new files
- **Architecture**: Follow Clean Architecture patterns with dependency injection
- **Quality**: Run TypeScript check (`tsc --noEmit`) and ESLint before commits
- **Documentation**: Reference specific architecture docs in `docs/architecture/`
- **Setup**: Use `SETUP.md` for comprehensive installation guide
