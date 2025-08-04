"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Zod schemas for component props validation
const TextSkeletonLineSchema = z.object({
  width: z.union([
    z.literal("full"),
    z.literal("3/4"), 
    z.literal("1/2"),
    z.literal("1/3"),
    z.literal("1/4"),
    z.string(), // Custom width class
  ]).optional().default("full"),
  height: z.union([
    z.literal("xs"), // h-3 (12px)
    z.literal("sm"), // h-4 (16px)
    z.literal("md"), // h-5 (20px)  
    z.literal("lg"), // h-6 (24px)
    z.literal("xl"), // h-8 (32px)
  ]).optional().default("md"),
  className: z.string().optional(),
});

const TextSkeletonPropsSchema = z.object({
  lines: z.union([
    z.number().min(1).max(10),
    z.array(TextSkeletonLineSchema),
  ]).optional().default(1),
  variant: z.union([
    z.literal("default"), // Standard gray skeleton
    z.literal("gradient"), // Gradient skeleton like hero banner
    z.literal("shimmer"), // Animated shimmer effect
  ]).optional().default("default"),
  spacing: z.union([
    z.literal("tight"),  // gap-1
    z.literal("normal"), // gap-2
    z.literal("relaxed"), // gap-3
    z.literal("loose"),   // gap-4
  ]).optional().default("normal"),
  className: z.string().optional(),
});

export type TextSkeletonProps = z.infer<typeof TextSkeletonPropsSchema>;
export type TextSkeletonLine = z.infer<typeof TextSkeletonLineSchema>;

/**
 * Height mapping for skeleton lines
 */
const heightClasses = {
  xs: "h-3",
  sm: "h-4", 
  md: "h-5",
  lg: "h-6",
  xl: "h-8",
} as const;

/**
 * Width mapping for skeleton lines
 */
const widthClasses = {
  full: "w-full",
  "3/4": "w-3/4",
  "1/2": "w-1/2", 
  "1/3": "w-1/3",
  "1/4": "w-1/4",
} as const;

/**
 * Spacing mapping for skeleton containers
 */
const spacingClasses = {
  tight: "gap-1",
  normal: "gap-2",
  relaxed: "gap-3",
  loose: "gap-4",
} as const;

/**
 * Get variant-specific classes for skeleton styling
 */
const getVariantClasses = (variant: TextSkeletonProps["variant"]) => {
  switch (variant) {
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
 * TextSkeleton Component
 * 
 * A flexible skeleton component for text content with multiple lines,
 * responsive sizing, and various visual styles.
 * 
 * Features:
 * - Multiple line support with customizable widths
 * - Responsive height variations (xs to xl)
 * - Three visual variants (default, gradient, shimmer)
 * - Customizable spacing between lines
 * - Zod runtime validation
 * - Full accessibility support
 * 
 * @param props - Component props validated with Zod
 * @returns JSX element with text skeleton
 */
export function TextSkeleton(props: TextSkeletonProps) {
  // Validate props at runtime
  const validatedProps = TextSkeletonPropsSchema.parse(props);
  const { lines, variant, spacing, className } = validatedProps;

  // Generate lines configuration
  const linesConfig = React.useMemo(() => {
    if (typeof lines === "number") {
      // Generate default line configurations
      return Array.from({ length: lines }, (_, index) => ({
        width: index === lines - 1 && lines > 1 ? ("3/4" as const) : ("full" as const),
        height: "md" as const,
      }));
    }
    return lines;
  }, [lines]);

  const variantClasses = getVariantClasses(variant);
  const spacingClass = spacingClasses[spacing!];

  return (
    <div 
      className={cn("flex flex-col", spacingClass, className)}
      role="status"
      aria-label="Chargement du contenu textuel"
    >
      {linesConfig.map((line, index) => (
        <TextSkeletonLine 
          key={index}
          line={line}
          variant={variant}
          variantClasses={variantClasses}
        />
      ))}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
}

/**
 * Individual skeleton line component
 */
interface TextSkeletonLineProps {
  line: TextSkeletonLine;
  variant: TextSkeletonProps["variant"];
  variantClasses: string;
}

function TextSkeletonLine({ line, variant, variantClasses }: TextSkeletonLineProps) {
  const heightClass = heightClasses[line.height!];
  const widthClass = typeof line.width === "string" && line.width in widthClasses 
    ? widthClasses[line.width as keyof typeof widthClasses]
    : line.width || "w-full";

  return (
    <div
      className={cn(
        "rounded-md",
        heightClass,
        widthClass,
        variantClasses,
        line.className
      )}
    >
      {variant === "shimmer" && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Preset configurations for common use cases
export const TextSkeletonPresets = {
  /**
   * Single line skeleton for titles/headings
   */
  title: (props?: Partial<TextSkeletonProps>) => (
    <TextSkeleton 
      lines={[{ height: "xl", width: "3/4" }]}
      variant="gradient"
      spacing="normal"
      {...props}
    />
  ),

  /**
   * Paragraph skeleton with multiple lines
   */
  paragraph: (props?: Partial<TextSkeletonProps>) => (
    <TextSkeleton 
      lines={3}
      variant="default"
      spacing="normal"
      {...props}
    />
  ),

  /**
   * Long paragraph skeleton 
   */
  longParagraph: (props?: Partial<TextSkeletonProps>) => (
    <TextSkeleton 
      lines={5}
      variant="default"
      spacing="normal"
      {...props}
    />
  ),

  /**
   * Button text skeleton
   */
  button: (props?: Partial<TextSkeletonProps>) => (
    <TextSkeleton 
      lines={[{ height: "md", width: "1/2" }]}
      variant="default"
      spacing="normal"
      {...props}
    />
  ),

  /**
   * Caption/small text skeleton
   */
  caption: (props?: Partial<TextSkeletonProps>) => (
    <TextSkeleton 
      lines={[{ height: "sm", width: "2/3" }]}
      variant="default"
      spacing="normal"
      {...props}
    />
  ),
} as const;

export default TextSkeleton;