'use client'

import * as React from 'react'
import { Heart, TrendingUp, Star, Filter, Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from './card'
import { ProductCard } from './product-card'
import { Button } from './button'
import { Badge } from './badge'
import { Container } from './container'
import { Separator } from './separator'
import { 
  useEditorialFavorites, 
  useUserFavorites, 
  usePopularProducts 
} from '@/features/products'
import type { Product } from '@/features/products'

export type FavoritesSectionType = 'editorial' | 'user_favorites' | 'analytics' | 'mixed'
export type FavoritesSectionSize = 'sm' | 'default' | 'lg'
export type FavoritesSectionLayout = 'grid' | 'carousel' | 'list'

export interface FavoritesSectionProps extends React.HTMLAttributes<HTMLElement> {
  type?: FavoritesSectionType
  userId?: string
  sessionId?: string
  title?: string
  subtitle?: string
  showTitle?: boolean
  showFilters?: boolean
  showViewToggle?: boolean
  limit?: number
  size?: FavoritesSectionSize
  layout?: FavoritesSectionLayout
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  onProductClick?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  filters?: {
    isFeatured?: boolean
    isPopular?: boolean
    isTrending?: boolean
  }
  emptyState?: {
    title?: string
    description?: string
    showAddProducts?: boolean
  }
}

/**
 * FavoritesSection component displaying favorite products in various layouts
 * 
 * Features:
 * - Multiple data sources (editorial, user favorites, analytics)
 * - Responsive grid layout with customizable columns
 * - Filter options for different promotion types
 * - View toggle between grid and list layouts
 * - Loading states and empty state handling
 * - Mixed mode showing all types of favorites
 */
export const FavoritesSection = React.forwardRef<HTMLElement, FavoritesSectionProps>(
  ({
    type = 'editorial',
    userId,
    sessionId,
    title,
    subtitle,
    showTitle = true,
    showFilters = false,
    showViewToggle = false,
    limit = 12,
    size = 'default',
    layout = 'grid',
    columns = { sm: 1, md: 2, lg: 3, xl: 4 },
    onProductClick,
    onAddToCart,
    filters,
    emptyState,
    className,
    ...props
  }, ref) => {
    const [currentLayout, setCurrentLayout] = React.useState<FavoritesSectionLayout>(layout)
    const [activeFilters, setActiveFilters] = React.useState(filters || {})

    // Data fetching based on type
    const editorialFavorites = useEditorialFavorites({
      limit,
      filters: activeFilters
    })

    const userFavorites = useUserFavorites(userId)
    const popularProducts = usePopularProducts(limit)

    // Determine which data to use
    const queryResult = React.useMemo(() => {
      switch (type) {
        case 'editorial':
          return editorialFavorites
        case 'user_favorites':
          return userFavorites
        case 'analytics':
          return popularProducts
        case 'mixed':
          // Combine all sources (editorial takes priority)
          const allProducts: Product[] = []
          if (editorialFavorites.data?.products) {
            allProducts.push(...editorialFavorites.data.products)
          }
          if (userFavorites.data?.products) {
            // Add user favorites that aren't already in editorial
            const editorialIds = new Set(editorialFavorites.data?.products?.map(p => p.id) || [])
            allProducts.push(...userFavorites.data.products.filter(p => !editorialIds.has(p.id)))
          }
          if (popularProducts.data?.products) {
            // Add popular products that aren't already included
            const existingIds = new Set(allProducts.map(p => p.id))
            allProducts.push(...popularProducts.data.products.filter(p => !existingIds.has(p.id)))
          }
          
          return {
            data: {
              products: allProducts.slice(0, limit),
              total: allProducts.length,
              page: 1,
              totalPages: 1,
              source: 'mixed' as const
            },
            isLoading: editorialFavorites.isLoading || userFavorites.isLoading || popularProducts.isLoading,
            error: editorialFavorites.error || userFavorites.error || popularProducts.error
          }
        default:
          return editorialFavorites
      }
    }, [type, editorialFavorites, userFavorites, popularProducts, limit])

    const { data, isLoading, error } = queryResult
    const products = data?.products || []

    // Section title based on type
    const sectionTitle = React.useMemo(() => {
      if (title) return title
      
      switch (type) {
        case 'editorial':
          return 'Featured Products'
        case 'user_favorites':
          return 'Your Favorites'
        case 'analytics':
          return 'Popular Right Now'
        case 'mixed':
          return 'Recommended for You'
        default:
          return 'Favorite Products'
      }
    }, [type, title])

    // Section subtitle
    const sectionSubtitle = React.useMemo(() => {
      if (subtitle) return subtitle
      
      switch (type) {
        case 'editorial':
          return 'Hand-picked favorites from our menu'
        case 'user_favorites':
          return 'Products you\'ve saved for later'
        case 'analytics':
          return 'Most loved by our customers'
        case 'mixed':
          return 'A curated selection just for you'
        default:
          return 'Discover amazing products'
      }
    }, [type, subtitle])

    // Grid columns based on breakpoints
    const gridColumns = React.useMemo(() => {
      const { sm = 1, md = 2, lg = 3, xl = 4 } = columns
      return `grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`
    }, [columns])

    // Handle filter changes
    const handleFilterChange = React.useCallback((filterType: keyof typeof activeFilters, value: boolean) => {
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }))
    }, [])

    // Empty state content
    const renderEmptyState = () => (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            {emptyState?.title || 'No favorites yet'}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground max-w-sm">
            {emptyState?.description || 'Start exploring our menu to find products you\'ll love!'}
          </p>
          {emptyState?.showAddProducts && (
            <Button variant="outline" size="sm">
              Browse Products
            </Button>
          )}
        </CardContent>
      </Card>
    )

    // Loading state
    if (isLoading) {
      return (
        <section ref={ref} className={cn('w-full', className)} {...props}>
          {showTitle && (
            <Container>
              <div className="mb-8 text-center">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto mb-2" />
                <div className="h-4 w-64 bg-muted rounded animate-pulse mx-auto" />
              </div>
            </Container>
          )}
          <Container>
            <div className={cn(
              'grid gap-6',
              gridColumns
            )}>
              {Array.from({ length: limit }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )
    }

    // Error state
    if (error) {
      return (
        <section ref={ref} className={cn('w-full', className)} {...props}>
          <Container>
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="flex flex-col items-center justify-center py-8 px-6 text-center">
                <div className="mb-4 rounded-full bg-destructive/10 p-4">
                  <Heart className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-destructive">
                  Unable to load favorites
                </h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading the favorite products. Please try again later.
                </p>
              </CardContent>
            </Card>
          </Container>
        </section>
      )
    }

    return (
      <section ref={ref} className={cn('w-full', className)} {...props}>
        {/* Section Header */}
        {showTitle && (
          <Container>
            <div className="mb-8 text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{sectionTitle}</h2>
                <p className="text-muted-foreground text-lg">{sectionSubtitle}</p>
              </div>

              {/* Stats */}
              {data && (
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="secondary" className="text-xs">
                    {data.total} {data.total === 1 ? 'product' : 'products'}
                  </Badge>
                  {type === 'analytics' && (
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {type === 'editorial' && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Staff Pick
                    </Badge>
                  )}
                </div>
              )}

              {/* Filters and View Toggle */}
              {(showFilters || showViewToggle) && (
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {/* Filters */}
                  {showFilters && type === 'editorial' && (
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Button
                        variant={activeFilters.isFeatured ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('isFeatured', !activeFilters.isFeatured)}
                      >
                        Featured
                      </Button>
                      <Button
                        variant={activeFilters.isPopular ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('isPopular', !activeFilters.isPopular)}
                      >
                        Popular
                      </Button>
                      <Button
                        variant={activeFilters.isTrending ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('isTrending', !activeFilters.isTrending)}
                      >
                        Trending
                      </Button>
                    </div>
                  )}

                  {/* View Toggle */}
                  {showViewToggle && (
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant={currentLayout === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentLayout('grid')}
                        className="rounded-r-none"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={currentLayout === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentLayout('list')}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Separator className="mb-8" />
          </Container>
        )}

        {/* Products Grid */}
        <Container>
          {products.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className={cn(
              'grid gap-6',
              currentLayout === 'grid' ? gridColumns : 'grid-cols-1',
              currentLayout === 'list' && 'max-w-2xl mx-auto'
            )}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userId={userId}
                  sessionId={sessionId}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  size={size}
                  imageAspectRatio={currentLayout === 'list' ? 'wide' : 'square'}
                  className={cn(
                    currentLayout === 'list' && 'flex-row items-center max-w-none'
                  )}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    )
  }
)

FavoritesSection.displayName = 'FavoritesSection'

export { FavoritesSection }
export type { FavoritesSectionProps }