import { Result } from '@/lib/result';
import { SiteSettings } from '../../domain/entities/SiteSettings';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';

export class GetSettingsUseCase {
  constructor(private settingsRepository: ISettingsRepository) {}

  async execute(): Promise<Result<SiteSettings | null>> {
    try {
      const result = await this.settingsRepository.getSettings();
      
      if (!result.success) {
        return Result.failure(result.error);
      }

      // If no settings exist, initialize with defaults
      if (!result.data) {
        const initResult = await this.settingsRepository.initializeDefaultSettings();
        return initResult;
      }

      return Result.success(result.data);
    } catch (error) {
      return Result.failure({
        code: 'GET_SETTINGS_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      });
    }
  }
}