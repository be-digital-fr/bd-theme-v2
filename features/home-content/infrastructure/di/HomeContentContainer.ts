import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { IHomeContentRepository } from '../../domain/repositories/IHomeContentRepository';
import { PrismaHomeContentRepository } from '../repositories/PrismaHomeContentRepository';
import { GetHomeContentUseCase } from '../../application/use-cases/GetHomeContentUseCase';
import { UpdateHomeContentUseCase } from '../../application/use-cases/UpdateHomeContentUseCase';

export class HomeContentContainer {
  private static instance: HomeContentContainer;
  private _homeContentRepository: IHomeContentRepository | null = null;
  private _getHomeContentUseCase: GetHomeContentUseCase | null = null;
  private _updateHomeContentUseCase: UpdateHomeContentUseCase | null = null;

  private constructor() {}

  public static getInstance(): HomeContentContainer {
    if (!HomeContentContainer.instance) {
      HomeContentContainer.instance = new HomeContentContainer();
    }
    return HomeContentContainer.instance;
  }

  public getHomeContentRepository(): IHomeContentRepository {
    if (!this._homeContentRepository) {
      this._homeContentRepository = new PrismaHomeContentRepository(prisma);
    }
    return this._homeContentRepository;
  }

  public getGetHomeContentUseCase(): GetHomeContentUseCase {
    if (!this._getHomeContentUseCase) {
      this._getHomeContentUseCase = new GetHomeContentUseCase(
        this.getHomeContentRepository()
      );
    }
    return this._getHomeContentUseCase;
  }

  public getUpdateHomeContentUseCase(): UpdateHomeContentUseCase {
    if (!this._updateHomeContentUseCase) {
      this._updateHomeContentUseCase = new UpdateHomeContentUseCase(
        this.getHomeContentRepository()
      );
    }
    return this._updateHomeContentUseCase;
  }
}