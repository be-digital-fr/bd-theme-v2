#!/usr/bin/env tsx

/**
 * Script pour initialiser manuellement les documents singleton
 * 
 * Usage: 
 * pnpm tsx scripts/init-singletons.ts
 * 
 * Ce script crée les documents settings et home avec leurs données par défaut
 * s'ils n'existent pas déjà dans Sanity.
 */

// Charger les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@sanity/client';

// Configuration du client Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2025-07-05',
});

async function ensureSingletonExists(
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
        _id: documentType, // ID fixe pour singleton
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

async function main() {
  console.log('🚀 Initialisation des documents singleton...\n');
  
  try {
    // Settings document
    await ensureSingletonExists('settings', {
      title: 'Paramètres du site',
      isMultilingual: false,
      supportedLanguages: ['fr'],
      defaultLanguage: 'fr',
      translationSettings: {
        autoTranslate: true,
        translationModel: process.env.TRANSLATION_MODEL || 'gpt-3.5-turbo',
        translationDelay: parseInt(process.env.TRANSLATION_DELAY || '2000'),
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

    console.log('\n✅ Initialisation terminée avec succès !');
    console.log('\n📝 Documents créés ou vérifiés :');
    console.log('  - settings: Paramètres du site');
    console.log('  - home: Page d\'accueil');
    console.log('\n🎨 Vous pouvez maintenant ouvrir Sanity Studio pour les modifier.');
    console.log('   URL: http://localhost:3000/studio');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    process.exit(1);
  }
}

// Exécuter le script
main().catch((error) => {
  console.error('❌ Erreur fatale :', error);
  process.exit(1);
});