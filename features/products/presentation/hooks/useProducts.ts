'use client'

import { useQuery } from '@tanstack/react-query'
import { productContainer } from '../../infrastructure/di/ProductContainer'
import type { GetProductsRequest } from '../../application/use-cases/GetProducts'

export function useProducts(request: GetProductsRequest = {}) {
  return useQuery({
    queryKey: ['products', request],
    queryFn: async () => {
      const useCase = productContainer.getProducts()
      const response = await useCase.execute(request)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch products')
      }
      
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}