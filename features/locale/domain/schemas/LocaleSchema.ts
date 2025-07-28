import { z } from 'zod';

export const LocaleSchema = z.object({
  code: z.string()
    .length(2, 'Locale code must be exactly 2 characters')
    .regex(/^[a-z]{2}$/, 'Locale code must contain only lowercase letters'),
  name: z.string().min(1, 'Locale name is required'),
  nativeName: z.string().min(1, 'Native name is required'),
  flag: z.string().min(1, 'Flag is required'),
});

export type LocaleType = z.infer<typeof LocaleSchema>;

export const SupportedLocalesSchema = z.array(LocaleSchema);
export type SupportedLocalesType = z.infer<typeof SupportedLocalesSchema>;

export const LocaleCodeSchema = z.enum(['fr', 'en', 'es']);
export type LocaleCodeType = z.infer<typeof LocaleCodeSchema>;

export const AVAILABLE_LANGUAGES = [
  { code: 'fr' as const, name: 'Français' },
  { code: 'en' as const, name: 'English' },
  { code: 'es' as const, name: 'Español' },
] as const;