import { LocalizedHomeContentType } from '../../domain/schemas/HomeContentSchema';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';
import { PrismaHomeRepository } from '../../infrastructure/repositories/PrismaHomeRepository';

export class GetLocalizedHomeContentFromPrismaUseCase {
  constructor(private repository: PrismaHomeRepository) {}

  async execute(locale?: LocaleCodeType): Promise<LocalizedHomeContentType | null> {
    const defaultLocale: LocaleCodeType = 'fr';
    const targetLocale = locale || defaultLocale;
    
    try {
      return await this.repository.getLocalizedHomeContent(targetLocale);
    } catch (error) {
      console.error('Error in GetLocalizedHomeContentFromPrismaUseCase:', error);
      throw error;
    }
  }

  async executeById(id: string, locale?: LocaleCodeType): Promise<LocalizedHomeContentType | null> {
    const defaultLocale: LocaleCodeType = 'fr';
    const targetLocale = locale || defaultLocale;
    
    try {
      const content = await this.repository.findById(id);
      if (!content) {
        return null;
      }

      // Use repository mapping method
      return this.repository.mapToLocalizedContent(content, targetLocale);
    } catch (error) {
      console.error('Error in GetLocalizedHomeContentFromPrismaUseCase (by ID):', error);
      throw error;
    }
  }

  async executeAll(locale?: LocaleCodeType): Promise<LocalizedHomeContentType[]> {
    const defaultLocale: LocaleCodeType = 'fr';
    const targetLocale = locale || defaultLocale;
    
    try {
      const content = await this.repository.getLocalizedHomeContent(targetLocale);
      return content ? [content] : [];
    } catch (error) {
      console.error('Error in GetLocalizedHomeContentFromPrismaUseCase (all):', error);
      throw error;
    }
  }
}