import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { SanityHomeRepository } from '../repositories/SanityHomeRepository';
import { GetHomeContentUseCase } from '../../application/use-cases/GetHomeContentUseCase';
import { GetLocalizedHomeContentUseCase } from '../../application/use-cases/GetLocalizedHomeContentUseCase';

export class HomeContainer {
  private static instance: HomeContainer;
  private homeRepository: IHomeRepository;
  private getHomeContentUseCase: GetHomeContentUseCase;
  private getLocalizedHomeContentUseCase: GetLocalizedHomeContentUseCase;

  private constructor() {
    this.homeRepository = new SanityHomeRepository();
    this.getHomeContentUseCase = new GetHomeContentUseCase(this.homeRepository);
    this.getLocalizedHomeContentUseCase = new GetLocalizedHomeContentUseCase(this.homeRepository);
  }

  static getInstance(): HomeContainer {
    if (!HomeContainer.instance) {
      HomeContainer.instance = new HomeContainer();
    }
    return HomeContainer.instance;
  }

  getGetHomeContentUseCase(): GetHomeContentUseCase {
    return this.getHomeContentUseCase;
  }

  getGetLocalizedHomeContentUseCase(): GetLocalizedHomeContentUseCase {
    return this.getLocalizedHomeContentUseCase;
  }
}