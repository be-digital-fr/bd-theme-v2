import { useQuery } from '@tanstack/react-query';
import type { HeaderSettings, NavigationItem, AuthSettings } from './useHeaderData';

interface AdminSettingsResponse {
  data: {
    id: string;
    title: string;
    isMultilingual: boolean;
    supportedLanguages: string[];
    defaultLanguage: string;
    headerSettings?: {
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
    };
    languageSelectorTexts?: {
      chooseLangText: Record<string, string>;
    };
    navigation?: {
      mobileMenuTitle: Record<string, string>;
      menuItems: Array<{
        id: string;
        label: Record<string, string>;
        slug?: string;
        href: string;
        isExternal: boolean;
        openInNewTab?: boolean;
        isActive: boolean;
        order: number;
      }>;
      footerMenuItems: Array<{
        id: string;
        label: Record<string, string>;
        href: string;
        isExternal: boolean;
        isActive: boolean;
        order: number;
      }>;
    };
  } | null;
}

async function fetchAdminSettings(): Promise<AdminSettingsResponse | null> {
  try {
    const response = await fetch('/api/admin/settings');
    if (!response.ok) {
      console.error('Failed to fetch admin settings:', response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return null;
  }
}

function mapAdminToHeaderSettings(adminData: AdminSettingsResponse['data']): {
  settings: {
    isMultilingual: boolean;
    supportedLanguages: string[];
    defaultLanguage: string;
    headerSettings: HeaderSettings;
    languageSelectorTexts?: {
      chooseLangText: Record<string, string>;
    };
  } | null;
  navigation: NavigationItem[];
  authSettings: AuthSettings | null;
} {
  if (!adminData) {
    return {
      settings: null,
      navigation: [],
      authSettings: null
    };
  }

  // Map header settings
  const headerSettings: HeaderSettings = {
    logoType: adminData.headerSettings?.logoType || 'text',
    logoText: adminData.headerSettings?.logoText,
    logoImageUrl: adminData.headerSettings?.logoImageUrl,
    logoImageAlt: adminData.headerSettings?.logoImageAlt,
    headerStyle: adminData.headerSettings?.headerStyle || 'transparent',
    stickyHeader: adminData.headerSettings?.stickyHeader ?? true,
    showSearchIcon: adminData.headerSettings?.showSearchIcon ?? true,
    showUserIcon: adminData.headerSettings?.showUserIcon ?? true,
    showCartIcon: adminData.headerSettings?.showCartIcon ?? true,
    cartBadgeCount: adminData.headerSettings?.cartBadgeCount || 0,
  };

  // Map navigation items
  const navigation: NavigationItem[] = adminData.navigation?.menuItems
    ?.filter(item => item.isActive)
    ?.sort((a, b) => a.order - b.order)
    ?.map(item => ({
      _id: item.id,
      label: item.label,
      slug: item.slug,
      href: item.href,
      isExternal: item.isExternal,
      openInNewTab: item.openInNewTab,
    })) || [];

  // For now, return null for authSettings as it needs to be implemented in admin
  // TODO: Implement auth settings in admin system
  const authSettings: AuthSettings | null = null;

  return {
    settings: {
      isMultilingual: adminData.isMultilingual,
      supportedLanguages: adminData.supportedLanguages,
      defaultLanguage: adminData.defaultLanguage,
      headerSettings,
      languageSelectorTexts: adminData.languageSelectorTexts,
    },
    navigation,
    authSettings,
  };
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const adminResponse = await fetchAdminSettings();
      
      if (adminResponse?.data) {
        return mapAdminToHeaderSettings(adminResponse.data);
      }
      
      // Return null if no admin settings available
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once
  });
}