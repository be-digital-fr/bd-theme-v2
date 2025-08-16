import { PrismaClient } from '@prisma/client';
import { GetSettingsUseCase } from '../../application/use-cases/GetSettingsUseCase';
import { UpdateSettingsUseCase } from '../../application/use-cases/UpdateSettingsUseCase';
import { PrismaSettingsRepository } from '../repositories/PrismaSettingsRepository';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { prisma } from '@/lib/prisma';

export class SettingsContainer {
  private static instance: SettingsContainer;
  private settingsRepository: ISettingsRepository;

  private constructor() {
    this.settingsRepository = new PrismaSettingsRepository(prisma);
  }

  static getInstance(): SettingsContainer {
    if (!SettingsContainer.instance) {
      SettingsContainer.instance = new SettingsContainer();
    }
    return SettingsContainer.instance;
  }

  getSettingsRepository(): ISettingsRepository {
    return this.settingsRepository;
  }

  getGetSettingsUseCase(): GetSettingsUseCase {
    return new GetSettingsUseCase(this.settingsRepository);
  }

  getUpdateSettingsUseCase(): UpdateSettingsUseCase {
    return new UpdateSettingsUseCase(this.settingsRepository);
  }

  async dispose(): Promise<void> {
    // Prisma singleton handles its own lifecycle
  }
}