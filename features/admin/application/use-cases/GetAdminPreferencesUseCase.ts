import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';

export class GetAdminPreferencesUseCase {
  constructor(private adminPreferencesRepository: IAdminPreferencesRepository) {}

  async execute(): Promise<AdminPreferences> {
    return await this.adminPreferencesRepository.get();
  }
}