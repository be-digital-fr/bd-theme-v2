'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentLocale, useLocaleChange, useSupportedLocales } from '../hooks/useLocale';
import { Locale } from '../../domain/entities/Locale';

interface LocaleContextType {
  currentLocale: string;
  supportedLocales: Locale[];
  changeLocale: (locale: string) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();
  const supportedLocales = useSupportedLocales();

  const contextValue: LocaleContextType = {
    currentLocale,
    supportedLocales,
    changeLocale,
    isLoading: false, // Could be enhanced with loading state
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}