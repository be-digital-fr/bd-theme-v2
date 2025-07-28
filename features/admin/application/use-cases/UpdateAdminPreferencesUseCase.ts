import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';

export interface UpdatePreferencesRequest {
  isMultilingual?: boolean;
  supportedLanguages?: string[];
  defaultLanguage?: string;
}

export class UpdateAdminPreferencesUseCase {
  constructor(private adminPreferencesRepository: IAdminPreferencesRepository) {}

  async execute(request: UpdatePreferencesRequest): Promise<AdminPreferences> {
    const currentPreferences = await this.adminPreferencesRepository.get();
    
    const updatedPreferences = new AdminPreferences(
      currentPreferences.id,
      request.isMultilingual ?? currentPreferences.isMultilingual,
      request.supportedLanguages ?? currentPreferences.supportedLanguages,
      request.defaultLanguage ?? currentPreferences.defaultLanguage
    );

    return await this.adminPreferencesRepository.update(updatedPreferences);
  }

  async setDefaultLanguage(locale: string): Promise<AdminPreferences> {
    const currentPreferences = await this.adminPreferencesRepository.get();
    const updatedPreferences = currentPreferences.updateDefaultLanguage(locale);
    
    return await this.adminPreferencesRepository.update(updatedPreferences);
  }

  async toggleMultilingual(): Promise<AdminPreferences> {
    const currentPreferences = await this.adminPreferencesRepository.get();
    const updatedPreferences = currentPreferences.toggleMultilingual();
    
    return await this.adminPreferencesRepository.update(updatedPreferences);
  }
}