import { Metadata } from 'next';
import { z } from 'zod';

// SEO Image Schema
export const SEOImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// SEO Config Schema
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

// Locale configuration for multilingual SEO
export const localeConfig = {
  fr: {
    siteName: 'Be Digital - Restaurant Numérique',
    siteDescription: 'Transformez votre restaurant avec notre solution numérique complète. Commande en ligne, gestion des livraisons, système de réservation et bien plus.',
    keywords: ['restaurant numérique', 'commande en ligne', 'livraison', 'réservation', 'menu digital', 'be digital'],
    currency: 'EUR',
    region: 'FR',
  },
  en: {
    siteName: 'Be Digital - Digital Restaurant',
    siteDescription: 'Transform your restaurant with our complete digital solution. Online ordering, delivery management, reservation system and much more.',
    keywords: ['digital restaurant', 'online ordering', 'delivery', 'reservation', 'digital menu', 'be digital'],
    currency: 'EUR',
    region: 'GB',
  },
  es: {
    siteName: 'Be Digital - Restaurante Digital',
    siteDescription: 'Transforma tu restaurante con nuestra solución digital completa. Pedidos en línea, gestión de entregas, sistema de reservas y mucho más.',
    keywords: ['restaurante digital', 'pedidos en línea', 'entrega', 'reserva', 'menú digital', 'be digital'],
    currency: 'EUR',
    region: 'ES',
  },
  de: {
    siteName: 'Be Digital - Digitales Restaurant',
    siteDescription: 'Verwandeln Sie Ihr Restaurant mit unserer kompletten digitalen Lösung. Online-Bestellung, Lieferverwaltung, Reservierungssystem und vieles mehr.',
    keywords: ['digitales restaurant', 'online bestellung', 'lieferung', 'reservierung', 'digitales menü', 'be digital'],
    currency: 'EUR',
    region: 'DE',
  },
};

// Generate hreflang links
export function generateHreflangLinks(pathname: string, defaultLocale: string = 'fr') {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const links: Record<string, string> = {};
  
  Object.keys(localeConfig).forEach(locale => {
    const url = locale === defaultLocale 
      ? `${baseUrl}${pathname}`
      : `${baseUrl}/${locale}${pathname}`;
  
    links[locale] = url;
  });
  
  // Add x-default for international targeting
  links['x-default'] = `${baseUrl}${pathname}`;
  
  return links;
}

// Main SEO metadata generator
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const validated = SEOConfigSchema.parse(config);
  const { title, description, pathname, locale, type, images, publishedAt, modifiedAt, author, tags } = validated;
  
  const siteConfig = localeConfig[locale as keyof typeof localeConfig] || localeConfig.fr;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}${locale === 'fr' ? '' : `/${locale}`}${pathname}`;
  
  const hreflangLinks = generateHreflangLinks(pathname);
  
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
      creator: '@bedigital',
      site: '@bedigital',
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
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}