import { ILocaleRepository } from '../../domain/repositories/ILocaleRepository';

export class GetCurrentLocaleUseCase {
  constructor(private localeRepository: ILocaleRepository) {}

  execute(): string {
    return this.localeRepository.getCurrentLocale();
  }
}