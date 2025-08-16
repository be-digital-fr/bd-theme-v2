import { Result } from '@/lib/result';
import { HomeContent } from '../../domain/entities/HomeContent';
import { IHomeContentRepository } from '../../domain/repositories/IHomeContentRepository';

export class GetHomeContentUseCase {
  constructor(private homeContentRepository: IHomeContentRepository) {}

  async execute(): Promise<Result<HomeContent | null>> {
    const result = await this.homeContentRepository.getHomeContent();
    
    if (!result.success) {
      return result;
    }

    // If no content exists, initialize with default content
    if (!result.data) {
      const initResult = await this.homeContentRepository.initializeDefaultContent();
      if (!initResult.success) {
        return Result.failure({
          code: 'INITIALIZATION_FAILED',
          message: 'Failed to initialize default home content',
          details: initResult.error
        });
      }
      return Result.success(initResult.data);
    }

    return result;
  }
}