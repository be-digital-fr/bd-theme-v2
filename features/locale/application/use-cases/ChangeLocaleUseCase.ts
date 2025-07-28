import { ILocaleRepository } from '../../domain/repositories/ILocaleRepository';

export class ChangeLocaleUseCase {
  constructor(private localeRepository: ILocaleRepository) {}

  execute(newLocale: string): void {
    if (!this.localeRepository.isValidLocale(newLocale)) {
      throw new Error(`Invalid locale: ${newLocale}`);
    }
    
    this.localeRepository.setCurrentLocale(newLocale);
  }
}