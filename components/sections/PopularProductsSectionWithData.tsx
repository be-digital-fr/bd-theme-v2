'use client';

import * as React from 'react';
import { PopularProductsSection } from './PopularProductsSection';
import { usePopularProducts } from '@/hooks/usePopularProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PopularProductsSectionWithDataProps {
  limit?: number;
  className?: string;
  onViewAll?: () => void;
  onProductClick?: (product: any) => void;
  onAddToFavorites?: (product: any) => void;
}

export function PopularProductsSectionWithData({
  limit = 12,
  className,
  onViewAll,
  onProductClick,
  onAddToFavorites
}: PopularProductsSectionWithDataProps) {
  const { 
    data: products, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = usePopularProducts({ limit });

  // Composant de loading skeleton
  const LoadingSkeleton = () => (
    <section className={className}>
      <div className="container mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-9 w-96" />
          <Skeleton className="h-10 w-24 hidden md:block" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls skeleton */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </section>
  );

  // Composant d'erreur
  const ErrorState = () => (
    <section className={className}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Explorez les meilleurs restaurants et les repas tendance
          </h2>
          <Button 
            variant="outline" 
            onClick={onViewAll}
            className="hidden md:flex"
          >
            Voir tout
          </Button>
        </div>

        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Impossible de charger les produits populaires. 
              {error instanceof Error ? ` ${error.message}` : ''}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="ml-4"
            >
              {isRefetching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Réessayer'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );

  // État vide
  const EmptyState = () => (
    <section className={className}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Explorez les meilleurs restaurants et les repas tendance
          </h2>
          <Button 
            variant="outline" 
            onClick={onViewAll}
            className="hidden md:flex"
          >
            Voir tout
          </Button>
        </div>

        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun produit populaire
          </h3>
          <p className="text-muted-foreground mb-4">
            Il n'y a actuellement aucun produit marqué comme populaire.
          </p>
          <Button onClick={onViewAll} variant="outline">
            Voir tous les produits
          </Button>
        </div>
      </div>
    </section>
  );

  // Rendu conditionnel
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <PopularProductsSection
      products={products}
      className={className}
      onViewAll={onViewAll}
      onProductClick={onProductClick}
      onAddToFavorites={onAddToFavorites}
    />
  );
}