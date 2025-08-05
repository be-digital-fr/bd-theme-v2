import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import type { ProductView, CreateProductView } from '../../domain/schemas/ProductSchemas'

export interface TrackProductViewRequest {
  productId: string
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
}

export interface TrackProductViewResponse {
  success: boolean
  data?: ProductView
  error?: string
}

export class TrackProductView {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: TrackProductViewRequest): Promise<TrackProductViewResponse> {
    try {
      const { productId, userId, sessionId, ipAddress, userAgent } = request

      // Validate required fields
      if (!productId) {
        return {
          success: false,
          error: 'Product ID is required'
        }
      }

      // Check if product exists
      const product = await this.productRepository.getProductById(productId)
      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        }
      }

      // Create the view data
      const viewData: CreateProductView = {
        productId,
        userId,
        sessionId,
        ipAddress,
        userAgent
      }

      // Track the product view
      const productView = await this.productRepository.trackProductView(viewData)

      // Update product popularity asynchronously (don't wait for it)
      this.updateProductPopularityAsync(productId).catch(error => {
        console.error('Error updating product popularity:', error)
        // Don't fail the main operation if popularity update fails
      })

      return {
        success: true,
        data: productView
      }
    } catch (error) {
      console.error('Error in TrackProductView use case:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track product view'
      }
    }
  }

  /**
   * Updates product popularity score asynchronously
   * This is called as a side effect and doesn't block the main operation
   */
  private async updateProductPopularityAsync(productId: string): Promise<void> {
    try {
      // Get current popularity data
      let popularity = await this.productRepository.getProductPopularity(productId)
      
      if (!popularity) {
        // If no popularity record exists, it will be created by the repository
        // when we call updateProductPopularity
        popularity = {
          id: '', // Will be generated
          productId,
          viewCount: 0,
          orderCount: 0,
          totalRevenue: 0,
          popularityScore: 0,
          trendScore: 0,
          lastUpdated: new Date(),
          createdAt: new Date()
        }
      }

      // Increment view count
      const newViewCount = popularity.viewCount + 1

      // Calculate new popularity score (weighted formula)
      // This is a simple formula - in production you might want more sophisticated scoring
      const viewWeight = 1
      const orderWeight = 10
      const revenueWeight = 0.1
      
      const newPopularityScore = (
        (newViewCount * viewWeight) +
        (popularity.orderCount * orderWeight) +
        (Number(popularity.totalRevenue) * revenueWeight)
      )

      // Calculate trend score based on recent activity
      // For now, use a simple time-decay formula
      const daysSinceLastUpdate = Math.floor(
        (Date.now() - popularity.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      )
      const timeDecayFactor = Math.max(0.1, 1 - (daysSinceLastUpdate * 0.1))
      const newTrendScore = newPopularityScore * timeDecayFactor

      // Update popularity
      await this.productRepository.updateProductPopularity(productId, {
        viewCount: newViewCount,
        popularityScore: newPopularityScore,
        trendScore: newTrendScore
      })
    } catch (error) {
      // Log error but don't throw - this is a background operation
      console.error('Error updating product popularity for product', productId, error)
    }
  }
}