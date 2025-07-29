"use client";

import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { getSettingsQuery } from '@/sanity/lib/queries';
import { getNavigationQuery } from '@/sanity/lib/queries/getNavigation';

export interface MenuItem {
  _key: string;
  label: Record<string, string> | string;
  slug: {
    current: string;
    _type: string;
  };
  href: string;
  isExternal: boolean;
  openInNewTab?: boolean;
  isActive: boolean;
}

export interface FooterMenuItem {
  _key: string;
  label: Record<string, string> | string;
  href: string;
  isExternal: boolean;
  isActive: boolean;
}

export interface HeaderSettings {
  logoType?: 'text' | 'image' | 'both';
  logoText?: string;
  logoImage?: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  headerStyle?: 'transparent' | 'opaque' | 'gradient';
  stickyHeader?: boolean;
  showSearchIcon?: boolean;
  showUserIcon?: boolean;
  showCartIcon?: boolean;
  cartBadgeCount?: number;
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
  translationSettings?: {
    autoTranslate: boolean;
    translationModel: string;
    translationDelay: number;
    apiKeyInfo?: {
      info: string;
    };
  };
  languageSelectorTexts?: {
    chooseLangText?: Record<string, string> | string;
  };
}

// Hook pour récupérer les paramètres (sans navigation)
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<SettingsData | null> => {
      try {
        const data = await client.fetch(getSettingsQuery);
        return data;
      } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour récupérer les données de navigation (nouveau singleton séparé)
export function useNavigation() {
  return useQuery({
    queryKey: ['navigation'],
    queryFn: async (): Promise<NavigationData | null> => {
      try {
        const data = await client.fetch(getNavigationQuery);
        return data || null;
      } catch (error) {
        console.error('Failed to fetch navigation:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook combiné pour la compatibilité (header qui a besoin des deux)
export function useHeaderData() {
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useSettings();
  const { data: navigation, isLoading: navigationLoading, error: navigationError } = useNavigation();

  return {
    data: {
      settings,
      navigation,
    },
    isLoading: settingsLoading || navigationLoading,
    error: settingsError || navigationError,
  };
}