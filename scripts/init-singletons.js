#!/usr/bin/env node

/**
 * Script pour forcer l'initialisation des documents singleton
 * Utilise directement le client Sanity pour créer/mettre à jour les données
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-07-05', // Using a fixed API version
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

const settingsData = {
  _type: 'settings',
  title: 'Paramètres du site',
  isMultilingual: false,
  supportedLanguages: ['fr'],
  defaultLanguage: 'fr',
  headerSettings: {
    logoType: 'text',
    logoText: 'BD Theme',
    headerStyle: 'transparent',
    stickyHeader: true,
    showSearchIcon: true,
    showUserIcon: true,
    showCartIcon: true,
    cartBadgeCount: 0,
  },
  navigationSettings: {
    menuItems: [
      {
        label: {
          fr: 'Accueil',
          en: 'Home',
        },
        slug: {
          current: 'accueil',
        },
        href: '/',
        isExternal: false,
        openInNewTab: false,
        isActive: true,
      },
      {
        label: {
          fr: 'Menu',
          en: 'Menu',
        },
        slug: {
          current: 'menu',
        },
        href: '/menu',
        isExternal: false,
        openInNewTab: false,
        isActive: true,
      },
      {
        label: {
          fr: 'À propos',
          en: 'About',
        },
        slug: {
          current: 'a-propos',
        },
        href: '/about',
        isExternal: false,
        openInNewTab: false,
        isActive: true,
      },
      {
        label: {
          fr: 'Blog',
          en: 'Blog',
        },
        slug: {
          current: 'blog',
        },
        href: '/blog',
        isExternal: false,
        openInNewTab: false,
        isActive: true,
      },
      {
        label: {
          fr: 'Contact',
          en: 'Contact',
        },
        slug: {
          current: 'contact',
        },
        href: '/contact',
        isExternal: false,
        openInNewTab: false,
        isActive: true,
      },
    ],
    mobileMenuTitle: {
      fr: 'Menu',
      en: 'Menu',
    },
  },
  translationSettings: {
    autoTranslate: true,
    translationModel: process.env.TRANSLATION_MODEL || 'gpt-3.5-turbo',
    translationDelay: parseInt(process.env.TRANSLATION_DELAY || '2000'),
    apiKeyInfo: {
      info: 'La clé API OpenAI est configurée dans les variables d\'environnement (.env) pour des raisons de sécurité. Variable: OPENAI_API_KEY',
    },
  },
};

async function initSettings() {
  try {
    console.log('🔍 Checking existing settings document...');
    
    // Vérifier si le document existe
    const existing = await client.fetch('*[_type == "settings"][0]');
    
    if (existing) {
      console.log('📝 Updating existing settings document:', existing._id);
      
      // Mettre à jour le document existant
      const updated = await client
        .patch(existing._id)
        .set(settingsData)
        .commit();
      
      console.log('✅ Settings document updated successfully:', updated._id);
    } else {
      console.log('📝 Creating new settings document...');
      
      // Créer un nouveau document
      const created = await client.create(settingsData);
      
      console.log('✅ Settings document created successfully:', created._id);
    }
    
    // Vérifier le résultat
    console.log('🔍 Verifying updated document...');
    const result = await client.fetch(`
      *[_type == "settings"][0] {
        _id,
        title,
        headerSettings,
        navigationSettings {
          menuItems[] {
            label,
            slug,
            href,
            isActive
          }
        }
      }
    `);
    
    console.log('📊 Document verification:');
    console.log('- ID:', result._id);
    console.log('- Logo Text:', result.headerSettings?.logoText);
    console.log('- Menu Items Count:', result.navigationSettings?.menuItems?.length);
    console.log('- First Menu Item:', result.navigationSettings?.menuItems?.[0]?.label);
    
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initSettings()
  .then(() => {
    console.log('🎉 Initialization completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Initialization failed:', error);
    process.exit(1);
  });