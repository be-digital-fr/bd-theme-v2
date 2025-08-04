"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { MediaSkeleton, type MediaSkeletonProps } from "./media-skeleton";
import { TextSkeleton, type TextSkeletonProps } from "./text-skeleton";
import { Skeleton } from "./skeleton";

// Zod schemas for component props validation
const CardSkeletonPropsSchema = z.object({
  layout: z.union([
    z.literal("vertical"),      // Image on top, content below
    z.literal("horizontal"),    // Image on left, content on right
    z.literal("overlay"),       // Content overlaid on image
    z.literal("minimal"),       // Text only, no image
  ]).optional().default("vertical"),
  imageConfig: z.object({
    aspectRatio: z.union([
      z.literal("square"),
      z.literal("video"),
      z.literal("photo"),
      z.literal("portrait"),
      z.literal("banner"),
      z.literal("auto"),
    ]).optional().default("photo"),
    variant: z.union([
      z.literal("default"),
      z.literal("gradient"),
      z.literal("shimmer"),
      z.literal("pulse"),
    ]).optional().default("gradient"),
    showIcon: z.boolean().optional().default(true),
    icon: z.union([
      z.literal("image"),
      z.literal("video"),
      z.literal("file"),
      z.literal("none"),
    ]).optional().default("image"),
    rounded: z.union([
      z.literal("none"),
      z.literal("sm"),
      z.literal("md"),
      z.literal("lg"),
      z.literal("xl"),
      z.literal("full"),
    ]).optional().default("md"),
  }).optional(),
  contentConfig: z.object({
    title: z.object({
      lines: z.number().min(1).max(3).optional().default(1),
      variant: z.union([
        z.literal("default"),
        z.literal("gradient"),
        z.literal("shimmer"),
      ]).optional().default("gradient"),
    }).optional(),
    description: z.object({
      lines: z.number().min(1).max(5).optional().default(2),
      variant: z.union([
        z.literal("default"),
        z.literal("gradient"),
        z.literal("shimmer"),
      ]).optional().default("default"),
    }).optional(),
    metadata: z.object({
      lines: z.number().min(1).max(3).optional().default(1),
      variant: z.union([
        z.literal("default"),
        z.literal("gradient"),
        z.literal("shimmer"),
      ]).optional().default("default"),
    }).optional(),
    actions: z.object({
      buttons: z.number().min(0).max(3).optional().default(0),
      variant: z.union([
        z.literal("default"),
        z.literal("gradient"),
        z.literal("shimmer"),
      ]).optional().default("default"),
    }).optional(),
  }).optional(),
  padding: z.union([
    z.literal("none"),    // p-0
    z.literal("sm"),      // p-3
    z.literal("md"),      // p-4
    z.literal("lg"),      // p-6
    z.literal("xl"),      // p-8
  ]).optional().default("md"),
  rounded: z.union([
    z.literal("none"),    // rounded-none
    z.literal("sm"),      // rounded-sm
    z.literal("md"),      // rounded-md
    z.literal("lg"),      // rounded-lg
    z.literal("xl"),      // rounded-xl
  ]).optional().default("lg"),
  shadow: z.boolean().optional().default(true),
  border: z.boolean().optional().default(false),
  className: z.string().optional(),
});

export type CardSkeletonProps = z.infer<typeof CardSkeletonPropsSchema>;

/**
 * Padding mapping for card containers
 */
const paddingClasses = {
  none: "p-0",
  sm: "p-3",
  md: "p-4", 
  lg: "p-6",
  xl: "p-8",
} as const;

/**
 * Rounded corner mapping for cards
 */
const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
} as const;

/**
 * CardSkeleton Component
 * 
 * A composite skeleton component that combines MediaSkeleton and TextSkeleton
 * to create common card layouts. Perfect for product cards, blog posts, 
 * user profiles, and other card-based UI patterns.
 * 
 * Features:
 * - Multiple layout options (vertical, horizontal, overlay, minimal)
 * - Configurable image and content sections
 * - Responsive design with proper spacing
 * - Support for title, description, metadata, and action skeletons
 * - Customizable padding, borders, shadows, and corners
 * - Full Zod validation and TypeScript support
 * - Accessibility features
 * 
 * @param props - Component props validated with Zod
 * @returns JSX element with card skeleton layout
 */
export function CardSkeleton(props: CardSkeletonProps) {
  // Validate props at runtime
  const validatedProps = CardSkeletonPropsSchema.parse(props);
  const {
    layout,
    imageConfig,
    contentConfig,
    padding,
    rounded,
    shadow,
    border,
    className,
  } = validatedProps;

  // Get style classes
  const paddingClass = paddingClasses[padding!];
  const roundedClass = roundedClasses[rounded!];

  const containerClasses = cn(
    "bg-card",
    roundedClass,
    paddingClass,
    shadow && "shadow-md",
    border && "border border-border",
    "transition-all duration-300",
    className
  );

  // Layout-specific rendering
  switch (layout) {
    case "horizontal":
      return (
        <div className={containerClasses} role="status" aria-label="Chargement de la carte">
          <div className="flex gap-4">
            {/* Image section */}
            {imageConfig && (
              <div className="flex-shrink-0 w-24 sm:w-32 md:w-40">
                <MediaSkeleton
                  aspectRatio={imageConfig.aspectRatio}
                  variant={imageConfig.variant}
                  showIcon={imageConfig.showIcon}
                  icon={imageConfig.icon || "image"}
                  rounded={imageConfig.rounded || "md"}
                  width="full"
                  height="auto"
                />
              </div>
            )}
            
            {/* Content section */}
            <div className="flex-1 min-w-0">
              <CardContent contentConfig={contentConfig} />
            </div>
          </div>
        </div>
      );

    case "overlay":
      return (
        <div className={cn(containerClasses, "relative overflow-hidden")} role="status" aria-label="Chargement de la carte">
          {/* Background image */}
          {imageConfig && (
            <MediaSkeleton
              aspectRatio={imageConfig.aspectRatio}
              variant={imageConfig.variant}
              showIcon={imageConfig.showIcon}
              icon={imageConfig.icon || "image"}
              rounded={imageConfig.rounded || "md"}
              width="full"
              height="auto"
              className="absolute inset-0"
            />
          )}
          
          {/* Overlay content */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="mt-auto">
              <CardContent contentConfig={contentConfig} />
            </div>
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className={containerClasses} role="status" aria-label="Chargement de la carte">
          <CardContent contentConfig={contentConfig} />
        </div>
      );

    case "vertical":
    default:
      return (
        <div className={containerClasses} role="status" aria-label="Chargement de la carte">
          {/* Image section */}
          {imageConfig && (
            <div className="mb-4">
              <MediaSkeleton
                aspectRatio={imageConfig.aspectRatio}
                variant={imageConfig.variant}
                showIcon={imageConfig.showIcon}
                icon={imageConfig.icon || "image"}
                rounded={imageConfig.rounded || "md"}
                width="full"
                height="auto"
              />
            </div>
          )}
          
          {/* Content section */}
          <CardContent contentConfig={contentConfig} />
        </div>
      );
  }
}

/**
 * Card content section component
 */
interface CardContentProps {
  contentConfig?: CardSkeletonProps["contentConfig"];
}

function CardContent({ contentConfig }: CardContentProps) {
  return (
    <div className="space-y-3">
      {/* Title skeleton */}
      {contentConfig?.title && (
        <TextSkeleton
          lines={[
            { height: "lg", width: "full" },
            ...(contentConfig.title.lines > 1 
              ? Array.from({ length: contentConfig.title.lines - 1 }, () => ({ 
                  height: "lg" as const, 
                  width: "3/4" as const 
                }))
              : []
            )
          ]}
          variant={contentConfig.title.variant}
          spacing="tight"
        />
      )}

      {/* Description skeleton */}
      {contentConfig?.description && (
        <TextSkeleton
          lines={contentConfig.description.lines}
          variant={contentConfig.description.variant}
          spacing="normal"
        />
      )}

      {/* Metadata skeleton */}
      {contentConfig?.metadata && (
        <TextSkeleton
          variant={contentConfig.metadata.variant}
          spacing="tight"
          lines={[
            { height: "sm", width: "1/2" },
            ...(contentConfig.metadata.lines > 1
              ? Array.from({ length: contentConfig.metadata.lines - 1 }, () => ({
                  height: "sm" as const,
                  width: "1/3" as const
                }))
              : []
            )
          ]}
        />
      )}

      {/* Action buttons skeleton */}
      {contentConfig?.actions?.buttons && contentConfig.actions.buttons > 0 && (
        <div className="flex gap-2 pt-2">
          {Array.from({ length: contentConfig.actions.buttons }).map((_, index) => (
            <Skeleton
              key={index}
              variant={contentConfig.actions?.variant}
              className="h-9 w-20 rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Preset configurations for common card types
export const CardSkeletonPresets = {
  /**
   * Product card skeleton
   */
  product: (props?: Partial<CardSkeletonProps>) => (
    <CardSkeleton
      layout="vertical"
      padding="md"
      rounded="lg"
      shadow={true}
      border={false}
      imageConfig={{
        aspectRatio: "square",
        variant: "gradient",
        showIcon: true,
        icon: "image",
        rounded: "md",
      }}
      contentConfig={{
        title: { lines: 1, variant: "gradient" },
        description: { lines: 2, variant: "default" },
        metadata: { lines: 1, variant: "default" },
        actions: { buttons: 1, variant: "default" },
      }}
      {...props}
    />
  ),

  /**
   * Blog post card skeleton
   */
  blogPost: (props?: Partial<CardSkeletonProps>) => (
    <CardSkeleton
      layout="vertical"
      padding="md"
      rounded="lg"
      shadow={true}
      border={false}
      imageConfig={{
        aspectRatio: "video",
        variant: "shimmer",
        showIcon: true,
        icon: "image",
        rounded: "md",
      }}
      contentConfig={{
        title: { lines: 2, variant: "gradient" },
        description: { lines: 3, variant: "default" },
        metadata: { lines: 2, variant: "default" },
        actions: { buttons: 0, variant: "default" },
      }}
      {...props}
    />
  ),

  /**
   * User profile card skeleton
   */
  profile: (props?: Partial<CardSkeletonProps>) => (
    <CardSkeleton
      layout="horizontal"
      padding="md"
      rounded="lg"
      shadow={true}
      border={false}
      imageConfig={{
        aspectRatio: "square",
        variant: "gradient",
        showIcon: true,
        icon: "image",
        rounded: "md",
      }}
      contentConfig={{
        title: { lines: 1, variant: "gradient" },
        description: { lines: 1, variant: "default" },
        metadata: { lines: 2, variant: "default" },
        actions: { buttons: 2, variant: "default" },
      }}
      {...props}
    />
  ),

  /**
   * Feature card skeleton (text only)
   */
  feature: (props?: Partial<CardSkeletonProps>) => (
    <CardSkeleton
      layout="minimal"
      contentConfig={{
        title: { lines: 1, variant: "gradient" },
        description: { lines: 2, variant: "default" },
        actions: { buttons: 0, variant: "default" },
      }}
      padding="lg"
      rounded="lg"
      shadow={true}
      border={false}
      {...props}
    />
  ),

  /**
   * Hero card skeleton with overlay
   */
  hero: (props?: Partial<CardSkeletonProps>) => (
    <CardSkeleton
      layout="overlay"
      imageConfig={{
        aspectRatio: "banner",
        variant: "shimmer",
        showIcon: false,
      }}
      contentConfig={{
        title: { lines: 2, variant: "gradient" },
        description: { lines: 1, variant: "default" },
        actions: { buttons: 2, variant: "gradient" },
      }}
      padding="xl"
      {...props}
    />
  ),
} as const;

export default CardSkeleton;