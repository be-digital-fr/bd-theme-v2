import { z } from 'zod';
import { LocaleCodeSchema } from '../../../locale/domain/schemas/LocaleSchema';

export const MultilingualValueSchema = z.union([
  z.string(),
  z.record(LocaleCodeSchema, z.string())
]);

export type MultilingualValueType = z.infer<typeof MultilingualValueSchema>;

export const HomeContentSchema = z.object({
  id: z.string().min(1, 'HomeContent ID is required'),
  title: z.string().optional(),
  welcoming: MultilingualValueSchema.optional(),
  subtitle: MultilingualValueSchema.optional(),
  description: MultilingualValueSchema.optional(),
  content: z.string().optional(),
});

export type HomeContentType = z.infer<typeof HomeContentSchema>;

export const LocalizedHomeContentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  welcoming: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});

export type LocalizedHomeContentType = z.infer<typeof LocalizedHomeContentSchema>;

export const SanityHomeDocumentSchema = z.object({
  _id: z.string(),
  _type: z.literal('home'),
  title: z.string().optional(),
  welcoming: MultilingualValueSchema.optional(),
  subtitle: MultilingualValueSchema.optional(),
  description: MultilingualValueSchema.optional(),
  content: z.string().optional(),
});

export type SanityHomeDocumentType = z.infer<typeof SanityHomeDocumentSchema>;