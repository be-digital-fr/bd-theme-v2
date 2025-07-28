import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';

export class ApiAdminPreferencesRepository implements IAdminPreferencesRepository {
  private static readonly DEFAULT_PREFERENCES = {
    id: 'default',
    isMultilingual: false,
    supportedLanguages: ['fr'],
    defaultLanguage: 'fr'
  };

  async get(): Promise<AdminPreferences> {
    try {
      const response = await fetch('/api/admin/preferences');
      
      if (!response.ok) {
        console.error('Failed to fetch admin preferences');
        return this.createDefaultPreferences();
      }

      const data = await response.json();
      
      return new AdminPreferences(
        data.id,
        data.isMultilingual,
        data.supportedLanguages,
        data.defaultLanguage
      );
    } catch (error) {
      console.error('Error fetching admin preferences:', error);
      return this.createDefaultPreferences();
    }
  }

  async update(preferences: AdminPreferences): Promise<AdminPreferences> {
    try {
      const response = await fetch('/api/admin/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isMultilingual: preferences.isMultilingual,
          supportedLanguages: preferences.supportedLanguages,
          defaultLanguage: preferences.defaultLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update admin preferences');
      }

      const data = await response.json();
      
      return new AdminPreferences(
        data.id,
        data.isMultilingual,
        data.supportedLanguages,
        data.defaultLanguage
      );
    } catch (error) {
      console.error('Error updating admin preferences:', error);
      throw new Error('Failed to update admin preferences');
    }
  }

  private createDefaultPreferences(): AdminPreferences {
    return new AdminPreferences(
      ApiAdminPreferencesRepository.DEFAULT_PREFERENCES.id,
      ApiAdminPreferencesRepository.DEFAULT_PREFERENCES.isMultilingual,
      ApiAdminPreferencesRepository.DEFAULT_PREFERENCES.supportedLanguages,
      ApiAdminPreferencesRepository.DEFAULT_PREFERENCES.defaultLanguage
    );
  }
}