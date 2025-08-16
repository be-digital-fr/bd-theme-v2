import { PrismaClient } from '@prisma/client';
import { Result } from '@/lib/result';
import { IHomeContentRepository } from '../../domain/repositories/IHomeContentRepository';
import { HomeContent, UpdateHomeContentDto } from '../../domain/entities/HomeContent';

export class PrismaHomeContentRepository implements IHomeContentRepository {
  constructor(private prisma: PrismaClient) {}

  async getHomeContent(): Promise<Result<HomeContent | null>> {
    try {
      const homeContent = await this.prisma.home_content.findFirst({
        include: {
          hero_banner: true,
          features_section: {
            include: {
              feature_items: {
                orderBy: { order: 'asc' }
              }
            }
          },
          seo_metadata: true,
        }
      });

      if (!homeContent) {
        return Result.success(null);
      }

      const mappedContent: HomeContent = {
        id: homeContent.id,
        createdAt: homeContent.createdAt,
        updatedAt: homeContent.updatedAt,
        heroBanner: homeContent.hero_banner ? {
          id: homeContent.hero_banner.id,
          isActive: homeContent.hero_banner.isActive,
          heroTitle: homeContent.hero_banner.heroTitle as Record<string, string>,
          heroDescription: homeContent.hero_banner.heroDescription as Record<string, string>,
          primaryButtonText: homeContent.hero_banner.primaryButtonText as Record<string, string>,
          primaryButtonUrl: homeContent.hero_banner.primaryButtonUrl,
          secondaryButtonText: homeContent.hero_banner.secondaryButtonText as Record<string, string>,
          secondaryButtonUrl: homeContent.hero_banner.secondaryButtonUrl,
          heroImageDesktop: homeContent.hero_banner.heroImageDesktop || undefined,
          heroImageMobile: homeContent.hero_banner.heroImageMobile || undefined,
          heroImageAlt: homeContent.hero_banner.heroImageAlt as Record<string, string> || undefined,
          backgroundImageDesktop: homeContent.hero_banner.backgroundImageDesktop || undefined,
          backgroundImageMobile: homeContent.hero_banner.backgroundImageMobile || undefined,
          homeContentId: homeContent.hero_banner.homeContentId,
        } : undefined,
        featuresSection: homeContent.features_section ? {
          id: homeContent.features_section.id,
          isActive: homeContent.features_section.isActive,
          homeContentId: homeContent.features_section.homeContentId,
          featureItems: homeContent.features_section.feature_items.map(item => ({
            id: item.id,
            title: item.title as Record<string, string>,
            iconUrl: item.iconUrl,
            order: item.order,
            featuresSectionId: item.featuresSectionId,
          }))
        } : undefined,
        seoMetadata: homeContent.seo_metadata ? {
          id: homeContent.seo_metadata.id,
          seoTitle: homeContent.seo_metadata.seoTitle as Record<string, string> || undefined,
          seoDescription: homeContent.seo_metadata.seoDescription as Record<string, string> || undefined,
          ogImage: homeContent.seo_metadata.ogImage || undefined,
          homeContentId: homeContent.seo_metadata.homeContentId,
        } : undefined,
      };

      return Result.success(mappedContent);
    } catch (error) {
      return Result.failure({
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database query failed',
        details: error
      });
    }
  }

  async updateHomeContent(data: UpdateHomeContentDto): Promise<Result<HomeContent>> {
    try {
      // Ensure main home_content record exists
      await this.prisma.home_content.upsert({
        where: { id: 'home-content-singleton' },
        update: { updatedAt: new Date() },
        create: { 
          id: 'home-content-singleton', 
          updatedAt: new Date() 
        },
      });

      // Update hero banner if provided
      if (data.heroBanner) {
        await this.prisma.hero_banner.upsert({
          where: { id: 'home-content-singleton-hero' },
          update: {
            isActive: data.heroBanner.isActive,
            heroTitle: data.heroBanner.heroTitle,
            heroDescription: data.heroBanner.heroDescription,
            primaryButtonText: data.heroBanner.primaryButtonText,
            primaryButtonUrl: data.heroBanner.primaryButtonUrl,
            secondaryButtonText: data.heroBanner.secondaryButtonText,
            secondaryButtonUrl: data.heroBanner.secondaryButtonUrl,
            heroImageDesktop: data.heroBanner.heroImageDesktop,
            heroImageMobile: data.heroBanner.heroImageMobile,
            heroImageAlt: data.heroBanner.heroImageAlt,
            backgroundImageDesktop: data.heroBanner.backgroundImageDesktop,
            backgroundImageMobile: data.heroBanner.backgroundImageMobile,
          },
          create: {
            id: 'home-content-singleton-hero',
            homeContentId: 'home-content-singleton',
            isActive: data.heroBanner.isActive,
            heroTitle: data.heroBanner.heroTitle,
            heroDescription: data.heroBanner.heroDescription,
            primaryButtonText: data.heroBanner.primaryButtonText,
            primaryButtonUrl: data.heroBanner.primaryButtonUrl,
            secondaryButtonText: data.heroBanner.secondaryButtonText,
            secondaryButtonUrl: data.heroBanner.secondaryButtonUrl,
            heroImageDesktop: data.heroBanner.heroImageDesktop,
            heroImageMobile: data.heroBanner.heroImageMobile,
            heroImageAlt: data.heroBanner.heroImageAlt,
            backgroundImageDesktop: data.heroBanner.backgroundImageDesktop,
            backgroundImageMobile: data.heroBanner.backgroundImageMobile,
          },
        });
      }

      // Update features section if provided
      if (data.featuresSection) {
        // Upsert features section
        await this.prisma.features_section.upsert({
          where: { id: 'home-content-singleton-features' },
          update: { 
            isActive: data.featuresSection.isActive,
          },
          create: {
            id: 'home-content-singleton-features',
            homeContentId: 'home-content-singleton',
            isActive: data.featuresSection.isActive,
          },
        });

        // Delete existing feature items and recreate
        await this.prisma.feature_items.deleteMany({
          where: { featuresSectionId: 'home-content-singleton-features' }
        });

        // Create new feature items
        for (const item of data.featuresSection.featureItems) {
          await this.prisma.feature_items.create({
            data: {
              title: item.title,
              iconUrl: item.iconUrl,
              order: item.order,
              featuresSectionId: 'home-content-singleton-features',
            },
          });
        }
      }

      // Update SEO metadata if provided
      if (data.seoMetadata) {
        await this.prisma.seo_metadata.upsert({
          where: { id: 'home-content-singleton-seo' },
          update: {
            seoTitle: data.seoMetadata.seoTitle,
            seoDescription: data.seoMetadata.seoDescription,
            ogImage: data.seoMetadata.ogImage,
          },
          create: {
            id: 'home-content-singleton-seo',
            homeContentId: 'home-content-singleton',
            seoTitle: data.seoMetadata.seoTitle,
            seoDescription: data.seoMetadata.seoDescription,
            ogImage: data.seoMetadata.ogImage,
          },
        });
      }

      // Return updated content
      const result = await this.getHomeContent();
      if (!result.success || !result.data) {
        return Result.failure({
          code: 'UPDATE_FAILED',
          message: 'Failed to retrieve updated home content'
        });
      }

      return Result.success(result.data);
    } catch (error) {
      return Result.failure({
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database update failed',
        details: error
      });
    }
  }

  async initializeDefaultContent(): Promise<Result<HomeContent>> {
    try {
      const defaultData: UpdateHomeContentDto = {
        heroBanner: {
          isActive: true,
          heroTitle: {
            fr: 'Savourez nos burgers uniques',
            en: 'Taste our unique burgers',
            es: 'Saborea nuestras hamburguesas únicas',
          },
          heroDescription: {
            fr: 'Des recettes fraîches, gourmandes et préparées avec des ingrédients de qualité pour une expérience gustative exceptionnelle',
            en: 'Fresh, delicious recipes prepared with quality ingredients for an exceptional taste experience',
            es: 'Recetas frescas y deliciosas preparadas con ingredientes de calidad para una experiencia gastronómica excepcional',
          },
          primaryButtonText: {
            fr: 'Commander maintenant',
            en: 'Order now',
            es: 'Pedir ahora',
          },
          primaryButtonUrl: '/order',
          secondaryButtonText: {
            fr: 'Voir le menu',
            en: 'View menu',
            es: 'Ver menú',
          },
          secondaryButtonUrl: '/menu',
          heroImageAlt: {
            fr: 'Délicieux burger avec des ingrédients frais',
            en: 'Delicious burger with fresh ingredients',
            es: 'Deliciosa hamburguesa con ingredientes frescos',
          },
        },
        featuresSection: {
          isActive: true,
          sectionTitle: {
            fr: 'Nos services',
            en: 'Our services',
            es: 'Nuestros servicios',
          },
          sectionDescription: {
            fr: 'Découvrez pourquoi nos clients nous font confiance',
            en: 'Discover why our customers trust us',
            es: 'Descubre por qué nuestros clientes confían en nosotros',
          },
          featureItems: [
            {
              title: { fr: 'Livraison rapide', en: 'Fast delivery', es: 'Entrega rápida' },
              iconUrl: 'Clock',
              order: 1,
            },
            {
              title: { fr: 'Ingrédients frais', en: 'Fresh ingredients', es: 'Ingredientes frescos' },
              iconUrl: 'Leaf',
              order: 2,
            },
            {
              title: { fr: 'Fait maison', en: 'Homemade', es: 'Hecho en casa' },
              iconUrl: 'Heart',
              order: 3,
            },
          ],
        },
        seoMetadata: {
          seoTitle: {
            fr: 'Restaurant - Burgers artisanaux et livraison',
            en: 'Restaurant - Artisanal burgers and delivery',
            es: 'Restaurante - Hamburguesas artesanales y entrega',
          },
          seoDescription: {
            fr: 'Découvrez nos burgers artisanaux préparés avec des ingrédients frais. Commandez en ligne et profitez de notre livraison rapide.',
            en: 'Discover our artisanal burgers prepared with fresh ingredients. Order online and enjoy our fast delivery.',
            es: 'Descubre nuestras hamburguesas artesanales preparadas con ingredientes frescos. Pide en línea y disfruta de nuestra entrega rápida.',
          },
        },
      };

      return await this.updateHomeContent(defaultData);
    } catch (error) {
      return Result.failure({
        code: 'INITIALIZATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to initialize default content',
        details: error
      });
    }
  }
}