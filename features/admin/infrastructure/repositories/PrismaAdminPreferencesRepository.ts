import { IAdminPreferencesRepository } from '../../domain/repositories/IAdminPreferencesRepository';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';
import { prisma } from '../../../../lib/prisma';

export class PrismaAdminPreferencesRepository implements IAdminPreferencesRepository {
  private static readonly DEFAULT_PREFERENCES = {
    id: 'default',
    isMultilingual: false,
    supportedLanguages: ['fr'],
    defaultLanguage: 'fr'
  };

  async get(): Promise<AdminPreferences> {
    try {
      const preferences = await prisma.adminPreferences.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      
      if (!preferences) {
        return this.createDefaultPreferences();
      }

      return new AdminPreferences(
        preferences.id,
        preferences.isMultilingual,
        preferences.supportedLanguages as LocaleCodeType[],
        preferences.defaultLanguage as LocaleCodeType
      );
    } catch (error) {
      console.error('Error fetching admin preferences:', error);
      return this.createDefaultPreferences();
    }
  }

  async update(preferences: AdminPreferences): Promise<AdminPreferences> {
    try {
      const existingPreference = await prisma.adminPreferences.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      let updated;
      if (existingPreference) {
        updated = await prisma.adminPreferences.update({
          where: { id: existingPreference.id },
          data: {
            isMultilingual: preferences.isMultilingual,
            supportedLanguages: preferences.supportedLanguages,
            defaultLanguage: preferences.defaultLanguage,
          }
        });
      } else {
        updated = await prisma.adminPreferences.create({
          data: {
            isMultilingual: preferences.isMultilingual,
            supportedLanguages: preferences.supportedLanguages,
            defaultLanguage: preferences.defaultLanguage,
          }
        });
      }

      return new AdminPreferences(
        updated.id,
        updated.isMultilingual,
        updated.supportedLanguages as LocaleCodeType[],
        updated.defaultLanguage as LocaleCodeType
      );
    } catch (error) {
      console.error('Error updating admin preferences:', error);
      throw new Error('Failed to update admin preferences');
    }
  }

  private createDefaultPreferences(): AdminPreferences {
    return new AdminPreferences(
      PrismaAdminPreferencesRepository.DEFAULT_PREFERENCES.id,
      PrismaAdminPreferencesRepository.DEFAULT_PREFERENCES.isMultilingual,
      PrismaAdminPreferencesRepository.DEFAULT_PREFERENCES.supportedLanguages as LocaleCodeType[],
      PrismaAdminPreferencesRepository.DEFAULT_PREFERENCES.defaultLanguage as LocaleCodeType
    );
  }
}