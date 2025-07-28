import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { PrismaAdminPreferencesRepository } from '../repositories/PrismaAdminPreferencesRepository';
import { ApiAdminPreferencesRepository } from '../repositories/ApiAdminPreferencesRepository';
import { GetAdminPreferencesUseCase } from '../../application/use-cases/GetAdminPreferencesUseCase';
import { UpdateAdminPreferencesUseCase } from '../../application/use-cases/UpdateAdminPreferencesUseCase';

export class AdminContainer {
  private static instance: AdminContainer;
  private adminPreferencesRepository: IAdminPreferencesRepository;
  private getAdminPreferencesUseCase: GetAdminPreferencesUseCase;
  private updateAdminPreferencesUseCase: UpdateAdminPreferencesUseCase;

  private constructor() {
    // Use API repository for client-side, Prisma for server-side
    this.adminPreferencesRepository = typeof window !== 'undefined' 
      ? new ApiAdminPreferencesRepository()
      : new PrismaAdminPreferencesRepository();
      
    this.getAdminPreferencesUseCase = new GetAdminPreferencesUseCase(this.adminPreferencesRepository);
    this.updateAdminPreferencesUseCase = new UpdateAdminPreferencesUseCase(this.adminPreferencesRepository);
  }

  static getInstance(): AdminContainer {
    if (!AdminContainer.instance) {
      AdminContainer.instance = new AdminContainer();
    }
    return AdminContainer.instance;
  }

  getGetAdminPreferencesUseCase(): GetAdminPreferencesUseCase {
    return this.getAdminPreferencesUseCase;
  }

  getUpdateAdminPreferencesUseCase(): UpdateAdminPreferencesUseCase {
    return this.updateAdminPreferencesUseCase;
  }
}