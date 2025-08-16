'use client';

import { useQuery } from '@tanstack/react-query';
import { LocalizedHomeContentType, HomeContentType } from '../../domain/schemas/HomeContentSchema';

export function useHomeContent(locale?: string) {
  return useQuery({
    queryKey: ['home-content', locale],
    queryFn: async (): Promise<LocalizedHomeContentType | null> => {
      const response = await fetch(`/api/public/home-content?locale=${locale || 'fr'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch home content');
      }
      const result = await response.json();
      return result.data;
    },
  });
}

export function useAllHomeContent(locale?: string) {
  return useQuery({
    queryKey: ['home-content-all', locale],
    queryFn: async (): Promise<LocalizedHomeContentType[]> => {
      const response = await fetch(`/api/public/home-content?locale=${locale || 'fr'}&all=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch all home content');
      }
      const result = await response.json();
      return result.data || [];
    },
  });
}

export function useRawHomeContent() {
  return useQuery({
    queryKey: ['home-content-raw'],
    queryFn: async (): Promise<HomeContentType[]> => {
      const response = await fetch('/api/public/home-content?raw=true');
      if (!response.ok) {
        throw new Error('Failed to fetch raw home content');
      }
      const result = await response.json();
      return result.data || [];
    },
  });
}

export function useHomeContentById(id: string, locale?: string) {
  return useQuery({
    queryKey: ['home-content-by-id', id, locale],
    queryFn: async (): Promise<LocalizedHomeContentType | null> => {
      const response = await fetch(`/api/public/home-content?id=${id}&locale=${locale || 'fr'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch home content by id');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!id,
  });
}