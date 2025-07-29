import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';
import { prisma } from '@/lib/prisma';

export class PrismaAdminPreferencesRepository implements IAdminPreferencesRepository {
  async get(): Promise<AdminPreferences> {
    try {
      const preferences = await prisma.adminPreferences.findFirst();
      if (!preferences) {
        // Retourner des valeurs par défaut si pas de préférences
        return new AdminPreferences(
          '1',
          false,
          ['fr'],
          'fr'
        );
      }
      return AdminPreferences.fromData({
        id: preferences.id,
        isMultilingual: preferences.isMultilingual,
        supportedLanguages: preferences.supportedLanguages as LocaleCodeType[],
        defaultLanguage: preferences.defaultLanguage as LocaleCodeType,
      });
    } catch (error) {
      console.error('Error fetching admin preferences from database:', error);
      throw error;
    }
  }

  async update(preferences: AdminPreferences): Promise<AdminPreferences> {
    try {
      const existing = await prisma.adminPreferences.findFirst();
      
      if (existing) {
        const updated = await prisma.adminPreferences.update({
          where: { id: existing.id },
          data: preferences.toData(),
        });
        return AdminPreferences.fromData({
          id: updated.id,
          isMultilingual: updated.isMultilingual,
          supportedLanguages: updated.supportedLanguages as LocaleCodeType[],
          defaultLanguage: updated.defaultLanguage as LocaleCodeType,
        });
      } else {
        const created = await prisma.adminPreferences.create({
          data: preferences.toData(),
        });
        return AdminPreferences.fromData({
          id: created.id,
          isMultilingual: created.isMultilingual,
          supportedLanguages: created.supportedLanguages as LocaleCodeType[],
          defaultLanguage: created.defaultLanguage as LocaleCodeType,
        });
      }
    } catch (error) {
      console.error('Error updating admin preferences in database:', error);
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