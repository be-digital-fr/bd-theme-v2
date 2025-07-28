import React from 'react';
import { defineType, defineField } from 'sanity';
import { client } from './client';

/**
 * SYSTÈME DE DOCUMENTS SINGLETON (SKELETONS)
 * =========================================
 * 
 * Ce système permet de créer des documents uniques qui ne peuvent exister
 * qu'en un seul exemplaire dans Sanity Studio. Parfait pour :
 * - Les paramètres du site (settings)
 * - La page d'accueil (home)
 * - Les configurations globales
 * 
 * FONCTIONNALITÉS :
 * - Création automatique du document s'il n'existe pas
 * - Interface simplifiée dans Sanity Studio
 * - Données par défaut pré-remplies
 * - Prévention de la création de doublons
 */

export interface SingletonConfig {
  name: string;
  title: string;
  icon?: React.ComponentType;
  initialData?: Record<string, any>;
  fields: any[];
}

/**
 * Crée un type de document singleton
 */
export function createSingleton(config: SingletonConfig) {
  return defineType({
    name: config.name,
    title: config.title,
    type: 'document',
    icon: config.icon,
    fields: [
      // Champ caché pour identifier les singletons
      defineField({
        name: 'isSingleton',
        type: 'boolean',
        title: 'Document singleton',
        description: 'Indique que ce document est unique (ne pas modifier)',
        hidden: true,
        initialValue: true,
        readOnly: true,
      }),
      ...config.fields,
    ],
    preview: {
      prepare() {
        return {
          title: config.title,
          subtitle: 'Document unique',
        };
      },
    },
  });
}

/**
 * Crée automatiquement un document singleton s'il n'existe pas
 */
export async function ensureSingletonExists(
  documentType: string,
  initialData: Record<string, any> = {}
): Promise<void> {
  try {
    // Vérifier si le document existe déjà
    const existing = await client.fetch(`*[_type == $type][0]`, {
      type: documentType,
    });

    if (!existing) {
      console.log(`[Singleton] Creating ${documentType} document with initial data`);
      
      // Créer le document avec les données initiales
      const doc = await client.create({
        _type: documentType,
        isSingleton: true,
        ...initialData,
      });

      console.log(`[Singleton] Created ${documentType} document:`, doc._id);
    } else {
      console.log(`[Singleton] ${documentType} document already exists:`, existing._id);
    }
  } catch (error) {
    console.error(`[Singleton] Error ensuring ${documentType} exists:`, error);
  }
}

/**
 * Initialise tous les documents singleton au démarrage
 */
export async function initializeSingletons(): Promise<void> {
  console.log('[Singleton] Initializing singleton documents...');

  // Settings document
  await ensureSingletonExists('settings', {
    title: 'Paramètres du site',
    isMultilingual: false,
    supportedLanguages: ['fr'],
    defaultLanguage: 'fr',
    translationSettings: {
      autoTranslate: true,
      translationModel: 'gpt-3.5-turbo',
      translationDelay: 2000,
      apiKeyInfo: {
        info: 'La clé API OpenAI est configurée dans les variables d\'environnement (.env) pour des raisons de sécurité. Variable: OPENAI_API_KEY',
      },
    },
  });

  // Home document
  await ensureSingletonExists('home', {
    title: {
      fr: 'Bienvenue sur notre site',
    },
    subtitle: {
      fr: 'Découvrez nos services exceptionnels',
    },
    welcoming: {
      fr: 'Nous sommes ravis de vous accueillir !',
    },
    description: {
      fr: 'Notre plateforme offre des solutions innovantes pour répondre à tous vos besoins. Explorez nos fonctionnalités et découvrez comment nous pouvons vous aider à atteindre vos objectifs.',
    },
    content: 'Contenu supplémentaire par défaut',
  });

  console.log('[Singleton] Singleton initialization completed');
}

/**
 * Hook pour vérifier et créer les singletons côté client
 */
export function useSingletonInitializer() {
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!initialized) {
      initializeSingletons().then(() => {
        setInitialized(true);
      });
    }
  }, [initialized]);

  return initialized;
}

// Types pour TypeScript
export type SingletonDocument<T = Record<string, any>> = T & {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  isSingleton: boolean;
};