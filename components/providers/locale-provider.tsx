'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isValidLocale } from '@/lib/locale';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: string;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<string>(initialLocale || DEFAULT_LOCALE);
  const [isLoading, setIsLoading] = useState(false);

  // Synchroniser avec le router Next.js
  useEffect(() => {
    if (router.locale && isValidLocale(router.locale)) {
      setLocaleState(router.locale);
    }
  }, [router.locale]);

  const setLocale = (newLocale: string) => {
    if (!isValidLocale(newLocale)) {
      console.warn(`Locale "${newLocale}" is not supported`);
      return;
    }

    setIsLoading(true);
    router.push(router.asPath, router.asPath, { locale: newLocale })
      .finally(() => setIsLoading(false));
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

/**
 * Hook pour obtenir la langue actuelle avec fallback
 */
export function useCurrentLocaleWithFallback(): string {
  const { locale } = useLocale();
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
} 