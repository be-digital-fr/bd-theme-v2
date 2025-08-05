import type { 
  Product, 
  Category, 
  Ingredient, 
  Extra,
  CreateProduct,
  UpdateProduct,
  CreateCategory,
  UpdateCategory,
  CreateIngredient,
  UpdateIngredient,
  CreateExtra,
  UpdateExtra,
  ProductFilter,
  ProductSort,
  Pagination,
  ProductIngredient,
  ProductExtra,
  CreateProductIngredient,
  CreateProductExtra,
  ProductView,
  CreateProductView,
  ProductPopularity,
  UserFavorite,
  CreateUserFavorite,
  ProductRating,
  CreateProductRating,
  UpdateProductRating
} from '../schemas/ProductSchemas'

export interface ProductSearchResult {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export interface IProductRepository {
  // Product operations
  createProduct(data: CreateProduct): Promise<Product>
  getProductById(id: string): Promise<Product | null>
  getProductBySlug(slug: string): Promise<Product | null>
  getProducts(filters?: ProductFilter, sort?: ProductSort, pagination?: Pagination): Promise<ProductSearchResult>
  updateProduct(id: string, data: UpdateProduct): Promise<Product>
  deleteProduct(id: string): Promise<void>
  
  // Product with relations
  getProductWithIngredients(id: string): Promise<Product | null>
  getProductWithExtras(id: string): Promise<Product | null>
  getProductWithAll(id: string): Promise<Product | null>
  
  // Category operations
  createCategory(data: CreateCategory): Promise<Category>
  getCategoryById(id: string): Promise<Category | null>
  getCategoryBySlug(slug: string): Promise<Category | null>
  getCategories(activeOnly?: boolean): Promise<Category[]>
  getCategoriesHierarchy(): Promise<Category[]>
  updateCategory(id: string, data: UpdateCategory): Promise<Category>
  deleteCategory(id: string): Promise<void>
  
  // Ingredient operations
  createIngredient(data: CreateIngredient): Promise<Ingredient>
  getIngredientById(id: string): Promise<Ingredient | null>
  getIngredientBySlug(slug: string): Promise<Ingredient | null>
  getIngredients(): Promise<Ingredient[]>
  updateIngredient(id: string, data: UpdateIngredient): Promise<Ingredient>
  deleteIngredient(id: string): Promise<void>
  
  // Extra operations
  createExtra(data: CreateExtra): Promise<Extra>
  getExtraById(id: string): Promise<Extra | null>
  getExtraBySlug(slug: string): Promise<Extra | null>
  getExtras(availableOnly?: boolean): Promise<Extra[]>
  getExtrasByType(type: string, availableOnly?: boolean): Promise<Extra[]>
  updateExtra(id: string, data: UpdateExtra): Promise<Extra>
  deleteExtra(id: string): Promise<void>
  
  // Product-Ingredient relationships
  addIngredientToProduct(data: CreateProductIngredient): Promise<ProductIngredient>
  removeIngredientFromProduct(productId: string, ingredientId: string): Promise<void>
  updateProductIngredient(productId: string, ingredientId: string, updates: Partial<ProductIngredient>): Promise<ProductIngredient>
  getProductIngredients(productId: string): Promise<ProductIngredient[]>
  
  // Product-Extra relationships
  addExtraToProduct(data: CreateProductExtra): Promise<ProductExtra>
  removeExtraFromProduct(productId: string, extraId: string): Promise<void>
  updateProductExtra(productId: string, extraId: string, updates: Partial<ProductExtra>): Promise<ProductExtra>
  getProductExtras(productId: string): Promise<ProductExtra[]>
  
  // Analytics and Social operations
  // Product Views
  trackProductView(data: CreateProductView): Promise<ProductView>
  getProductViews(productId: string): Promise<ProductView[]>
  getProductViewCount(productId: string): Promise<number>
  
  // Product Popularity
  getProductPopularity(productId: string): Promise<ProductPopularity | null>
  updateProductPopularity(productId: string, updates: Partial<ProductPopularity>): Promise<ProductPopularity>
  getPopularProducts(limit?: number): Promise<Product[]>
  getTrendingProducts(limit?: number): Promise<Product[]>
  
  // User Favorites
  addUserFavorite(data: CreateUserFavorite): Promise<UserFavorite>
  removeUserFavorite(userId: string, productId: string): Promise<void>
  getUserFavorites(userId: string): Promise<Product[]>
  getFavoriteProducts(limit?: number): Promise<Product[]>
  isProductFavorited(userId: string, productId: string): Promise<boolean>
  
  // Product Ratings
  addProductRating(data: CreateProductRating): Promise<ProductRating>
  updateProductRating(id: string, data: UpdateProductRating): Promise<ProductRating>
  removeProductRating(id: string): Promise<void>
  getProductRatings(productId: string): Promise<ProductRating[]>
  getAverageRating(productId: string): Promise<number>
}

export interface ISanityProductRepository {
  // Sync operations with Sanity CMS
  syncProductFromSanity(sanityId: string): Promise<Product>
  syncCategoryFromSanity(sanityId: string): Promise<Category>
  syncIngredientFromSanity(sanityId: string): Promise<Ingredient>
  syncExtraFromSanity(sanityId: string): Promise<Extra>
  
  // Bulk sync operations
  syncAllProductsFromSanity(): Promise<Product[]>
  syncAllCategoriesFromSanity(): Promise<Category[]>
  syncAllIngredientsFromSanity(): Promise<Ingredient[]>
  syncAllExtrasFromSanity(): Promise<Extra[]>
}

export interface IExternalIntegrationRepository {
  // Uber Eats integration
  syncProductToUberEats(productId: string): Promise<string> // Returns external ID
  syncProductFromUberEats(uberEatsId: string): Promise<Product>
  updateUberEatsProduct(productId: string): Promise<void>
  deactivateUberEatsProduct(productId: string): Promise<void>
  
  // Deliveroo integration
  syncProductToDeliveroo(productId: string): Promise<string> // Returns external ID
  syncProductFromDeliveroo(deliverooId: string): Promise<Product>
  updateDeliverooProduct(productId: string): Promise<void>
  deactivateDeliverooProduct(productId: string): Promise<void>
  
  // General external sync
  getProductsForExternalSync(): Promise<Product[]>
  markExternalSyncComplete(productId: string, platform: 'uber_eats' | 'deliveroo'): Promise<void>
}