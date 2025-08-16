import { PrismaHomeRepository } from '../repositories/PrismaHomeRepository';
import { GetLocalizedHomeContentFromPrismaUseCase } from '../../application/use-cases/GetLocalizedHomeContentFromPrismaUseCase';

export class PrismaHomeContainer {
  private static instance: PrismaHomeContainer;
  private homeRepository: PrismaHomeRepository;
  private getLocalizedHomeContentUseCase: GetLocalizedHomeContentFromPrismaUseCase;

  private constructor() {
    this.homeRepository = new PrismaHomeRepository();
    this.getLocalizedHomeContentUseCase = new GetLocalizedHomeContentFromPrismaUseCase(this.homeRepository);
  }

  static getInstance(): PrismaHomeContainer {
    if (!PrismaHomeContainer.instance) {
      PrismaHomeContainer.instance = new PrismaHomeContainer();
    }
    return PrismaHomeContainer.instance;
  }

  getGetLocalizedHomeContentUseCase(): GetLocalizedHomeContentFromPrismaUseCase {
    return this.getLocalizedHomeContentUseCase;
  }

  getHomeRepository(): PrismaHomeRepository {
    return this.homeRepository;
  }
}