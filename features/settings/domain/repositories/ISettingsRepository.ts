import { Result } from '@/lib/result';
import { 
  SiteSettings, 
  CreateSiteSettingsDto, 
  UpdateSiteSettingsDto 
} from '../entities/SiteSettings';

export interface ISettingsRepository {
  /**
   * Get the site settings (singleton)
   */
  getSettings(): Promise<Result<SiteSettings | null>>;

  /**
   * Create or update site settings
   */
  createOrUpdateSettings(data: UpdateSiteSettingsDto): Promise<Result<SiteSettings>>;

  /**
   * Update specific settings fields
   */
  updateSettings(id: string, data: UpdateSiteSettingsDto): Promise<Result<SiteSettings>>;

  /**
   * Initialize default settings if none exist
   */
  initializeDefaultSettings(): Promise<Result<SiteSettings>>;
}