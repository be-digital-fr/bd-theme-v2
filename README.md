# Be Digital Restaurant Theme

Modern, multilingual Next.js 15 restaurant theme with Clean Architecture, e-commerce capabilities, and comprehensive order management.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup database
pnpm dlx prisma db push && pnpm db:seed

# Initialize CMS content
pnpm init-singletons

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## ✨ Features

- **🏗️ Clean Architecture** - Hexagonal architecture with dependency injection
- **🌍 Multilingual** - 7 languages with admin-configurable support
- **🛒 E-commerce** - Click-and-collect, payments (Stripe/SumUp), order tracking
- **📱 Responsive** - Mobile-first design with Tailwind CSS v4
- **🔐 Authentication** - Better Auth with OAuth (Google/Facebook) support
- **📊 CMS Integration** - Sanity CMS with dynamic multilingual fields
- **🧪 Comprehensive Testing** - Playwright E2E tests with feature organization
- **📈 Analytics Ready** - Built-in analytics dashboard and order management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: PostgreSQL, Prisma ORM, Better Auth
- **CMS**: Sanity with custom multilingual components
- **State**: TanStack React Query
- **Testing**: Playwright, Zod validation
- **Deployment**: Vercel-ready with Docker support

## 📖 Documentation

- **[Setup Guide](./SETUP.md)** - Complete installation and configuration
- **[Architecture Guide](./docs/architecture/README.md)** - Clean Architecture implementation
- **[Authentication Guide](./AUTH.md)** - Auth system documentation
- **[Development Guide](./CLAUDE.md)** - Development patterns and standards

## 🏗️ Project Structure

```
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── auth/           # Authentication components
├── features/           # Clean Architecture features
│   ├── auth/          # User authentication
│   ├── admin/         # Admin preferences
│   ├── home/          # Homepage content
│   ├── locale/        # Internationalization
│   └── products/      # E-commerce catalog
├── sanity/            # Sanity CMS configuration
├── tests/             # Playwright tests by feature
└── docs/              # Detailed documentation
```

## 🌍 Multilingual Support

Supports 7 languages with admin-configurable preferences:
🇫🇷 French • 🇬🇧 English • 🇪🇸 Spanish • 🇩🇪 German • 🇮🇹 Italian • 🇵🇹 Portuguese • 🇸🇦 Arabic

## 🚀 Deployment

The application is optimized for deployment on:
- **Vercel** (recommended)
- **Netlify** 
- **Railway**
- **Docker** containers

See the [Setup Guide](./SETUP.md) for detailed deployment instructions.

## 🧪 Testing

```bash
pnpm test              # Run all tests
pnpm test:auth         # Authentication tests only
pnpm test:ui           # Tests with Playwright UI
pnpm test:validate     # Validate test structure
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Follow the [Clean Architecture patterns](./docs/architecture/README.md)
2. Run quality checks: `pnpm lint && pnpm exec tsc --noEmit`
3. Add tests for new features in `tests/features/`
4. Update documentation as needed

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)