import { HomeContent } from '../entities/HomeContent';

export interface IHomeRepository {
  findAll(): Promise<HomeContent[]>;
  findById(id: string): Promise<HomeContent | null>;
  findFirst(): Promise<HomeContent | null>;
}