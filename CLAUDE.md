# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands

- `pnpm dlx prisma generate` - Generate Prisma client
- `pnpm dlx prisma db push` - Apply database schema changes
- `pnpm dlx prisma studio` - Open Prisma Studio for database management

## Project Architecture

This is a multilingual Next.js 15 application built with the App Router, featuring a sophisticated internationalization system with Sanity CMS integration.

### Core Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Database**: Prisma ORM with Neon PostgreSQL
- **CMS**: Sanity for content management with custom multilingual components
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Validation**: Zod schemas for type-safe validation

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
- `sanity/` - Sanity CMS configuration and custom components
- `lib/` - Utilities, Prisma client, schemas
- `hooks/` - Custom React hooks for data fetching
- `prisma/` - Database schema and migrations

## Sanity CMS Integration

### Custom Multilingual Types

- `adaptiveString` & `adaptiveText` - Fields that adapt to language preferences but store single values
- `multilingualString` & `multilingualText` - Fields that store all languages as objects

### Dynamic Component System

The `DynamicWelcomingInput` component automatically adapts Sanity Studio interface based on admin preferences:

- **Monolingual Mode**: Single input field
- **Multilingual Mode**: Input field for each configured language

### Content Structure

Admin preferences are stored in PostgreSQL and determine how Sanity content is structured and displayed.

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

### API Routes

- Located in `app/api/`
- Use proper error handling with try/catch
- Return appropriate HTTP status codes
- Validate input with Zod schemas

### Data Fetching

- Use Server Components for initial data loading
- Use TanStack React Query for client-side data management
- Custom hooks in `hooks/` directory for reusable data logic

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

## Testing and Quality

### Before Committing

- TypeScript compilation must pass
- ESLint warnings must be addressed
- Ensure responsive design works
- Test both monolingual and multilingual modes

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

## Common Tasks

1. **Adding a new language**: Update `SUPPORTED_LOCALES` in relevant files
2. **Creating adaptive content**: Use `adaptiveString` or `adaptiveText` types in Sanity schemas
3. **Testing multilingual features**: Use admin preferences modal to switch between modes
4. **Database changes**: Always run `pnpm dlx prisma generate` after schema updates

## Important Notes

- The system is designed to work both in monolingual and multilingual modes
- Sanity Studio interface changes require the Next.js app to be running on port 3000
- Language preferences are cached and may require browser refresh after changes
- Always test with different language configurations to ensure proper functionality
