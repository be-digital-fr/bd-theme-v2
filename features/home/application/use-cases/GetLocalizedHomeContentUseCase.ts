import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { LocalizedHomeContentType, MultilingualValueType } from '../../domain/schemas/HomeContentSchema';
import { LocaleCodeSchema, LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';
import { z } from 'zod';

export class GetLocalizedHomeContentUseCase {
  constructor(private homeRepository: IHomeRepository) {}

  private resolveMultilingualValue(value: MultilingualValueType | undefined, locale: LocaleCodeType): string | undefined {
    if (!value) return undefined;
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object') {
      return value[locale] || value['fr'] || Object.values(value)[0];
    }
    
    return undefined;
  }

  private localizeHomeContent(homeContent: any, locale: LocaleCodeType): LocalizedHomeContentType {
    const localized: LocalizedHomeContentType = {
      id: homeContent.id || homeContent._id,
      title: this.resolveMultilingualValue(homeContent.title, locale),
      welcoming: this.resolveMultilingualValue(homeContent.welcoming, locale),
      subtitle: this.resolveMultilingualValue(homeContent.subtitle, locale),
      description: this.resolveMultilingualValue(homeContent.description, locale),
    };

    // Localiser le heroBanner s'il existe
    if (homeContent.heroBanner) {
      localized.heroBanner = {
        isActive: homeContent.heroBanner.isActive,
        heroTitle: this.resolveMultilingualValue(homeContent.heroBanner.heroTitle, locale),
        heroDescription: this.resolveMultilingualValue(homeContent.heroBanner.heroDescription, locale),
        primaryButton: homeContent.heroBanner.primaryButton ? {
          text: this.resolveMultilingualValue(homeContent.heroBanner.primaryButton.text, locale),
          url: homeContent.heroBanner.primaryButton.url
        } : undefined,
        secondaryButton: homeContent.heroBanner.secondaryButton ? {
          text: this.resolveMultilingualValue(homeContent.heroBanner.secondaryButton.text, locale),
          url: homeContent.heroBanner.secondaryButton.url
        } : undefined,
        heroImage: homeContent.heroBanner.heroImage ? {
          desktop: homeContent.heroBanner.heroImage.desktop,
          mobile: homeContent.heroBanner.heroImage.mobile,
          alt: this.resolveMultilingualValue(homeContent.heroBanner.heroImage.alt, locale)
        } : undefined
      };
    }

    return localized;
  }

  async execute(locale: string = 'fr'): Promise<LocalizedHomeContentType | null> {
    const validatedLocale = LocaleCodeSchema.parse(locale);
    const homeContent = await this.homeRepository.getHomeContent(validatedLocale);
    
    if (!homeContent) {
      return null;
    }

    return this.localizeHomeContent(homeContent, validatedLocale);
  }

  async executeAll(locale: string = 'fr'): Promise<LocalizedHomeContentType[]> {
    const validatedLocale = LocaleCodeSchema.parse(locale);
    const homeContents = await this.homeRepository.getAllHomeContent();
    
    return homeContents.map(content => this.localizeHomeContent(content, validatedLocale));
  }

  async executeById(id: string, locale: string = 'fr'): Promise<LocalizedHomeContentType | null> {
    const validatedId = z.string().min(1).parse(id);
    const validatedLocale = LocaleCodeSchema.parse(locale);
    
    const homeContent = await this.homeRepository.getHomeContentById(validatedId);
    if (!homeContent) {
      return null;
    }

    return this.localizeHomeContent(homeContent, validatedLocale);
  }
}