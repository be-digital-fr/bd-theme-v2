'use client'

import { useQuery } from '@tanstack/react-query'
import { productContainer } from '../../infrastructure/di/ProductContainer'
import type { GetProductBySlugRequest } from '../../application/use-cases/GetProductBySlug'

export function useProduct(request: GetProductBySlugRequest) {
  return useQuery({
    queryKey: ['product', request.slug, request.includeIngredients, request.includeExtras],
    queryFn: async () => {
      const useCase = productContainer.getProductBySlug()
      const response = await useCase.execute(request)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch product')
      }
      
      return response.data
    },
    enabled: !!request.slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}