// Legacy exports for backward compatibility
export { Locale } from '../features/locale/domain/entities/Locale';
export {
  useCurrentLocale,
  useLocaleChange,
  useSupportedLocales,
  useLocaleInfo,
  useLocale
} from '../features/locale/presentation/hooks/useLocale';

// Legacy utility functions for backward compatibility
const DEFAULT_LOCALE_VALUE = 'fr';

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LOCALES_VALUE: LocaleInfo[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export function getServerLocale(request?: Request): string {
  if (typeof window !== 'undefined') {
    const savedLocale = localStorage.getItem('preferred-locale');
    if (savedLocale && isValidLocale(savedLocale)) {
      return savedLocale;
    }
  }
  
  if (request) {
    const cookieLocale = getCookieLocale(request);
    if (cookieLocale) return cookieLocale;
    
    const headerLocale = getLocaleFromHeaders(request.headers);
    if (headerLocale !== DEFAULT_LOCALE_VALUE) return headerLocale;
  }
  
  return DEFAULT_LOCALE_VALUE;
}

function getCookieLocale(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'preferred-locale' && isValidLocale(value)) {
      return value;
    }
  }
  
  return null;
}

export function getLocaleFromHeaders(headers: Headers): string {
  const acceptLanguage = headers.get('accept-language');
  
  if (acceptLanguage) {
    const preferredLanguages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .map(lang => lang.split('-')[0]);
    
    for (const lang of preferredLanguages) {
      if (SUPPORTED_LOCALES_VALUE.some(locale => locale.code === lang)) {
        return lang;
      }
    }
  }
  
  return DEFAULT_LOCALE_VALUE;
}

export function getLocaleFromSearchParams(searchParams: URLSearchParams): string {
  const langParam = searchParams.get('lang');
  
  if (langParam && SUPPORTED_LOCALES_VALUE.some(locale => locale.code === langParam)) {
    return langParam;
  }
  
  return DEFAULT_LOCALE_VALUE;
}

export function resolveCurrentLocale(
  nextjsLocale?: string,
  searchParams?: URLSearchParams,
  headers?: Headers
): string {
  if (nextjsLocale && SUPPORTED_LOCALES_VALUE.some(locale => locale.code === nextjsLocale)) {
    return nextjsLocale;
  }
  
  if (searchParams) {
    const langFromParams = getLocaleFromSearchParams(searchParams);
    if (langFromParams !== DEFAULT_LOCALE_VALUE) {
      return langFromParams;
    }
  }
  
  if (headers) {
    const langFromHeaders = getLocaleFromHeaders(headers);
    if (langFromHeaders !== DEFAULT_LOCALE_VALUE) {
      return langFromHeaders;
    }
  }
  
  return DEFAULT_LOCALE_VALUE;
}

export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALES_VALUE.some(l => l.code === locale);
}

export function getLocaleInfo(locale: string): LocaleInfo | null {
  return SUPPORTED_LOCALES_VALUE.find(l => l.code === locale) || null;
}

export function getLocalizedUrl(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE_VALUE) {
    return path;
  }
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
}

// Export constants for backward compatibility
export const DEFAULT_LOCALE = DEFAULT_LOCALE_VALUE;
export const SUPPORTED_LOCALES = SUPPORTED_LOCALES_VALUE; 