# Base Theme App - Cursor Rules Configuration

## 🏗️ ARCHITECTURE OVERVIEW

This is a Next.js 15 restaurant application with the following stack:

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, Neon PostgreSQL
- **Auth**: Better Auth
- **CMS**: Sanity for content and images
- **Payments**: Stripe & SumUp (admin configurable)
- **State**: Zustand for client state management
- **Styling**: Tailwind CSS with custom design system

## 📁 PROJECT STRUCTURE

```
bd-theme/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalization
│   ├── api/               # API routes
│   └── globals.css
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── features/         # Feature-specific components
│   └── common/           # Common utilities
├── lib/                  # Utilities and configurations
│   ├── auth/            # Better Auth config
│   ├── database/        # Prisma client
│   ├── cms/             # Sanity client
│   ├── payments/        # Stripe & SumUp
│   └── utils/           # General utilities
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── types/               # TypeScript definitions
└── styles/              # Global styles
```

## 🎯 CODING GUIDELINES

### TypeScript Best Practices

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Use proper typing for API responses and database schemas
- Prefer `type` over `interface` for unions and primitives
- Use `interface` for object shapes that might be extended

### Component Architecture

- Follow Atomic Design principles (atoms, molecules, organisms)
- Use composition over inheritance
- Create reusable UI components in `components/ui/`
- Feature-specific components go in `components/features/`
- All components should be TypeScript functional components
- Use `forwardRef` when component needs to pass refs

### File Naming Conventions

- Components: PascalCase (e.g., `MenuCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- Types: PascalCase with descriptive names (e.g., `OrderStatus.ts`)

### Component Structure Template

```typescript
'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // ... other props
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("default-styles", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = 'Component';

export { Component };
```

## 🎨 STYLING GUIDELINES

### Tailwind CSS Usage

- Use Tailwind utility classes for styling
- Create custom components for repeated patterns
- Use the `cn()` utility for conditional classes
- Follow mobile-first responsive design
- Use semantic color names from the design system

### Responsive Design

- Mobile-first approach (base styles for mobile, then `md:`, `lg:`, etc.)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Use `container` class for max-width layouts
- Ensure touch-friendly interface on mobile

### Design System Colors

```javascript
// Custom color palette (add to tailwind.config.js)
colors: {
  primary: {
    50: '#fef7f0',
    500: '#f97316',
    900: '#9a3412',
  },
  // ... other colors
}
```

## 🔧 DEVELOPMENT PATTERNS

### API Route Structure

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // API logic here
  
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Database Operations

- Use Prisma Client for all database operations
- Implement proper error handling
- Use transactions for complex operations
- Always validate input data before database operations

### Custom Hooks Pattern

```typescript
// hooks/useExample.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useExample() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hook logic
  }, []);

  return { data, loading, error };
}
```

### Zustand Store Pattern

```typescript
// store/exampleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExampleState {
  data: DataType[];
  actions: {
    addItem: (item: DataType) => void;
    removeItem: (id: string) => void;
    clearData: () => void;
  };
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set) => ({
      data: [],
      actions: {
        addItem: (item) => set((state) => ({ 
          data: [...state.data, item] 
        })),
        removeItem: (id) => set((state) => ({ 
          data: state.data.filter(item => item.id !== id) 
        })),
        clearData: () => set({ data: [] }),
      },
    }),
    {
      name: 'example-store',
      partialize: (state) => ({ data: state.data }),
    }
  )
);
```

## 🌐 INTERNATIONALIZATION

### i18n Structure

- Use Next.js built-in i18n support
- Store translations in `lib/i18n/locales/`
- Use `useTranslation` hook for client components
- Use `getTranslations` for server components

### Translation Usage

```typescript
// Client component
import { useTranslation } from '@/lib/i18n';

const { t } = useTranslation();
return <h1>{t('common.welcome')}</h1>;

// Server component
import { getTranslations } from '@/lib/i18n';

const t = await getTranslations('common');
return <h1>{t('welcome')}</h1>;
```

## 🎮 GAMIFICATION SYSTEM

### Game Component Structure

- Base game engine in `lib/games/base/`
- Individual games in `lib/games/[gameName]/`
- Game components in `components/features/games/`
- Reward system integrated with user system

### Game Implementation Pattern

```typescript
// lib/games/base/GameEngine.ts
export abstract class GameEngine {
  abstract start(): void;
  abstract end(): void;
  abstract calculateScore(): number;
  abstract getRewards(): Reward[];
}
```

## 💳 PAYMENTS INTEGRATION

### Payment Provider Pattern

```typescript
// lib/payments/base.ts
export interface PaymentProvider {
  name: string;
  createPayment(amount: number, currency: string): Promise<PaymentIntent>;
  confirmPayment(paymentId: string): Promise<PaymentResult>;
}
```

### Usage

- Admin can switch between Stripe and SumUp
- Payment provider is determined at runtime
- All payment logic is abstracted behind common interface

## 📦 ORDERS MANAGEMENT

### Order Status Flow

```typescript
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```

### Multi-platform Integration

- Unified order management for website, Uber Eats, Deliveroo
- Common order interface across all platforms
- Real-time order tracking for customers

## 🔐 SECURITY & PERFORMANCE

### Security Best Practices

- Validate all inputs on both client and server
- Use CSRF protection in middleware
- Implement rate limiting for API routes
- Secure sensitive operations with proper authentication

### Performance Optimization

- Use Next.js Image component for all images
- Implement proper loading states
- Use React.memo for expensive components
- Optimize database queries with proper indexing

## 📱 RESPONSIVE DESIGN

### Mobile-First Approach

- Design for mobile first, then enhance for desktop
- Use touch-friendly interactions
- Implement proper gesture support for games
- Ensure readability on all screen sizes

### Breakpoint Usage

- `sm`: Small tablets and large phones
- `md`: Tablets
- `lg`: Small desktops
- `xl`: Large desktops

## 🧪 TESTING GUIDELINES

### Component Testing

- Test user interactions and state changes
- Mock external dependencies
- Test error states and loading states
- Ensure accessibility compliance

### API Testing

- Test all endpoints with proper authentication
- Test error scenarios and edge cases
- Validate response formats and status codes
- Test rate limiting and security measures

## 🚀 DEPLOYMENT & ENVIRONMENT

### Environment Variables

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Auth
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
SUMUP_API_KEY=

# CMS
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_TOKEN=

# Integrations
UBER_EATS_API_KEY=
DELIVEROO_API_KEY=
RESEND_API_KEY=
```

### Build Process

- Use TypeScript strict mode
- Run ESLint and Prettier before commits
- Generate Prisma client during build
- Optimize images and assets

## 📋 CODE REVIEW CHECKLIST

### Before Committing

- [ ]  TypeScript compilation passes
- [ ]  ESLint warnings addressed
- [ ]  Component props properly typed
- [ ]  Error handling implemented
- [ ]  Responsive design tested
- [ ]  Accessibility considerations
- [ ]  Performance optimizations applied
- [ ]  Security implications reviewed

### Code Quality

- [ ]  Functions are single-purpose and small
- [ ]  Variable names are descriptive
- [ ]  Comments explain complex logic
- [ ]  No console.log statements in production
- [ ]  Proper error boundaries implemented
- [ ]  Loading states handled gracefully

Remember: Write code that is readable, maintainable, and follows the established patterns. When in doubt, prefer explicit over implicit, and always consider the user experience.
