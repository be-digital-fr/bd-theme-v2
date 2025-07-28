'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCurrentLocale, useLocaleChange } from '@/lib/locale';

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

export function LocaleProvider({ children }: LocaleProviderProps) {
  const locale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();

  return (
    <LocaleContext.Provider value={{ 
      locale, 
      setLocale: changeLocale, 
      isLoading: false 
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