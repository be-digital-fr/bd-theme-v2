import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import type { UpdateProduct } from '../../domain/schemas/ProductSchemas'

export interface UpdateProductRequest {
  id: string
  data: Partial<UpdateProduct>
}

export interface UpdateProductResponse {
  success: boolean
  data?: any
  error?: string
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: Partial<UpdateProduct>): Promise<UpdateProductResponse> {
    try {
      const result = await this.productRepository.updateProduct(id, data)

      if (!result) {
        return {
          success: false,
          error: 'Product not found'
        }
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error in UpdateProduct use case:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update product'
      }
    }
  }
}