'use client';

import { useQuery } from '@tanstack/react-query';
import { HomeContainer } from '../../infrastructure/di/HomeContainer';
import { LocalizedHomeContentType } from '../../domain/schemas/HomeContentSchema';
import { HomeContent } from '../../domain/entities/HomeContent';

export function useHomeContent(locale?: string) {
  return useQuery({
    queryKey: ['home-content', locale],
    queryFn: async (): Promise<LocalizedHomeContentType | null> => {
      const container = HomeContainer.getInstance();
      const useCase = container.getGetLocalizedHomeContentUseCase();
      return await useCase.execute(locale);
    },
  });
}

export function useAllHomeContent(locale?: string) {
  return useQuery({
    queryKey: ['home-content-all', locale],
    queryFn: async (): Promise<LocalizedHomeContentType[]> => {
      const container = HomeContainer.getInstance();
      const useCase = container.getGetLocalizedHomeContentUseCase();
      return await useCase.executeAll(locale);
    },
  });
}

export function useRawHomeContent() {
  return useQuery({
    queryKey: ['home-content-raw'],
    queryFn: async (): Promise<HomeContent[]> => {
      const container = HomeContainer.getInstance();
      const useCase = container.getGetHomeContentUseCase();
      return await useCase.execute();
    },
  });
}

export function useHomeContentById(id: string, locale?: string) {
  return useQuery({
    queryKey: ['home-content-by-id', id, locale],
    queryFn: async (): Promise<LocalizedHomeContentType | null> => {
      const container = HomeContainer.getInstance();
      const useCase = container.getGetLocalizedHomeContentUseCase();
      return await useCase.executeById(id, locale);
    },
    enabled: !!id,
  });
}