"use client";

import { useQuery } from '@tanstack/react-query';
// Client Sanity supprimé - utilise des valeurs par défaut

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

// Valeurs par défaut pour les paramètres d'authentification
const DEFAULT_AUTH_SETTINGS: AuthSettings = {
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

export function useAuthSettings() {
  return useQuery<AuthSettings | null>({
    queryKey: ['authSettings'],
    queryFn: async () => {
      // Retourner directement les valeurs par défaut
      return DEFAULT_AUTH_SETTINGS;
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