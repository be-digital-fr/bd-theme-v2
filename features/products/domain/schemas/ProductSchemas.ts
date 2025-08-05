import { z } from 'zod'

// Base schemas for validation
export const AllergenSchema = z.enum([
  'gluten',
  'lactose',
  'eggs',
  'fish',
  'crustaceans',
  'molluscs',
  'peanuts',
  'treeNuts',
  'soy',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin'
])

export const ExtraTypeSchema = z.enum([
  'size',
  'topping',
  'side',
  'sauce',
  'drink',
  'other'
])

export const BadgeColorSchema = z.enum([
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'destructive'
])

export const PromotionBadgeSchema = z.object({
  text: z.string().optional(),
  color: BadgeColorSchema.default('primary'),
  isVisible: z.boolean().default(false)
})

// Nutritional information schema
export const NutritionalInfoSchema = z.object({
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbohydrates: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  sodium: z.number().min(0).optional()
}).optional()

// Category schemas
export const CategorySchema = z.object({
  id: z.string(),
  sanityId: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  displayOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  parentId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

// Ingredient schemas
export const IngredientSchema = z.object({
  id: z.string(),
  sanityId: z.string().optional(),
  name: z.string().min(1, 'Ingredient name is required'),
  slug: z.string().min(1, 'Ingredient slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  allergens: z.array(AllergenSchema).default([]),
  isVegetarian: z.boolean().default(true),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isRemovable: z.boolean().default(true),
  additionalPrice: z.number().min(0).default(0),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbohydrates: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateIngredientSchema = IngredientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateIngredientSchema = CreateIngredientSchema.partial()

// Extra schemas
export const ExtraSchema = z.object({
  id: z.string(),
  sanityId: z.string().optional(),
  name: z.string().min(1, 'Extra name is required'),
  slug: z.string().min(1, 'Extra slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  type: ExtraTypeSchema,
  basePrice: z.number().min(0, 'Base price must be positive'),
  maxQuantity: z.number().min(1).optional(),
  isAvailable: z.boolean().default(true),
  allergens: z.array(AllergenSchema).default([]),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbohydrates: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  uberEatsId: z.string().optional(),
  deliverooId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateExtraSchema = ExtraSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateExtraSchema = CreateExtraSchema.partial()

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  sanityId: z.string().optional(),
  title: z.string().min(1, 'Product title is required'),
  slug: z.string().min(1, 'Product slug is required'),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().default(true),
  stockQuantity: z.number().min(0).optional(),
  preparationTime: z.number().min(1, 'Preparation time must be at least 1 minute'),
  categoryId: z.string().min(1, 'Category is required'),
  
  // Promotion & Popularity
  isFeatured: z.boolean().default(false).optional(),
  isPopular: z.boolean().default(false).optional(),
  isTrending: z.boolean().default(false).optional(),
  promotionBadge: PromotionBadgeSchema.optional(),
  popularityScore: z.number().min(0).max(100).optional(),
  displayOrder: z.number().default(0).optional(),
  
  uberEatsId: z.string().optional(),
  deliverooId: z.string().optional(),
  uberEatsActive: z.boolean().default(false),
  deliverooActive: z.boolean().default(false),
  uberEatsLastSync: z.date().optional(),
  deliverooLastSync: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateProductSchema = CreateProductSchema.partial()

// Junction table schemas
export const ProductIngredientSchema = z.object({
  id: z.string(),
  productId: z.string(),
  ingredientId: z.string(),
  isRequired: z.boolean().default(true),
  canRemove: z.boolean().default(true)
})

export const CreateProductIngredientSchema = ProductIngredientSchema.omit({
  id: true
})

export const ProductExtraSchema = z.object({
  id: z.string(),
  productId: z.string(),
  extraId: z.string(),
  price: z.number().min(0, 'Price must be positive')
})

export const CreateProductExtraSchema = ProductExtraSchema.omit({
  id: true
})

// Search and filter schemas
export const ProductFilterSchema = z.object({
  categoryId: z.string().optional(),
  isAvailable: z.boolean().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  maxPreparationTime: z.number().min(1).optional(),
  allergens: z.array(AllergenSchema).optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  search: z.string().optional(),
  
  // Promotion filters
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  minPopularityScore: z.number().min(0).max(100).optional(),
})

export const ProductSortSchema = z.enum([
  'title_asc',
  'title_desc',
  'price_asc',
  'price_desc',
  'preparation_time_asc',
  'preparation_time_desc',
  'created_at_asc',
  'created_at_desc',
  'popularity_desc',
  'popularity_asc',
  'display_order_asc',
  'display_order_desc'
]).default('title_asc')

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// Analytics and Social schemas
export const ProductViewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  viewedAt: z.date()
})

export const CreateProductViewSchema = ProductViewSchema.omit({
  id: true,
  viewedAt: true
})

export const ProductPopularitySchema = z.object({
  id: z.string(),
  productId: z.string(),
  viewCount: z.number().min(0).default(0),
  orderCount: z.number().min(0).default(0),
  totalRevenue: z.number().min(0).default(0),
  averageRating: z.number().min(0).max(5).optional(),
  popularityScore: z.number().min(0).default(0),
  trendScore: z.number().min(0).default(0),
  lastUpdated: z.date(),
  createdAt: z.date()
})

export const UserFavoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.date()
})

export const CreateUserFavoriteSchema = UserFavoriteSchema.omit({
  id: true,
  createdAt: true
})

export const ProductRatingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CreateProductRatingSchema = ProductRatingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const UpdateProductRatingSchema = CreateProductRatingSchema.pick({
  rating: true,
  comment: true
})

// Type exports
export type Allergen = z.infer<typeof AllergenSchema>
export type ExtraType = z.infer<typeof ExtraTypeSchema>
export type Category = z.infer<typeof CategorySchema>
export type CreateCategory = z.infer<typeof CreateCategorySchema>
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>
export type Ingredient = z.infer<typeof IngredientSchema>
export type CreateIngredient = z.infer<typeof CreateIngredientSchema>
export type UpdateIngredient = z.infer<typeof UpdateIngredientSchema>
export type Extra = z.infer<typeof ExtraSchema>
export type CreateExtra = z.infer<typeof CreateExtraSchema>
export type UpdateExtra = z.infer<typeof UpdateExtraSchema>
export type Product = z.infer<typeof ProductSchema>
export type CreateProduct = z.infer<typeof CreateProductSchema>
export type UpdateProduct = z.infer<typeof UpdateProductSchema>
export type ProductIngredient = z.infer<typeof ProductIngredientSchema>
export type CreateProductIngredient = z.infer<typeof CreateProductIngredientSchema>
export type ProductExtra = z.infer<typeof ProductExtraSchema>
export type CreateProductExtra = z.infer<typeof CreateProductExtraSchema>
export type ProductFilter = z.infer<typeof ProductFilterSchema>
export type ProductSort = z.infer<typeof ProductSortSchema>
export type Pagination = z.infer<typeof PaginationSchema>

// Analytics and Social types
export type BadgeColor = z.infer<typeof BadgeColorSchema>
export type PromotionBadge = z.infer<typeof PromotionBadgeSchema>
export type ProductView = z.infer<typeof ProductViewSchema>
export type CreateProductView = z.infer<typeof CreateProductViewSchema>
export type ProductPopularity = z.infer<typeof ProductPopularitySchema>
export type UserFavorite = z.infer<typeof UserFavoriteSchema>
export type CreateUserFavorite = z.infer<typeof CreateUserFavoriteSchema>
export type ProductRating = z.infer<typeof ProductRatingSchema>
export type CreateProductRating = z.infer<typeof CreateProductRatingSchema>
export type UpdateProductRating = z.infer<typeof UpdateProductRatingSchema>