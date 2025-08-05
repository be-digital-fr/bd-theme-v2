'use client'

import * as React from 'react'
import Image from 'next/image'
import { Heart, Clock, ShoppingBag, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { 
  useAutoTrackProductView, 
  useIsProductFavorited, 
  useUserFavoriteMutations 
} from '@/features/products'
import type { Product, PromotionBadge } from '@/features/products'

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  userId?: string
  sessionId?: string
  showFavoriteButton?: boolean
  showAddToCart?: boolean
  onAddToCart?: (product: Product) => void
  onProductClick?: (product: Product) => void
  imageAspectRatio?: 'square' | 'wide' | 'tall'
  size?: 'sm' | 'default' | 'lg'
  trackViews?: boolean
}

/**
 * ProductCard component displaying product information with favorite and cart functionality
 * 
 * Features:
 * - Product image with fallback
 * - Promotion badges (featured, popular, trending, custom)
 * - Favorite toggle with optimistic updates
 * - Price and preparation time display
 * - Availability status
 * - View tracking
 * - Responsive design
 */
const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({
    product,
    userId,
    sessionId,
    showFavoriteButton = true,
    showAddToCart = true,
    onAddToCart,
    onProductClick,
    imageAspectRatio = 'square',
    size = 'default',
    trackViews = true,
    className,
    ...props
  }, ref) => {
    const {
      id,
      title,
      shortDescription,
      price,
      imageUrl,
      isAvailable,
      preparationTime,
      isFeatured,
      isPopular,
      isTrending,
      promotionBadge,
      popularityScore
    } = product

    // Track product view when card is viewed
    useAutoTrackProductView(
      id,
      userId,
      sessionId,
      { 
        enabled: trackViews,
        delay: 2000 // Track after 2 seconds of viewing
      }
    )

    // Check if product is favorited
    const { data: isFavorited = false } = useIsProductFavorited(id, userId)

    // Favorite mutations
    const { addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = 
      useUserFavoriteMutations(userId)

    // Handle favorite toggle
    const handleFavoriteClick = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (!userId) {
        // Could show login modal or redirect to login
        console.warn('User must be logged in to favorite products')
        return
      }

      if (isFavorited) {
        removeFavorite.mutate({ userId, productId: id })
      } else {
        addFavorite.mutate({ userId, productId: id })
      }
    }, [isFavorited, userId, id, addFavorite, removeFavorite])

    // Handle add to cart
    const handleAddToCart = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onAddToCart?.(product)
    }, [onAddToCart, product])

    // Handle product click
    const handleProductClick = React.useCallback(() => {
      onProductClick?.(product)
    }, [onProductClick, product])

    // Generate promotion badges
    const badges = React.useMemo(() => {
      const badgeList: Array<{ text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = []

      if (isFeatured) {
        badgeList.push({ text: '⭐ Featured', variant: 'default' })
      }
      if (isPopular) {
        badgeList.push({ text: '🔥 Popular', variant: 'secondary' })
      }
      if (isTrending) {
        badgeList.push({ text: '📈 Trending', variant: 'outline' })
      }

      // Custom promotion badge
      if (promotionBadge?.isVisible && promotionBadge.text) {
        const variant = getPromotionBadgeVariant(promotionBadge.color)
        badgeList.push({ text: promotionBadge.text, variant })
      }

      return badgeList
    }, [isFeatured, isPopular, isTrending, promotionBadge])

    // Size-based styling
    const sizeStyles = {
      sm: {
        card: 'w-full max-w-[280px]',
        image: 'h-32',
        title: 'text-sm font-medium',
        description: 'text-xs',
        price: 'text-sm font-semibold',
        badge: 'text-[10px] px-1.5 py-0.5',
        button: 'h-7 px-2 text-xs'
      },
      default: {
        card: 'w-full max-w-[320px]',
        image: 'h-40',
        title: 'text-base font-semibold',
        description: 'text-sm',
        price: 'text-lg font-bold',
        badge: 'text-xs',
        button: 'h-8 px-3 text-sm'
      },
      lg: {
        card: 'w-full max-w-[380px]',
        image: 'h-48',
        title: 'text-lg font-bold',
        description: 'text-base',
        price: 'text-xl font-bold',
        badge: 'text-sm',
        button: 'h-9 px-4'
      }
    }

    const currentSize = sizeStyles[size]

    // Image aspect ratio styles
    const aspectRatioStyles = {
      square: 'aspect-square',
      wide: 'aspect-[4/3]',
      tall: 'aspect-[3/4]'
    }

    return (
      <Card
        ref={ref}
        className={cn(
          'group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
          'border-border/50 hover:border-border',
          !isAvailable && 'opacity-60',
          currentSize.card,
          className
        )}
        onClick={handleProductClick}
        {...props}
      >
        {/* Product Image */}
        <CardHeader className="p-0 relative overflow-hidden">
          <div className={cn(
            'relative w-full overflow-hidden rounded-t-lg bg-muted',
            currentSize.image,
            aspectRatioStyles[imageAspectRatio]
          )}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title || 'Product image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            {/* Availability overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className={currentSize.badge}>
                  Unavailable
                </Badge>
              </div>
            )}

            {/* Promotion badges */}
            {badges.length > 0 && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant}
                    className={cn(currentSize.badge, 'shadow-sm')}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}

            {/* Favorite button */}
            {showFavoriteButton && userId && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm',
                  'hover:bg-background transition-all duration-200',
                  'opacity-0 group-hover:opacity-100'
                )}
                onClick={handleFavoriteClick}
                disabled={isAddingFavorite || isRemovingFavorite}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-colors duration-200',
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
                  )}
                />
              </Button>
            )}

            {/* Popularity score indicator */}
            {popularityScore && popularityScore > 80 && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className={cn(currentSize.badge, 'bg-yellow-100 text-yellow-800')}>
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Hot
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Product Information */}
        <CardContent className="p-4 space-y-3">
          {/* Title and Description */}
          <div className="space-y-1">
            <h3 className={cn(
              'line-clamp-2 leading-tight text-foreground',
              currentSize.title
            )}>
              {title || 'Untitled Product'}
            </h3>
            {shortDescription && (
              <p className={cn(
                'line-clamp-2 text-muted-foreground leading-relaxed',
                currentSize.description
              )}>
                {shortDescription}
              </p>
            )}
          </div>

          {/* Price and Preparation Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn('text-primary', currentSize.price)}>
                €{typeof price === 'number' ? price.toFixed(2) : price}
              </span>
              {preparationTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{preparationTime}min</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {showAddToCart && onAddToCart && isAvailable && (
            <Button
              variant="default"
              size="sm"
              className={cn('w-full', currentSize.button)}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
)

ProductCard.displayName = 'ProductCard'

/**
 * Helper function to map promotion badge colors to badge variants
 */
function getPromotionBadgeVariant(color: PromotionBadge['color']): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (color) {
    case 'primary':
      return 'default'
    case 'secondary':
      return 'secondary'
    case 'destructive':
    case 'warning':
      return 'destructive'
    case 'success':
      return 'secondary'
    default:
      return 'outline'
  }
}

export { ProductCard }