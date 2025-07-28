import { z } from 'zod'

// Langues disponibles dans l'application
export const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' },
] as const

export const LanguageCodeSchema = z.enum(['fr', 'en', 'es', 'de', 'it', 'pt', 'ar'])

export const AdminPreferencesSchema = z.object({
  isMultilingual: z.boolean().default(false),
  supportedLanguages: z.array(LanguageCodeSchema).default(['fr']),
  defaultLanguage: LanguageCodeSchema.default('fr'),
})

export const AdminPreferencesFormSchema = z.object({
  isMultilingual: z.boolean(),
  supportedLanguages: z.array(LanguageCodeSchema)
    .min(1, 'Au moins une langue doit être sélectionnée')
    .refine((languages) => {
      return languages.length === new Set(languages).size
    }, 'Les langues ne peuvent pas être dupliquées'),
  defaultLanguage: LanguageCodeSchema,
}).refine((data) => {
  // Si multilingue est activé, la langue par défaut doit être dans les langues supportées
  if (data.isMultilingual && !data.supportedLanguages.includes(data.defaultLanguage)) {
    return false
  }
  return true
}, {
  message: 'La langue par défaut doit être incluse dans les langues supportées',
  path: ['defaultLanguage'],
})

export type AdminPreferences = z.infer<typeof AdminPreferencesSchema>
export type AdminPreferencesForm = z.infer<typeof AdminPreferencesFormSchema>
export type LanguageCode = z.infer<typeof LanguageCodeSchema> 