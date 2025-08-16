'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UpdateSiteSettingsDto, SiteSettings } from '../../domain/entities/SiteSettings';

/**
 * Client-side hook to get site settings via API
 */
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load settings');
      }
      
      const result = await response.json();
      return result.data as SiteSettings | null;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Client-side hook to update site settings via API
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSiteSettingsDto) => {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }
      
      const result = await response.json();
      return result.data as SiteSettings;
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