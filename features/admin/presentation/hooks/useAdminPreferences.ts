'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminContainer } from '../../infrastructure/di/AdminContainer';
import type { AdminPreferences } from '../../domain/entities/AdminPreferences';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';

export function useAdminPreferences() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminPreferences'],
    queryFn: async () => {
      const container = AdminContainer.getInstance();
      const useCase = container.getGetAdminPreferencesUseCase();
      return await useCase.execute();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    data: data || null,
    isLoading,
    error,
  };
}

export function useUpdateAdminPreferences() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (preferences: Partial<AdminPreferences>) => {
      const container = AdminContainer.getInstance();
      const useCase = container.getUpdateAdminPreferencesUseCase();
      return await useCase.execute(preferences);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['adminPreferences'], data);
      queryClient.invalidateQueries({ queryKey: ['adminPreferences'] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useSetDefaultLanguage() {
  const updatePreferences = useUpdateAdminPreferences();

  const setDefaultLanguage = (language: LocaleCodeType) => {
    updatePreferences.mutate({ defaultLanguage: language });
  };

  return {
    setDefaultLanguage,
    isLoading: updatePreferences.isLoading,
    error: updatePreferences.error,
  };
}

export function useToggleMultilingual() {
  const updatePreferences = useUpdateAdminPreferences();

  const toggleMultilingual = (isMultilingual: boolean) => {
    updatePreferences.mutate({ isMultilingual });
  };

  return {
    toggleMultilingual,
    isLoading: updatePreferences.isLoading,
    error: updatePreferences.error,
  };
}