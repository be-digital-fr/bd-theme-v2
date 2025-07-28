import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContent } from '../../domain/entities/HomeContent';

export interface LocalizedHomeContent {
  id: string;
  title?: string;
  welcoming?: string;
  subtitle?: string;
  description?: string;
  content?: string;
}

export class GetLocalizedHomeContentUseCase {
  constructor(private homeRepository: IHomeRepository) {}

  async execute(locale: string = 'fr'): Promise<LocalizedHomeContent | null> {
    const homeContent = await this.homeRepository.findFirst();
    if (!homeContent) {
      return null;
    }

    return homeContent.toLocalizedObject(locale);
  }

  async executeAll(locale: string = 'fr'): Promise<LocalizedHomeContent[]> {
    const homeContents = await this.homeRepository.findAll();
    return homeContents.map(homeContent => homeContent.toLocalizedObject(locale));
  }

  async executeById(id: string, locale: string = 'fr'): Promise<LocalizedHomeContent | null> {
    const homeContent = await this.homeRepository.findById(id);
    if (!homeContent) {
      return null;
    }

    return homeContent.toLocalizedObject(locale);
  }
}