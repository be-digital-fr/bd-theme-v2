import { Result } from '@/lib/result';
import { SiteSettings, UpdateSiteSettingsDto } from '../../domain/entities/SiteSettings';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';

export class UpdateSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(data: UpdateSiteSettingsDto): Promise<Result<SiteSettings>> {
    try {
      // Validate required fields
      if (data.supportedLanguages && data.supportedLanguages.length === 0) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'At least one supported language is required'
        });
      }

      if (data.defaultLanguage && data.supportedLanguages && 
          !data.supportedLanguages.includes(data.defaultLanguage)) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Default language must be included in supported languages'
        });
      }

      // Use create or update to handle singleton pattern
      const result = await this.settingsRepository.createOrUpdateSettings(data);
      
      if (!result.success) {
        return Result.failure(result.error);
      }

      return Result.success(result.data);
    } catch (error) {
      return Result.failure({
        code: 'UPDATE_SETTINGS_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      });
    }
  }
}