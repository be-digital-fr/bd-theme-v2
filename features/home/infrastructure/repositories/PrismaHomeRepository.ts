import { prisma } from '@/lib/prisma';
import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContentType, LocalizedHomeContentType } from '../../domain/schemas/HomeContentSchema';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';
import { resolveMultilingualValue } from '@/lib/resolveMultilingualValue';

export class PrismaHomeRepository implements IHomeRepository {
  
  async getHomeContent(locale: LocaleCodeType): Promise<HomeContentType | null> {
    const content = await this.findFirst();
    return content;
  }

  async getAllHomeContent(): Promise<HomeContentType[]> {
    const content = await this.findFirst();
    return content ? [content] : [];
  }

  async getHomeContentById(id: string): Promise<HomeContentType | null> {
    return await this.findById(id);
  }

  async findAll(): Promise<HomeContentType[]> {
    const content = await this.findFirst();
    return content ? [content] : [];
  }

  async findById(id: string): Promise<HomeContentType | null> {
    try {
      const homeContent = await prisma.home_content.findUnique({
        where: { id },
        include: {
          hero_banner: true,
          features_section: {
            include: {
              feature_items: {
                orderBy: { order: 'asc' }
              }
            }
          },
          seo_metadata: true
        }
      });

      if (!homeContent) {
        return null;
      }

      return this.mapPrismaToHomeContent(homeContent);
    } catch (error) {
      console.error('Error fetching home content by ID:', error);
      throw error;
    }
  }

  async findFirst(): Promise<HomeContentType | null> {
    try {
      const homeContent = await prisma.home_content.findFirst({
        include: {
          hero_banner: true,
          features_section: {
            include: {
              feature_items: {
                orderBy: { order: 'asc' }
              }
            }
          },
          seo_metadata: true
        }
      });

      if (!homeContent) {
        return null;
      }

      return this.mapPrismaToHomeContent(homeContent);
    } catch (error) {
      console.error('Error fetching home content:', error);
      throw error;
    }
  }

  async getLocalizedHomeContent(locale: LocaleCodeType): Promise<LocalizedHomeContentType | null> {
    try {
      const homeContent = await this.findFirst();
      if (!homeContent) {
        return null;
      }

      return this.mapToLocalizedContent(homeContent, locale);
    } catch (error) {
      console.error('Error fetching localized home content:', error);
      throw error;
    }
  }

  async getAllLocalizedHomeContent(locale: LocaleCodeType): Promise<LocalizedHomeContentType[]> {
    try {
      const homeContent = await this.findFirst();
      if (!homeContent) {
        return [];
      }

      return [this.mapToLocalizedContent(homeContent, locale)];
    } catch (error) {
      console.error('Error fetching all localized home content:', error);
      throw error;
    }
  }

  private mapPrismaToHomeContent(prismaData: any): HomeContentType {
    return {
      id: prismaData.id,
      title: prismaData.title || undefined,
      welcoming: prismaData.welcoming || undefined,
      subtitle: prismaData.subtitle || undefined,
      description: prismaData.description || undefined,
      heroBanner: prismaData.hero_banner ? {
        isActive: prismaData.hero_banner.isActive,
        heroTitle: prismaData.hero_banner.heroTitle,
        heroDescription: prismaData.hero_banner.heroDescription,
        primaryButton: {
          text: prismaData.hero_banner.primaryButtonText,
          url: prismaData.hero_banner.primaryButtonUrl,
        },
        secondaryButton: {
          text: prismaData.hero_banner.secondaryButtonText,
          url: prismaData.hero_banner.secondaryButtonUrl,
        },
        heroImage: {
          desktop: prismaData.hero_banner.heroImageDesktop ? {
            _type: 'image' as const,
            asset: {
              _ref: prismaData.hero_banner.heroImageDesktop,
              _type: 'reference' as const,
            }
          } : undefined,
          mobile: prismaData.hero_banner.heroImageMobile ? {
            _type: 'image' as const,
            asset: {
              _ref: prismaData.hero_banner.heroImageMobile,
              _type: 'reference' as const,
            }
          } : undefined,
          alt: prismaData.hero_banner.heroImageAlt,
        },
        backgroundImages: {
          desktop: prismaData.hero_banner.backgroundImageDesktop ? {
            _type: 'image' as const,
            asset: {
              _ref: prismaData.hero_banner.backgroundImageDesktop,
              _type: 'reference' as const,
            }
          } : undefined,
          mobile: prismaData.hero_banner.backgroundImageMobile ? {
            _type: 'image' as const,
            asset: {
              _ref: prismaData.hero_banner.backgroundImageMobile,
              _type: 'reference' as const,
            }
          } : undefined,
        },
      } : undefined,
      featuresSection: prismaData.features_section ? {
        isActive: prismaData.features_section.isActive,
        features: prismaData.features_section.feature_items?.map((item: any) => ({
          title: item.title,
          icon: item.iconUrl ? {
            _type: 'image' as const,
            asset: {
              _ref: item.iconUrl,
              _type: 'reference' as const,
            }
          } : undefined,
        })) || [],
      } : undefined,
    };
  }

  public mapToLocalizedContent(content: HomeContentType, locale: LocaleCodeType): LocalizedHomeContentType {
    return {
      id: content.id,
      title: typeof content.title === 'string' ? content.title : resolveMultilingualValue({
        value: content.title,
        currentLanguage: locale
      }),
      welcoming: resolveMultilingualValue({
        value: content.welcoming,
        currentLanguage: locale
      }),
      subtitle: resolveMultilingualValue({
        value: content.subtitle,
        currentLanguage: locale
      }),
      description: resolveMultilingualValue({
        value: content.description,
        currentLanguage: locale
      }),
      heroBanner: content.heroBanner ? {
        isActive: content.heroBanner.isActive,
        heroTitle: resolveMultilingualValue({
          value: content.heroBanner.heroTitle,
          currentLanguage: locale
        }),
        heroDescription: resolveMultilingualValue({
          value: content.heroBanner.heroDescription,
          currentLanguage: locale
        }),
        primaryButton: content.heroBanner.primaryButton ? {
          text: resolveMultilingualValue({
            value: content.heroBanner.primaryButton.text,
            currentLanguage: locale
          }),
          url: content.heroBanner.primaryButton.url,
        } : undefined,
        secondaryButton: content.heroBanner.secondaryButton ? {
          text: resolveMultilingualValue({
            value: content.heroBanner.secondaryButton.text,
            currentLanguage: locale
          }),
          url: content.heroBanner.secondaryButton.url,
        } : undefined,
        heroImage: content.heroBanner.heroImage ? {
          desktop: content.heroBanner.heroImage.desktop?.asset?._ref,
          mobile: content.heroBanner.heroImage.mobile?.asset?._ref,
          alt: resolveMultilingualValue({
            value: content.heroBanner.heroImage.alt,
            currentLanguage: locale
          }),
        } : undefined,
        backgroundImages: content.heroBanner.backgroundImages ? {
          desktop: content.heroBanner.backgroundImages.desktop?.asset?._ref,
          mobile: content.heroBanner.backgroundImages.mobile?.asset?._ref,
        } : undefined,
      } : undefined,
      featuresSection: content.featuresSection ? {
        isActive: content.featuresSection.isActive,
        features: content.featuresSection.features?.map(feature => ({
          icon: feature.icon?.asset?._ref,
          title: resolveMultilingualValue({
            value: feature.title,
            currentLanguage: locale
          }),
        })) || [],
      } : undefined,
    };
  }
}