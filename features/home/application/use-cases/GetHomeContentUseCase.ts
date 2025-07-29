import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContentType } from '../../domain/schemas/HomeContentSchema';

export class GetHomeContentUseCase {
  constructor(private homeRepository: IHomeRepository) {}

  async execute(): Promise<HomeContentType[]> {
    return await this.homeRepository.findAll();
  }

  async executeFirst(): Promise<HomeContentType | null> {
    return await this.homeRepository.findFirst();
  }

  async executeById(id: string): Promise<HomeContentType | null> {
    if (!id) {
      throw new Error('Home content ID is required');
    }
    
    return await this.homeRepository.findById(id);
  }
}