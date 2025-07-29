#!/usr/bin/env node

/**
 * Script pour patcher le document settings existant avec les champs manquants
 * Ce script ajoute headerSettings et navigationSettings au document existant
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-07-05',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

async function patchSettings() {
  try {
    console.log('🔍 Récupération du document settings existant...');
    
    // Récupérer le document settings existant
    const existing = await client.fetch('*[_type == "settings"][0]');
    
    if (!existing) {
      console.error('❌ Aucun document settings trouvé');
      return;
    }
    
    console.log('📄 Document trouvé:', existing._id);
    console.log('📊 Champs existants:', Object.keys(existing));
    
    // Données à ajouter
    const patchData = {};
    
    // Ajouter headerSettings s'il n'existe pas
    if (!existing.headerSettings) {
      console.log('➕ Ajout de headerSettings...');
      patchData.headerSettings = {
        logoType: 'text',
        logoText: 'BD Theme',
        headerStyle: 'transparent',
        stickyHeader: true,
        showSearchIcon: true,
        showUserIcon: true,
        showCartIcon: true,
        cartBadgeCount: 0,
      };
    }
    
    // Ajouter navigationSettings s'il n'existe pas
    if (!existing.navigationSettings) {
      console.log('➕ Ajout de navigationSettings...');
      patchData.navigationSettings = {
        menuItems: [
          {
            _key: 'item1',
            label: {
              fr: 'Accueil',
              en: 'Home',
              es: 'Inicio'
            },
            slug: {
              current: 'accueil',
              _type: 'slug'
            },
            href: '/',
            isExternal: false,
            openInNewTab: false,
            isActive: true,
          },
          {
            _key: 'item2',
            label: {
              fr: 'Menu',
              en: 'Menu',
              es: 'Menú'
            },
            slug: {
              current: 'menu',
              _type: 'slug'
            },
            href: '/menu',
            isExternal: false,
            openInNewTab: false,
            isActive: true,
          },
          {
            _key: 'item3',
            label: {
              fr: 'À propos',
              en: 'About',
              es: 'Acerca de'
            },
            slug: {
              current: 'a-propos',
              _type: 'slug'
            },
            href: '/about',
            isExternal: false,
            openInNewTab: false,
            isActive: true,
          },
          {
            _key: 'item4',
            label: {
              fr: 'Blog',
              en: 'Blog',
              es: 'Blog'
            },
            slug: {
              current: 'blog',
              _type: 'slug'
            },
            href: '/blog',
            isExternal: false,
            openInNewTab: false,
            isActive: true,
          },
          {
            _key: 'item5',
            label: {
              fr: 'Contact',
              en: 'Contact',
              es: 'Contacto'
            },
            slug: {
              current: 'contact',
              _type: 'slug'
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
          es: 'Menú'
        },
      };
    }
    
    // Si des champs doivent être ajoutés
    if (Object.keys(patchData).length > 0) {
      console.log('🔧 Application du patch...');
      
      // Utiliser setIfMissing pour ne pas écraser les valeurs existantes
      const transaction = client.transaction();
      
      for (const [key, value] of Object.entries(patchData)) {
        transaction.patch(existing._id).setIfMissing({ [key]: value });
      }
      
      const result = await transaction.commit();
      
      console.log('✅ Document patché avec succès !');
      
      // Vérifier le résultat
      const updated = await client.fetch(`
        *[_type == "settings"][0] {
          _id,
          headerSettings,
          navigationSettings
        }
      `);
      
      console.log('\n📊 Vérification du document mis à jour:');
      console.log('- headerSettings:', updated.headerSettings ? '✅ Présent' : '❌ Manquant');
      console.log('- navigationSettings:', updated.navigationSettings ? '✅ Présent' : '❌ Manquant');
      
      if (updated.navigationSettings?.menuItems) {
        console.log('- Nombre d\'éléments de menu:', updated.navigationSettings.menuItems.length);
      }
      
    } else {
      console.log('✅ Tous les champs sont déjà présents !');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

// Exécuter le script
patchSettings()
  .then(() => {
    console.log('\n🎉 Script terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });