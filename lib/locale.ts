import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Types pour la gestion des langues
export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

// Langues supportées par l'application
export const SUPPORTED_LOCALES: Locale[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const DEFAULT_LOCALE = 'fr';

/**
 * Récupère la langue actuelle depuis l'URL côté client
 * Utilise le router Next.js pour obtenir la locale active
 */
export function useCurrentLocale(): string {
  const router = useRouter();
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE);

  useEffect(() => {
    if (router.locale) {
      setLocale(router.locale);
    }
  }, [router.locale]);

  return locale;
}

/**
 * Récupère la langue actuelle depuis l'URL côté serveur
 * À utiliser dans les Server Components et les API routes
 */
export function getCurrentLocaleFromUrl(url: string): string {
  // Extraire la locale depuis l'URL
  const urlPath = url.replace(/^https?:\/\/[^\/]+/, '');
  const segments = urlPath.split('/').filter(Boolean);
  
  if (segments.length > 0) {
    const potentialLocale = segments[0];
    if (SUPPORTED_LOCALES.some(locale => locale.code === potentialLocale)) {
      return potentialLocale;
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Récupère la langue actuelle depuis les headers de requête
 * Utilise l'Accept-Language header comme fallback
 */
export function getLocaleFromHeaders(headers: Headers): string {
  const acceptLanguage = headers.get('accept-language');
  
  if (acceptLanguage) {
    const preferredLanguages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .map(lang => lang.split('-')[0]); // Extraire le code principal (fr-FR -> fr)
    
    for (const lang of preferredLanguages) {
      if (SUPPORTED_LOCALES.some(locale => locale.code === lang)) {
        return lang;
      }
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Récupère la langue actuelle depuis les paramètres de recherche
 * Utilise le paramètre ?lang=xx comme fallback
 */
export function getLocaleFromSearchParams(searchParams: URLSearchParams): string {
  const langParam = searchParams.get('lang');
  
  if (langParam && SUPPORTED_LOCALES.some(locale => locale.code === langParam)) {
    return langParam;
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Récupère la langue actuelle avec fallback intelligent
 * Ordre de priorité :
 * 1. Paramètre de route Next.js
 * 2. Paramètre de recherche ?lang=xx
 * 3. Header Accept-Language
 * 4. Langue par défaut
 */
export function resolveCurrentLocale(
  nextjsLocale?: string,
  searchParams?: URLSearchParams,
  headers?: Headers
): string {
  // 1. Priorité à la locale Next.js
  if (nextjsLocale && SUPPORTED_LOCALES.some(locale => locale.code === nextjsLocale)) {
    return nextjsLocale;
  }
  
  // 2. Paramètre de recherche
  if (searchParams) {
    const langFromParams = getLocaleFromSearchParams(searchParams);
    if (langFromParams !== DEFAULT_LOCALE) {
      return langFromParams;
    }
  }
  
  // 3. Headers
  if (headers) {
    const langFromHeaders = getLocaleFromHeaders(headers);
    if (langFromHeaders !== DEFAULT_LOCALE) {
      return langFromHeaders;
    }
  }
  
  // 4. Fallback par défaut
  return DEFAULT_LOCALE;
}

/**
 * Vérifie si une langue est supportée
 */
export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALES.some(l => l.code === locale);
}

/**
 * Récupère les informations complètes d'une langue
 */
export function getLocaleInfo(locale: string): Locale | null {
  return SUPPORTED_LOCALES.find(l => l.code === locale) || null;
}

/**
 * Génère l'URL avec la langue spécifiée
 */
export function getLocalizedUrl(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) {
    return path;
  }
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
}

/**
 * Hook pour changer de langue
 */
export function useLocaleChange() {
  const router = useRouter();
  
  const changeLocale = (newLocale: string) => {
    if (isValidLocale(newLocale)) {
      router.push(router.asPath, router.asPath, { locale: newLocale });
    }
  };
  
  return { changeLocale };
} 