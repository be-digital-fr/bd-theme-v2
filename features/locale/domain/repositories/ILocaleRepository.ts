export interface ILocaleRepository {
  getCurrentLocale(): string;
  setCurrentLocale(locale: string): void;
  getSupportedLocales(): string[];
  isValidLocale(locale: string): boolean;
  getBrowserLocale(): string;
}