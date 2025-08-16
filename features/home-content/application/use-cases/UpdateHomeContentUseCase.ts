import { Result } from '@/lib/result';
import { HomeContent, UpdateHomeContentDto } from '../../domain/entities/HomeContent';
import { IHomeContentRepository } from '../../domain/repositories/IHomeContentRepository';

export class UpdateHomeContentUseCase {
  constructor(private homeContentRepository: IHomeContentRepository) {}

  async execute(data: UpdateHomeContentDto): Promise<Result<HomeContent>> {
    // Validate data
    const validationResult = this.validateData(data);
    if (!validationResult.success) {
      return validationResult;
    }

    // Update content
    return await this.homeContentRepository.updateHomeContent(data);
  }

  private validateData(data: UpdateHomeContentDto): Result<void> {
    // Validate hero banner if provided
    if (data.heroBanner) {
      const { heroTitle, heroDescription, primaryButtonText, secondaryButtonText } = data.heroBanner;
      
      if (!heroTitle || Object.keys(heroTitle).length === 0) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Hero title is required and must contain at least one language'
        });
      }

      if (!heroDescription || Object.keys(heroDescription).length === 0) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Hero description is required and must contain at least one language'
        });
      }

      if (!primaryButtonText || Object.keys(primaryButtonText).length === 0) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Primary button text is required and must contain at least one language'
        });
      }

      if (!secondaryButtonText || Object.keys(secondaryButtonText).length === 0) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Secondary button text is required and must contain at least one language'
        });
      }

      if (!data.heroBanner.primaryButtonUrl?.trim()) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Primary button URL is required'
        });
      }

      if (!data.heroBanner.secondaryButtonUrl?.trim()) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Secondary button URL is required'
        });
      }
    }

    // Validate features section if provided
    if (data.featuresSection) {
      if (data.featuresSection.featureItems.length > 6) {
        return Result.failure({
          code: 'VALIDATION_ERROR',
          message: 'Maximum 6 feature items allowed'
        });
      }

      for (const item of data.featuresSection.featureItems) {
        if (!item.title || Object.keys(item.title).length === 0) {
          return Result.failure({
            code: 'VALIDATION_ERROR',
            message: 'Feature item title is required and must contain at least one language'
          });
        }

        if (!item.iconUrl?.trim()) {
          return Result.failure({
            code: 'VALIDATION_ERROR',
            message: 'Feature item icon URL is required'
          });
        }
      }
    }

    return Result.success(undefined);
  }
}