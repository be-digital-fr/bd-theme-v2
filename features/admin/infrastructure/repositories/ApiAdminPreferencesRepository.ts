import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';

export class ApiAdminPreferencesRepository implements IAdminPreferencesRepository {
  private baseUrl = '/api/admin/preferences';

  async get(): Promise<AdminPreferences> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        if (response.status === 404) {
          // Retourner des valeurs par défaut si pas de préférences
          return new AdminPreferences(
            '1',
            false,
            ['fr'],
            'fr'
          );
        }
        throw new Error(`Failed to fetch preferences: ${response.statusText}`);
      }
      const data = await response.json();
      return AdminPreferences.fromData(data);
    } catch (error) {
      console.error('Error fetching admin preferences:', error);
      throw error;
    }
  }

  async update(preferences: AdminPreferences): Promise<AdminPreferences> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences.toData()),
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.statusText}`);
      }

      const data = await response.json();
      return AdminPreferences.fromData(data);
    } catch (error) {
      console.error('Error updating admin preferences:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  async getPreferences(): Promise<AdminPreferences> {
    return this.get();
  }

  async updatePreferences(preferences: Partial<AdminPreferences>): Promise<AdminPreferences> {
    const current = await this.get();
    const updatedData = { ...current.toData(), ...preferences };
    const updated = AdminPreferences.fromData(updatedData);
    return this.update(updated);
  }

  async setDefaultLanguage(language: LocaleCodeType): Promise<AdminPreferences> {
    return this.updatePreferences({ defaultLanguage: language });
  }

  async toggleMultilingual(isMultilingual: boolean): Promise<AdminPreferences> {
    return this.updatePreferences({ isMultilingual });
  }
}