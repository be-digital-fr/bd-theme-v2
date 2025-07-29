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
      content: (data as any).content,
    };
  }

  async getHomeContent(locale: LocaleCodeType): Promise<HomeContentType | null> {
    try {
      const content = await getFirstResolvedHome(locale);
      return content ? this.mapToHomeContentType(content) : null;
    } catch (error) {
      console.error('Error fetching home content from Sanity:', error);
      throw error;
    }
  }

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