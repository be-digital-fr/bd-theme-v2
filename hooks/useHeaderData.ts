"use client";

import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { AuthSettings } from './useAuthSettings';

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
  slug?: { current: string };
  href: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
  isActive?: boolean;
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

// Requête pour récupérer tous les paramètres
const getSettingsQuery = `
  *[_type == "settings"][0] {
    _id,
    title,
    isMultilingual,
    supportedLanguages,
    defaultLanguage,
    headerSettings,
    navigation {
      _id,
      title,
      menuItems[] {
        _key,
        label,
        slug,
        href,
        isExternal,
        openInNewTab,
        isActive
      },
      footerMenuItems[] {
        _key,
        label,
        href,
        isActive
      },
      mobileMenuTitle
    },
    languageSelectorTexts
  }
`;

// Requête pour récupérer les paramètres d'authentification
const getAuthSettingsQuery = `
  *[_type == "authSettings"][0] {
    _id,
    _type,
    redirectType,
    defaultAuthPage,
    enableGoogleAuth,
    enableFacebookAuth,
    enableTwitterAuth,
    enableGitHubAuth,
    modalTitle,
    modalDescription,
    authButtonText,
    showSocialProviders
  }
`;

// Hook principal pour toutes les données du header
export function useHeaderData() {
  return useQuery<HeaderData>({
    queryKey: ['headerData'],
    queryFn: async (): Promise<HeaderData> => {
      try {
        // Faire les deux requêtes en parallèle
        const [settingsData, authSettingsData] = await Promise.all([
          client.fetch(getSettingsQuery),
          client.fetch(getAuthSettingsQuery)
        ]);

        // Valeurs par défaut pour authSettings si pas trouvé
        const defaultAuthSettings: AuthSettings = {
          _id: 'default',
          _type: 'authSettings',
          redirectType: 'page',
          defaultAuthPage: 'signin',
          enableGoogleAuth: false,
          enableFacebookAuth: false,
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
          settings: settingsData || null,
          authSettings: authSettingsData || defaultAuthSettings,
          navigation: settingsData?.navigation || null,
        };
      } catch (error) {
        console.error('Error fetching header data:', error);
        
        // Retourner des valeurs par défaut en cas d'erreur
        return {
          settings: {
            _id: 'default',
            title: 'Settings',
            isMultilingual: false,
            supportedLanguages: ['fr'],
            defaultLanguage: 'fr',
            headerSettings: {
              logoType: 'text',
              logoText: 'BD Theme',
              headerStyle: 'transparent',
              stickyHeader: true,
              showSearchIcon: true,
              showUserIcon: true,
              showCartIcon: true,
              cartBadgeCount: 0,
            },
          },
          authSettings: {
            _id: 'default',
            _type: 'authSettings',
            redirectType: 'page',
            defaultAuthPage: 'signin',
            enableGoogleAuth: false,
            enableFacebookAuth: false,
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
          },
          navigation: null,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}