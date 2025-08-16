'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FavoriteButton, AddToCartButton } from '@/features/products/presentation/components';

interface Product {
  id: string;
  title: string;
  name?: string;
  shortDescription?: string;
  imageUrl?: string;
  image?: string;
  price: number;
  isAvailable: boolean;
  category?: {
    id: string;
    name: string;
  };
  rating?: number;
  preparationTime?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  reviews?: Array<{ rating: number }>;
}

interface PopularProductsSectionProps {
  products?: Product[];
  className?: string;
  showDescription?: boolean;
  onViewAll?: () => void;
  onProductClick?: (product: Product) => void;
  onAddToFavorites?: (product: Product) => void;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Burger Classic Deluxe',
    name: 'Burger Classic Deluxe',
    shortDescription: 'Pain brioche, steak haché 180g, cheddar, salade, tomate, oignon',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    price: 14.90,
    isAvailable: true,
    category: { id: '1', name: 'Burgers' },
    rating: 4.8,
    preparationTime: 15,
    isPopular: true,
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 4 }]
  },
  {
    id: '2',
    title: 'Pizza Margherita Artisanale',
    name: 'Pizza Margherita Artisanale',
    shortDescription: 'Base tomate, mozzarella di bufala, basilic frais, huile d\'olive',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    price: 16.50,
    isAvailable: true,
    category: { id: '2', name: 'Pizzas' },
    rating: 4.9,
    preparationTime: 12,
    isPopular: true,
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }]
  },
  {
    id: '3',
    title: 'Salade César Gourmet',
    name: 'Salade César Gourmet',
    shortDescription: 'Salade romaine, poulet grillé, parmesan, croûtons, sauce César maison',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    price: 13.20,
    isAvailable: true,
    category: { id: '3', name: 'Salades' },
    rating: 4.6,
    preparationTime: 8,
    isPopular: true,
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }]
  },
  {
    id: '4',
    title: 'Tacos Beef Supreme',
    name: 'Tacos Beef Supreme',
    shortDescription: 'Viande de bœuf marinée, guacamole, crème fraîche, fromage, salade',
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763ed1?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763ed1?w=400&h=300&fit=crop',
    price: 12.80,
    isAvailable: true,
    category: { id: '4', name: 'Mexicain' },
    rating: 4.7,
    preparationTime: 10,
    isPopular: true,
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }]
  },
  {
    id: '5',
    title: 'Sushi Mix Premium',
    name: 'Sushi Mix Premium',
    shortDescription: 'Assortiment de 12 sushis, saumon, thon, crevette, avocat',
    imageUrl: 'https://images.unsplash.com/photo-1563612492-3c9b59208d51?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1563612492-3c9b59208d51?w=400&h=300&fit=crop',
    price: 22.90,
    isAvailable: true,
    category: { id: '5', name: 'Japonais' },
    rating: 4.9,
    preparationTime: 20,
    isPopular: true,
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }]
  },
  {
    id: '6',
    title: 'Pasta Carbonara Traditionnelle',
    name: 'Pasta Carbonara Traditionnelle',
    shortDescription: 'Spaghetti, lardons fumés, œuf, parmesan, crème fraîche',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=400&h=300&fit=crop',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=400&h=300&fit=crop',
    price: 15.40,
    isAvailable: true,
    category: { id: '6', name: 'Pâtes' },
    rating: 4.5,
    preparationTime: 12,
    isPopular: true,
    reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 4 }]
  }
];

export function PopularProductsSection({
  products = MOCK_PRODUCTS,
  className,
  showDescription = false,
  onViewAll,
  onProductClick,
  onAddToFavorites
}: PopularProductsSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);


  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
  };

  const handleAddToFavorites = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToFavorites?.(product);
  };

  // Function to create product slug like in original
  const createSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  // Calculer le pourcentage de progression
  const progressPercentage = count > 0 ? ((current - 1) / (count - 1)) * 100 : 0;

  return (
    <section className={cn('py-16 bg-background', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
            Explorez les meilleurs restaurants et les repas tendance
          </h2>
          <Button 
            variant="outline" 
            onClick={onViewAll}
            className="hidden md:flex shrink-0"
          >
            Voir tout
          </Button>
        </div>

        {/* Carrousel */}
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                {/* Using the default card design from the GitHub repository */}
                <Card
                  className="max-w-96 w-full mx-auto md:max-w-80 bg-transparent border-none shadow-none relative"
                  role="article"
                  aria-label={`Product card for ${product.name || product.title}`}
                >
                  {/* Favorite button in top right corner */}
                  <FavoriteButton
                    productId={product.id}
                    productName={product.name || product.title}
                    className="absolute top-8 right-2 z-10"
                    onToggleFavorite={(_productId, _isFavorite) => {
                      // Adapter pour l'interface existante
                      const mockEvent = { stopPropagation: () => {} } as React.MouseEvent;
                      handleAddToFavorites(mockEvent, product);
                    }}
                  />
                  
                  <CardContent className="p-0">
                    {/* Main container with image and information */}
                    <div className="relative bg-card rounded-2xl w-full py-4 pb-10 px-4">
                      {/* Product image with link */}
                      <Link 
                        href={`/products/${createSlug(product.name || product.title)}`} 
                        className="block"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative w-full h-56">
                          <Image
                            src={product.image || product.imageUrl || ''}
                            alt={`Image of ${product.name || product.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                            className="object-contain"
                            priority
                          />
                        </div>

                        {/* Information bar at bottom of image */}
                        <div
                          className="w-full px-4 flex items-center justify-between absolute bottom-4 left-1/2 -translate-x-1/2"
                          role="group"
                          aria-label="Product information"
                        >
                          {/* Display average rating and number of reviews */}
                          <div
                            className="flex items-center gap-1"
                            role="group"
                            aria-label="Rating information"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-primary-dark rounded-full size-5 p-3"
                              aria-label="Rating star"
                            >
                              <Star fill="white" className="text-white" />
                            </Button>
                            <span
                              className="text-sm font-medium"
                              aria-label={`Rating: ${product.rating || (
                                product.reviews?.length > 0
                                  ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
                                  : '0.0'
                              )} out of 5`}
                            >
                              {product.rating || (
                                product.reviews?.length > 0
                                  ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
                                  : '0.0'
                              )}
                            </span>
                            <span
                              className="text-xs text-black/60"
                              aria-label={`${product.reviews?.length || 0} reviews`}
                            >
                              ({product.reviews?.length || 0})
                            </span>
                          </div>

                          {/* Preparation time */}
                          <div
                            className="flex items-center gap-1"
                            role="group"
                            aria-label="Preparation time"
                          >
                            <span className="text-sm font-medium">
                              ~{product.preparationTime || 0}
                            </span>
                            <span className="text-xs text-black/60"> mins</span>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Card footer with name and actions */}
                    <CardFooter className="flex flex-col gap-2 items-start p-0 mt-4">
                      <Link 
                        href={`/products/${createSlug(product.name || product.title)}`}
                        onClick={() => handleProductClick(product)}
                      >
                        <h2
                          className="text-md font-medium"
                          id={`product-name-${product.id}`}
                        >
                          {product.name || product.title}
                        </h2>
                      </Link>

                      {/* Description conditionnelle */}
                      {showDescription && product.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}

                      {/* Action buttons and price display */}
                      <div
                        className="w-full flex items-center justify-between gap-1"
                        role="group"
                        aria-label="Product actions"
                      >
                        <AddToCartButton
                          product={product}
                          onAddToCart={(product) => {
                            console.log('Product added to cart:', product);
                            // TODO: Logique d'ajout au panier à implémenter plus tard
                          }}
                        />
                        <p
                          data-testid={`product-price-${product.name || product.title}`}
                          className="text-primary-dark"
                          aria-label={`Price: ${product.price} euros`}
                        >
                          {product.price} €
                        </p>
                      </div>
                    </CardFooter>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation avec style personnalisé */}
          <CarouselPrevious className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary -left-12 hidden md:flex" />
          <CarouselNext className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary -right-12 hidden md:flex" />
        </Carousel>

        {/* Contrôles du carousel réorganisés */}
        <div className="mt-6 space-y-4">
          {/* Navigation mobile uniquement */}
          <div className="flex items-center justify-center gap-4 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => api?.scrollPrev()}
              className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => api?.scrollNext()}
              className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Button>
          </div>

          {/* Contrôles desktop : Précédent | Progress Bar | Suivant */}
          <div className="hidden md:flex items-center gap-4">
            {/* Bouton précédent à gauche */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => api?.scrollPrev()}
              className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Button>
            
            {/* Progress Bar au centre */}
            <div className="flex-1">
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-muted"
              />
            </div>
            
            {/* Bouton suivant à droite */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => api?.scrollNext()}
              className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Button>
          </div>

          {/* Indicateur de position centré */}
          <div className="text-center text-sm text-muted-foreground">
            {current} / {count}
          </div>
        </div>

        {/* Bouton mobile pour voir tout */}
        <div className="flex justify-center mt-6 md:hidden">
          <Button onClick={onViewAll} className="w-full max-w-xs">
            Voir tout
          </Button>
        </div>
      </div>
    </section>
  );
}