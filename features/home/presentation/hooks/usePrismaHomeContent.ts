'use client';

import { useQuery } from '@tanstack/react-query';
import { LocalizedHomeContentType } from '../../domain/schemas/HomeContentSchema';

export function usePrismaHomeContent(locale?: string) {
  return useQuery({
    queryKey: ['prisma-home-content', locale],
    queryFn: async (): Promise<LocalizedHomeContentType | null> => {
      const searchParams = new URLSearchParams();
      if (locale) {
        searchParams.set('locale', locale);
      }
      
      const response = await fetch(`/api/public/home-content?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch home content');
      }
      
      const result = await response.json();
      return result.success ? result.data : null;
    },
  });
}

export function usePrismaHomeContentById(id: string, locale?: string) {
  return useQuery({
    queryKey: ['prisma-home-content-by-id', id, locale],
    queryFn: async (): Promise<LocalizedHomeContentType | null> => {
      const searchParams = new URLSearchParams();
      if (locale) {
        searchParams.set('locale', locale);
      }
      if (id) {
        searchParams.set('id', id);
      }
      
      const response = await fetch(`/api/public/home-content?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch home content');
      }
      
      const result = await response.json();
      return result.success ? result.data : null;
    },
    enabled: !!id,
  });
}