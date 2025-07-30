"use client";

import { useQuery } from '@tanstack/react-query';
import { client, previewClient } from '@/sanity/lib/client';
import { getSettingsQuery } from '@/sanity/lib/queries';

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
  navigation?: NavigationData;
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
        console.log('Fetching settings from Sanity...');
        console.log('Query:', getSettingsQuery);
        const data = await client.fetch(getSettingsQuery, {}, { next: { revalidate: 3600 } });
        console.log('Settings fetched:', data);
        if (!data) {
          console.warn('No settings document found in Sanity. Please create one in Sanity Studio.');
        }
        return data;
      } catch (error) {
        console.error('Error fetching settings:', error);
        console.error('Full error details:', {
          message: (error as any).message,
          statusCode: (error as any).statusCode,
          details: (error as any).details
        });
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}

// Hook pour récupérer les données de navigation (depuis settings)
export function useNavigation() {
  const { data: settings, isLoading, error } = useSettings();

  console.log('settings', settings);

  return {
    data: settings?.navigation || null,
    isLoading,
    error,
  };
}

// Hook combiné pour la compatibilité (header qui a besoin des deux)
export function useHeaderData() {
  const { data: settings, isLoading, error } = useSettings();

  return {
    data: {
      settings,
      navigation: settings?.navigation,
    },
    isLoading,
    error,
  };
}