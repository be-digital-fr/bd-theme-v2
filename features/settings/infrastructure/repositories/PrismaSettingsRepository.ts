import { PrismaClient } from '@prisma/client';
import { Result } from '@/lib/result';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';
import { 
  SiteSettings, 
  CreateSiteSettingsDto, 
  UpdateSiteSettingsDto 
} from '../../domain/entities/SiteSettings';

export class PrismaSettingsRepository implements ISettingsRepository {
  constructor(private prisma: PrismaClient) {}

  async getSettings(): Promise<Result<SiteSettings | null>> {
    try {
      const settings = await this.prisma.site_settings.findFirst({
        include: {
          header_settings: true,
          language_selector_texts: true,
          navigation: {
            include: {
              menu_items: {
                orderBy: { order: 'asc' }
              },
              footer_menu_items: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (!settings) {
        return Result.success(null);
      }

      const mappedSettings: SiteSettings = {
        id: settings.id,
        title: settings.title,
        isMultilingual: settings.isMultilingual,
        supportedLanguages: settings.supportedLanguages,
        defaultLanguage: settings.defaultLanguage,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
        headerSettings: settings.header_settings ? {
          id: settings.header_settings.id,
          logoType: settings.header_settings.logoType,
          logoText: settings.header_settings.logoText || undefined,
          logoImageUrl: settings.header_settings.logoImageUrl || undefined,
          logoImageAlt: settings.header_settings.logoImageAlt as Record<string, string> || undefined,
          headerStyle: settings.header_settings.headerStyle,
          stickyHeader: settings.header_settings.stickyHeader,
          showSearchIcon: settings.header_settings.showSearchIcon,
          showUserIcon: settings.header_settings.showUserIcon,
          showCartIcon: settings.header_settings.showCartIcon,
          cartBadgeCount: settings.header_settings.cartBadgeCount,
          siteSettingsId: settings.header_settings.siteSettingsId
        } : undefined,
        languageSelectorTexts: settings.language_selector_texts ? {
          id: settings.language_selector_texts.id,
          chooseLangText: settings.language_selector_texts.chooseLangText as Record<string, string>,
          siteSettingsId: settings.language_selector_texts.siteSettingsId
        } : undefined,
        navigation: settings.navigation ? {
          id: settings.navigation.id,
          mobileMenuTitle: settings.navigation.mobileMenuTitle as Record<string, string>,
          siteSettingsId: settings.navigation.siteSettingsId,
          menuItems: settings.navigation.menu_items.map(item => ({
            id: item.id,
            label: item.label as Record<string, string>,
            slug: item.slug,
            href: item.href,
            isExternal: item.isExternal,
            openInNewTab: item.openInNewTab,
            isActive: item.isActive,
            order: item.order,
            navigationId: item.navigationId
          })),
          footerMenuItems: settings.navigation.footer_menu_items.map(item => ({
            id: item.id,
            label: item.label as Record<string, string>,
            href: item.href,
            isExternal: item.isExternal,
            isActive: item.isActive,
            order: item.order,
            navigationId: item.navigationId
          }))
        } : undefined
      };

      return Result.success(mappedSettings);
    } catch (error) {
      return Result.failure({
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database query failed',
        details: error
      });
    }
  }

  async createOrUpdateSettings(data: UpdateSiteSettingsDto): Promise<Result<SiteSettings>> {
    try {
      const settingsId = 'site-settings-singleton';
      const now = new Date();

      const result = await this.prisma.$transaction(async (tx) => {
        // Upsert main settings
        const settings = await tx.site_settings.upsert({
          where: { id: settingsId },
          create: {
            id: settingsId,
            title: data.title || 'Paramètres du site',
            isMultilingual: data.isMultilingual ?? false,
            supportedLanguages: data.supportedLanguages || ['fr'],
            defaultLanguage: data.defaultLanguage || 'fr',
            createdAt: now,
            updatedAt: now
          },
          update: {
            ...(data.title && { title: data.title }),
            ...(data.isMultilingual !== undefined && { isMultilingual: data.isMultilingual }),
            ...(data.supportedLanguages && { supportedLanguages: data.supportedLanguages }),
            ...(data.defaultLanguage && { defaultLanguage: data.defaultLanguage }),
            updatedAt: now
          }
        });

        // Handle header settings if provided
        if (data.headerSettings) {
          await tx.header_settings.upsert({
            where: { siteSettingsId: settingsId },
            create: {
              id: `${settingsId}-header`,
              siteSettingsId: settingsId,
              logoType: data.headerSettings.logoType || 'text',
              logoText: data.headerSettings.logoText,
              logoImageUrl: data.headerSettings.logoImageUrl,
              logoImageAlt: data.headerSettings.logoImageAlt,
              headerStyle: data.headerSettings.headerStyle || 'transparent',
              stickyHeader: data.headerSettings.stickyHeader ?? true,
              showSearchIcon: data.headerSettings.showSearchIcon ?? true,
              showUserIcon: data.headerSettings.showUserIcon ?? true,
              showCartIcon: data.headerSettings.showCartIcon ?? true,
              cartBadgeCount: data.headerSettings.cartBadgeCount || 0
            },
            update: {
              ...(data.headerSettings.logoType && { logoType: data.headerSettings.logoType }),
              ...(data.headerSettings.logoText !== undefined && { logoText: data.headerSettings.logoText }),
              ...(data.headerSettings.logoImageUrl !== undefined && { logoImageUrl: data.headerSettings.logoImageUrl }),
              ...(data.headerSettings.logoImageAlt && { logoImageAlt: data.headerSettings.logoImageAlt }),
              ...(data.headerSettings.headerStyle && { headerStyle: data.headerSettings.headerStyle }),
              ...(data.headerSettings.stickyHeader !== undefined && { stickyHeader: data.headerSettings.stickyHeader }),
              ...(data.headerSettings.showSearchIcon !== undefined && { showSearchIcon: data.headerSettings.showSearchIcon }),
              ...(data.headerSettings.showUserIcon !== undefined && { showUserIcon: data.headerSettings.showUserIcon }),
              ...(data.headerSettings.showCartIcon !== undefined && { showCartIcon: data.headerSettings.showCartIcon }),
              ...(data.headerSettings.cartBadgeCount !== undefined && { cartBadgeCount: data.headerSettings.cartBadgeCount })
            }
          });
        }

        // Handle language selector texts if provided
        if (data.languageSelectorTexts) {
          await tx.language_selector_texts.upsert({
            where: { siteSettingsId: settingsId },
            create: {
              id: `${settingsId}-lang-texts`,
              siteSettingsId: settingsId,
              chooseLangText: data.languageSelectorTexts.chooseLangText || { fr: 'Choisir une langue' }
            },
            update: {
              ...(data.languageSelectorTexts.chooseLangText && { chooseLangText: data.languageSelectorTexts.chooseLangText })
            }
          });
        }

        return settings;
      });

      // Fetch the complete updated settings
      const updatedSettings = await this.getSettings();
      
      if (!updatedSettings.success || !updatedSettings.data) {
        return Result.failure({
          code: 'UPDATE_ERROR',
          message: 'Failed to retrieve updated settings'
        });
      }

      return Result.success(updatedSettings.data);
    } catch (error) {
      return Result.failure({
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database update failed',
        details: error
      });
    }
  }

  async updateSettings(id: string, data: UpdateSiteSettingsDto): Promise<Result<SiteSettings>> {
    return this.createOrUpdateSettings(data);
  }

  async initializeDefaultSettings(): Promise<Result<SiteSettings>> {
    const defaultData: UpdateSiteSettingsDto = {
      title: 'Paramètres du site',
      isMultilingual: false,
      supportedLanguages: ['fr'],
      defaultLanguage: 'fr',
      headerSettings: {
        logoType: 'text',
        logoText: 'Be Digital',
        headerStyle: 'transparent',
        stickyHeader: true,
        showSearchIcon: true,
        showUserIcon: true,
        showCartIcon: true,
        cartBadgeCount: 0
      },
      languageSelectorTexts: {
        chooseLangText: { fr: 'Choisir une langue', en: 'Choose language' }
      }
    };

    return this.createOrUpdateSettings(defaultData);
  }
}