import { z } from 'zod';
import { LocaleCodeSchema } from '../../../locale/domain/schemas/LocaleSchema';

// Sanity Image schema
export const SanityImageSchema = z.object({
  _type: z.literal('image'),
  asset: z.object({
    _ref: z.string(),
    _type: z.literal('reference'),
  }),
  hotspot: z.object({
    x: z.number(),
    y: z.number(),
    height: z.number(),
    width: z.number(),
  }).optional(),
  crop: z.object({
    bottom: z.number(),
    left: z.number(),
    right: z.number(),
    top: z.number(),
  }).optional(),
});

export type SanityImageType = z.infer<typeof SanityImageSchema>;

export const MultilingualValueSchema = z.union([
  z.string(),
  z.record(LocaleCodeSchema, z.string())
]);

export type MultilingualValueType = z.infer<typeof MultilingualValueSchema>;

export const HeroBannerButtonSchema = z.object({
  text: MultilingualValueSchema.optional(),
  url: z.string().optional(),
});

export const HeroBannerImageSchema = z.object({
  desktop: SanityImageSchema.optional(),
  mobile: SanityImageSchema.optional(),
  alt: MultilingualValueSchema.optional(),
});

export const BackgroundImagesSchema = z.object({
  desktop: SanityImageSchema.optional(),
  mobile: SanityImageSchema.optional(),
});

export const HeroBannerSchema = z.object({
  isActive: z.boolean().optional(),
  heroTitle: MultilingualValueSchema.optional(),
  heroDescription: MultilingualValueSchema.optional(),
  primaryButton: HeroBannerButtonSchema.optional(),
  secondaryButton: HeroBannerButtonSchema.optional(),
  heroImage: HeroBannerImageSchema.optional(),
  backgroundImages: BackgroundImagesSchema.optional(),
});

export type HeroBannerType = z.infer<typeof HeroBannerSchema>;

export const HomeContentSchema = z.object({
  id: z.string().min(1, 'HomeContent ID is required'),
  title: z.string().optional(),
  welcoming: MultilingualValueSchema.optional(),
  subtitle: MultilingualValueSchema.optional(),
  description: MultilingualValueSchema.optional(),
  heroBanner: HeroBannerSchema.optional(),
});

export type HomeContentType = z.infer<typeof HomeContentSchema>;

export const LocalizedHomeContentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  welcoming: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroBanner: z.object({
    isActive: z.boolean().optional(),
    heroTitle: z.string().optional(),
    heroDescription: z.string().optional(),
    primaryButton: z.object({
      text: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
    secondaryButton: z.object({
      text: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
    heroImage: z.object({
      desktop: z.string().optional(),
      mobile: z.string().optional(),
      alt: z.string().optional(),
    }).optional(),
    backgroundImages: z.object({
      desktop: z.string().optional(),
      mobile: z.string().optional(),
    }).optional(),
  }).optional(),
});

export type LocalizedHomeContentType = z.infer<typeof LocalizedHomeContentSchema>;

export const SanityHomeDocumentSchema = z.object({
  _id: z.string(),
  _type: z.literal('home'),
  title: MultilingualValueSchema.optional(),
  welcoming: MultilingualValueSchema.optional(),
  subtitle: MultilingualValueSchema.optional(),
  description: MultilingualValueSchema.optional(),
  callToAction: MultilingualValueSchema.optional(),
  heroBanner: HeroBannerSchema.optional(),
});

export type SanityHomeDocumentType = z.infer<typeof SanityHomeDocumentSchema>;