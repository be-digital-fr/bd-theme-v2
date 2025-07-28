import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { UpdatePreferencesSchema, UpdatePreferencesType } from '../../domain/schemas/AdminPreferencesSchema';
import { LocaleCodeSchema, LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';

export class UpdateAdminPreferencesUseCase {
  constructor(private adminPreferencesRepository: IAdminPreferencesRepository) {}

  async execute(request: UpdatePreferencesType): Promise<AdminPreferences> {
    // Validate input with Zod
    const validatedRequest = UpdatePreferencesSchema.parse(request);
    
    const currentPreferences = await this.adminPreferencesRepository.get();
    
    const updatedPreferences = new AdminPreferences(
      currentPreferences.id,
      validatedRequest.isMultilingual ?? currentPreferences.isMultilingual,
      validatedRequest.supportedLanguages ?? currentPreferences.supportedLanguages,
      validatedRequest.defaultLanguage ?? currentPreferences.defaultLanguage
    );

    return await this.adminPreferencesRepository.update(updatedPreferences);
  }

  async setDefaultLanguage(locale: string): Promise<AdminPreferences> {
    // Validate locale with Zod
    const validatedLocale = LocaleCodeSchema.parse(locale);
    
    const currentPreferences = await this.adminPreferencesRepository.get();
    const updatedPreferences = currentPreferences.updateDefaultLanguage(validatedLocale);
    
    return await this.adminPreferencesRepository.update(updatedPreferences);
  }

  async toggleMultilingual(): Promise<AdminPreferences> {
    const currentPreferences = await this.adminPreferencesRepository.get();
    const updatedPreferences = currentPreferences.toggleMultilingual();
    
    return await this.adminPreferencesRepository.update(updatedPreferences);
  }
}