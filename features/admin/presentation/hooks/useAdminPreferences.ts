'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminContainer } from '../../infrastructure/di/AdminContainer';
import { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { UpdatePreferencesRequest } from '../../application/use-cases/UpdateAdminPreferencesUseCase';

export function useAdminPreferences() {
  return useQuery({
    queryKey: ['admin-preferences'],
    queryFn: async (): Promise<AdminPreferences> => {
      const container = AdminContainer.getInstance();
      const useCase = container.getGetAdminPreferencesUseCase();
      return await useCase.execute();
    },
  });
}

export function useUpdateAdminPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesRequest): Promise<AdminPreferences> => {
      const container = AdminContainer.getInstance();
      const useCase = container.getUpdateAdminPreferencesUseCase();
      return await useCase.execute(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-preferences'] });
    },
  });
}

export function useSetDefaultLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (locale: string): Promise<AdminPreferences> => {
      const container = AdminContainer.getInstance();
      const useCase = container.getUpdateAdminPreferencesUseCase();
      return await useCase.setDefaultLanguage(locale);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-preferences'] });
    },
  });
}

export function useToggleMultilingual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<AdminPreferences> => {
      const container = AdminContainer.getInstance();
      const useCase = container.getUpdateAdminPreferencesUseCase();
      return await useCase.toggleMultilingual();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-preferences'] });
    },
  });
}