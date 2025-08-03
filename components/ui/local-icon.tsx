'use client';

import Image from 'next/image';
import { z } from 'zod';
import { cn } from '@/lib/utils';

// Zod schema for local icon props validation
const LocalIconPropsSchema = z.object({
  name: z.enum(['click-collect', 'healthy', 'multiple-payment', 'payments', 'time']),
  size: z.number().positive().optional(),
  className: z.string().optional(),
  alt: z.string().optional(),
  priority: z.boolean().optional(),
});

export type LocalIconProps = z.infer<typeof LocalIconPropsSchema>;

// Icon mapping with descriptive information for accessibility
const ICON_MAP = {
  'click-collect': {
    src: '/icons/click-collect.svg',
    defaultAlt: 'Click and collect service icon',
    description: 'Order online and pickup in store'
  },
  'healthy': {
    src: '/icons/healhy.svg', // Note: original filename has typo
    defaultAlt: 'Healthy food icon',
    description: 'Fresh and healthy ingredients'
  },
  'multiple-payment': {
    src: '/icons/multiple-payment.svg',
    defaultAlt: 'Multiple payment methods icon',
    description: 'Various payment options accepted'
  },
  'payments': {
    src: '/icons/payments.svg',
    defaultAlt: 'Secure payment icon',
    description: 'Safe and secure payment processing'
  },
  'time': {
    src: '/icons/time.svg',
    defaultAlt: 'Fast service icon',
    description: 'Quick and efficient service'
  }
} as const;

/**
 * LocalIcon Component
 * 
 * Displays local SVG icons with optimized loading and accessibility features.
 * Uses Next.js Image component for performance benefits.
 * 
 * @param props - Component props validated with Zod
 * @returns JSX element or null if icon not found
 */
export function LocalIcon(props: LocalIconProps) {
  // Validate props at runtime
  const validatedProps = LocalIconPropsSchema.parse(props);
  const { name, size = 64, className, alt, priority = false } = validatedProps;

  const iconConfig = ICON_MAP[name];
  
  if (!iconConfig) {
    console.warn(`LocalIcon: Icon "${name}" not found in ICON_MAP`);
    return null;
  }

  const finalAlt = alt || iconConfig.defaultAlt;

  return (
    <div 
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={finalAlt}
      title={iconConfig.description}
    >
      <Image
        src={iconConfig.src}
        alt={finalAlt}
        width={size}
        height={size}
        priority={priority}
        className="object-contain"
        sizes={`${size}px`}
        // Add loading optimization
        quality={90}
        // Error handling
        onError={(e) => {
          console.error(`LocalIcon: Failed to load icon "${name}"`, e);
        }}
      />
    </div>
  );
}

/**
 * Get available icon names for type safety
 */
export const getAvailableIconNames = () => Object.keys(ICON_MAP) as Array<keyof typeof ICON_MAP>;

/**
 * Check if an icon name is valid
 */
export const isValidIconName = (name: string): name is keyof typeof ICON_MAP => {
  return name in ICON_MAP;
};

export default LocalIcon;