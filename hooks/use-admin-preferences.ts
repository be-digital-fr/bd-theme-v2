import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AdminPreferences, AdminPreferencesForm } from '@/lib/schemas'

export function useAdminPreferences() {
  return useQuery({
    queryKey: ['admin-preferences'],
    queryFn: async (): Promise<AdminPreferences> => {
      const response = await fetch('/api/admin/preferences')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des préférences')
      }
      return response.json()
    },
  })
}

export function useUpdateAdminPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AdminPreferencesForm): Promise<AdminPreferences> => {
      const response = await fetch('/api/admin/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des préférences')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalider et refetch les préférences
      queryClient.invalidateQueries({ queryKey: ['admin-preferences'] })
    },
  })
} 