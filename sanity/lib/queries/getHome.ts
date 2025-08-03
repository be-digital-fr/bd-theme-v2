import { client } from "../client";
import { sanityFetch } from "../live";

/**
 * DOCUMENTATION DÉVELOPPEUR - RÉCUPÉRATION DES DONNÉES HOME
 * =========================================================
 * 
 * Ce fichier contient toutes les fonctions pour récupérer et résoudre les données 
 * du document "home" depuis Sanity CMS avec support multilingue.
 * 
 * DIAGNOSTIC DES PROBLÈMES COURANTS :
 * -----------------------------------
 * 
 * 1. Si getHome() retourne un tableau vide [] :
 *    - Vérifiez qu'il existe au moins un document de type "home" dans Sanity Studio
 *    - Allez dans Studio (/studio) et créez un document "Home"
 *    - Le schéma "home" doit être correctement défini dans sanity/schemaTypes/home.ts
 * 
 * 2. Si vous obtenez des erreurs de token :
 *    - Vérifiez que SANITY_API_TOKEN est défini dans .env
 *    - Le token doit avoir les permissions de lecture
 * 
 * 3. Si les données multilingues ne s'affichent pas :
 *    - Vérifiez les préférences admin via l'API /api/admin/preferences
 *    - Utilisez DynamicWelcomingInput dans Studio pour créer du contenu multilingue
 * 
 * FLUX DE DONNÉES :
 * ----------------
 * 1. getHome() → Récupère tous les documents "home" bruts depuis Sanity
 * 2. getResolvedHome() → Résout les valeurs multilingues selon une langue
 * 3. getHomeWithPreferences() → Combine préférences admin + résolution automatique
 * 
 * TYPES DE DONNÉES :
 * -----------------
 * - HomeDocument : Document brut avec valeurs string ou object selon le type de champ
 * - ResolvedHomeData : Document avec valeurs résolues en string selon la langue
 */

// Interface pour le document home brut depuis Sanity
export interface HomeDocument {
  _id: string;
  _type: "home";
  title?: Record<string, string> | string;
  welcoming?: Record<string, string> | string; // Object si multilingualString, string si adaptiveString
  subtitle?: Record<string, string> | string;
  description?: Record<string, string> | string;
  callToAction?: Record<string, string> | string;
  heroBanner?: {
    isActive?: boolean;
    heroTitle?: Record<string, string> | string;
    heroDescription?: Record<string, string> | string;
    primaryButton?: {
      text?: Record<string, string> | string;
      url?: string;
    };
    secondaryButton?: {
      text?: Record<string, string> | string;
      url?: string;
    };
    heroImage?: {
      desktop?: string;
      mobile?: string;
      alt?: Record<string, string> | string;
    };
  };
}

// Interface pour les données home résolues selon la langue
export interface ResolvedHomeData {
  _id: string;
  title?: string;
  welcoming?: string;      // Toujours string après résolution
  subtitle?: string;
  description?: string;
  callToAction?: string;
  heroBanner?: {
    isActive?: boolean;
    heroTitle?: string;
    heroDescription?: string;
    primaryButton?: {
      text?: string;
      url?: string;
    };
    secondaryButton?: {
      text?: string;
      url?: string;
    };
    heroImage?: {
      desktop?: string;
      mobile?: string;
      alt?: string;
    };
  };
  originalData: HomeDocument; // Données brutes pour référence et débogage
}

/**
 * Récupère tous les documents "home" depuis Sanity
 * 
 * UTILISATION :
 * const documents = await getHome()
 * console.log('Nombre de documents:', documents.length)
 * 
 * DÉBOGAGE :
 * - Si retourne [], vérifiez qu'un document "home" existe dans Studio
 * - Si erreur de token, vérifiez SANITY_API_TOKEN dans .env
 */
export const getHome = async (): Promise<HomeDocument[]> => {
  const result = await client.fetch(`*[_type == "home"]{
    _id,
    _type,
    title,
    welcoming,
    subtitle,
    description,
    callToAction,
    heroBanner {
      isActive,
      heroTitle,
      heroDescription,
      primaryButton {
        text,
        url
      },
      secondaryButton {
        text,
        url
      },
      heroImage {
        desktop,
        mobile,
        alt
      }
    }
  }`);
  return result || [];
};

/**
 * Fonction utilitaire pour résoudre les valeurs multilingues
 * 
 * COMPORTEMENT :
 * - Si value est string → retourne directement
 * - Si value est object → cherche preferredLanguage, puis fallbackLanguage, puis première valeur
 * - Si value est undefined/null → retourne undefined
 * 
 * EXEMPLES :
 * resolveMultilingualValue("Hello", "fr") → "Hello"
 * resolveMultilingualValue({fr: "Bonjour", en: "Hello"}, "fr") → "Bonjour"
 * resolveMultilingualValue({en: "Hello"}, "fr", "en") → "Hello" (fallback)
 */
export const resolveMultilingualValue = (
  value: Record<string, string> | string | undefined,
  preferredLanguage: string = 'fr',
  fallbackLanguage: string = 'fr'
): string | undefined => {
  // Cas simple : valeur undefined ou null
  if (!value) return undefined;
  
  // Cas simple : déjà une string (champs adaptiveString ou standards)
  if (typeof value === 'string') {
    return value;
  }
  
  // Cas complexe : objet multilingue (champs multilingualString)
  if (typeof value === 'object') {
    // 1. Essayer la langue préférée
    if (value[preferredLanguage]) {
      return value[preferredLanguage];
    }
    
    // 2. Fallback vers la langue de fallback
    if (value[fallbackLanguage]) {
      return value[fallbackLanguage];
    }
    
    // 3. Prendre la première valeur disponible non vide
    const firstAvailable = Object.values(value).find(v => v && v.trim() !== '');
    return firstAvailable;
  }
  
  return undefined;
};

/**
 * Récupère et résout tous les documents home selon une langue spécifique
 * 
 * UTILISATION :
 * const resolvedDocs = await getResolvedHome('fr')
 * const resolvedDocs = await getResolvedHome('en')
 * 
 * RETOUR :
 * Tableau de ResolvedHomeData avec valeurs string résolues selon la langue
 */
export const getResolvedHome = async (
  preferredLanguage: string = 'fr'
): Promise<ResolvedHomeData[]> => {
  // Récupérer les documents bruts
  const homeDocuments = await getHome();
  
  // Résoudre chaque document selon la langue
  return homeDocuments.map(doc => ({
    _id: doc._id,
    title: resolveMultilingualValue(doc.title, preferredLanguage),
    welcoming: resolveMultilingualValue(doc.welcoming, preferredLanguage),
    subtitle: resolveMultilingualValue(doc.subtitle, preferredLanguage),
    description: resolveMultilingualValue(doc.description, preferredLanguage),
    callToAction: resolveMultilingualValue(doc.callToAction, preferredLanguage),
    heroBanner: doc.heroBanner ? {
      isActive: doc.heroBanner.isActive,
      heroTitle: resolveMultilingualValue(doc.heroBanner.heroTitle, preferredLanguage),
      heroDescription: resolveMultilingualValue(doc.heroBanner.heroDescription, preferredLanguage),
      primaryButton: doc.heroBanner.primaryButton ? {
        text: resolveMultilingualValue(doc.heroBanner.primaryButton.text, preferredLanguage),
        url: doc.heroBanner.primaryButton.url
      } : undefined,
      secondaryButton: doc.heroBanner.secondaryButton ? {
        text: resolveMultilingualValue(doc.heroBanner.secondaryButton.text, preferredLanguage),
        url: doc.heroBanner.secondaryButton.url
      } : undefined,
      heroImage: doc.heroBanner.heroImage ? {
        desktop: doc.heroBanner.heroImage.desktop,
        mobile: doc.heroBanner.heroImage.mobile,
        alt: resolveMultilingualValue(doc.heroBanner.heroImage.alt, preferredLanguage)
      } : undefined
    } : undefined,
    originalData: doc, // Garder les données originales pour débogage
  }));
};

/**
 * Récupère le premier document home résolu selon une langue
 * Fonction de commodité pour les cas où on n'a besoin que d'un seul document
 * 
 * UTILISATION :
 * const homeData = await getFirstResolvedHome('fr')
 * if (homeData) {
 *   console.log('Titre:', homeData.title)
 *   console.log('Message:', homeData.welcoming)
 * }
 * 
 * RETOUR :
 * ResolvedHomeData | null (null si aucun document trouvé)
 */
export const getFirstResolvedHome = async (
  preferredLanguage: string = 'fr'
): Promise<ResolvedHomeData | null> => {
  const resolvedHomes = await getResolvedHome(preferredLanguage);
  return resolvedHomes.length > 0 ? resolvedHomes[0] : null;
};