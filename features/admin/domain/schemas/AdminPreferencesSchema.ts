import { z } from 'zod';
import { LocaleCodeSchema } from '../../../locale/domain/schemas/LocaleSchema';

export const AdminPreferencesSchema = z.object({
  id: z.string().min(1, 'AdminPreferences ID is required'),
  isMultilingual: z.boolean(),
  supportedLanguages: z.array(LocaleCodeSchema).min(1, 'At least one language must be supported'),
  defaultLanguage: LocaleCodeSchema,
}).refine(
  (data) => data.supportedLanguages.includes(data.defaultLanguage),
  {
    message: 'Default language must be included in supported languages',
    path: ['defaultLanguage'],
  }
);

export type AdminPreferencesType = z.infer<typeof AdminPreferencesSchema>;

export const UpdatePreferencesSchema = z.object({
  isMultilingual: z.boolean().optional(),
  supportedLanguages: z.array(LocaleCodeSchema).min(1).optional(),
  defaultLanguage: LocaleCodeSchema.optional(),
});

export type UpdatePreferencesType = z.infer<typeof UpdatePreferencesSchema>;

export const AdminPreferencesFormSchema = z.object({
  isMultilingual: z.boolean(),
  supportedLanguages: z.array(LocaleCodeSchema)
    .min(1, 'Au moins une langue doit être sélectionnée')
    .refine((languages) => {
      return languages.length === new Set(languages).size
    }, 'Les langues ne peuvent pas être dupliquées'),
  defaultLanguage: LocaleCodeSchema,
}).refine((data) => {
  // Si multilingue est activé, la langue par défaut doit être dans les langues supportées
  if (data.isMultilingual && !data.supportedLanguages.includes(data.defaultLanguage)) {
    return false
  }
  return true
}, {
  message: 'La langue par défaut doit être incluse dans les langues supportées',
  path: ['defaultLanguage'],
});

export type AdminPreferencesFormType = z.infer<typeof AdminPreferencesFormSchema>;