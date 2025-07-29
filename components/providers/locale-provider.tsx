'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCurrentLocale, useLocaleChange } from '@/lib/locale';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
  resolveMultilingualValue: (value: Record<string, string> | string | undefined) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: string;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const locale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();

  const resolveMultilingualValue = (value: Record<string, string> | string | undefined): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[locale] || value['fr'] || value['en'] || Object.values(value)[0] || '';
    }
    return '';
  };

  return (
    <LocaleContext.Provider value={{ 
      locale, 
      setLocale: changeLocale, 
      isLoading: false,
      resolveMultilingualValue
    }}>
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
  return locale || 'fr';
} 