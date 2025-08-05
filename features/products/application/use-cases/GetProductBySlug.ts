import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import type { Product } from '../../domain/schemas/ProductSchemas'

export interface GetProductBySlugRequest {
  slug: string
  includeIngredients?: boolean
  includeExtras?: boolean
}

export interface GetProductBySlugResponse {
  success: boolean
  data?: Product
  error?: string
}

export class GetProductBySlug {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: GetProductBySlugRequest): Promise<GetProductBySlugResponse> {
    try {
      const { slug, includeIngredients = false, includeExtras = false } = request

      if (!slug) {
        return {
          success: false,
          error: 'Product slug is required'
        }
      }

      let product: Product | null = null

      if (includeIngredients && includeExtras) {
        // Get product with all relations
        const productWithSlug = await this.productRepository.getProductBySlug(slug)
        if (productWithSlug) {
          product = await this.productRepository.getProductWithAll(productWithSlug.id)
        }
      } else if (includeIngredients) {
        const productWithSlug = await this.productRepository.getProductBySlug(slug)
        if (productWithSlug) {
          product = await this.productRepository.getProductWithIngredients(productWithSlug.id)
        }
      } else if (includeExtras) {
        const productWithSlug = await this.productRepository.getProductBySlug(slug)
        if (productWithSlug) {
          product = await this.productRepository.getProductWithExtras(productWithSlug.id)
        }
      } else {
        product = await this.productRepository.getProductBySlug(slug)
      }

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        }
      }

      return {
        success: true,
        data: product
      }
    } catch (error) {
      console.error('Error in GetProductBySlug use case:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      }
    }
  }
}