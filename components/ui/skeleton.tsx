"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Zod schema for enhanced skeleton props
const SkeletonPropsSchema = z.object({
  variant: z.union([
    z.literal("default"),    // Standard muted background
    z.literal("media"),      // Media skeleton with --skeleton-media-color
    z.literal("gradient"),   // Gradient effect
    z.literal("shimmer"),    // Animated shimmer effect
  ]).optional().default("default"),
  size: z.union([
    z.literal("xs"),         // h-3 w-12
    z.literal("sm"),         // h-4 w-16
    z.literal("md"),         // h-5 w-20
    z.literal("lg"),         // h-6 w-24
    z.literal("xl"),         // h-8 w-32
  ]).optional(),
  shape: z.union([
    z.literal("rectangle"),  // Default rounded-md
    z.literal("circle"),     // Rounded-full with equal width/height
    z.literal("pill"),       // Fully rounded sides
    z.literal("square"),     // No border radius
  ]).optional().default("rectangle"),
  className: z.string().optional(),
});

// Props interface extending HTML div attributes
interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: z.infer<typeof SkeletonPropsSchema>["variant"];
  size?: z.infer<typeof SkeletonPropsSchema>["size"];
  shape?: z.infer<typeof SkeletonPropsSchema>["shape"];
  className?: string;
}

/**
 * Size mapping for skeleton elements
 */
const sizeClasses = {
  xs: "h-3 w-12",
  sm: "h-4 w-16", 
  md: "h-5 w-20",
  lg: "h-6 w-24",
  xl: "h-8 w-32",
} as const;

/**
 * Shape mapping for skeleton elements
 */
const shapeClasses = {
  rectangle: "rounded-md",
  circle: "rounded-full aspect-square",
  pill: "rounded-full",
  square: "rounded-none",
} as const;

/**
 * Get variant-specific classes for skeleton styling
 */
const getVariantClasses = (variant: SkeletonProps["variant"]) => {
  switch (variant) {
    case "media":
      return "bg-skeleton-media animate-pulse";
    case "gradient":
      return "bg-gradient-to-r from-muted via-muted/80 to-muted/60 animate-pulse";
    case "shimmer":
      return "relative bg-muted animate-pulse overflow-hidden";
    case "default":
    default:
      return "bg-muted animate-pulse";
  }
};

/**
 * Enhanced Skeleton Component
 * 
 * An improved version of the basic skeleton with additional features:
 * - Multiple variants (default, media, gradient, shimmer)
 * - Predefined sizes (xs to xl)
 * - Different shapes (rectangle, circle, pill, square)
 * - Maintains backward compatibility with original API
 * - Zod validation for type safety
 * 
 * @param props - Component props extending HTML div attributes
 * @returns JSX element with enhanced skeleton styling
 */
function Skeleton({
  variant = "default",
  size,
  shape = "rectangle",
  className,
  ...props
}: SkeletonProps) {
  // Validate props when provided
  if (variant || size || shape) {
    const validationResult = SkeletonPropsSchema.safeParse({
      variant,
      size,
      shape,
      className,
    });
    
    if (!validationResult.success) {
      console.warn("Invalid skeleton props:", validationResult.error.message);
    }
  }

  // Get style classes
  const variantClasses = getVariantClasses(variant);
  const sizeClass = size ? sizeClasses[size] : "";
  const shapeClass = shapeClasses[shape];

  return (
    <div
      className={cn(
        variantClasses,
        shapeClass,
        sizeClass,
        className
      )}
      role="status"
      aria-label="Chargement du contenu"
      {...props}
    >
      {/* Shimmer effect overlay */}
      {variant === "shimmer" && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
}

// Enhanced skeleton variants as separate components for convenience
const SkeletonText = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton variant="default" {...props} />
);

const SkeletonMedia = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton variant="media" {...props} />
);

const SkeletonGradient = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton variant="gradient" {...props} />
);

const SkeletonShimmer = (props: Omit<SkeletonProps, 'variant'>) => (
  <Skeleton variant="shimmer" {...props} />
);

export { 
  Skeleton,
  SkeletonText,
  SkeletonMedia, 
  SkeletonGradient,
  SkeletonShimmer,
  type SkeletonProps,
};