import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-05',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const defaultHeroBanner = {
  isActive: true,
  heroTitle: {
    fr: 'Savourez nos burgers uniques',
    en: 'Taste our unique burgers',
    es: 'Saborea nuestras hamburguesas únicas',
    de: 'Probieren Sie unsere einzigartigen Burger'
  },
  heroDescription: {
    fr: 'Des recettes fraîches, gourmandes et préparées avec des ingrédients de qualité pour une expérience gustative exceptionnelle',
    en: 'Fresh, delicious recipes prepared with quality ingredients for an exceptional taste experience',
    es: 'Recetas frescas y deliciosas preparadas con ingredientes de calidad para una experiencia gastronómica excepcional',
    de: 'Frische, köstliche Rezepte mit hochwertigen Zutaten für ein außergewöhnliches Geschmackserlebnis'
  },
  primaryButton: {
    text: {
      fr: 'Commander maintenant',
      en: 'Order now',
      es: 'Pedir ahora',
      de: 'Jetzt bestellen'
    },
    url: '/order'
  },
  secondaryButton: {
    text: {
      fr: 'Voir le menu',
      en: 'View menu',
      es: 'Ver menú',
      de: 'Menü ansehen'
    },
    url: '/menu'
  },
  heroImage: {
    desktop: '/images/banner/burger-desktop.png',
    mobile: '/images/banner/burger-mobile.png',
    alt: {
      fr: 'Délicieux burger avec des ingrédients frais',
      en: 'Delicious burger with fresh ingredients',
      es: 'Deliciosa hamburguesa con ingredientes frescos',
      de: 'Köstlicher Burger mit frischen Zutaten'
    }
  }
};

async function initHeroBanner() {
  try {
    console.log('🚀 Initialisation de la bannière hero...');

    // Chercher le document homeWithAutoTranslate existant
    const existingDoc = await client.fetch(`*[_type == "home"][0]`);

    if (existingDoc) {
      console.log('📄 Document trouvé, mise à jour de la bannière...');
      
      // Mettre à jour seulement si heroBanner n'existe pas ou est vide
      if (!existingDoc.heroBanner || Object.keys(existingDoc.heroBanner).length === 0) {
        await client
          .patch(existingDoc._id)
          .set({ heroBanner: defaultHeroBanner })
          .commit();
        
        console.log('✅ Bannière hero ajoutée avec succès!');
      } else {
        console.log('ℹ️ La bannière hero existe déjà');
      }
    } else {
      console.log('📝 Création du document avec la bannière...');
      
      // Créer un nouveau document avec la bannière
      await client.create({
        _type: 'home',
        title: {
          fr: 'Bienvenue',
          en: 'Welcome',
          es: 'Bienvenido',
          de: 'Willkommen'
        },
        subtitle: {
          fr: 'Découvrez notre cuisine',
          en: 'Discover our cuisine',
          es: 'Descubre nuestra cocina',
          de: 'Entdecken Sie unsere Küche'
        },
        heroBanner: defaultHeroBanner
      });
      
      console.log('✅ Document créé avec la bannière hero!');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

initHeroBanner();