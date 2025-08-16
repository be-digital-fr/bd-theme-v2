'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface FavoriteButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string, isFavorite: boolean) => void;
}

export function FavoriteButton({
  productId,
  productName,
  className,
  isFavorite = false,
  onToggleFavorite
}: FavoriteButtonProps) {
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = React.useState(isFavorite);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavoriteState = !isCurrentlyFavorite;
    setIsCurrentlyFavorite(newFavoriteState);
    onToggleFavorite?.(productId, newFavoriteState);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full transition-colors",
        className
      )}
      onClick={handleToggle}
      aria-label={`${isCurrentlyFavorite ? 'Remove' : 'Add'} ${productName || 'product'} ${isCurrentlyFavorite ? 'from' : 'to'} favorites`}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors",
          isCurrentlyFavorite 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600 hover:text-red-500"
        )} 
      />
    </Button>
  );
}