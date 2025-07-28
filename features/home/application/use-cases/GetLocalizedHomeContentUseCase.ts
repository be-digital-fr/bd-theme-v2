import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContent } from '../../domain/entities/HomeContent';
import { LocalizedHomeContentType } from '../../domain/schemas/HomeContentSchema';
import { LocaleCodeSchema } from '../../../locale/domain/schemas/LocaleSchema';
import { z } from 'zod';

export class GetLocalizedHomeContentUseCase {
  constructor(private homeRepository: IHomeRepository) {}

  async execute(locale: string = 'fr'): Promise<LocalizedHomeContentType | null> {
    // Validate locale input
    const validatedLocale = LocaleCodeSchema.parse(locale);
    
    const homeContent = await this.homeRepository.findFirst();
    if (!homeContent) {
      return null;
    }

    return homeContent.toLocalizedObject(validatedLocale);
  }

  async executeAll(locale: string = 'fr'): Promise<LocalizedHomeContentType[]> {
    // Validate locale input
    const validatedLocale = LocaleCodeSchema.parse(locale);
    
    const homeContents = await this.homeRepository.findAll();
    return homeContents.map(homeContent => homeContent.toLocalizedObject(validatedLocale));
  }

  async executeById(id: string, locale: string = 'fr'): Promise<LocalizedHomeContentType | null> {
    // Validate inputs
    const validatedId = z.string().min(1).parse(id);
    const validatedLocale = LocaleCodeSchema.parse(locale);
    
    const homeContent = await this.homeRepository.findById(validatedId);
    if (!homeContent) {
      return null;
    }

    return homeContent.toLocalizedObject(validatedLocale);
  }
}