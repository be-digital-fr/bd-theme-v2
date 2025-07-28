import { ILocaleRepository } from '../../domain/repositories/ILocaleRepository';
import { Locale } from '../../domain/entities/Locale';

export class GetSupportedLocalesUseCase {
  private static readonly SUPPORTED_LOCALES = [
    new Locale('fr', 'French', 'Français', '🇫🇷'),
    new Locale('en', 'English', 'English', '🇬🇧'),
    new Locale('es', 'Spanish', 'Español', '🇪🇸'),
  ];

  constructor(private localeRepository: ILocaleRepository) {}

  execute(): Locale[] {
    return GetSupportedLocalesUseCase.SUPPORTED_LOCALES;
  }

  executeAsStrings(): string[] {
    return this.localeRepository.getSupportedLocales();
  }

  getLocaleInfo(code: string): Locale | null {
    return GetSupportedLocalesUseCase.SUPPORTED_LOCALES.find(locale => locale.code === code) || null;
  }
}