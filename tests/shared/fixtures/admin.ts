/**
 * Admin-related test fixtures
 */

export const ADMIN_PREFERENCES = {
  default: {
    isMultilingual: false,
    supportedLanguages: ['fr'],
    defaultLanguage: 'fr',
  },
  multilingual: {
    isMultilingual: true,
    supportedLanguages: ['fr', 'en', 'es'],
    defaultLanguage: 'fr',
  },
} as const;

export const AUTH_SETTINGS = {
  default: {
    enableGoogleAuth: false,
    enableFacebookAuth: false,
    requireEmailVerification: false,
  },
  withSocial: {
    enableGoogleAuth: true,
    enableFacebookAuth: true,
    requireEmailVerification: true,
  },
} as const;

export type AdminPreferences = typeof ADMIN_PREFERENCES[keyof typeof ADMIN_PREFERENCES];
export type AuthSettings = typeof AUTH_SETTINGS[keyof typeof AUTH_SETTINGS];