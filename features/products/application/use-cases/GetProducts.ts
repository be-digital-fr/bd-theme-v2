import type { IProductRepository, ProductSearchResult } from '../../domain/repositories/IProductRepository'
import type { ProductFilter, ProductSort, Pagination } from '../../domain/schemas/ProductSchemas'

export interface GetProductsRequest {
  filters?: ProductFilter
  sort?: ProductSort
  pagination?: Pagination
}

export interface GetProductsResponse {
  success: boolean
  data?: ProductSearchResult
  error?: string
}

export class GetProducts {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: GetProductsRequest = {}): Promise<GetProductsResponse> {
    try {
      const { filters, sort, pagination } = request

      const result = await this.productRepository.getProducts(
        filters,
        sort,
        pagination
      )

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error in GetProducts use case:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      }
    }
  }
}