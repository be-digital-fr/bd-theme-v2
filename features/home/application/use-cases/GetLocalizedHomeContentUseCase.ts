import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContentType, LocalizedHomeContentType, MultilingualValueType } from '../../domain/schemas/HomeContentSchema';
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
    return {
      id: homeContent.id || homeContent._id,
      title: this.resolveMultilingualValue(homeContent.title, locale),
      welcoming: this.resolveMultilingualValue(homeContent.welcoming, locale),
      subtitle: this.resolveMultilingualValue(homeContent.subtitle, locale),
      description: this.resolveMultilingualValue(homeContent.description, locale),
      content: homeContent.content,
    };
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