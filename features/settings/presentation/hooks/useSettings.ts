'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SettingsContainer } from '../../infrastructure/di/SettingsContainer';
import { UpdateSiteSettingsDto } from '../../domain/entities/SiteSettings';

/**
 * Hook to get site settings
 */
export function useSettings() {
  const container = SettingsContainer.getInstance();
  const getSettingsUseCase = container.getGetSettingsUseCase();

  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const result = await getSettingsUseCase.execute();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to load settings');
      }
      
      return result.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update site settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const container = SettingsContainer.getInstance();
  const updateSettingsUseCase = container.getUpdateSettingsUseCase();

  return useMutation({
    mutationFn: async (data: UpdateSiteSettingsDto) => {
      const result = await updateSettingsUseCase.execute(data);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update settings');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ 
        queryKey: ['settings'] 
      });
      
      toast.success('Paramètres mis à jour avec succès');
    },
    onError: (error: Error) => {
      console.error('Error updating settings:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour des paramètres');
    },
  });
}