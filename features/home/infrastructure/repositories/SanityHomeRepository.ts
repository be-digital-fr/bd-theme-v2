import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContentType } from '../../domain/schemas/HomeContentSchema';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';
import { 
  getHome, 
  getResolvedHome, 
  getFirstResolvedHome,
  type HomeDocument,
  type ResolvedHomeData 
} from '@/sanity/lib/queries';

export class SanityHomeRepository implements IHomeRepository {
  private mapToHomeContentType(data: ResolvedHomeData | HomeDocument): HomeContentType {
    return {
      id: data._id,
      title: (data as any).title,
      welcoming: (data as any).welcoming,
      subtitle: (data as any).subtitle,
      description: (data as any).description,
      heroBanner: (data as any).heroBanner,
      featuresSection: (data as any).featuresSection,
    };
  }

  async getHomeContent(locale: LocaleCodeType): Promise<HomeContentType | null> {
    try {
      // Get raw data for features section with images, but resolve text content
      const rawContent = await getHome();
      if (!rawContent.length) return null;
      
      const content = rawContent[0];
      
      // Create hybrid content that keeps images as objects but resolves text
      const mappedContent = {
        id: content._id,
        title: this.resolveMultilingualValue(content.title, locale),
        welcoming: this.resolveMultilingualValue(content.welcoming, locale),
        subtitle: this.resolveMultilingualValue(content.subtitle, locale),
        description: this.resolveMultilingualValue(content.description, locale),
        heroBanner: content.heroBanner ? {
          isActive: content.heroBanner.isActive,
          heroTitle: this.resolveMultilingualValue(content.heroBanner.heroTitle, locale),
          heroDescription: this.resolveMultilingualValue(content.heroBanner.heroDescription, locale),
          primaryButton: content.heroBanner.primaryButton ? {
            text: this.resolveMultilingualValue(content.heroBanner.primaryButton.text, locale),
            url: content.heroBanner.primaryButton.url
          } : undefined,
          secondaryButton: content.heroBanner.secondaryButton ? {
            text: this.resolveMultilingualValue(content.heroBanner.secondaryButton.text, locale),
            url: content.heroBanner.secondaryButton.url
          } : undefined,
          heroImage: content.heroBanner.heroImage
        } : undefined,
        featuresSection: content.featuresSection ? {
          isActive: content.featuresSection.isActive,
          sectionTitle: this.resolveMultilingualValue(content.featuresSection.sectionTitle, locale),
          sectionDescription: this.resolveMultilingualValue(content.featuresSection.sectionDescription, locale),
          features: content.featuresSection.featuresList ? content.featuresSection.featuresList.map(feature => ({
            icon: feature.icon, // Keep as Sanity image object
            title: this.resolveMultilingualValue(feature.title, locale),
            description: this.resolveMultilingualValue(feature.description, locale)
          })) : undefined
        } : undefined,
      };
      
      return mappedContent as HomeContentType;
    } catch (error) {
      console.error('Error fetching home content from Sanity:', error);
      throw error;
    }
  }

  private resolveMultilingualValue = (
    value: Record<string, string> | string | undefined | any,
    preferredLanguage: string = 'fr',
    fallbackLanguage: string = 'fr'
  ): string | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Handle autoMultilingualString objects with _type
      if (value._type === 'autoMultilingualString' || value._type === 'autoMultilingualText') {
        // Extract language values, excluding _type
        const { _type, ...langValues } = value;
        if (langValues[preferredLanguage]) return langValues[preferredLanguage];
        if (langValues[fallbackLanguage]) return langValues[fallbackLanguage];
        const firstAvailable = Object.values(langValues).find(v => v && typeof v === 'string' && v.trim() !== '');
        return firstAvailable as string;
      }
      
      // Handle regular multilingual objects
      if (value[preferredLanguage]) return value[preferredLanguage];
      if (value[fallbackLanguage]) return value[fallbackLanguage];
      const firstAvailable = Object.values(value).find(v => v && typeof v === 'string' && v.trim() !== '');
      return firstAvailable as string;
    }
    return undefined;
  };

  async getAllHomeContent(): Promise<HomeContentType[]> {
    try {
      const content = await getResolvedHome('fr');
      return content ? content.map(c => this.mapToHomeContentType(c)) : [];
    } catch (error) {
      console.error('Error fetching all home content from Sanity:', error);
      throw error;
    }
  }

  async getHomeContentById(id: string): Promise<HomeContentType | null> {
    try {
      const allContent = await getHome();
      const found = allContent.find(doc => doc._id === id);
      return found ? this.mapToHomeContentType(found) : null;
    } catch (error) {
      console.error('Error fetching home content by ID from Sanity:', error);
      throw error;
    }
  }

  async findAll(): Promise<HomeContentType[]> {
    return this.getAllHomeContent();
  }

  async findById(id: string): Promise<HomeContentType | null> {
    return this.getHomeContentById(id);
  }

  async findFirst(): Promise<HomeContentType | null> {
    try {
      const content = await getFirstResolvedHome('fr');
      return content ? this.mapToHomeContentType(content) : null;
    } catch (error) {
      console.error('Error fetching first home content from Sanity:', error);
      throw error;
    }
  }

  async getRawHomeContent(): Promise<HomeDocument[]> {
    try {
      const content = await getHome();
      return content;
    } catch (error) {
      console.error('Error fetching raw home content from Sanity:', error);
      throw error;
    }
  }
}