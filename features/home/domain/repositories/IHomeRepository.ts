import { HomeContentType } from '../schemas/HomeContentSchema';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';

export interface IHomeRepository {
  getHomeContent(locale: LocaleCodeType): Promise<HomeContentType | null>;
  getAllHomeContent(): Promise<HomeContentType[]>;
  getHomeContentById(id: string): Promise<HomeContentType | null>;
  findAll(): Promise<HomeContentType[]>;
  findById(id: string): Promise<HomeContentType | null>;
  findFirst(): Promise<HomeContentType | null>;
}