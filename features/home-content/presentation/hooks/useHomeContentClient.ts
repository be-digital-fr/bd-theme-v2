'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UpdateHomeContentDto, HomeContent } from '../../domain/entities/HomeContent';

/**
 * Client-side hook to get home content via API
 */
export function useHomeContent() {
  return useQuery({
    queryKey: ['home-content'],
    queryFn: async () => {
      const response = await fetch('/api/admin/home-content');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load home content');
      }
      
      const result = await response.json();
      return result.data as HomeContent | null;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Client-side hook to update home content via API
 */
export function useUpdateHomeContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateHomeContentDto) => {
      const response = await fetch('/api/admin/home-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update home content');
      }
      
      const result = await response.json();
      return result.data as HomeContent;
    },
    onSuccess: () => {
      // Invalidate and refetch home content
      queryClient.invalidateQueries({ 
        queryKey: ['home-content'] 
      });
      
      toast.success('Contenu de la page d\'accueil mis à jour avec succès');
    },
    onError: (error: Error) => {
      console.error('Error updating home content:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du contenu');
    },
  });
}