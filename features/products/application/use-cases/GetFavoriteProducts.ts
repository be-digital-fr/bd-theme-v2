import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import type { Product, ProductFilter, ProductSort, Pagination } from '../../domain/schemas/ProductSchemas'

export interface GetFavoriteProductsRequest {
  userId?: string
  filters?: ProductFilter
  sort?: ProductSort
  pagination?: Pagination
  source?: 'editorial' | 'user_favorites' | 'analytics' // Source of favorite classification
}

export interface GetFavoriteProductsResponse {
  success: boolean
  data?: {
    products: Product[]
    total: number
    page: number
    totalPages: number
    source: 'editorial' | 'user_favorites' | 'analytics'
  }
  error?: string
}

export class GetFavoriteProducts {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: GetFavoriteProductsRequest = {}): Promise<GetFavoriteProductsResponse> {
    try {
      const { userId, filters = {}, sort = 'display_order_asc', pagination = { page: 1, limit: 20 }, source = 'editorial' } = request

      let products: Product[] = []
      let total: number = 0

      switch (source) {
        case 'editorial':
          // Get products marked as featured, popular, or trending in Sanity
          const editorialFilters = {
            ...filters,
            // Apply one or more of these filters
            isFeatured: filters.isFeatured ?? true,
            isPopular: filters.isPopular ?? true,
            isTrending: filters.isTrending ?? true
          }
          
          const editorialResult = await this.productRepository.getProducts(
            editorialFilters,
            sort,
            pagination
          )
          products = editorialResult.products
          total = editorialResult.total
          break

        case 'user_favorites':
          // Get user's personal favorites
          if (!userId) {
            return {
              success: false,
              error: 'User ID is required for user favorites'
            }
          }
          
          const userFavorites = await this.productRepository.getUserFavorites(userId)
          // Apply pagination manually since getUserFavorites doesn't support it
          const startIndex = (pagination.page - 1) * pagination.limit
          const endIndex = startIndex + pagination.limit
          products = userFavorites.slice(startIndex, endIndex)
          total = userFavorites.length
          break

        case 'analytics':
          // Get popular products based on analytics data
          const popularProducts = await this.productRepository.getPopularProducts(pagination.limit)
          products = popularProducts
          total = popularProducts.length
          break

        default:
          return {
            success: false,
            error: 'Invalid source specified'
          }
      }

      // Calculate total pages
      const totalPages = Math.ceil(total / pagination.limit)

      return {
        success: true,
        data: {
          products,
          total,
          page: pagination.page,
          totalPages,
          source
        }
      }
    } catch (error) {
      console.error('Error in GetFavoriteProducts use case:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorite products'
      }
    }
  }
}