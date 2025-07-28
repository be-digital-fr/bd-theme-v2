import { ILocaleRepository } from '../../domain/repositories/ILocaleRepository';
import { LocalStorageLocaleRepository } from '../repositories/LocalStorageLocaleRepository';
import { GetCurrentLocaleUseCase } from '../../application/use-cases/GetCurrentLocaleUseCase';
import { ChangeLocaleUseCase } from '../../application/use-cases/ChangeLocaleUseCase';
import { GetSupportedLocalesUseCase } from '../../application/use-cases/GetSupportedLocalesUseCase';

export class LocaleContainer {
  private static instance: LocaleContainer;
  private localeRepository: ILocaleRepository;
  private getCurrentLocaleUseCase: GetCurrentLocaleUseCase;
  private changeLocaleUseCase: ChangeLocaleUseCase;
  private getSupportedLocalesUseCase: GetSupportedLocalesUseCase;

  private constructor() {
    this.localeRepository = new LocalStorageLocaleRepository();
    this.getCurrentLocaleUseCase = new GetCurrentLocaleUseCase(this.localeRepository);
    this.changeLocaleUseCase = new ChangeLocaleUseCase(this.localeRepository);
    this.getSupportedLocalesUseCase = new GetSupportedLocalesUseCase(this.localeRepository);
  }

  static getInstance(): LocaleContainer {
    if (!LocaleContainer.instance) {
      LocaleContainer.instance = new LocaleContainer();
    }
    return LocaleContainer.instance;
  }

  getGetCurrentLocaleUseCase(): GetCurrentLocaleUseCase {
    return this.getCurrentLocaleUseCase;
  }

  getChangeLocaleUseCase(): ChangeLocaleUseCase {
    return this.changeLocaleUseCase;
  }

  getGetSupportedLocalesUseCase(): GetSupportedLocalesUseCase {
    return this.getSupportedLocalesUseCase;
  }
}