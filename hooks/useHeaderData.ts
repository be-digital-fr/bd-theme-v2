"use client";

import { useQuery } from '@tanstack/react-query';
import { AuthSettings } from './useAuthSettings';
import { useAdminSettings } from './useAdminSettings';

// Types pour les données du header
export interface HeaderSettings {
  logoType?: 'text' | 'image' | 'both';
  logoText?: string;
  logoImage?: {
    asset: {
      url: string;
    };
    alt?: Record<string, string> | string;
  };
  logoImageUrl?: string;
  logoImageAlt?: Record<string, string>;
  headerStyle?: 'transparent' | 'solid' | 'gradient';
  stickyHeader?: boolean;
  showSearchIcon?: boolean;
  showUserIcon?: boolean;
  showCartIcon?: boolean;
  cartBadgeCount?: number;
}

export interface MenuItem {
  _key?: string;
  label: Record<string, string> | string;
  slug?: { current: string } | string;
  href: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
  isActive?: boolean;
}

export interface NavigationItem {
  _id: string;
  label: Record<string, string>;
  slug?: string;
  href: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
}

export interface FooterMenuItem {
  _key?: string;
  label: Record<string, string> | string;
  href: string;
  isActive?: boolean;
}

export interface NavigationData {
  _id: string;
  title: string;
  menuItems: MenuItem[];
  footerMenuItems?: FooterMenuItem[];
  mobileMenuTitle: Record<string, string> | string;
}

export interface SettingsData {
  _id: string;
  title: string;
  isMultilingual: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  headerSettings?: HeaderSettings;
  navigation?: NavigationData;
  languageSelectorTexts?: {
    chooseLangText?: Record<string, string> | string;
  };
}

// Interface pour les données complètes du header
export interface HeaderData {
  settings: SettingsData | null;
  authSettings: AuthSettings | null;
  navigation: NavigationData | null;
}

// Plus besoin des requêtes Sanity - utilisation uniquement des données admin

// Hook principal pour toutes les données du header
export function useHeaderData() {
  const { data: adminData, isLoading: adminLoading } = useAdminSettings();

  return useQuery<HeaderData>({
    queryKey: ['headerData', adminData],
    queryFn: async (): Promise<HeaderData> => {
      // Utiliser les données admin ou des valeurs par défaut
      if (adminData && adminData.settings) {
        // Mapper les données admin au format attendu
        const mappedSettings: SettingsData = {
          _id: 'admin-settings',
          title: adminData.settings.headerSettings.logoText || 'Mon Site',
          isMultilingual: adminData.settings.isMultilingual,
          supportedLanguages: adminData.settings.supportedLanguages,
          defaultLanguage: adminData.settings.defaultLanguage,
          headerSettings: {
            ...adminData.settings.headerSettings,
            // Mapper logoImageUrl vers logoImage si nécessaire
            logoImage: adminData.settings.headerSettings.logoImageUrl ? {
              asset: {
                url: adminData.settings.headerSettings.logoImageUrl
              },
              alt: adminData.settings.headerSettings.logoImageAlt
            } : undefined
          },
          languageSelectorTexts: adminData.settings.languageSelectorTexts,
          navigation: {
            _id: 'admin-navigation',
            title: 'Navigation',
            menuItems: adminData.navigation.map(item => ({
              _key: item._id,
              label: item.label,
              slug: item.slug ? { current: item.slug } : undefined,
              href: item.href,
              isExternal: item.isExternal,
              openInNewTab: item.openInNewTab,
              isActive: true
            })),
            footerMenuItems: [],
            mobileMenuTitle: { fr: 'Menu', en: 'Menu' }
          }
        };

        return {
          settings: mappedSettings,
          authSettings: adminData.authSettings,
          navigation: mappedSettings.navigation
        };
      }

      // Valeurs par défaut si pas de données admin
      const defaultAuthSettings: AuthSettings = {
        _id: 'default',
        _type: 'authSettings',
        redirectType: 'page',
        defaultAuthPage: 'signin',
        googleAuth: {
          enabled: false,
        },
        facebookAuth: {
          enabled: false,
        },
        enableTwitterAuth: false,
        enableGitHubAuth: false,
        modalTitle: {
          fr: 'Connexion à votre compte',
          en: 'Sign in to your account',
        },
        modalDescription: {
          fr: 'Accédez à votre espace personnel',
          en: 'Access your personal space',
        },
        authButtonText: {
          fr: 'Se connecter',
          en: 'Sign in',
        },
        showSocialProviders: false,
      };

      return {
        settings: {
          _id: 'default',
          title: 'Settings',
          isMultilingual: false,
          supportedLanguages: ['fr'],
          defaultLanguage: 'fr',
          headerSettings: {
            logoType: 'text',
            logoText: 'Mon Site',
            headerStyle: 'transparent',
            stickyHeader: true,
            showSearchIcon: true,
            showUserIcon: true,
            showCartIcon: true,
            cartBadgeCount: 0,
          },
        },
        authSettings: defaultAuthSettings,
        navigation: null,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !adminLoading, // Ne pas faire la requête tant que admin loading
  });
}