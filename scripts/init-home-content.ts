import { prisma } from '../lib/prisma';

async function initHomeContent() {
  try {
    console.log('🏠 Initializing home content...');

    // Check if home content already exists
    const existingContent = await prisma.home_content.findFirst();
    
    if (existingContent) {
      console.log('✅ Home content already exists');
      return;
    }

    // Create default home content with hero banner
    const homeContent = await prisma.home_content.create({
      data: {
        id: 'home-content-singleton',
        updatedAt: new Date(),
        hero_banner: {
          create: {
            id: 'home-content-singleton-hero',
            isActive: true,
            heroTitle: {
              fr: 'Goûtez nos burgers uniques',
              en: 'Taste our unique burgers',
              es: 'Prueba nuestras hamburguesas únicas',
              de: 'Probieren Sie unsere einzigartigen Burger',
              it: 'Assaggiate i nostri burger unici',
              pt: 'Prove nossos hambúrgueres únicos',
              ar: 'تذوق برجرنا الفريد'
            },
            heroDescription: {
              fr: 'Des recettes fraîches et délicieuses préparées avec des ingrédients de qualité',
              en: 'Fresh, delicious recipes prepared with quality ingredients',
              es: 'Recetas frescas y deliciosas preparadas con ingredientes de calidad',
              de: 'Frische, köstliche Rezepte mit hochwertigen Zutaten',
              it: 'Ricette fresche e deliziose preparate con ingredienti di qualità',
              pt: 'Receitas frescas e deliciosas preparadas com ingredientes de qualidade',
              ar: 'وصفات طازجة ولذيذة محضرة بمكونات عالية الجودة'
            },
            primaryButtonText: {
              fr: 'Commander maintenant',
              en: 'Order now',
              es: 'Pedir ahora',
              de: 'Jetzt bestellen',
              it: 'Ordina ora',
              pt: 'Pedir agora',
              ar: 'اطلب الآن'
            },
            primaryButtonUrl: '/order',
            secondaryButtonText: {
              fr: 'Voir le menu',
              en: 'View menu',
              es: 'Ver menú',
              de: 'Menü ansehen',
              it: 'Vedi menu',
              pt: 'Ver cardápio',
              ar: 'عرض القائمة'
            },
            secondaryButtonUrl: '/menu',
            heroImageDesktop: '/images/banner/burger-desktop.png',
            heroImageMobile: '/images/banner/burger-mobile.png',
            heroImageAlt: {
              fr: 'Délicieux burger avec des ingrédients frais',
              en: 'Delicious burger with fresh ingredients',
              es: 'Deliciosa hamburguesa con ingredientes frescos',
              de: 'Leckerer Burger mit frischen Zutaten',
              it: 'Delizioso burger con ingredienti freschi',
              pt: 'Delicioso hambúrguer com ingredientes frescos',
              ar: 'برجر لذيذ بمكونات طازجة'
            },
            backgroundImageDesktop: '/images/banner/bg-desktop.png',
            backgroundImageMobile: '/images/banner/bg-mobile.png',
          }
        },
        features_section: {
          create: {
            id: 'home-content-singleton-features',
            isActive: true,
            sectionTitle: {
              fr: 'Pourquoi nous choisir',
              en: 'Why choose us',
              es: 'Por qué elegirnos',
              de: 'Warum uns wählen',
              it: 'Perché sceglierci',
              pt: 'Por que nos escolher',
              ar: 'لماذا تختارنا'
            },
            sectionDescription: {
              fr: 'Découvrez ce qui nous rend unique',
              en: 'Discover what makes us unique',
              es: 'Descubre lo que nos hace únicos',
              de: 'Entdecken Sie, was uns einzigartig macht',
              it: 'Scopri cosa ci rende unici',
              pt: 'Descubra o que nos torna únicos',
              ar: 'اكتشف ما يجعلنا فريدين'
            },
            feature_items: {
              create: [
                {
                  title: {
                    fr: 'Ingrédients frais',
                    en: 'Fresh ingredients',
                    es: 'Ingredientes frescos',
                    de: 'Frische Zutaten',
                    it: 'Ingredienti freschi',
                    pt: 'Ingredientes frescos',
                    ar: 'مكونات طازجة'
                  },
                  iconUrl: '/icons/fresh.svg',
                  order: 1
                },
                {
                  title: {
                    fr: 'Livraison rapide',
                    en: 'Fast delivery',
                    es: 'Entrega rápida',
                    de: 'Schnelle Lieferung',
                    it: 'Consegna veloce',
                    pt: 'Entrega rápida',
                    ar: 'توصيل سريع'
                  },
                  iconUrl: '/icons/delivery.svg',
                  order: 2
                },
                {
                  title: {
                    fr: 'Qualité garantie',
                    en: 'Quality guaranteed',
                    es: 'Calidad garantizada',
                    de: 'Qualität garantiert',
                    it: 'Qualità garantita',
                    pt: 'Qualidade garantida',
                    ar: 'جودة مضمونة'
                  },
                  iconUrl: '/icons/quality.svg',
                  order: 3
                }
              ]
            }
          }
        },
        seo_metadata: {
          create: {
            id: 'home-content-singleton-seo',
            seoTitle: {
              fr: 'Be Digital - Restaurant de burgers authentiques',
              en: 'Be Digital - Authentic burger restaurant',
              es: 'Be Digital - Restaurante de hamburguesas auténticas',
              de: 'Be Digital - Authentisches Burger-Restaurant',
              it: 'Be Digital - Ristorante di burger autentici',
              pt: 'Be Digital - Restaurante de hambúrgueres autênticos',
              ar: 'Be Digital - مطعم برجر أصيل'
            },
            seoDescription: {
              fr: 'Découvrez nos burgers faits maison avec des ingrédients frais et locaux. Commandez en ligne pour une livraison rapide.',
              en: 'Discover our homemade burgers with fresh, local ingredients. Order online for fast delivery.',
              es: 'Descubre nuestras hamburguesas caseras con ingredientes frescos y locales. Pide en línea para entrega rápida.',
              de: 'Entdecken Sie unsere hausgemachten Burger mit frischen, lokalen Zutaten. Online bestellen für schnelle Lieferung.',
              it: 'Scopri i nostri burger fatti in casa con ingredienti freschi e locali. Ordina online per consegna veloce.',
              pt: 'Descubra nossos hambúrgueres caseiros com ingredientes frescos e locais. Peça online para entrega rápida.',
              ar: 'اكتشف برجرنا المنزلي بمكونات طازجة ومحلية. اطلب عبر الإنترنت للتوصيل السريع.'
            },
            ogImage: '/images/og-image.jpg'
          }
        }
      }
    });

    console.log('✅ Home content initialized successfully');
    console.log('📄 Created home content with ID:', homeContent.id);

  } catch (error) {
    console.error('❌ Error initializing home content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initHomeContent()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });