import { getFirstResolvedHome, type ResolvedHomeData } from './getHome';
import { DEFAULT_LOCALE, isValidLocale } from '@/lib/locale';

/**
 * INTÉGRATION AVEC LES PRÉFÉRENCES ADMINISTRATIVES ET L'URL
 * =========================================================
 * 
 * Ce fichier combine la récupération des données Sanity avec les préférences 
 * linguistiques définies par l'administrateur dans la base de données ET
 * la langue sélectionnée par l'utilisateur via l'URL.
 * 
 * FLUX COMPLET :
 * -------------
 * 1. Récupère les préférences admin depuis l'API /api/admin/preferences
 * 2. Détermine la langue à utiliser (URL → user preference → default → fr)
 * 3. Récupère et résout les données Sanity selon cette langue
 * 4. Retourne un objet complet avec données + métadonnées
 * 
 * ORDRE DE PRIORITÉ POUR LA LANGUE :
 * ----------------------------------
 * 1. Langue depuis l'URL (paramètre Next.js locale)
 * 2. Langue préférée utilisateur (paramètre userPreferredLanguage)
 * 3. Langue par défaut des préférences admin
 * 4. Langue par défaut du système (fr)
 * 
 * DIAGNOSTIC :
 * -----------
 * - Si preferences.isMultilingual = false → utilise defaultLanguage uniquement
 * - Si preferences.isMultilingual = true → résout selon supportedLanguages
 * - Si l'API preferences échoue → utilise des valeurs par défaut sûres
 * 
 * ENVIRONNEMENTS :
 * ---------------
 * - En développement : utilise window.location.origin ou localhost:3001
 * - En production : utilise NEXT_PUBLIC_BASE_URL ou window.location.origin
 */

// Interface pour les préférences admin récupérées de l'API
interface AdminPreferences {
  isMultilingual: boolean;     // Mode mono ou multilingue
  supportedLanguages: string[]; // Langues configurées par l'admin
  defaultLanguage: string;     // Langue par défaut du système
}

/**
 * Récupère les préférences administratives depuis l'API
 * 
 * GESTION D'ERREURS :
 * - Timeout réseau → fallback vers valeurs par défaut
 * - API non disponible → fallback vers valeurs par défaut  
 * - Erreur de parsing JSON → fallback vers valeurs par défaut
 * 
 * VALEURS PAR DÉFAUT :
 * - isMultilingual: false (mode sûr)
 * - supportedLanguages: ['fr'] (français uniquement)
 * - defaultLanguage: 'fr' (français)
 */
async function getAdminPreferences(): Promise<AdminPreferences> {
  try {
    // Détection de l'environnement pour construire l'URL de base
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin  // Côté client
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'; // Côté serveur
    
    console.log(`[getAdminPreferences] Fetching from: ${baseUrl}/api/admin/preferences`);
    
    const response = await fetch(`${baseUrl}/api/admin/preferences`);
    
    if (!response.ok) {
      console.warn(`[getAdminPreferences] HTTP ${response.status}: Using defaults`);
      return getDefaultPreferences();
    }
    
    const preferences = await response.json();
    console.log('[getAdminPreferences] Successfully fetched:', preferences);
    return preferences;
    
  } catch (error) {
    console.warn('[getAdminPreferences] Error fetching preferences:', error);
    return getDefaultPreferences();
  }
}

/**
 * Retourne les préférences par défaut en cas d'erreur
 * Ces valeurs garantissent que l'application fonctionne même si l'API est indisponible
 */
function getDefaultPreferences(): AdminPreferences {
  return {
    isMultilingual: false,
    supportedLanguages: ['fr'],
    defaultLanguage: 'fr',
  };
}

/**
 * Fonction principale qui récupère les données home avec résolution automatique
 * selon les préférences administratives et la langue de l'URL
 * 
 * LOGIQUE DE RÉSOLUTION DE LANGUE (NOUVELLE PRIORITÉ) :
 * 1. Si nextjsLocale fourni ET supporté → utilise nextjsLocale (PRIORITÉ URL)
 * 2. Si userPreferredLanguage fourni ET supporté → utilise userPreferredLanguage
 * 3. Sinon → utilise preferences.defaultLanguage
 * 4. En cas d'erreur → utilise 'fr' par défaut
 * 
 * UTILISATION :
 * // Langue automatique selon les préférences
 * const result = await getHomeWithPreferences()
 * 
 * // Langue depuis l'URL (RECOMMANDÉ)
 * const result = await getHomeWithPreferences(undefined, 'en')
 * 
 * // Langue spécifique utilisateur avec fallback URL
 * const result = await getHomeWithPreferences('es', 'en')
 * 
 * RETOUR :
 * {
 *   data: ResolvedHomeData | null,  // Données home résolues ou null si aucun document
 *   preferences: AdminPreferences,  // Configuration admin actuelle
 *   resolvedLanguage: string       // Langue effectivement utilisée
 * }
 */
export async function getHomeWithPreferences(
  userPreferredLanguage?: string,
  nextjsLocale?: string
): Promise<{
  data: ResolvedHomeData | null;
  preferences: AdminPreferences;
  resolvedLanguage: string;
}> {
  console.log('[getHomeWithPreferences] Starting with:', {
    userPreferredLanguage,
    nextjsLocale
  });
  
  // 1. Récupérer les préférences administratives
  const preferences = await getAdminPreferences();
  
  // 2. Déterminer la langue à utiliser selon la NOUVELLE logique de priorité
  let resolvedLanguage = preferences.defaultLanguage;
  
  // PRIORITÉ 1: Langue depuis l'URL Next.js (NOUVEAU)
  if (nextjsLocale && isValidLocale(nextjsLocale)) {
    if (preferences.supportedLanguages.includes(nextjsLocale)) {
      resolvedLanguage = nextjsLocale;
      console.log('[getHomeWithPreferences] Using Next.js locale from URL:', nextjsLocale);
    } else {
      console.log('[getHomeWithPreferences] Next.js locale not supported, using default:', preferences.defaultLanguage);
    }
  }
  // PRIORITÉ 2: Langue préférée utilisateur (si pas de locale URL)
  else if (userPreferredLanguage && isValidLocale(userPreferredLanguage)) {
    if (preferences.supportedLanguages.includes(userPreferredLanguage)) {
      resolvedLanguage = userPreferredLanguage;
      console.log('[getHomeWithPreferences] Using user preferred language:', userPreferredLanguage);
    } else {
      console.log('[getHomeWithPreferences] User language not supported, using default:', preferences.defaultLanguage);
    }
  }
  // PRIORITÉ 3: Langue par défaut des préférences
  else {
    console.log('[getHomeWithPreferences] No valid locale provided, using default:', preferences.defaultLanguage);
  }
  
  // 3. Récupérer les données résolues selon la langue déterminée
  console.log('[getHomeWithPreferences] Fetching data with resolved language:', resolvedLanguage);
  const data = await getFirstResolvedHome(resolvedLanguage);
  
  // 4. Log final pour débogage
  console.log('[getHomeWithPreferences] Final result:', {
    hasData: !!data,
    preferences,
    resolvedLanguage,
    dataPreview: data ? {
      id: data._id,
      title: data.title,
      welcoming: data.welcoming
    } : null
  });
  
  return {
    data,
    preferences,
    resolvedLanguage,
  };
}

/**
 * Fonction pour récupérer les données avec la langue depuis les paramètres Next.js
 * Version adaptée pour les Server Components Next.js 13+
 * 
 * UTILISATION DANS LES SERVER COMPONENTS :
 * 
 * // Dans une page avec paramètres de route dynamiques
 * export default async function Page({ params }: { params: { locale: string } }) {
 *   const result = await getHomeWithNextjsLocale(params.locale);
 *   // ...
 * }
 * 
 * // Dans un layout avec paramètres
 * export default async function Layout({ params }: { params: { locale: string } }) {
 *   const result = await getHomeWithNextjsLocale(params.locale);
 *   // ...
 * }
 */
export async function getHomeWithNextjsLocale(
  locale?: string
): Promise<{
  data: ResolvedHomeData | null;
  preferences: AdminPreferences;
  resolvedLanguage: string;
}> {
  return getHomeWithPreferences(undefined, locale);
}

/**
 * Fonction simplifiée qui retourne uniquement les données home résolues
 * avec support de la langue URL
 * 
 * UTILISATION :
 * const homeData = await getResolvedHomeData()
 * const homeDataFromUrl = await getResolvedHomeData(undefined, 'en')
 * const homeDataUserPref = await getResolvedHomeData('es', 'en')
 * 
 * RETOUR :
 * ResolvedHomeData | null
 */
export async function getResolvedHomeData(
  userPreferredLanguage?: string,
  nextjsLocale?: string
): Promise<ResolvedHomeData | null> {
  const result = await getHomeWithPreferences(userPreferredLanguage, nextjsLocale);
  return result.data;
}

/**
 * Hook pour récupérer les données avec la langue actuelle côté client
 * À utiliser avec React Query ou SWR
 * 
 * UTILISATION DANS LES COMPOSANTS :
 * 
 * // Avec React Query
 * const { data } = useQuery({
 *   queryKey: ['home', locale],
 *   queryFn: () => getHomeWithCurrentLocale(locale)
 * });
 */
export async function getHomeWithCurrentLocale(
  currentLocale: string
): Promise<{
  data: ResolvedHomeData | null;
  preferences: AdminPreferences;
  resolvedLanguage: string;
}> {
  return getHomeWithPreferences(undefined, currentLocale);
} 