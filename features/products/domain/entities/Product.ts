export interface Product {
  id: string
  sanityId?: string
  title: string
  slug: string
  shortDescription?: string
  longDescription?: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  stockQuantity?: number
  preparationTime: number // in minutes
  categoryId: string
  
  // Promotion & Popularity
  isFeatured?: boolean
  isPopular?: boolean
  isTrending?: boolean
  promotionBadge?: PromotionBadge
  popularityScore?: number
  
  // External integrations
  uberEatsId?: string
  deliverooId?: string
  uberEatsActive: boolean
  deliverooActive: boolean
  uberEatsLastSync?: Date
  deliverooLastSync?: Date
  
  // Relations
  category?: Category
  ingredients?: ProductIngredient[]
  extras?: ProductExtra[]
  views?: ProductView[]
  popularity?: ProductPopularity
  favorites?: UserFavorite[]
  ratings?: ProductRating[]
  
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  sanityId?: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  parentId?: string
  parent?: Category
  children?: Category[]
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  sanityId?: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  allergens: string[]
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isRemovable: boolean
  additionalPrice: number
  
  // Nutritional info
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  fiber?: number
  sodium?: number // in mg
  
  createdAt: Date
  updatedAt: Date
}

export interface Extra {
  id: string
  sanityId?: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  type: ExtraType
  basePrice: number
  maxQuantity?: number
  isAvailable: boolean
  allergens: string[]
  isVegetarian: boolean
  isVegan: boolean
  
  // Nutritional info
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  
  // External integrations
  uberEatsId?: string
  deliverooId?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface ProductIngredient {
  id: string
  productId: string
  ingredientId: string
  isRequired: boolean
  canRemove: boolean
  ingredient?: Ingredient
}

export interface ProductExtra {
  id: string
  productId: string
  extraId: string
  price: number // Override price for this product
  extra?: Extra
}

export type ExtraType = 'size' | 'topping' | 'side' | 'sauce' | 'drink' | 'other'

export type Allergen = 
  | 'gluten'
  | 'lactose'
  | 'eggs'
  | 'fish'
  | 'crustaceans'
  | 'molluscs'
  | 'peanuts'
  | 'treeNuts'
  | 'soy'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'

// Promotion and Analytics Interfaces
export interface PromotionBadge {
  text?: string
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
  isVisible: boolean
}

export interface ProductView {
  id: string
  productId: string
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  viewedAt: Date
  product?: Product
}

export interface ProductPopularity {
  id: string
  productId: string
  viewCount: number
  orderCount: number
  totalRevenue: number
  averageRating?: number
  popularityScore: number
  trendScore: number
  lastUpdated: Date
  createdAt: Date
  product?: Product
}

export interface UserFavorite {
  id: string
  userId: string
  productId: string
  createdAt: Date
  product?: Product
}

export interface ProductRating {
  id: string
  userId: string
  productId: string
  rating: number // 1-5 stars
  comment?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  product?: Product
}