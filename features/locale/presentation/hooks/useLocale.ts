'use client';

import { useEffect, useState } from 'react';
import { LocaleContainer } from '../../infrastructure/di/LocaleContainer';
import { Locale } from '../../domain/entities/Locale';

export function useCurrentLocale(): string {
  const [locale, setLocale] = useState<string>('fr');

  useEffect(() => {
    const container = LocaleContainer.getInstance();
    const useCase = container.getGetCurrentLocaleUseCase();
    const currentLocale = useCase.execute();
    setLocale(currentLocale);
  }, []);

  return locale;
}

export function useLocaleChange() {
  const changeLocale = (newLocale: string) => {
    const container = LocaleContainer.getInstance();
    const useCase = container.getChangeLocaleUseCase();
    
    try {
      useCase.execute(newLocale);
      window.location.reload();
    } catch (error) {
      console.error('Failed to change locale:', error);
    }
  };

  return { changeLocale };
}

export function useSupportedLocales(): Locale[] {
  const [locales, setLocales] = useState<Locale[]>([]);

  useEffect(() => {
    const container = LocaleContainer.getInstance();
    const useCase = container.getGetSupportedLocalesUseCase();
    const supportedLocales = useCase.execute();
    setLocales(supportedLocales);
  }, []);

  return locales;
}

export function useLocaleInfo(code: string): Locale | null {
  const [localeInfo, setLocaleInfo] = useState<Locale | null>(null);

  useEffect(() => {
    const container = LocaleContainer.getInstance();
    const useCase = container.getGetSupportedLocalesUseCase();
    const info = useCase.getLocaleInfo(code);
    setLocaleInfo(info);
  }, [code]);

  return localeInfo;
}

export function useLocale(): [string, (locale: string) => void] {
  const currentLocale = useCurrentLocale();
  const { changeLocale } = useLocaleChange();
  
  return [currentLocale, changeLocale];
}