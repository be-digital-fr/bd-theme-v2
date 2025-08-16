'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number;
  isAvailable: boolean;
}

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  children?: React.ReactNode;
  onAddToCart?: (product: Product) => void;
}

export function AddToCartButton({
  product,
  className,
  children,
  onAddToCart
}: AddToCartButtonProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.isAvailable) {
      onAddToCart?.(product);
      // TODO: Implémenter la logique d'ajout au panier plus tard
      console.log('Ajout au panier:', product.name || product.title);
    }
  };

  return (
    <Button 
      className={cn(className)}
      disabled={!product.isAvailable}
      onClick={handleAddToCart}
      aria-label={`Add ${product.name || product.title} to cart`}
    >
      {children || (product.isAvailable ? 'Add to Cart' : 'Indisponible')}
    </Button>
  );
}