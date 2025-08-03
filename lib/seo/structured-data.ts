import { z } from 'zod';

// Restaurant Schema for local business SEO
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

// Generate restaurant structured data for local SEO
export function generateRestaurantStructuredData(restaurant: z.infer<typeof RestaurantSchema>) {
  const validatedRestaurant = RestaurantSchema.parse(restaurant);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: validatedRestaurant.name,
    description: validatedRestaurant.description,
    image: validatedRestaurant.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: validatedRestaurant.address.street,
      addressLocality: validatedRestaurant.address.city,
      postalCode: validatedRestaurant.address.postalCode,
      addressCountry: validatedRestaurant.address.country,
    },
    telephone: validatedRestaurant.phone,
    email: validatedRestaurant.email,
    openingHours: validatedRestaurant.openingHours,
    priceRange: validatedRestaurant.priceRange,
    servesCuisine: validatedRestaurant.cuisine,
    paymentAccepted: validatedRestaurant.paymentAccepted,
    ...(validatedRestaurant.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: validatedRestaurant.rating.value,
        reviewCount: validatedRestaurant.rating.count,
      },
    }),
  };
}

// Generate website structured data
export function generateWebsiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Be Digital - Restaurant Numérique',
    description: 'Solution numérique complète pour restaurants',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://facebook.com/bedigital',
      'https://instagram.com/bedigital',
      'https://twitter.com/bedigital',
    ],
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Be Digital',
    description: 'Solutions numériques innovantes pour restaurants',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-1-23-45-67-89',
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Spanish', 'German'],
    },
    sameAs: [
      'https://facebook.com/bedigital',
      'https://instagram.com/bedigital',
      'https://twitter.com/bedigital',
    ],
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
}

// Validate structured data
export function validateStructuredData(data: unknown) {
  const StructuredDataSchema = z.object({
    '@context': z.string().url(),
    '@type': z.string(),
  }).passthrough();

  try {
    return StructuredDataSchema.parse(data);
  } catch (error) {
    console.error('Invalid structured data:', error);
    return null;
  }
}