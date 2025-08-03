# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. General Overview

**Be Digital** is a Next.js theme designed for restaurants and food businesses to digitize their operations.  
It is **SEO optimized**, follows a **Clean Architecture** (Hexagonal Architecture), and includes **complete e-commerce solutions** (click-and-collect, online payments, order management).

### Main Technologies

- **Next.js 15** (App Router)
- **Neon (PostgreSQL) via Prisma**
- **Better Auth** for authentication with Clean Architecture implementation
- **Sanity** for text & image content (multilingual)
- **Stripe & SumUp** for payments
- **Uber Eats & Deliveroo integrations** to centralize orders
- **Tailwind CSS v4** with shadcn/ui components
- **Zod** for TypeScript validation
- **Playwright** for testing
- **TanStack React Query** for server state management

---

## 2. Main Pages

- **Home**
- **Menu (products)**
- **About**
- **Blog**
- **Contact**
- **E-commerce pages**: cart, checkout, order tracking
- **Authentication pages**: login, signup, password reset
- **Admin dashboard**

---

## 3. Key Features

### A. E-commerce & Orders

1. **Click-and-Collect** with the ability to choose the pick-up restaurant.
2. **Secure online payments** (Stripe, SumUp) and **cash payment on pick-up**.
   - Security features to avoid abuse (block repeat offenders).
3. **Real-time order management** with a "Rush Hour" type system to visualize orders and their status.
4. **Order aggregation** from the website, Uber Eats, and Deliveroo into a **single interface**.

---

### B. Customer Experience

1. **Complete customer profiles**:
   - Personal information
   - Order history
   - Payment methods and delivery addresses
   - Newsletter subscriptions and favorites
   - Ability to delete account
2. **Multilingual support** enabled by the admin (automatic translation via Sanity).
3. **Promotional banners**: fully customizable and can be activated/deactivated by the admin.

---

### C. Gamification & Marketing

1. **Interactive games** to engage and retain customers:
   - Wheel of Fortune
   - Flavor Memory Game (later release)
   - Bubble Click
   - Scratch & Win
   - Virtual Archery
2. **QR code integration**: customers scan codes to play after completing an action (leave a review, place an order, etc.).
3. **Coupon & discount system** linked directly to games and customer loyalty.
4. **Integrated email marketing** for campaigns and customer engagement.

---

### D. Customer Reviews Management

1. Collect and moderate customer reviews.
2. Public display of reviews on the website.
3. Direct integration with **Google Reviews**.

---

### E. Reservations

1. **Built-in reservation system**:
   - Table selection and dietary preferences
   - Ability to pre-order meals
2. Manage availability directly from the dashboard.

---

### F. Analytics Dashboard (Top Priority)

1. Real-time statistics on:
   - Sales and orders
   - Customer reviews
   - Website traffic
   - Marketing campaign performance
2. Intuitive visualization (charts, KPIs).


## Development Commands

### Core Commands

- `pnpm dev` - Start development server (standard mode)
- `pnpm dev:turbo` - Start development server with Turbopack (faster)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands

- `pnpm dlx prisma generate` - Generate Prisma client
- `pnpm dlx prisma db push` - Apply database schema changes
- `pnpm dlx prisma studio` - Open Prisma Studio for database management
- `pnpm db:seed` - Seed database with initial data

### Testing Commands

- `pnpm test` - Run all Playwright tests
- `pnpm test:ui` - Run tests with Playwright UI mode
- `pnpm test:headed` - Run tests in headed mode (visible browser)
- `pnpm test:auth` - Run authentication tests only
- `pnpm test:auth:ui` - Run auth tests with UI mode
- `pnpm test:validate` - Validate test structure

### Development Utilities

- `pnpm init-singletons` - Initialize Sanity singleton documents
- `pnpm init-translations` - Initialize translation documents
- `pnpm init-hero-banner` - Initialize hero banner content
- `pnpm check-home` - Check home document structure

## Project Architecture

This is a multilingual Next.js 15 application built with the App Router, featuring a sophisticated internationalization system with Sanity CMS integration and **Clean Architecture** (Hexagonal Architecture) implementation.

### Core Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Database**: Prisma ORM with Neon PostgreSQL
- **CMS**: Sanity for content management with custom multilingual components
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Validation**: Zod schemas for type-safe validation

### Clean Architecture Implementation

The project follows Clean Architecture principles with clear separation of concerns across multiple features:

#### Directory Structure by Feature
```
features/
├── auth/                    # Authentication feature
├── admin/                   # Admin preferences
├── home/                    # Home content
└── locale/                  # Internationalization
```

#### Layer Organization (within each feature)
```
feature/
├── domain/                  # Business logic (innermost layer)
│   ├── entities/           # Business entities
│   ├── schemas/            # Zod validation schemas
│   ├── repositories/       # Repository interfaces
│   └── services/          # Service interfaces
├── application/            # Use cases (application layer)
│   └── use-cases/         # Business use cases
├── infrastructure/         # External dependencies (outermost layer)
│   ├── repositories/      # Repository implementations
│   ├── services/         # Service implementations
│   └── di/               # Dependency injection containers
└── presentation/          # UI layer
    └── hooks/            # React hooks for UI components
```

#### Dependency Injection Containers

Each feature uses a singleton container pattern for dependency injection:

- **AuthContainer**: Manages authentication dependencies
- **AdminContainer**: Manages admin preferences dependencies  
- **HomeContainer**: Manages home content dependencies
- **LocaleContainer**: Manages localization dependencies

#### Key Clean Architecture Patterns

1. **Domain Independence**: Domain layer has no dependencies on external frameworks
2. **Interface Segregation**: Repository and service interfaces define contracts
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **Use Case Pattern**: Each business operation is encapsulated in a use case
5. **Entity Design**: Business entities contain validation and business rules

### Internationalization System

The project implements a unique dual-approach multilingual system:

1. **Client-side Language Management**: Uses localStorage-based localization (Next.js i18n is not supported in App Router)
2. **Admin-configurable Preferences**: Database-stored preferences for multilingual content management
3. **Dynamic Sanity Components**: CMS fields adapt based on admin preferences

### Language Resolution Priority

1. User preferred language from localStorage/session (highest priority)
2. Admin default language from preferences
3. System default (`fr`)

**Note**: The system has moved away from Next.js i18n to a localStorage-based approach since i18n is not supported in App Router.

### Key Directories

- `app/` - Next.js App Router with internationalization
- `components/` - React components including UI library
  - `ui/` - shadcn/ui base components (Button, Card, Dialog, Container, etc.)
  - `auth/` - Authentication-specific components  
  - `navigation/` - Header and navigation components
  - `hero-banner.tsx` - Main hero banner component with Sanity integration
- `features/` - Clean Architecture features (auth, admin, home, locale)
- `sanity/` - Sanity CMS configuration and custom components
  - `lib/image.ts` - Image optimization utilities with urlFor
  - `schemaTypes/` - Content type definitions
- `lib/` - Utilities, Prisma client, schemas
- `hooks/` - Custom React hooks for data fetching
- `prisma/` - Database schema and migrations
- `tests/` - Playwright tests organized by features
- `scripts/` - Utility scripts for initialization and maintenance

## Sanity CMS Integration

### Custom Multilingual Types

- `adaptiveString` & `adaptiveText` - Fields that adapt to language preferences but store single values
- `multilingualString` & `multilingualText` - Fields that store all languages as objects
- `autoMultilingualString` & `autoMultilingualText` - Fields with automatic translation capabilities

### Image Optimization System

The project implements a sophisticated image optimization system:

- **Sanity Image Types**: All images use proper Sanity image objects instead of strings
- **WebP Conversion**: Automatic conversion to WebP format for performance
- **Quality Control**: Configurable quality settings (85% for content, 75% for backgrounds)
- **Responsive Images**: Separate desktop and mobile image variants
- **No Dimension Constraints**: Images maintain their natural proportions

### Dynamic Component System

The `DynamicWelcomingInput` component automatically adapts Sanity Studio interface based on admin preferences:

- **Monolingual Mode**: Single input field
- **Multilingual Mode**: Input field for each configured language

### Content Structure

Admin preferences are stored in PostgreSQL and determine how Sanity content is structured and displayed.

### Hero Banner Implementation

The hero banner system includes:
- **Responsive Background Images**: Separate images for desktop and mobile
- **Optimized Content Images**: Hero images with proper alt text and accessibility
- **Call-to-Action Buttons**: Primary and secondary buttons with configurable URLs
- **Multilingual Content**: Title, description, and button text with translation support

## Database Schema

### Core Tables

- `admin_preferences` - Stores multilingual configuration
  - `isMultilingual` - Toggle between mono/multilingual modes
  - `supportedLanguages` - Array of enabled language codes
  - `defaultLanguage` - Fallback language

## Environment Setup

Required environment variables (see `SETUP.md`):

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SANITY_PROJECT_ID="..."
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-07-05"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Development Patterns

### Component Architecture

- Use TypeScript strict mode
- Follow shadcn/ui patterns for components
- Prefer Server Components over Client Components
- Use `forwardRef` for components that need ref passing
- Component props interfaces always include optional `className?: string`
- Use `cn()` utility from `@/lib/utils` for conditional styling

### API Routes

- Located in `app/api/`
- Use proper error handling with try/catch
- Return appropriate HTTP status codes
- Validate input with Zod schemas
- Better Auth routes use CORS handling for cross-origin requests

### Data Fetching

- Use Server Components for initial data loading
- Use TanStack React Query for client-side data management
- Custom hooks in `hooks/` directory for reusable data logic
- Clean Architecture features use dependency injection containers
- Presentation hooks call use cases through containers

### Authentication Architecture

The authentication system follows Clean Architecture with Better Auth integration:

#### Domain Layer
- **User Entity**: Contains user validation and business rules
- **Schemas**: Separate UI schemas (with confirmPassword) from domain schemas
- **Repository Interfaces**: Define contracts for auth operations

#### Application Layer  
- **Use Cases**: SignIn, SignUp, SignOut, GetCurrentUser, ResetPassword
- **Either Pattern**: Use cases return `{ success: boolean; data?: T; error?: AuthError }`

#### Infrastructure Layer
- **BetterAuthRepository**: Implements auth operations using Better Auth
- **ApiAuthRepository**: Alternative implementation for API-based auth
- **ConsoleEmailService**: Development email service implementation

#### Presentation Layer
- **React Hooks**: useSignIn, useSignUp, useSignOut, useCurrentUser
- **Components**: Form components handle UI concerns (validation, loading states)
- **Error Handling**: UI-friendly error messages with loading states

## Code Style Guidelines

### From Cursor Rules

- Use strict TypeScript configuration
- Follow Atomic Design principles
- Mobile-first responsive design
- Use `cn()` utility for conditional classes
- Prefer composition over inheritance

### File Naming

- Components: PascalCase (e.g., `MenuCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase with descriptive names

## Testing Architecture

### Playwright Testing

The project uses feature-based test organization:

```
tests/
├── features/
│   └── auth/              # Authentication tests
│       ├── signin.spec.ts
│       ├── signup.spec.ts
│       └── password-reset.spec.ts
├── shared/
│   ├── helpers/          # Reusable test utilities
│   ├── fixtures/         # Test data fixtures
│   └── config/          # Test configuration
└── validate-structure.js  # Test structure validation
```

### Test Patterns

- **Feature-based Organization**: Tests grouped by business feature
- **Shared Helpers**: Reusable functions for common test operations
- **Dynamic Email Generation**: Prevents test conflicts with unique emails
- **Page Object Pattern**: Test helpers encapsulate page interactions
- **Responsive Testing**: Tests verify mobile and desktop layouts

### Quality Checks

Before committing, ensure:
- `pnpm exec tsc --noEmit` - TypeScript compilation passes
- `pnpm lint` - ESLint warnings addressed  
- `pnpm test:validate` - Test structure is valid
- Test both monolingual and multilingual modes
- Responsive design works across breakpoints

## Special Features

### Client-side Language Switching

- Language preference stored in localStorage/session
- Language selector components with flags and native names
- Dynamic content loading based on selected language

### Admin Configuration Interface

- Modal-based preferences configuration
- Real-time updates to Sanity Studio interface
- Multi-select language picker

### Sanity Studio Customization

- Custom input components that adapt to preferences
- Dynamic schema types based on configuration
- Integration with Next.js API for preference fetching

## Common Development Tasks

### Adding New Features with Clean Architecture

1. **Create feature directory structure**:
   ```bash
   mkdir -p features/[feature-name]/{domain/{entities,schemas,repositories,services},application/use-cases,infrastructure/{repositories,services,di},presentation/hooks}
   ```

2. **Follow the layer dependencies**: Domain ← Application ← Infrastructure → Presentation

3. **Use dependency injection**: Create a container in `infrastructure/di/` and register dependencies

### Component Development

1. **UI Components**: Add to `components/ui/` following shadcn/ui patterns
2. **Feature Components**: Group by domain in `components/[feature-name]/`
3. **Always include TypeScript interfaces** with optional `className?: string`
4. **Use responsive design patterns**: Mobile-first with `lg:` prefixes for desktop
5. **Implement Zod validation**: Create schemas for props and validate at runtime
6. **Add comprehensive JSDoc comments**: Document complex components and functions
7. **Use forwardRef pattern**: For components that need ref passing to DOM elements

### Database Operations

1. **Schema changes**: Modify `prisma/schema.prisma` then run `pnpm dlx prisma generate`
2. **Database sync**: Run `pnpm dlx prisma db push` to apply changes
3. **Seeding**: Add seed data in `prisma/seed.ts` and run `pnpm db:seed`

### Internationalization

1. **Adding a new language**: Update `SUPPORTED_LOCALES` in relevant files
2. **Creating adaptive content**: Use `adaptiveString`, `adaptiveText`, or `autoMultilingualString` types in Sanity schemas
3. **Testing multilingual features**: Use admin preferences modal to switch between modes
4. **Image optimization**: Use Sanity image types with proper fallbacks for all visual content
5. **Content validation**: Implement Zod schemas for multilingual content structures

### Testing New Features

1. **Create feature tests**: Add to `tests/features/[feature-name]/`
2. **Use shared helpers**: Leverage existing utilities in `tests/shared/helpers/`
3. **Generate dynamic test data**: Use helper functions to avoid test conflicts
4. **Validate test structure**: Run `pnpm test:validate` after organizing tests

## Important Notes

- The system is designed to work both in monolingual and multilingual modes
- Sanity Studio interface changes require the Next.js app to be running on port 3000
- Language preferences are cached and may require browser refresh after changes
- Always test with different language configurations to ensure proper functionality
- Clean Architecture features should maintain strict layer separation
- Use dependency injection containers for feature dependencies
- Authentication system uses Better Auth with Clean Architecture wrappers
- Tests are organized by feature for better maintainability

## Recent Architectural Improvements

### Clean Architecture Implementation (2025)

The codebase has been refactored to follow Clean Architecture principles:

- **Authentication Feature**: Complete implementation with domain entities, use cases, repositories, and presentation hooks
- **Dependency Injection**: Singleton containers manage feature dependencies
- **Layer Separation**: Clear boundaries between domain, application, infrastructure, and presentation
- **Better Auth Integration**: Clean Architecture wrapper around Better Auth library
- **Error Handling**: Consistent error patterns across all features using Either-like patterns

### Testing Architecture (2025)

- **Feature-based Organization**: Tests grouped by business domain rather than technical concerns
- **Shared Test Utilities**: Reusable helpers, fixtures, and configuration
- **Dynamic Test Data**: Email generation and user creation to prevent test conflicts
- **Validation Scripts**: Automated validation of test structure and organization

### Hero Banner System (2025)

The hero banner represents a complete implementation of modern component architecture:

- **Clean Architecture Integration**: Full separation of concerns with domain schemas, use cases, and presentation hooks
- **Sanity CMS Integration**: Advanced image optimization without dimension constraints
- **Zod Validation**: Runtime prop validation with TypeScript type inference
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility Features**: Comprehensive ARIA labels, roles, and semantic markup
- **Performance Optimization**: WebP conversion, quality control, and image preloading

## Development Standards

### Code Quality Requirements

1. **TypeScript**: Use strict mode with comprehensive type safety
2. **Validation**: Implement Zod schemas for all data structures and props
3. **Comments**: Use English for all comments and documentation
4. **Architecture**: Follow Clean Architecture with proper layer separation
5. **Performance**: Optimize images, implement loading states, use proper caching
6. **Accessibility**: Include ARIA labels, alt text, and semantic HTML
7. **Testing**: Write tests for complex logic and user interactions

### Commit Message Standards

Follow this format for commit messages:
```
feat: brief description of changes

- Bullet point for major change 1
- Bullet point for major change 2
- Include performance improvements
- Note accessibility enhancements
- Mention architectural improvements

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Image Handling Best Practices

1. **Always use Sanity image types** instead of string URLs
2. **Implement image optimization** with `urlFor` from `@sanity/lib/image`
3. **Convert to WebP format** for performance benefits
4. **Never hard-code dimensions** - let images maintain natural proportions
5. **Provide fallback images** for development and error states
6. **Include proper alt text** for accessibility compliance
7. **Use blur placeholders** for better loading experience

### Container and Layout Patterns

- Use the `Container` component for consistent max-width layouts
- Implement responsive design with mobile-first approach
- Use CSS Grid and Flexbox for complex layouts
- Ensure touch-friendly interfaces on mobile devices
- Test across different screen sizes and orientations
