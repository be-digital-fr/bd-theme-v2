# Deployment Guide - Be Digital Theme

## Vercel Deployment

This project is configured for optimal deployment on Vercel with maximum scores for Performance, Accessibility, Best Practices, and SEO.

### Prerequisites

1. Vercel account
2. Vercel CLI installed (`npm i -g vercel`)
3. Environment variables configured

### Deployment Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --yes
   ```

3. **Configure Environment Variables**
   
   Visit: https://vercel.com/[your-project]/settings/environment-variables
   
   Add the following variables:

   #### Database
   - `DATABASE_URL` - PostgreSQL connection string from Neon
   - `DIRECT_URL` - Direct database URL for migrations

   #### Authentication
   - `BETTER_AUTH_SECRET` - At least 32 characters
   - `BETTER_AUTH_URL` - Your production URL

   #### Sanity CMS
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` - From Sanity dashboard
   - `NEXT_PUBLIC_SANITY_DATASET` - Usually "production"
   - `NEXT_PUBLIC_SANITY_API_VERSION` - "2025-07-05"
   - `SANITY_API_TOKEN` - For server-side operations

   #### Application
   - `NEXT_PUBLIC_BASE_URL` - Your production URL

   #### Optional
   - OAuth credentials (Google, Facebook)
   - Sentry error tracking
   - OpenAI API key for translations
   - Google site verification

4. **Run Database Migrations**
   ```bash
   pnpm dlx prisma generate
   pnpm dlx prisma db push
   ```

5. **Seed Initial Data** (if needed)
   ```bash
   pnpm db:seed
   ```

## Performance Optimizations

### SEO Enhancements
- ✅ Dynamic sitemap generation (`/api/sitemap`)
- ✅ Robots.txt configuration (`/api/robots`)
- ✅ Comprehensive metadata with Open Graph
- ✅ Structured data support
- ✅ Multi-language support

### Performance Features
- ✅ Next.js 15 with App Router
- ✅ Automatic image optimization (WebP, AVIF)
- ✅ Edge runtime for API routes
- ✅ Server Components by default
- ✅ Bundle size optimization
- ✅ CDN caching headers

### Security Headers
- ✅ Content Security Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Strict Transport Security
- ✅ Referrer Policy

### PWA Support
- ✅ Web App Manifest
- ✅ Service Worker for offline support
- ✅ Installable on mobile devices
- ✅ App shortcuts

## Monitoring

### Build Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs [deployment-url]
```

### Redeploy
```bash
vercel --prod
```

## Domain Configuration

1. Add custom domain in Vercel dashboard
2. Update environment variables:
   - `BETTER_AUTH_URL`
   - `NEXT_PUBLIC_BASE_URL`

## Troubleshooting

### Build Errors
- Check all environment variables are set
- Ensure Prisma client is generated
- Verify database connection

### Performance Issues
- Enable Vercel Analytics
- Check bundle size with `ANALYZE=true pnpm build`
- Review Core Web Vitals in Vercel dashboard

### SEO Issues
- Verify sitemap at `/sitemap.xml`
- Check robots.txt at `/robots.txt`
- Test with Google PageSpeed Insights

## Best Practices

1. **Always test locally first**
   ```bash
   pnpm build && pnpm start
   ```

2. **Use preview deployments**
   ```bash
   vercel
   ```

3. **Monitor performance**
   - Vercel Analytics
   - Core Web Vitals
   - Sentry error tracking

4. **Keep dependencies updated**
   ```bash
   pnpm update
   ```

## Expected Scores

With proper configuration, expect:
- **Performance**: 95-100
- **Accessibility**: 95-100
- **Best Practices**: 95-100
- **SEO**: 95-100

These scores depend on:
- Proper environment configuration
- Optimized images
- Fast database queries
- Efficient code splitting