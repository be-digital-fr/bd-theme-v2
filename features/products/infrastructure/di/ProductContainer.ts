import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import { GetProducts } from '../../application/use-cases/GetProducts'
import { GetProductBySlug } from '../../application/use-cases/GetProductBySlug'
import { GetCategories } from '../../application/use-cases/GetCategories'
import { GetFavoriteProducts } from '../../application/use-cases/GetFavoriteProducts'
import { TrackProductView } from '../../application/use-cases/TrackProductView'

// Placeholder for actual repository implementations
// These would be implemented in separate files
interface ProductRepositoryImplementation extends IProductRepository {}

export class ProductContainer {
  private static instance: ProductContainer
  private _productRepository: IProductRepository | null = null

  private constructor() {}

  static getInstance(): ProductContainer {
    if (!ProductContainer.instance) {
      ProductContainer.instance = new ProductContainer()
    }
    return ProductContainer.instance
  }

  // Repository registration
  registerProductRepository(repository: IProductRepository): void {
    this._productRepository = repository
  }

  get productRepository(): IProductRepository {
    if (!this._productRepository) {
      throw new Error('ProductRepository not registered. Call registerProductRepository first.')
    }
    return this._productRepository
  }

  // Use Case factories
  getProducts(): GetProducts {
    return new GetProducts(this.productRepository)
  }

  getProductBySlug(): GetProductBySlug {
    return new GetProductBySlug(this.productRepository)
  }

  getCategories(): GetCategories {
    return new GetCategories(this.productRepository)
  }

  getFavoriteProducts(): GetFavoriteProducts {
    return new GetFavoriteProducts(this.productRepository)
  }

  trackProductView(): TrackProductView {
    return new TrackProductView(this.productRepository)
  }
}

// Export singleton instance
export const productContainer = ProductContainer.getInstance()