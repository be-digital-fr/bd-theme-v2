"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaSkeleton } from "@/components/ui/media-skeleton";
import { TextSkeleton } from "@/components/ui/text-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FoodBannerProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonAction?: () => void;
  secondaryButtonAction?: () => void;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  showDecorations?: boolean;
  isLoading?: boolean;
}

// Decorative SVG components
const TomatoDecoration = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute w-8 h-8 text-red-500 opacity-70", className)}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2c-1.5 0-3 .5-4 1.5C7 4.5 6 6 6 8c0 3.5 2.5 6.5 6 6.5s6-3 6-6.5c0-2-1-3.5-2-4.5C15 2.5 13.5 2 12 2zm0 1c1 0 2 .3 2.8 1C15.5 4.7 16 5.8 16 7c0 2.8-1.8 5-4 5s-4-2.2-4-5c0-1.2.5-2.3 1.2-3C10 3.3 11 3 12 3z"/>
    <circle cx="12" cy="7" r="3" opacity="0.6"/>
  </svg>
);

const LettuceDecoration = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute w-10 h-10 text-green-500 opacity-60", className)}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C9 2 7 4 7 7c0 1.5.5 3 1.5 4C9.5 12 10.5 13 12 13s2.5-1 3.5-2C16.5 10 17 8.5 17 7c0-3-2-5-5-5zm0 2c2 0 3 1.5 3 3 0 1-.3 2-.8 2.5-.5.5-1.2.5-2.2.5s-1.7 0-2.2-.5C9.3 9 9 8 9 7c0-1.5 1-3 3-3z"/>
    <path d="M12 7c-.5 0-1 .2-1.3.5-.3.3-.7.5-1.2.5h-.5c.2-.5.5-1 .8-1.3C10.2 6.3 11 6 12 6s1.8.3 2.2.7c.3.3.6.8.8 1.3h-.5c-.5 0-.9-.2-1.2-.5C13 7.2 12.5 7 12 7z" opacity="0.7"/>
  </svg>
);

const CheeseDecoration = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute w-6 h-8 text-yellow-400 opacity-75", className)}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6 8l6-4 6 4v8c0 2-1 3-3 3H9c-2 0-3-1-3-3V8z"/>
    <path d="M6 8c0-1 1-2 3-2h6c2 0 3 1 3 2" opacity="0.6"/>
    <circle cx="10" cy="12" r="1" opacity="0.8"/>
    <circle cx="14" cy="10" r="0.8" opacity="0.8"/>
    <circle cx="12" cy="14" r="0.6" opacity="0.8"/>
  </svg>
);

const SesameDecoration = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute w-3 h-3 text-yellow-200 opacity-80", className)}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="12" cy="12" r="8"/>
  </svg>
);

export function FoodBanner({
  title = "Savourez nos burgers uniques",
  description = "Des recettes fraîches, gourmandes et préparées avec des ingrédients de qualité",
  primaryButtonText = "Commander maintenant",
  secondaryButtonText = "Voir le menu",
  primaryButtonAction,
  secondaryButtonAction,
  imageUrl = "/images/food/hero-burger.svg",
  imageAlt = "Burger appétissant",
  className,
  showDecorations = true,
  isLoading = false,
  ...props
}: FoodBannerProps) {
  // Show skeleton while loading
  if (isLoading) {
    return <FoodBannerSkeleton className={className} showDecorations={showDecorations} />;
  }
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20",
        "rounded-3xl p-6 lg:p-12",
        className
      )}
      {...props}
    >
      {/* Decorative Elements */}
      {showDecorations && (
        <>
          <TomatoDecoration className="top-8 left-12 transform rotate-12 animate-pulse" />
          <LettuceDecoration className="top-6 right-16 transform -rotate-12 hover:rotate-6 transition-transform duration-500" />
          <CheeseDecoration className="bottom-12 left-8 transform rotate-45 hover:rotate-90 transition-transform duration-700" />
          <SesameDecoration className="top-20 left-1/4 animate-bounce" />
          <SesameDecoration className="top-24 right-1/3 animate-bounce delay-300" />
          <SesameDecoration className="bottom-20 right-12 animate-bounce delay-500" />
        </>
      )}

      <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Content Section */}
        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
              {description}
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button
              size="lg"
              onClick={primaryButtonAction}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {primaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryButtonAction}
              className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              {secondaryButtonText}
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative order-1 lg:order-2">
          <div className="relative w-full h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover hover:scale-110 transition-transform duration-700"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Image Decorations */}
            {showDecorations && (
              <div className="absolute inset-0 pointer-events-none">
                <TomatoDecoration className="top-4 right-4 w-6 h-6 animate-pulse delay-700" />
                <CheeseDecoration className="bottom-8 left-4 w-8 h-10 transform -rotate-12 animate-bounce delay-1000" />
              </div>
            )}
          </div>

          {/* Floating decoration behind image */}
          {showDecorations && (
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-400 rounded-full blur-2xl"></div>
        </div>
      </div>
    </Card>
  );
}

/**
 * FoodBanner Skeleton Component
 * 
 * Loading skeleton that matches the FoodBanner layout structure.
 * Uses the new skeleton system with MediaSkeleton and TextSkeleton.
 */
interface FoodBannerSkeletonProps {
  className?: string;
  showDecorations?: boolean;
}

function FoodBannerSkeleton({ className, showDecorations = true }: FoodBannerSkeletonProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 bg-gradient-to-br from-orange-50/50 via-red-50/50 to-yellow-50/50 dark:from-orange-950/10 dark:via-red-950/10 dark:to-yellow-950/10",
        "rounded-3xl p-6 lg:p-12",
        className
      )}
      role="status"
      aria-label="Chargement de la bannière alimentaire"
    >
      {/* Decorative skeleton elements */}
      {showDecorations && (
        <>
          <Skeleton variant="gradient" className="absolute top-8 left-12 w-8 h-8 rounded-full opacity-40" />
          <Skeleton variant="gradient" className="absolute top-6 right-16 w-10 h-10 rounded-full opacity-30" />
          <Skeleton variant="gradient" className="absolute bottom-12 left-8 w-6 h-8 rounded opacity-35" />
          <Skeleton variant="shimmer" className="absolute top-20 left-1/4 w-3 h-3 rounded-full opacity-50" />
          <Skeleton variant="shimmer" className="absolute top-24 right-1/3 w-3 h-3 rounded-full opacity-50" />
          <Skeleton variant="shimmer" className="absolute bottom-20 right-12 w-3 h-3 rounded-full opacity-50" />
        </>
      )}

      <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Content Section Skeleton */}
        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            {/* Title skeleton */}
            <TextSkeleton
              lines={[
                { height: "xl", width: "full" },
                { height: "xl", width: "3/4" }
              ]}
              variant="gradient"
              spacing="tight"
            />
            
            {/* Description skeleton */}
            <TextSkeleton
              lines={[
                { height: "lg", width: "full" },
                { height: "lg", width: "full" },
                { height: "lg", width: "2/3" }
              ]}
              variant="default"
              spacing="normal"
              className="max-w-lg"
            />
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Skeleton
              variant="gradient"
              className="h-12 w-48 rounded-lg shadow-lg"
            />
            <Skeleton
              variant="shimmer"
              className="h-12 w-40 rounded-lg border-2"
            />
          </div>
        </div>

        {/* Image Section Skeleton */}
        <div className="relative order-1 lg:order-2">
          <div className="relative w-full h-64 lg:h-96">
            <MediaSkeleton
              aspectRatio="photo"
              variant="gradient"
              showIcon={true}
              icon="image"
              rounded="xl"
              width="full"
              height="auto"
              className="shadow-2xl"
            />
            
            {/* Image decorations skeleton */}
            {showDecorations && (
              <div className="absolute inset-0 pointer-events-none">
                <Skeleton variant="shimmer" className="absolute top-4 right-4 w-6 h-6 rounded-full opacity-60" />
                <Skeleton variant="gradient" className="absolute bottom-8 left-4 w-8 h-10 rounded opacity-50" />
              </div>
            )}
          </div>

          {/* Floating decoration skeleton */}
          {showDecorations && (
            <Skeleton 
              variant="shimmer" 
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
            />
          )}
        </div>
      </div>

      {/* Background pattern skeleton */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-0 left-0 w-full h-full">
          <Skeleton variant="gradient" className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl opacity-20" />
          <Skeleton variant="gradient" className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-15" />
          <Skeleton variant="gradient" className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full blur-2xl opacity-25" />
        </div>
      </div>

      <span className="sr-only">Chargement de la bannière alimentaire en cours...</span>
    </Card>
  );
}