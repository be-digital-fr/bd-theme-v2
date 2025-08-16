import { HomeContent, UpdateHomeContentDto } from '../../domain/entities/HomeContent';

/**
 * Adapter to transform Home Content data to form format
 */
export class HomeContentFormAdapter {
  /**
   * Transform HomeContent to form data format expected by form components
   */
  static toFormData(content: HomeContent | null): Record<string, any> {
    if (!content) {
      return {
        hero: {
          isActive: true,
          heroTitle: { fr: '', en: '', es: '' },
          heroDescription: { fr: '', en: '', es: '' },
          primaryButtonText: { fr: '', en: '', es: '' },
          primaryButtonUrl: '/order',
          secondaryButtonText: { fr: '', en: '', es: '' },
          secondaryButtonUrl: '/menu',
          heroImageDesktop: '',
          heroImageMobile: '',
          heroImageAlt: { fr: '', en: '', es: '' },
          backgroundImageDesktop: '',
          backgroundImageMobile: '',
        },
        features: {
          isActive: true,
          services: [],
        },
        seo: {
          seoTitle: { fr: '', en: '', es: '' },
          seoDescription: { fr: '', en: '', es: '' },
        },
      };
    }

    return {
      hero: {
        isActive: content.heroBanner?.isActive ?? true,
        heroTitle: content.heroBanner?.heroTitle || { fr: '', en: '', es: '' },
        heroDescription: content.heroBanner?.heroDescription || { fr: '', en: '', es: '' },
        primaryButtonText: content.heroBanner?.primaryButtonText || { fr: '', en: '', es: '' },
        primaryButtonUrl: content.heroBanner?.primaryButtonUrl || '/order',
        secondaryButtonText: content.heroBanner?.secondaryButtonText || { fr: '', en: '', es: '' },
        secondaryButtonUrl: content.heroBanner?.secondaryButtonUrl || '/menu',
        heroImageDesktop: content.heroBanner?.heroImageDesktop || '',
        heroImageMobile: content.heroBanner?.heroImageMobile || '',
        heroImageAlt: content.heroBanner?.heroImageAlt || { fr: '', en: '', es: '' },
        backgroundImageDesktop: content.heroBanner?.backgroundImageDesktop || '',
        backgroundImageMobile: content.heroBanner?.backgroundImageMobile || '',
      },
      features: {
        isActive: content.featuresSection?.isActive ?? true,
        services: content.featuresSection?.featureItems || [],
      },
      seo: {
        seoTitle: content.seoMetadata?.seoTitle || { fr: '', en: '', es: '' },
        seoDescription: content.seoMetadata?.seoDescription || { fr: '', en: '', es: '' },
      },
    };
  }

  /**
   * Transform form data back to UpdateHomeContentDto format
   */
  static fromFormData(formData: Record<string, any>): UpdateHomeContentDto {
    const data: UpdateHomeContentDto = {};

    // Hero banner
    if (formData.hero) {
      data.heroBanner = {
        isActive: formData.hero.isActive ?? true,
        heroTitle: formData.hero.heroTitle || {},
        heroDescription: formData.hero.heroDescription || {},
        primaryButtonText: formData.hero.primaryButtonText || {},
        primaryButtonUrl: formData.hero.primaryButtonUrl || '/order',
        secondaryButtonText: formData.hero.secondaryButtonText || {},
        secondaryButtonUrl: formData.hero.secondaryButtonUrl || '/menu',
        heroImageDesktop: formData.hero.heroImageDesktop || undefined,
        heroImageMobile: formData.hero.heroImageMobile || undefined,
        heroImageAlt: formData.hero.heroImageAlt || undefined,
        backgroundImageDesktop: formData.hero.backgroundImageDesktop || undefined,
        backgroundImageMobile: formData.hero.backgroundImageMobile || undefined,
      };
    }

    // Features section
    if (formData.features) {
      data.featuresSection = {
        isActive: formData.features.isActive ?? true,
        featureItems: (formData.features.services || []).map((item: any, index: number) => ({
          title: item.title || {},
          iconUrl: item.iconUrl || '',
          order: item.order ?? index + 1,
        })),
      };
    }

    // SEO metadata
    if (formData.seo) {
      data.seoMetadata = {
        seoTitle: formData.seo.seoTitle || undefined,
        seoDescription: formData.seo.seoDescription || undefined,
      };
    }

    return data;
  }
}