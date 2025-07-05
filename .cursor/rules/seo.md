# SEO Cursor Rules - Next.js Restaurant App

## 🎯 SEO ARCHITECTURE OVERVIEW

This restaurant application implements comprehensive SEO optimization using Next.js 14 App Router with:

- **Dynamic metadata generation** for all pages
- **Structured data (JSON-LD)** for rich snippets
- **Multi-language SEO** support
- **Local business optimization** for restaurants
- **Performance-optimized** images and content
- **Social media integration** (Open Graph, Twitter Cards)

## 📋 SEO IMPLEMENTATION GUIDELINES

### Metadata Generation Pattern

- **ALWAYS** use Next.js `generateMetadata()` for dynamic pages
- **NEVER** use static metadata objects for content-driven pages
- **ALWAYS** include canonical URLs
- **ALWAYS** implement hreflang for multilingual sites
- **ALWAYS** validate metadata with Zod schemas

### Page-Level SEO Structure

```typescript
// app/[locale]/menu/page.tsx
import { Metadata } from 'next';
import { z } from 'zod';
import { generateSEOMetadata } from '@/lib/seo';
import { getMenuItems } from '@/lib/cms/sanity';

const MenuPageProps = z.object({
  params: z.object({
    locale: z.string(),
  }),
  searchParams: z.object({
    category: z.string().optional(),
  }).optional(),
});

export async function generateMetadata({ 
  params, 
  searchParams 
}: z.infer<typeof MenuPageProps>): Promise<Metadata> {
  const { locale } = params;
  const category = searchParams?.category;
  
  const menuItems = await getMenuItems(locale, category);
  
  return generateSEOMetadata({
    title: category ? `${category} Menu` : 'Our Menu',
    description: `Discover our delicious ${category || 'menu items'}. Fresh ingredients, authentic flavors.`,
    pathname: `/menu${category ? `?category=${category}` : ''}`,
    locale,
    type: 'menu',
    images: menuItems.slice(0, 4).map(item => item.image),
    structuredData: {
      type: 'Menu',
      items: menuItems,
    },
  });
}
```

### SEO Metadata Schema (Zod)

```typescript
// schemas/seo.ts
import { z } from 'zod';

export const SEOImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const SEOConfigSchema = z.object({
  title: z.string().min(10).max(60),
  description: z.string().min(120).max(160),
  pathname: z.string(),
  locale: z.string(),
  type: z.enum(['website', 'menu', 'blog', 'contact', 'game']),
  images: z.array(SEOImageSchema).optional(),
  publishedAt: z.date().optional(),
  modifiedAt: z.date().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  structuredData: z.any().optional(),
});

export type SEOConfig = z.infer<typeof SEOConfigSchema>;
export type SEOImage = z.infer<typeof SEOImageSchema>;
```

## 🏪 LOCAL BUSINESS SEO

### Restaurant Structured Data

```typescript
// lib/seo/structured-data.ts
import { z } from 'zod';

const RestaurantSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  phone: z.string(),
  email: z.string().email(),
  openingHours: z.array(z.string()),
  priceRange: z.string(),
  cuisine: z.array(z.string()),
  paymentAccepted: z.array(z.string()),
  rating: z.object({
    value: z.number().min(0).max(5),
    count: z.number().min(0),
  }).optional(),
});

export function generateRestaurantStructuredData(restaurant: z.infer<typeof RestaurantSchema>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.city,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.country,
    },
    telephone: restaurant.phone,
    email: restaurant.email,
    openingHours: restaurant.openingHours,
    priceRange: restaurant.priceRange,
    servesCuisine: restaurant.cuisine,
    paymentAccepted: restaurant.paymentAccepted,
    ...(restaurant.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: restaurant.rating.value,
        reviewCount: restaurant.rating.count,
      },
    }),
  };
}
```

### Menu Item Structured Data

```typescript
// lib/seo/menu-structured-data.ts
export function generateMenuStructuredData(menuItems: MenuItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    hasMenuSection: menuItems.reduce((acc, item) => {
      const category = item.category;
      let section = acc.find(s => s.name === category);
    
      if (!section) {
        section = {
          '@type': 'MenuSection',
          name: category,
          hasMenuItem: [],
        };
        acc.push(section);
      }
    
      section.hasMenuItem.push({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        image: item.image,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'EUR',
        },
        nutrition: item.nutrition && {
          '@type': 'NutritionInformation',
          calories: item.nutrition.calories,
        },
        suitableForDiet: item.dietary?.map(diet => `https://schema.org/${diet}Diet`),
      });
    
      return acc;
    }, [] as any[]),
  };
}
```

## 📝 BLOG SEO OPTIMIZATION

### Blog Post Metadata

```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateMetadata({ params }: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug, params.locale);
  
  if (!post) {
    return generateSEOMetadata({
      title: 'Article not found',
      description: 'This article could not be found.',
      pathname: `/blog/${params.slug}`,
      locale: params.locale,
      type: 'blog',
    });
  }
  
  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    pathname: `/blog/${params.slug}`,
    locale: params.locale,
    type: 'blog',
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt,
    author: post.author.name,
    tags: post.tags,
    images: [post.featuredImage],
    structuredData: {
      type: 'BlogPost',
      post,
    },
  });
}
```

### Blog Post Structured Data

```typescript
// lib/seo/blog-structured-data.ts
export function generateBlogPostStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage.url,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(' ').length,
  };
}
```

## 🌐 MULTILINGUAL SEO

### Hreflang Implementation

```typescript
// lib/seo/hreflang.ts
import { z } from 'zod';

const HreflangSchema = z.object({
  pathname: z.string(),
  locales: z.array(z.string()),
  defaultLocale: z.string(),
});

export function generateHreflangLinks({ pathname, locales, defaultLocale }: z.infer<typeof HreflangSchema>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const links: Record<string, string> = {};
  
  locales.forEach(locale => {
    const url = locale === defaultLocale 
      ? `${baseUrl}${pathname}`
      : `${baseUrl}/${locale}${pathname}`;
  
    links[locale] = url;
  });
  
  // Add x-default for international targeting
  links['x-default'] = `${baseUrl}${pathname}`;
  
  return links;
}
```

### Locale-Specific SEO

```typescript
// lib/seo/locale-config.ts
export const localeConfig = {
  fr: {
    siteName: 'Restaurant Délice',
    siteDescription: 'Découvrez notre cuisine authentique et nos plats préparés avec passion',
    keywords: ['restaurant', 'cuisine française', 'plats traditionnels', 'livraison'],
    currency: 'EUR',
    region: 'FR',
  },
  en: {
    siteName: 'Restaurant Délice',
    siteDescription: 'Discover our authentic cuisine and dishes prepared with passion',
    keywords: ['restaurant', 'french cuisine', 'traditional dishes', 'delivery'],
    currency: 'EUR',
    region: 'GB',
  },
  es: {
    siteName: 'Restaurante Délice',
    siteDescription: 'Descubre nuestra cocina auténtica y platos preparados con pasión',
    keywords: ['restaurante', 'cocina francesa', 'platos tradicionales', 'entrega'],
    currency: 'EUR',
    region: 'ES',
  },
};
```

## 🚀 PERFORMANCE SEO

### Image Optimization for SEO

```typescript
// components/seo/SEOImage.tsx
import Image from 'next/image';
import { z } from 'zod';

const SEOImagePropsSchema = z.object({
  src: z.string().url(),
  alt: z.string().min(5).max(100),
  width: z.number().min(200),
  height: z.number().min(200),
  priority: z.boolean().optional(),
  sizes: z.string().optional(),
  className: z.string().optional(),
});

type SEOImageProps = z.infer<typeof SEOImagePropsSchema>;

export function SEOImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className 
}: SEOImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIEBwAAAAAAAAAAAAABAgADBAUREiExQVFhkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0r/Z"
    />
  );
}
```

### Core Web Vitals Optimization

```typescript
// lib/seo/web-vitals.ts
import { z } from 'zod';

const WebVitalsSchema = z.object({
  lcp: z.number(), // Largest Contentful Paint
  fid: z.number(), // First Input Delay
  cls: z.number(), // Cumulative Layout Shift
  fcp: z.number(), // First Contentful Paint
  ttfb: z.number(), // Time to First Byte
});

export function trackWebVitals(metric: any) {
  const { name, value, id } = metric;
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
}
```

## 🎮 GAMIFICATION SEO

### Game Page SEO

```typescript
// app/[locale]/games/wheel/page.tsx
export async function generateMetadata({ params }: {
  params: { locale: string }
}): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Wheel of Fortune Game - Win Amazing Prizes!',
    description: 'Spin our wheel of fortune and win amazing prizes! Play our interactive game and discover exclusive offers.',
    pathname: '/games/wheel',
    locale: params.locale,
    type: 'game',
    structuredData: {
      type: 'Game',
      game: {
        name: 'Wheel of Fortune',
        description: 'Interactive prize wheel game',
        genre: 'Casual',
        gamePlatform: 'Web',
      },
    },
  });
}
```

### Game Structured Data

```typescript
// lib/seo/game-structured-data.ts
export function generateGameStructuredData(game: Game) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: game.name,
    description: game.description,
    genre: game.genre,
    gamePlatform: 'Web Browser',
    operatingSystem: 'Any',
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    aggregateRating: game.rating && {
      '@type': 'AggregateRating',
      ratingValue: game.rating.value,
      reviewCount: game.rating.count,
    },
  };
}
```

## 📊 SEO MONITORING & ANALYTICS

### SEO Component with Analytics

```typescript
// components/seo/SEOProvider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  
  return <>{children}</>;
}
```

### Structured Data Validation

```typescript
// lib/seo/validation.ts
import { z } from 'zod';

const StructuredDataSchema = z.object({
  '@context': z.string().url(),
  '@type': z.string(),
}).passthrough();

export function validateStructuredData(data: unknown) {
  try {
    return StructuredDataSchema.parse(data);
  } catch (error) {
    console.error('Invalid structured data:', error);
    return null;
  }
}
```

## 🔧 SEO UTILITY FUNCTIONS

### Main SEO Generator

```typescript
// lib/seo/generate-metadata.ts
import { Metadata } from 'next';
import { z } from 'zod';
import { SEOConfigSchema } from '@/schemas/seo';
import { generateHreflangLinks } from './hreflang';
import { localeConfig } from './locale-config';

export function generateSEOMetadata(config: z.infer<typeof SEOConfigSchema>): Metadata {
  const validated = SEOConfigSchema.parse(config);
  const { title, description, pathname, locale, type, images, publishedAt, modifiedAt, author, tags } = validated;
  
  const siteConfig = localeConfig[locale as keyof typeof localeConfig];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const fullUrl = `${baseUrl}/${locale === 'fr' ? '' : locale}${pathname}`;
  
  const hreflangLinks = generateHreflangLinks({
    pathname,
    locales: Object.keys(localeConfig),
    defaultLocale: 'fr',
  });
  
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.siteName}`,
    },
    description,
    keywords: tags ? [...siteConfig.keywords, ...tags] : siteConfig.keywords,
    authors: author ? [{ name: author }] : undefined,
    creator: siteConfig.siteName,
    publisher: siteConfig.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: hreflangLinks,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: siteConfig.siteName,
      images: images?.map(img => ({
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
      })),
      locale,
      type: type === 'blog' ? 'article' : 'website',
      ...(publishedAt && { publishedTime: publishedAt.toISOString() }),
      ...(modifiedAt && { modifiedTime: modifiedAt.toISOString() }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images?.[0]?.url,
      creator: '@restaurant_delice',
      site: '@restaurant_delice',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  };
}
```

## 📋 SEO CHECKLIST

### Page-Level SEO Requirements

- [ ]  Unique, descriptive title (10-60 characters)
- [ ]  Meta description (120-160 characters)
- [ ]  Canonical URL set
- [ ]  Hreflang tags for multilingual
- [ ]  Open Graph tags complete
- [ ]  Twitter Cards configured
- [ ]  Structured data implemented
- [ ]  Images optimized with alt text
- [ ]  Core Web Vitals optimized

### Content SEO Requirements

- [ ]  H1 tag present and unique
- [ ]  Proper heading hierarchy (H1-H6)
- [ ]  Internal linking strategy
- [ ]  External links with rel attributes
- [ ]  Image alt text descriptive
- [ ]  Content minimum 300 words
- [ ]  Keywords naturally integrated
- [ ]  Mobile-friendly responsive design

### Technical SEO Requirements

- [ ]  XML sitemap generated
- [ ]  Robots.txt configured
- [ ]  Page speed optimized
- [ ]  HTTPS enabled
- [ ]  Schema markup validated
- [ ]  404 error handling
- [ ]  Redirect management
- [ ]  Analytics tracking implemented

Remember: SEO is an ongoing process. Regularly monitor performance, update content, and adapt to search engine algorithm changes. Focus on user experience while maintaining technical excellence.
