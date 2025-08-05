// Domain exports - Entities (interfaces)
export type {
  Product,
  Category,
  Ingredient,
  Extra,
  ProductIngredient,
  ProductExtra,
  ExtraType,
  Allergen,
  PromotionBadge,
  ProductView,
  ProductPopularity,
  UserFavorite,
  ProductRating
} from './domain/entities/Product'

// Domain exports - Schemas (Zod schemas and types)
export {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  CategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  IngredientSchema,
  CreateIngredientSchema,
  UpdateIngredientSchema,
  ExtraSchema,
  CreateExtraSchema,
  UpdateExtraSchema,
  ProductFilterSchema,
  ProductSortSchema,
  PaginationSchema,
  ProductViewSchema,
  CreateProductViewSchema,
  ProductPopularitySchema,
  UserFavoriteSchema,
  CreateUserFavoriteSchema,
  ProductRatingSchema,
  CreateProductRatingSchema,
  UpdateProductRatingSchema,
  AllergenSchema,
  ExtraTypeSchema,
  BadgeColorSchema,
  PromotionBadgeSchema
} from './domain/schemas/ProductSchemas'

// Domain exports - Schema types (derived from Zod)
export type {
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
  CreateProductView,
  CreateUserFavorite,
  CreateProductRating,
  UpdateProductRating,
  BadgeColor
} from './domain/schemas/ProductSchemas'

export type * from './domain/repositories/IProductRepository'

// Application exports
export * from './application/use-cases/GetProducts'
export * from './application/use-cases/GetProductBySlug'
export * from './application/use-cases/GetCategories'
export * from './application/use-cases/GetFavoriteProducts'
export * from './application/use-cases/TrackProductView'

// Infrastructure exports
export * from './infrastructure/di/ProductContainer'

// Presentation exports
export * from './presentation/hooks/useProducts'
export * from './presentation/hooks/useProduct'
export * from './presentation/hooks/useCategories'
export * from './presentation/hooks/useFavoriteProducts'
export * from './presentation/hooks/useProductTracking'