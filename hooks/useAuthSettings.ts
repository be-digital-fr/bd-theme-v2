"use client";

import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';

export interface AuthSettings {
  _id: string;
  _type: 'authSettings';
  redirectType: 'page' | 'modal';
  defaultAuthPage: 'signin' | 'signup';
  googleAuth: {
    enabled: boolean;
    clientId?: string;
    clientSecret?: string;
  };
  facebookAuth: {
    enabled: boolean;
    appId?: string;
    appSecret?: string;
  };
  enableTwitterAuth: boolean;
  enableGitHubAuth: boolean;
  modalTitle: {
    fr: string;
    en: string;
    [key: string]: string;
  };
  modalDescription: {
    fr: string;
    en: string;
    [key: string]: string;
  };
  authButtonText: {
    fr: string;
    en: string;
    [key: string]: string;
  };
  showSocialProviders: boolean;
}

const AUTH_SETTINGS_QUERY = `
  *[_type == "authSettings"][0] {
    _id,
    _type,
    redirectType,
    defaultAuthPage,
    googleAuth{
      enabled,
      clientId,
      clientSecret
    },
    facebookAuth{
      enabled,
      appId,
      appSecret
    },
    enableTwitterAuth,
    enableGitHubAuth,
    modalTitle,
    modalDescription,
    authButtonText,
    showSocialProviders
  }
`;

export function useAuthSettings() {
  return useQuery<AuthSettings | null>({
    queryKey: ['authSettings'],
    queryFn: async () => {
      try {
        const data = await client.fetch(AUTH_SETTINGS_QUERY);
        console.log('Auth settings:', data);
        return data || null;
      } catch (error) {
        console.error('Error fetching auth settings:', error);
        // Retourner des valeurs par défaut en cas d'erreur
        return {
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
        } as AuthSettings;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour obtenir les paramètres d'auth avec des valeurs par défaut
export function useAuthSettingsWithDefaults() {
  const { data: authSettings, isLoading, error } = useAuthSettings();

  // Valeurs par défaut si pas de données
  const defaultSettings: AuthSettings = {
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
    authSettings: authSettings || defaultSettings,
    isLoading,
    error,
  };
}