import { Result } from '@/lib/result';
import { HomeContent, UpdateHomeContentDto } from '../entities/HomeContent';

export interface IHomeContentRepository {
  getHomeContent(): Promise<Result<HomeContent | null>>;
  updateHomeContent(data: UpdateHomeContentDto): Promise<Result<HomeContent>>;
  initializeDefaultContent(): Promise<Result<HomeContent>>;
}