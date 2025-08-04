"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Zod schemas for component props validation
const MediaSkeletonPropsSchema = z.object({
  aspectRatio: z.union([
    z.literal("square"),     // 1:1 aspect ratio
    z.literal("video"),      // 16:9 aspect ratio
    z.literal("photo"),      // 4:3 aspect ratio
    z.literal("portrait"),   // 3:4 aspect ratio
    z.literal("banner"),     // 21:9 aspect ratio
    z.literal("auto"),       // No forced aspect ratio
    z.string(),              // Custom aspect ratio class
  ]).optional().default("auto"),
  width: z.union([
    z.literal("full"),       // w-full
    z.literal("auto"),       // w-auto  
    z.string(),              // Custom width class
  ]).optional().default("full"),
  height: z.union([
    z.literal("auto"),       // h-auto
    z.literal("32"),         // h-32 (128px)
    z.literal("48"),         // h-48 (192px)
    z.literal("64"),         // h-64 (256px)
    z.literal("80"),         // h-80 (320px)
    z.literal("96"),         // h-96 (384px)
    z.string(),              // Custom height class
  ]).optional().default("auto"),
  variant: z.union([
    z.literal("default"),    // Basic media skeleton with --skeleton-media-color
    z.literal("gradient"),   // Gradient effect similar to hero banner
    z.literal("shimmer"),    // Animated shimmer effect
    z.literal("pulse"),      // Enhanced pulse animation
  ]).optional().default("default"),
  showIcon: z.boolean().optional().default(true),
  icon: z.union([
    z.literal("image"),      // Camera/image icon
    z.literal("video"),      // Play/video icon
    z.literal("file"),       // Document/file icon
    z.literal("none"),       // No icon
  ]).optional().default("image"),
  rounded: z.union([
    z.literal("none"),       // rounded-none
    z.literal("sm"),         // rounded-sm
    z.literal("md"),         // rounded-md
    z.literal("lg"),         // rounded-lg
    z.literal("xl"),         // rounded-xl
    z.literal("full"),       // rounded-full
  ]).optional().default("md"),
  className: z.string().optional(),
});

export type MediaSkeletonProps = z.infer<typeof MediaSkeletonPropsSchema>;

/**
 * Aspect ratio mapping for media containers
 */
const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video", // 16:9
  photo: "aspect-[4/3]",
  portrait: "aspect-[3/4]", 
  banner: "aspect-[21/9]",
  auto: "",
} as const;

/**
 * Width mapping for media containers
 */
const widthClasses = {
  full: "w-full",
  auto: "w-auto",
} as const;

/**
 * Height mapping for media containers
 */
const heightClasses = {
  auto: "h-auto",
  "32": "h-32",
  "48": "h-48", 
  "64": "h-64",
  "80": "h-80",
  "96": "h-96",
} as const;

/**
 * Rounded corner mapping
 */
const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg", 
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

/**
 * Get variant-specific classes for media skeleton styling
 */
const getVariantClasses = (variant: MediaSkeletonProps["variant"]) => {
  switch (variant) {
    case "gradient":
      return "bg-gradient-to-br from-skeleton-media via-skeleton-media/80 to-skeleton-media/60 animate-pulse";
    case "shimmer":
      return "relative bg-skeleton-media animate-pulse overflow-hidden";
    case "pulse":
      return "bg-skeleton-media animate-pulse shadow-md";
    case "default":
    default:
      return "bg-skeleton-media animate-pulse";
  }
};

/**
 * Get icon for media type
 */
const getMediaIcon = (icon: MediaSkeletonProps["icon"]) => {
  switch (icon) {
    case "image":
      return (
        <svg 
          className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground/40" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 10l2-3 2 3h6l-4-5-4 5H8z"/>
        </svg>
      );
    case "video":
      return (
        <svg 
          className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground/40"
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
      );
    case "file":
      return (
        <svg 
          className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground/40"
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6"/>
        </svg>
      );
    case "none":
    default:
      return null;
  }
};

/**
 * MediaSkeleton Component
 * 
 * A skeleton component specifically designed for image and video containers.
 * Uses the new --skeleton-media-color CSS variable for consistent media placeholder styling.
 * 
 * Features:
 * - Multiple aspect ratios (square, video, photo, portrait, banner)
 * - Responsive sizing with customizable width/height
 * - Four visual variants (default, gradient, shimmer, pulse)
 * - Optional media type icons (image, video, file)
 * - Customizable border radius
 * - Uses dedicated --skeleton-media-color variable
 * - Full accessibility support
 * - Zod runtime validation
 * 
 * @param props - Component props validated with Zod
 * @returns JSX element with media skeleton
 */
export function MediaSkeleton(props: MediaSkeletonProps) {
  // Validate props at runtime
  const validatedProps = MediaSkeletonPropsSchema.parse(props);
  const { 
    aspectRatio, 
    width, 
    height, 
    variant, 
    showIcon, 
    icon, 
    rounded, 
    className 
  } = validatedProps;

  // Get style classes
  const aspectRatioClass = typeof aspectRatio === "string" && aspectRatio in aspectRatioClasses
    ? aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses]
    : aspectRatio;

  const widthClass = typeof width === "string" && width in widthClasses
    ? widthClasses[width as keyof typeof widthClasses]  
    : width;

  const heightClass = typeof height === "string" && height in heightClasses
    ? heightClasses[height as keyof typeof heightClasses]
    : height;

  const roundedClass = roundedClasses[rounded!];
  const variantClasses = getVariantClasses(variant);

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "transition-all duration-300",
        aspectRatioClass,
        widthClass,
        heightClass,
        roundedClass,
        variantClasses,
        className
      )}
      role="img"
      aria-label="Chargement du contenu média"
    >
      {/* Media type icon */}
      {showIcon && icon !== "none" && (
        <div className="flex items-center justify-center">
          {getMediaIcon(icon)}
        </div>
      )}

      {/* Shimmer effect overlay */}
      {variant === "shimmer" && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"
          style={{ 
            animation: "shimmer 2s ease-in-out infinite",
            backgroundSize: "200% 100%"
          }}
          aria-hidden="true"
        />
      )}

      {/* Enhanced pulse effect */}
      {variant === "pulse" && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-skeleton-media/20 to-transparent opacity-50"
          aria-hidden="true"
        />
      )}

      <span className="sr-only">Chargement du média en cours...</span>
    </div>
  );
}

// Preset configurations for common media types
export const MediaSkeletonPresets = {
  /**
   * Avatar/profile image skeleton
   */
  avatar: (props?: Partial<MediaSkeletonProps>) => (
    <MediaSkeleton
      aspectRatio="square"
      width="auto"
      height="32"
      showIcon={true}
      rounded="full"
      icon="image"
      variant="default"
      {...props}
    />
  ),

  /**
   * Thumbnail image skeleton
   */
  thumbnail: (props?: Partial<MediaSkeletonProps>) => (
    <MediaSkeleton
      aspectRatio="photo"
      width="auto"
      height="48"
      showIcon={true}
      rounded="lg"
      icon="image"
      variant="gradient"
      {...props}
    />
  ),

  /**
   * Video player skeleton
   */
  videoPlayer: (props?: Partial<MediaSkeletonProps>) => (
    <MediaSkeleton
      aspectRatio="video"
      width="full"
      height="auto"
      showIcon={true}
      rounded="lg"
      icon="video"
      variant="shimmer"
      {...props}
    />
  ),

  /**
   * Hero/banner image skeleton
   */
  hero: (props?: Partial<MediaSkeletonProps>) => (
    <MediaSkeleton
      aspectRatio="banner"
      width="full"
      height="auto"
      showIcon={true}
      rounded="xl"
      icon="image"
      variant="gradient"
      {...props}
    />
  ),

  /**
   * Gallery image skeleton
   */
  gallery: (props?: Partial<MediaSkeletonProps>) => (
    <MediaSkeleton
      aspectRatio="square"
      width="full"
      height="auto"
      showIcon={true}
      rounded="md"
      icon="image"
      variant="pulse"
      {...props}
    />
  ),

  /**
   * Document/file preview skeleton
   */
  document: (props?: Partial<MediaSkeletonProps>) => (
    <MediaSkeleton
      aspectRatio="portrait"
      width="auto"
      height="64"
      showIcon={true}
      rounded="lg"
      icon="file"
      variant="default"
      {...props}
    />
  ),
} as const;

export default MediaSkeleton;