import { ILocaleRepository } from '../../domain/repositories/ILocaleRepository';

export class LocalStorageLocaleRepository implements ILocaleRepository {
  private static readonly SUPPORTED_LOCALES = ['fr', 'en', 'es'];
  private static readonly DEFAULT_LOCALE = 'fr';
  private static readonly STORAGE_KEY = 'preferred-locale';

  getCurrentLocale(): string {
    if (typeof window === 'undefined') {
      return LocalStorageLocaleRepository.DEFAULT_LOCALE;
    }

    const savedLocale = localStorage.getItem(LocalStorageLocaleRepository.STORAGE_KEY);
    
    if (savedLocale && this.isValidLocale(savedLocale)) {
      return savedLocale;
    }

    const browserLocale = this.getBrowserLocale();
    this.setCurrentLocale(browserLocale);
    return browserLocale;
  }

  setCurrentLocale(locale: string): void {
    if (!this.isValidLocale(locale)) {
      throw new Error(`Invalid locale: ${locale}`);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LocalStorageLocaleRepository.STORAGE_KEY, locale);
      document.cookie = `${LocalStorageLocaleRepository.STORAGE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }

  getSupportedLocales(): string[] {
    return [...LocalStorageLocaleRepository.SUPPORTED_LOCALES];
  }

  isValidLocale(locale: string): boolean {
    return LocalStorageLocaleRepository.SUPPORTED_LOCALES.includes(locale);
  }

  getBrowserLocale(): string {
    if (typeof window === 'undefined') {
      return LocalStorageLocaleRepository.DEFAULT_LOCALE;
    }
    
    const browserLang = navigator.language || navigator.languages?.[0];
    
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      if (this.isValidLocale(langCode)) {
        return langCode;
      }
    }
    
    return LocalStorageLocaleRepository.DEFAULT_LOCALE;
  }
}