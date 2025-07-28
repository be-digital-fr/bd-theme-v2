import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContent } from '../../domain/entities/HomeContent';

export class GetHomeContentUseCase {
  constructor(private homeRepository: IHomeRepository) {}

  async execute(): Promise<HomeContent[]> {
    return await this.homeRepository.findAll();
  }

  async executeFirst(): Promise<HomeContent | null> {
    return await this.homeRepository.findFirst();
  }

  async executeById(id: string): Promise<HomeContent | null> {
    if (!id) {
      throw new Error('Home content ID is required');
    }
    
    return await this.homeRepository.findById(id);
  }
}