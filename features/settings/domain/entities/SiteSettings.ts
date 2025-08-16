export interface SiteSettings {
  id: string;
  title: string;
  isMultilingual: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  headerSettings?: HeaderSettings;
  languageSelectorTexts?: LanguageSelectorTexts;
  navigation?: Navigation;
}

export interface HeaderSettings {
  id: string;
  logoType: string;
  logoText?: string;
  logoImageUrl?: string;
  logoImageAlt?: Record<string, string>;
  headerStyle: string;
  stickyHeader: boolean;
  showSearchIcon: boolean;
  showUserIcon: boolean;
  showCartIcon: boolean;
  cartBadgeCount: number;
  siteSettingsId: string;
}

export interface LanguageSelectorTexts {
  id: string;
  chooseLangText: Record<string, string>;
  siteSettingsId: string;
}

export interface Navigation {
  id: string;
  mobileMenuTitle: Record<string, string>;
  siteSettingsId: string;
  menuItems: MenuItem[];
  footerMenuItems: FooterMenuItem[];
}

export interface MenuItem {
  id: string;
  label: Record<string, string>;
  slug: string;
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
  isActive: boolean;
  order: number;
  navigationId: string;
}

export interface FooterMenuItem {
  id: string;
  label: Record<string, string>;
  href: string;
  isExternal: boolean;
  isActive: boolean;
  order: number;
  navigationId: string;
}

// DTOs for creating/updating
export interface CreateSiteSettingsDto {
  title?: string;
  isMultilingual?: boolean;
  supportedLanguages?: string[];
  defaultLanguage?: string;
}

export interface UpdateSiteSettingsDto extends Partial<CreateSiteSettingsDto> {
  headerSettings?: Partial<HeaderSettings>;
  languageSelectorTexts?: Partial<LanguageSelectorTexts>;
  navigation?: Partial<Navigation>;
}