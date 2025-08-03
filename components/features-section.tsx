'use client';

import { z } from 'zod';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import { useHomeContent } from '@/features/home/presentation/hooks/useHomeContent';
import { useCurrentLocale } from '@/lib/locale';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';
import { urlFor } from '@/sanity/lib/image';
import { cn } from '@/lib/utils';
import type { SanityImageType } from '@/features/home/domain/schemas/HomeContentSchema';
import { useState, useEffect } from 'react';

// Component props schema with Zod validation
const FeaturesSectionPropsSchema = z.object({
  className: z.string().optional(),
});

export type FeaturesSectionProps = z.infer<typeof FeaturesSectionPropsSchema>;

/**
 * Features Section Component
 * 
 * Displays a section with feature cards containing icons, titles, and descriptions.
 * Supports multilingual content and follows Clean Architecture patterns.
 * Optimized for SEO, accessibility, and performance.
 * 
 * @param props - Component props validated with Zod
 * @returns JSX element or null if not active
 */
export function FeaturesSection(props: FeaturesSectionProps) {
  // Validate props at runtime
  FeaturesSectionPropsSchema.parse(props);
  const { className } = props;

  const currentLocale = useCurrentLocale();
  const { data: homeContent, isLoading } = useHomeContent(currentLocale);

  // Debug logging (removed in production)

  // Show skeleton while loading
  if (isLoading) {
    return <FeaturesSectionSkeleton className={className} />;
  }

  // Get features section data
  const featuresSection = homeContent?.featuresSection;

  // Early return if section is not active or doesn't exist
  if (!featuresSection?.isActive || !featuresSection?.features?.length) {
    return null;
  }

  return (
    <>
      <section
        className={cn('py-12 lg:py-16', className)}
        role="region"
        aria-label="Services disponibles"
      >
      <Container size="xl">
        {/* Simple Features List */}
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
          role="list"
          aria-label="Liste des services"
        >
          {featuresSection.features.map((feature, index) => (
            <FeatureCard
              key={`${feature.icon}-${index}`}
              feature={feature}
              currentLocale={currentLocale}
              index={index}
            />
          ))}
        </div>
      </Container>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Services disponibles",
            "itemListElement": featuresSection.features.map((feature, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Service",
                "name": resolveMultilingualValue({
                  value: feature.title,
                  currentLanguage: currentLocale
                })
              }
            }))
          })
        }}
      />
      </section>
      
      {/* Separator */}
      <Separator className="h-1 bg-muted" />
    </>
  );
}

/**
 * Feature Card Component
 * 
 * Individual feature card with icon, title, and description
 */
interface FeatureCardProps {
  feature: {
    icon?: SanityImageType | string; // Allow both Sanity image object and URL string
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
  };
  currentLocale: string;
  index: number;
}

function FeatureCard({ feature, currentLocale, index }: FeatureCardProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  
  // Resolve multilingual content
  const title = resolveMultilingualValue({
    value: feature.title,
    currentLanguage: currentLocale
  }) || 'Service';

  // Get optimized image URL from Sanity or use direct URL
  useEffect(() => {
    try {
      if (feature.icon && typeof feature.icon === 'object' && feature.icon.asset?._ref && feature.icon.asset._ref !== '') {
        // Only try urlFor if we have a valid _ref
        const url = urlFor(feature.icon)
          .width(64)
          .height(64)
          .format('webp')
          .quality(85)
          .url();
        setIconUrl(url);
      } else if (feature.icon && typeof feature.icon === 'string') {
        setIconUrl(feature.icon);
      }
    } catch (error) {
      console.error('Error processing icon:', error);
    }
  }, [feature.icon]);

  console.log("feature", feature, "iconUrl", iconUrl);

  return (
    <div
      className="group flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors duration-300"
      role="listitem"
      aria-labelledby={`feature-title-${index}`}
    >
      {/* Icon Container */}
      <div className="mb-3 relative">
        <div className="w-16 h-16 rounded-xl bg-card flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 transform">
          {iconUrl ? (
            <Image
              src={iconUrl}
              alt={`${title} icon`}
              width={32}
              height={32}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              priority={index < 3} // Preload first 3 icons
            />
          ) : (
            <div className="w-8 h-8 bg-primary-foreground/30 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground text-xs">?</span>
            </div>
          )}
        </div>
        {/* Decorative blur effect */}
        <div className="absolute inset-0 w-16 h-16 rounded-xl bg-primary/20 blur-lg -z-10 group-hover:blur-xl transition-all duration-300" />
      </div>

      {/* Title only */}
      <h3
        id={`feature-title-${index}`}
        className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300"
      >
        {title}
      </h3>
    </div>
  );
}

/**
 * Features Section Skeleton Component
 * 
 * Loading state that matches the final layout structure
 */
interface FeaturesSectionSkeletonProps {
  className?: string;
}

function FeaturesSectionSkeleton({ className }: FeaturesSectionSkeletonProps) {
  return (
    <section
      className={cn('py-12 lg:py-16', className)}
      role="region"
      aria-label="Chargement des services"
    >
      <Container size="xl">
        {/* Simple Features List Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              {/* Icon Skeleton */}
              <div className="mb-3">
                <div className="w-16 h-16 rounded-xl bg-muted animate-pulse" />
              </div>
              {/* Title Skeleton */}
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturesSection;