'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productContainer } from '../../infrastructure/di/ProductContainer'
import type { GetFavoriteProductsRequest } from '../../application/use-cases/GetFavoriteProducts'
import type { CreateUserFavorite } from '../../domain/schemas/ProductSchemas'

/**
 * Hook to fetch favorite products (editorial, user favorites, or analytics-based)
 */
export function useFavoriteProducts(request: GetFavoriteProductsRequest = {}) {
  return useQuery({
    queryKey: ['favorite-products', request],
    queryFn: async () => {
      const useCase = productContainer.getFavoriteProducts()
      const response = await useCase.execute(request)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch favorite products')
      }
      
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - longer cache for favorites
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!request, // Only run if request is provided
  })
}

/**
 * Hook to get user's personal favorite products
 */
export function useUserFavorites(userId: string | undefined) {
  return useFavoriteProducts({
    userId,
    source: 'user_favorites',
    pagination: { page: 1, limit: 50 } // Higher limit for user favorites
  })
}

/**
 * Hook to get editorial favorite products (featured, popular, trending from Sanity)
 */
export function useEditorialFavorites(options: {
  limit?: number
  filters?: { isFeatured?: boolean; isPopular?: boolean; isTrending?: boolean }
} = {}) {
  const { limit = 12, filters = {} } = options
  
  return useFavoriteProducts({
    source: 'editorial',
    filters: {
      // Default to showing featured products if no specific filter is provided
      isFeatured: filters.isFeatured,
      isPopular: filters.isPopular,
      isTrending: filters.isTrending,
      isAvailable: true // Only show available products
    },
    sort: 'display_order_asc',
    pagination: { page: 1, limit }
  })
}

/**
 * Hook to get popular products based on analytics
 */
export function usePopularProducts(limit: number = 12) {
  return useFavoriteProducts({
    source: 'analytics',
    pagination: { page: 1, limit }
  })
}

/**
 * Hook to add/remove user favorites with optimistic updates
 */
export function useUserFavoriteMutations(userId: string | undefined) {
  const queryClient = useQueryClient()

  const addFavorite = useMutation({
    mutationFn: async (data: CreateUserFavorite) => {
      // This would call the repository directly or through a use case
      // For now, we'll simulate the API call
      const response = await fetch('/api/products/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to add favorite')
      }
      
      return response.json()
    },
    onMutate: async (newFavorite) => {
      if (!userId) return

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['favorite-products'] })

      // Optimistically update user favorites
      const queryKey = ['favorite-products', { userId, source: 'user_favorites' }]
      const previousData = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        // Add the product to the favorites list optimistically
        return {
          ...old,
          products: [...(old.products || []), { id: newFavorite.productId }],
          total: (old.total || 0) + 1
        }
      })

      return { previousData, queryKey }
    },
    onError: (err, newFavorite, context) => {
      // Rollback optimistic update on error
      if (context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
    onSettled: () => {
      // Refetch user favorites
      if (userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['favorite-products', { userId, source: 'user_favorites' }] 
        })
      }
    }
  })

  const removeFavorite = useMutation({
    mutationFn: async ({ userId, productId }: { userId: string; productId: string }) => {
      const response = await fetch(`/api/products/favorites/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite')
      }
      
      return response.json()
    },
    onMutate: async ({ productId }) => {
      if (!userId) return

      await queryClient.cancelQueries({ queryKey: ['favorite-products'] })

      const queryKey = ['favorite-products', { userId, source: 'user_favorites' }]
      const previousData = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old
        return {
          ...old,
          products: old.products?.filter((p: any) => p.id !== productId) || [],
          total: Math.max(0, (old.total || 0) - 1)
        }
      })

      return { previousData, queryKey }
    },
    onError: (err, variables, context) => {
      if (context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['favorite-products', { userId, source: 'user_favorites' }] 
        })
      }
    }
  })

  return {
    addFavorite,
    removeFavorite,
    isAddingFavorite: addFavorite.isPending,
    isRemovingFavorite: removeFavorite.isPending
  }
}