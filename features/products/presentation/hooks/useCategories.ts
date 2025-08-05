'use client'

import { useQuery } from '@tanstack/react-query'
import { productContainer } from '../../infrastructure/di/ProductContainer'
import type { GetCategoriesRequest } from '../../application/use-cases/GetCategories'

export function useCategories(request: GetCategoriesRequest = {}) {
  return useQuery({
    queryKey: ['categories', request.activeOnly, request.hierarchical],
    queryFn: async () => {
      const useCase = productContainer.getCategories()
      const response = await useCase.execute(request)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories')
      }
      
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}