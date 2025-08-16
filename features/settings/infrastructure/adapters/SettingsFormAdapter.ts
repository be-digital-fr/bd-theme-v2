import { SiteSettings } from '../../domain/entities/SiteSettings';

/**
 * Adapter to transform Prisma settings data to form format
 */
export class SettingsFormAdapter {
  /**
   * Transform SiteSettings to form data format expected by DynamicForm
   */
  static toFormData(settings: SiteSettings | null): Record<string, any> {
    if (!settings) {
      return {
        general: {
          title: '',
          isMultilingual: false,
          supportedLanguages: ['fr'],
          defaultLanguage: 'fr'
        },
        header: {
          logoType: 'text',
          logoText: '',
          headerStyle: 'transparent',
          stickyHeader: true,
          showSearchIcon: true,
          showUserIcon: true,
          showCartIcon: true,
          cartBadgeCount: 0
        },
        languageSelector: {
          chooseLangText: { fr: 'Choisir une langue', en: 'Choose language' }
        },
        navigation: {
          mobileMenuTitle: { fr: 'Menu', en: 'Menu' },
          menuItems: [],
          footerMenuItems: []
        }
      };
    }

    return {
      general: {
        title: settings.title,
        isMultilingual: settings.isMultilingual,
        supportedLanguages: settings.supportedLanguages,
        defaultLanguage: settings.defaultLanguage
      },
      header: {
        logoType: settings.headerSettings?.logoType || 'text',
        logoText: settings.headerSettings?.logoText || '',
        logoImageUrl: settings.headerSettings?.logoImageUrl || '',
        logoImageAlt: settings.headerSettings?.logoImageAlt || {},
        headerStyle: settings.headerSettings?.headerStyle || 'transparent',
        stickyHeader: settings.headerSettings?.stickyHeader ?? true,
        showSearchIcon: settings.headerSettings?.showSearchIcon ?? true,
        showUserIcon: settings.headerSettings?.showUserIcon ?? true,
        showCartIcon: settings.headerSettings?.showCartIcon ?? true,
        cartBadgeCount: settings.headerSettings?.cartBadgeCount || 0
      },
      languageSelector: {
        chooseLangText: settings.languageSelectorTexts?.chooseLangText || { fr: 'Choisir une langue' }
      },
      navigation: {
        mobileMenuTitle: settings.navigation?.mobileMenuTitle || { fr: 'Menu' },
        menuItems: settings.navigation?.menuItems || [],
        footerMenuItems: settings.navigation?.footerMenuItems || []
      }
    };
  }

  /**
   * Transform form data back to UpdateSiteSettingsDto format
   */
  static fromFormData(formData: Record<string, any>): any {
    return {
      title: formData.general?.title,
      isMultilingual: formData.general?.isMultilingual,
      supportedLanguages: formData.general?.supportedLanguages,
      defaultLanguage: formData.general?.defaultLanguage,
      headerSettings: formData.header ? {
        logoType: formData.header.logoType,
        logoText: formData.header.logoText,
        logoImageUrl: formData.header.logoImageUrl,
        logoImageAlt: formData.header.logoImageAlt,
        headerStyle: formData.header.headerStyle,
        stickyHeader: formData.header.stickyHeader,
        showSearchIcon: formData.header.showSearchIcon,
        showUserIcon: formData.header.showUserIcon,
        showCartIcon: formData.header.showCartIcon,
        cartBadgeCount: formData.header.cartBadgeCount
      } : undefined,
      languageSelectorTexts: formData.languageSelector ? {
        chooseLangText: formData.languageSelector.chooseLangText
      } : undefined,
      navigation: formData.navigation ? {
        mobileMenuTitle: formData.navigation.mobileMenuTitle,
        menuItems: formData.navigation.menuItems,
        footerMenuItems: formData.navigation.footerMenuItems
      } : undefined
    };
  }
}