'use client';

import Image from "next/image";
import Link from 'next/link';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeContent } from '@/features/home/presentation/hooks/useHomeContent';
import { useCurrentLocale } from '@/lib/locale';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Zod schema for image optimization options
const ImageOptimizationOptionsSchema = z.object({
  quality: z.number().min(1).max(100).optional()
});

type ImageOptimizationOptions = z.infer<typeof ImageOptimizationOptionsSchema>;

// Component props schema
const HeroBannerPropsSchema = z.object({
  className: z.string().optional()
});

type HeroBannerProps = z.infer<typeof HeroBannerPropsSchema>;

/**
 * Hero Banner Component
 * 
 * Displays the main hero banner with background images, title, description,
 * call-to-action buttons, and optimized Sanity images
 * 
 * @param props - Component props
 * @returns JSX element or null if not active
 */
export function HeroBanner(props: HeroBannerProps) {
  // Validate props at runtime
  HeroBannerPropsSchema.parse(props);
  
  const currentLocale = useCurrentLocale();
  const { data: homeContent, isLoading } = useHomeContent(currentLocale);

  // Show skeleton while loading
  if (isLoading) {
    return <HeroBannerSkeleton />;
  }

  // Early return if banner not active
  if (!homeContent?.heroBanner?.isActive) {
    return null;
  }

  const { heroBanner } = homeContent;

  // Resolve multilingual content with fallbacks
  const title = resolveMultilingualValue({
    value: heroBanner.heroTitle,
    currentLanguage: currentLocale
  }) || 'Taste our unique burgers';

  const description = resolveMultilingualValue({
    value: heroBanner.heroDescription,
    currentLanguage: currentLocale
  }) || 'Fresh, delicious recipes prepared with quality ingredients';

  const primaryButtonText = resolveMultilingualValue({
    value: heroBanner.primaryButton?.text,
    currentLanguage: currentLocale
  }) || 'Order now';

  const secondaryButtonText = resolveMultilingualValue({
    value: heroBanner.secondaryButton?.text,
    currentLanguage: currentLocale
  }) || 'View menu';

  const imageAlt = resolveMultilingualValue({
    value: heroBanner.heroImage?.alt,
    currentLanguage: currentLocale
  }) || 'Delicious burger with fresh ingredients';

  /**
   * Optimize Sanity images for web display
   * Prioritizes AVIF format with WebP fallback for better compression
   */
  const getOptimizedImageUrl = (
    image: SanityImageSource | undefined, 
    options: ImageOptimizationOptions = {}
  ): string | null => {
    if (!image) return null;
    
    const validatedOptions = ImageOptimizationOptionsSchema.parse(options);
    
    return urlFor(image)
      .quality(validatedOptions.quality || 85)
      .format('webp')
      .url();
  };

  /**
   * Optimize background images with lower quality for better performance
   * Uses aggressive compression for background elements
   */
  const getBackgroundImageUrl = (
    image: SanityImageSource | undefined, 
    options: ImageOptimizationOptions = {}
  ): string | null => {
    if (!image) return null;
    
    const validatedOptions = ImageOptimizationOptionsSchema.parse(options);
    
    return urlFor(image)
      .quality(validatedOptions.quality || 70)
      .format('webp')
      .url();
  };

  // Generate optimized image URLs with fallbacks
  const desktopImageUrl = getOptimizedImageUrl(heroBanner.heroImage?.desktop) || '/images/banner/burger-desktop.png';
  const mobileImageUrl = getOptimizedImageUrl(heroBanner.heroImage?.mobile) || '/images/banner/burger-mobile.png';

  // Generate optimized background image URLs with fallbacks
  const desktopBgUrl = getBackgroundImageUrl(heroBanner.backgroundImages?.desktop) || '/images/banner/bg-desktop.png';
  const mobileBgUrl = getBackgroundImageUrl(heroBanner.backgroundImages?.mobile) || '/images/banner/bg-mobile.png';

  return (
    <section className="relative h-[80vh] lg:h-[65vh] overflow-hidden rounded-none lg:rounded-3xl" role="banner" aria-label="Hero banner">
      {/* Responsive background images - Using Next.js Image for better performance */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Desktop background image */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src={desktopBgUrl}
            alt=""
            fill
            priority
            quality={75}
            className="object-cover object-center"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        {/* Mobile background image */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src={mobileBgUrl}
            alt=""
            fill
            priority
            quality={75}
            className="object-cover object-center"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      </div>

      <Container size="xl" className="relative z-10 h-full flex pt-8 lg:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 w-full">
          {/* Content section - Title, description and CTA buttons */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-lg">
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
              <p className="text-lg text-white/90 sm:text-xl lg:text-2xl xl:text-3xl drop-shadow-md max-w-3xl">
                {description}
              </p>
            </div>

            {/* Call-to-action buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 px-8 py-4 text-lg lg:text-xl font-semibold text-white shadow-2xl transition-all hover:shadow-3xl hover:scale-105 border-0"
                aria-label={primaryButtonText}
              >
                <Link href={heroBanner.primaryButton?.url || ''}>
                  {primaryButtonText}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/80 px-8 py-4 text-lg lg:text-xl font-semibold text-white transition-all hover:bg-white hover:text-green-600 bg-white/10 backdrop-blur-sm hover:scale-105"
                aria-label={secondaryButtonText}
              >
                <Link href={heroBanner.secondaryButton?.url || ''}>
                  {secondaryButtonText}
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero image section - Responsive burger image */}
          <div className="relative flex justify-center lg:justify-end" role="img" aria-label={imageAlt}>
            {/* Desktop hero image */}
            <div className="hidden md:block relative w-full max-w-none lg:max-w-none xl:max-w-none 2xl:max-w-none">
              <Image
                src={desktopImageUrl}
                alt={imageAlt}
                width={1600}
                height={1200}
                className="h-auto w-full drop-shadow-2xl scale-100 lg:scale-110"
                priority
                quality={85}
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* Mobile hero image */}
            <div className="block md:hidden relative max-w-md">
              <Image
                src={mobileImageUrl}
                alt={imageAlt}
                width={400}
                height={500}
                className="h-auto w-full drop-shadow-2xl"
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 400px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* Visual shimmer effect for enhanced presentation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" aria-hidden="true"></div>
          </div>
        </div>
      </Container>

      {/* Subtle overlay for improved text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-green-800/20 z-[1]" aria-hidden="true"></div>
    </section>
  );
}

/**
 * Hero Banner Skeleton Component
 * 
 * Displays a loading skeleton while hero banner data is being fetched
 * Maintains the same layout structure as the actual component
 */
function HeroBannerSkeleton() {
  return (
    <section className="relative h-[80vh] lg:h-[65vh] overflow-hidden rounded-none lg:rounded-3xl bg-muted/20" role="banner" aria-label="Loading hero banner">
      {/* Background skeleton */}
      <div className="absolute inset-0 z-0">
        <Skeleton className="w-full h-full rounded-none lg:rounded-3xl" />
      </div>

      <Container size="xl" className="relative z-10 h-full flex pt-8 lg:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 w-full">
          {/* Content section skeleton */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              {/* Title skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-12 sm:h-16 lg:h-20 xl:h-24 w-full max-w-2xl mx-auto lg:mx-0" />
                <Skeleton className="h-12 sm:h-16 lg:h-20 xl:h-24 w-4/5 max-w-xl mx-auto lg:mx-0" />
              </div>
              {/* Description skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-6 sm:h-7 lg:h-8 w-full max-w-3xl mx-auto lg:mx-0" />
                <Skeleton className="h-6 sm:h-7 lg:h-8 w-5/6 max-w-2xl mx-auto lg:mx-0" />
                <Skeleton className="h-6 sm:h-7 lg:h-8 w-3/4 max-w-xl mx-auto lg:mx-0" />
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Skeleton className="h-12 lg:h-14 w-48 rounded-lg" />
              <Skeleton className="h-12 lg:h-14 w-40 rounded-lg" />
            </div>
          </div>

          {/* Image section skeleton */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Desktop image skeleton */}
            <div className="hidden md:block relative w-full max-w-none">
              <Skeleton className="aspect-[4/3] w-full max-w-lg lg:max-w-xl rounded-2xl" />
            </div>

            {/* Mobile image skeleton */}
            <div className="block md:hidden relative max-w-md w-full">
              <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </Container>

      {/* Shimmer overlay for enhanced loading effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse z-[1]" aria-hidden="true"></div>
    </section>
  );
}