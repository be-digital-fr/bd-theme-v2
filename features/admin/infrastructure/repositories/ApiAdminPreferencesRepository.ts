import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { AdminPreferencesSchema, AdminPreferencesType } from '../../domain/schemas/AdminPreferencesSchema';

export class ApiAdminPreferencesRepository implements IAdminPreferencesRepository {
  private static readonly DEFAULT_PREFERENCES: AdminPreferencesType = {
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
      
      // Validate response data with Zod
      const validatedData = AdminPreferencesSchema.parse(data);
      return AdminPreferences.fromData(validatedData);
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
        body: JSON.stringify(preferences.toData()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update admin preferences: ${errorData.error}`);
      }

      const data = await response.json();
      
      // Validate response data with Zod
      const validatedData = AdminPreferencesSchema.parse(data);
      return AdminPreferences.fromData(validatedData);
    } catch (error) {
      console.error('Error updating admin preferences:', error);
      throw new Error('Failed to update admin preferences');
    }
  }

  private createDefaultPreferences(): AdminPreferences {
    return AdminPreferences.fromData(ApiAdminPreferencesRepository.DEFAULT_PREFERENCES);
  }
}