'use client';

import { useQuery } from '@tanstack/react-query';
import { useCurrentLocale } from '@/lib/locale';
import { getHomeWithCurrentLocale } from '@/sanity/lib/queries/getHomeWithPreferences';

/**
 * Hook personnalisé pour récupérer les données home avec la langue actuelle
 * Utilise React Query pour la mise en cache et la synchronisation
 * 
 * UTILISATION :
 * ```typescript
 * function MyComponent() {
 *   const { data, isLoading, error } = useLocaleData();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return <div>{data?.data?.title}</div>;
 * }
 * ```
 */
export function useLocaleData() {
  const currentLocale = useCurrentLocale();
  
  return useQuery({
    queryKey: ['home-data', currentLocale],
    queryFn: () => getHomeWithCurrentLocale(currentLocale),
    enabled: !!currentLocale,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook pour récupérer uniquement les données home (sans métadonnées)
 * Version simplifiée pour les composants qui n'ont besoin que du contenu
 */
export function useHomeData() {
  const { data, ...rest } = useLocaleData();
  
  return {
    data: data?.data || null,
    preferences: data?.preferences || null,
    resolvedLanguage: data?.resolvedLanguage || 'fr',
    ...rest,
  };
}

/**
 * Hook pour récupérer les préférences admin actuelles
 * Utile pour les composants qui ont besoin de connaître la configuration
 */
export function useAdminPreferences() {
  const { data, ...rest } = useLocaleData();
  
  return {
    preferences: data?.preferences || {
      isMultilingual: false,
      supportedLanguages: ['fr'],
      defaultLanguage: 'fr',
    },
    ...rest,
  };
}

/**
 * Hook pour vérifier si le mode multilingue est activé
 * Retourne boolean pour faciliter les conditions
 */
export function useIsMultilingual() {
  const { preferences, isLoading } = useAdminPreferences();
  
  return {
    isMultilingual: preferences?.isMultilingual || false,
    isLoading,
  };
}

/**
 * Hook pour récupérer les langues supportées
 * Utile pour générer des sélecteurs de langue dynamiques
 */
export function useSupportedLanguages() {
  const { preferences, isLoading } = useAdminPreferences();
  
  return {
    supportedLanguages: preferences?.supportedLanguages || ['fr'],
    defaultLanguage: preferences?.defaultLanguage || 'fr',
    isLoading,
  };
}

/**
 * Hook pour vérifier si une langue spécifique est supportée
 */
export function useIsLanguageSupported(language: string) {
  const { supportedLanguages, isLoading } = useSupportedLanguages();
  
  return {
    isSupported: supportedLanguages.includes(language),
    isLoading,
  };
}

/**
 * Hook pour récupérer des données avec prefetch
 * Utile pour precharger les données avant un changement de langue
 */
export function usePrefetchLocaleData() {
  const { prefetchQuery } = useQuery({
    queryKey: ['prefetch-locale-data'],
    queryFn: () => Promise.resolve(null),
    enabled: false,
  });
  
  const prefetchLanguage = async (locale: string) => {
    await prefetchQuery({
      queryKey: ['home-data', locale],
      queryFn: () => getHomeWithCurrentLocale(locale),
      staleTime: 5 * 60 * 1000,
    });
  };
  
  return { prefetchLanguage };
} 