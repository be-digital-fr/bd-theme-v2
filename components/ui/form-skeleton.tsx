"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { TextSkeleton } from "./text-skeleton";
import { Skeleton } from "./skeleton";

// Zod schemas for form field configurations
const FormFieldSkeletonSchema = z.object({
  type: z.union([
    z.literal("input"),      // Text input field
    z.literal("textarea"),   // Multi-line text area
    z.literal("select"),     // Dropdown/select field
    z.literal("checkbox"),   // Checkbox field
    z.literal("radio"),      // Radio button group
    z.literal("file"),       // File upload field
    z.literal("button"),     // Action button
    z.literal("title"),      // Section title
    z.literal("divider"),    // Visual separator
  ]),
  label: z.boolean().optional().default(true), // Show field label skeleton
  width: z.union([
    z.literal("full"),       // w-full
    z.literal("1/2"),        // w-1/2
    z.literal("1/3"),        // w-1/3
    z.literal("2/3"),        // w-2/3
    z.literal("auto"),       // w-auto
  ]).optional().default("full"),
  required: z.boolean().optional().default(false), // Show required indicator
  helpText: z.boolean().optional().default(false), // Show help text skeleton
  error: z.boolean().optional().default(false), // Show error state
  className: z.string().optional(),
});

// Transform function to apply defaults
const FormFieldSkeletonTransform = FormFieldSkeletonSchema.transform((data) => ({
  type: data.type,
  label: data.label ?? true,
  width: data.width ?? "full",
  required: data.required ?? false,
  helpText: data.helpText ?? false,
  error: data.error ?? false,
  className: data.className,
}));

const FormSkeletonPropsSchema = z.object({
  fields: z.array(FormFieldSkeletonSchema),
  variant: z.union([
    z.literal("default"),    // Standard skeleton styling
    z.literal("gradient"),   // Gradient skeleton effects
    z.literal("shimmer"),    // Animated shimmer effects
  ]).optional().default("default"),
  layout: z.union([
    z.literal("vertical"),   // Stack fields vertically
    z.literal("grid"),       // Grid layout for fields
  ]).optional().default("vertical"),
  spacing: z.union([
    z.literal("tight"),      // gap-3
    z.literal("normal"),     // gap-4
    z.literal("relaxed"),    // gap-6
    z.literal("loose"),      // gap-8
  ]).optional().default("normal"),
  padding: z.union([
    z.literal("none"),       // p-0
    z.literal("sm"),         // p-4
    z.literal("md"),         // p-6
    z.literal("lg"),         // p-8
  ]).optional().default("md"),
  border: z.boolean().optional().default(true),
  className: z.string().optional(),
});

// Transform schema to apply defaults
const FormSkeletonPropsTransform = FormSkeletonPropsSchema.transform((data) => ({
  fields: data.fields.map(field => FormFieldSkeletonTransform.parse(field)),
  variant: data.variant ?? "default",
  layout: data.layout ?? "vertical",
  spacing: data.spacing ?? "normal",
  padding: data.padding ?? "md",
  border: data.border ?? true,
  className: data.className,
}));

export type FormSkeletonProps = z.infer<typeof FormSkeletonPropsSchema>;
export type FormFieldSkeleton = z.infer<typeof FormFieldSkeletonTransform>;

/**
 * Width mapping for form fields
 */
const widthClasses = {
  full: "w-full",
  "1/2": "w-1/2",
  "1/3": "w-1/3", 
  "2/3": "w-2/3",
  auto: "w-auto",
} as const;

/**
 * Spacing mapping for form containers
 */
const spacingClasses = {
  tight: "gap-3",
  normal: "gap-4",
  relaxed: "gap-6",
  loose: "gap-8",
} as const;

/**
 * Padding mapping for form containers
 */
const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

/**
 * FormSkeleton Component
 * 
 * A comprehensive skeleton component for forms with support for various
 * field types, layouts, and styling options. Perfect for authentication
 * forms, settings panels, and data entry forms.
 * 
 * Features:
 * - Multiple field types (input, textarea, select, checkbox, etc.)
 * - Flexible layout options (vertical, grid)
 * - Configurable spacing and padding
 * - Support for labels, help text, and error states
 * - Responsive field widths
 * - Three visual variants (default, gradient, shimmer)
 * - Full Zod validation and TypeScript support
 * - Accessibility features
 * 
 * @param props - Component props validated with Zod
 * @returns JSX element with form skeleton layout
 */
export function FormSkeleton(props: FormSkeletonProps) {
  // Validate props at runtime and apply defaults
  const validatedProps = FormSkeletonPropsTransform.parse(props);
  const {
    fields,
    variant,
    layout,
    spacing,
    padding,
    border,
    className,
  } = validatedProps;

  // Get style classes
  const spacingClass = spacingClasses[spacing!];
  const paddingClass = paddingClasses[padding!];

  const containerClasses = cn(
    "bg-card rounded-lg",
    paddingClass,
    border && "border border-border",
    "transition-all duration-300",
    className
  );

  const fieldsContainerClasses = cn(
    "flex flex-col",
    spacingClass,
    layout === "grid" && "sm:grid sm:grid-cols-2 sm:gap-x-6"
  );

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-label="Chargement du formulaire"
    >
      <div className={fieldsContainerClasses}>
        {fields.map((field, index) => (
          <FormFieldSkeleton
            key={index}
            field={field}
            variant={variant}
            layout={layout}
          />
        ))}
      </div>
      <span className="sr-only">Chargement du formulaire en cours...</span>
    </div>
  );
}

/**
 * Individual form field skeleton component
 */
interface FormFieldSkeletonProps {
  field: FormFieldSkeleton;
  variant: FormSkeletonProps["variant"];
  layout: FormSkeletonProps["layout"];
}

function FormFieldSkeleton({ field, variant, layout }: FormFieldSkeletonProps) {
  const widthClass = widthClasses[field.width!];

  // Handle special field types
  switch (field.type) {
    case "title":
      return (
        <div className={cn("space-y-2", widthClass, field.className)}>
          <TextSkeleton
            lines={[{ height: "xl", width: "1/2" }]}
            variant={variant}
            spacing="normal"
          />
        </div>
      );

    case "divider":
      return (
        <div className={cn("py-2", widthClass, field.className)}>
          <Skeleton variant={variant} className="h-px w-full" />
        </div>
      );

    case "button":
      return (
        <div className={cn("space-y-2", field.width === "auto" ? "w-auto" : "w-full", field.className)}>
          <Skeleton
            variant={variant}
            className={cn(
              "h-10 rounded-md",
              field.width === "auto" ? "w-24" : "w-full"
            )}
          />
        </div>
      );

    default:
      return (
        <div className={cn("space-y-2", widthClass, field.className)}>
          {/* Field label */}
          {field.label && (
            <div className="flex items-center gap-1">
              <TextSkeleton
                lines={[{ height: "sm", width: "1/4" }]}
                variant={variant}
                spacing="normal"
              />
              {field.required && (
                <Skeleton variant={variant} className="w-2 h-2 rounded-full" />
              )}
            </div>
          )}

          {/* Field input */}
          <FormInputSkeleton field={field} variant={variant} />

          {/* Help text */}
          {field.helpText && (
            <TextSkeleton
              lines={[{ height: "xs", width: "3/4" }]}
              variant="default"
              spacing="normal"
            />
          )}

          {/* Error message */}
          {field.error && (
            <TextSkeleton
              lines={[{ height: "xs", width: "1/2" }]}
              variant="default"
              spacing="normal"
              className="text-destructive"
            />
          )}
        </div>
      );
  }
}

/**
 * Form input skeleton based on field type
 */
function FormInputSkeleton({ field, variant }: { field: FormFieldSkeleton; variant: FormSkeletonProps["variant"] }) {
  switch (field.type) {
    case "textarea":
      return (
        <Skeleton
          variant={variant}
          className="h-24 w-full rounded-md"
        />
      );

    case "select":
      return (
        <div className="relative">
          <Skeleton
            variant={variant}
            className="h-10 w-full rounded-md"
          />
          <Skeleton
            variant={variant}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-3">
          <Skeleton
            variant={variant}
            shape="square"
            className="w-4 h-4 rounded"
          />
          <TextSkeleton
            lines={[{ height: "sm", width: "1/3" }]}
            variant={variant}
            spacing="normal"
          />
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton
                variant={variant}
                shape="circle"
                className="w-4 h-4"
              />
              <TextSkeleton
                lines={[{ height: "sm", width: "1/4" }]}
                variant={variant}
                spacing="normal"
              />
            </div>
          ))}
        </div>
      );

    case "file":
      return (
        <div className="border-2 border-dashed border-muted rounded-md p-6">
          <div className="flex flex-col items-center gap-2">
            <Skeleton
              variant={variant}
              className="w-8 h-8 rounded"
            />
            <TextSkeleton
              lines={[{ height: "sm", width: "1/3" }]}
              variant={variant}
              spacing="normal"
            />
          </div>
        </div>
      );

    case "input":
    default:
      return (
        <Skeleton
          variant={variant}
          className="h-10 w-full rounded-md"
        />
      );
  }
}

// Preset configurations for common form types
export const FormSkeletonPresets = {
  /**
   * Login form skeleton
   */
  login: (props?: Partial<FormSkeletonProps>) => (
    <FormSkeleton
      fields={[
        { type: "title", label: false, width: "full", required: false, helpText: false, error: false },
        { type: "input", label: true, required: true },
        { type: "input", label: true, required: true },
        { type: "checkbox", width: "auto" },
        { type: "button", width: "full" },
        { type: "button", width: "full", className: "opacity-60" },
      ]}
      variant="gradient"
      spacing="normal"
      {...props}
    />
  ),

  /**
   * Registration form skeleton
   */
  register: (props?: Partial<FormSkeletonProps>) => (
    <FormSkeleton
      fields={[
        { type: "title", label: false, width: "full", required: false, helpText: false, error: false },
        { type: "input", label: true, required: true, width: "1/2" },
        { type: "input", label: true, required: true, width: "1/2" },
        { type: "input", label: true, required: true },
        { type: "input", label: true, required: true },
        { type: "input", label: true, required: true },
        { type: "checkbox", label: true, width: "full", required: false, helpText: true, error: false },
        { type: "button", width: "full" },
      ]}
      variant="gradient"
      layout="grid"
      spacing="normal"
      {...props}
    />
  ),

  /**
   * Contact form skeleton
   */
  contact: (props?: Partial<FormSkeletonProps>) => (
    <FormSkeleton
      fields={[
        { type: "input", label: true, required: true, width: "1/2" },
        { type: "input", label: true, required: true, width: "1/2" },
        { type: "input", label: true, required: true },
        { type: "textarea", label: true, required: true },
        { type: "button", label: false, width: "auto", required: false, helpText: false, error: false },
      ]}
      variant="default"
      layout="grid"
      spacing="relaxed"
      {...props}
    />
  ),

  /**
   * Settings form skeleton
   */
  settings: (props?: Partial<FormSkeletonProps>) => (
    <FormSkeleton
      fields={[
        { type: "title", label: false, width: "full", required: false, helpText: false, error: false },
        { type: "input", label: true, width: "full", required: false, helpText: true, error: false },
        { type: "select", label: true, width: "full", required: false, helpText: true, error: false },
        { type: "divider", label: false, width: "full", required: false, helpText: false, error: false },
        { type: "title", label: false, width: "full", required: false, helpText: false, error: false },
        { type: "checkbox", label: true, width: "full", required: false, helpText: true, error: false },
        { type: "checkbox", label: true, width: "full", required: false, helpText: true, error: false },
        { type: "radio", label: true, width: "full", required: false, helpText: false, error: false },
        { type: "divider", label: false, width: "full", required: false, helpText: false, error: false },
        { type: "button", label: false, width: "auto", required: false, helpText: false, error: false },
        { type: "button", label: false, width: "auto", required: false, helpText: false, error: false, className: "opacity-60" },
      ]}
      variant="shimmer"
      spacing="relaxed"
      layout="vertical"
      padding="md"
      border={false}
      {...props}
    />
  ),

  /**
   * Profile form skeleton
   */
  profile: (props?: Partial<FormSkeletonProps>) => (
    <FormSkeleton
      fields={[
        { type: "file", label: true, width: "full", required: false, helpText: false, error: false },
        { type: "input", label: true, width: "1/2", required: false, helpText: false, error: false },
        { type: "input", label: true, width: "1/2", required: false, helpText: false, error: false },
        { type: "input", label: true, width: "full", required: false, helpText: false, error: false },
        { type: "textarea", label: true, width: "full", required: false, helpText: false, error: false },
        { type: "select", label: true, width: "full", required: false, helpText: false, error: false },
        { type: "button", label: false, width: "auto", required: false, helpText: false, error: false },
      ]}
      variant="gradient"
      layout="grid"
      spacing="normal"
      {...props}
    />
  ),
} as const;

export default FormSkeleton;