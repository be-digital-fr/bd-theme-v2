import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import type { Category } from '../../domain/entities/Product'

export interface GetCategoriesRequest {
  activeOnly?: boolean
  hierarchical?: boolean
}

export interface GetCategoriesResponse {
  success: boolean
  data?: Category[]
  error?: string
}

export class GetCategories {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: GetCategoriesRequest = {}): Promise<GetCategoriesResponse> {
    try {
      const { activeOnly = true, hierarchical = false } = request

      let categories: Category[]

      if (hierarchical) {
        categories = await this.productRepository.getCategoriesHierarchy()
        
        // Filter for active only if requested
        if (activeOnly) {
          categories = this.filterActiveCategories(categories)
        }
      } else {
        categories = await this.productRepository.getCategories(activeOnly)
      }

      return {
        success: true,
        data: categories
      }
    } catch (error) {
      console.error('Error in GetCategories use case:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      }
    }
  }

  private filterActiveCategories(categories: Category[]): Category[] {
    return categories
      .filter(category => category.isActive)
      .map(category => ({
        ...category,
        children: category.children ? this.filterActiveCategories(category.children) : undefined
      }))
  }
}