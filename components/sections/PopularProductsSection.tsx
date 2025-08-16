'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Star, Clock, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
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
}

interface PopularProductsSectionProps {
  products?: Product[];
  className?: string;
  onViewAll?: () => void;
  onProductClick?: (product: Product) => void;
  onAddToFavorites?: (product: Product) => void;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Burger Classic Deluxe',
    shortDescription: 'Pain brioche, steak haché 180g, cheddar, salade, tomate, oignon',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    price: 14.90,
    isAvailable: true,
    category: { id: '1', name: 'Burgers' },
    rating: 4.8,
    preparationTime: 15,
    isPopular: true
  },
  {
    id: '2',
    title: 'Pizza Margherita Artisanale',
    shortDescription: 'Base tomate, mozzarella di bufala, basilic frais, huile d\'olive',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    price: 16.50,
    isAvailable: true,
    category: { id: '2', name: 'Pizzas' },
    rating: 4.9,
    preparationTime: 12,
    isPopular: true
  },
  {
    id: '3',
    title: 'Salade César Gourmet',
    shortDescription: 'Salade romaine, poulet grillé, parmesan, croûtons, sauce César maison',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    price: 13.20,
    isAvailable: true,
    category: { id: '3', name: 'Salades' },
    rating: 4.6,
    preparationTime: 8,
    isPopular: true
  },
  {
    id: '4',
    title: 'Tacos Beef Supreme',
    shortDescription: 'Viande de bœuf marinée, guacamole, crème fraîche, fromage, salade',
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763ed1?w=400&h=300&fit=crop',
    price: 12.80,
    isAvailable: true,
    category: { id: '4', name: 'Mexicain' },
    rating: 4.7,
    preparationTime: 10,
    isPopular: true
  },
  {
    id: '5',
    title: 'Sushi Mix Premium',
    shortDescription: 'Assortiment de 12 sushis, saumon, thon, crevette, avocat',
    imageUrl: 'https://images.unsplash.com/photo-1563612492-3c9b59208d51?w=400&h=300&fit=crop',
    price: 22.90,
    isAvailable: true,
    category: { id: '5', name: 'Japonais' },
    rating: 4.9,
    preparationTime: 20,
    isPopular: true
  },
  {
    id: '6',
    title: 'Pasta Carbonara Traditionnelle',
    shortDescription: 'Spaghetti, lardons fumés, œuf, parmesan, crème fraîche',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=400&h=300&fit=crop',
    price: 15.40,
    isAvailable: true,
    category: { id: '6', name: 'Pâtes' },
    rating: 4.5,
    preparationTime: 12,
    isPopular: true
  }
];

export function PopularProductsSection({
  products = MOCK_PRODUCTS,
  className,
  onViewAll,
  onProductClick,
  onAddToFavorites
}: PopularProductsSectionProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Nombre de produits visibles selon la taille d'écran
  const [itemsPerView, setItemsPerView] = React.useState(4);

  React.useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 768) {
        setItemsPerView(2);
      } else if (width < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Auto-play du carrousel
  React.useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
  };

  const handleAddToFavorites = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToFavorites?.(product);
  };

  // Calculer le pourcentage de progression
  const progressPercentage = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

  return (
    <section className={cn('py-16 bg-background', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
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

        {/* Carrousel Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Produits */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  'flex-shrink-0 px-2',
                  itemsPerView === 1 && 'w-full',
                  itemsPerView === 2 && 'w-1/2',
                  itemsPerView === 3 && 'w-1/3',
                  itemsPerView === 4 && 'w-1/4'
                )}
              >
                <Card
                  className="max-w-96 w-full mx-auto md:max-w-80 bg-transparent border-none shadow-none relative"
                  role="article"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Pas d'image</span>
                      </div>
                    )}

                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isPopular && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          Populaire
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge variant="secondary">
                          Recommandé
                        </Badge>
                      )}
                    </div>

                    {/* Bouton favoris */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                      onClick={(e) => handleAddToFavorites(e, product)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {/* Catégorie */}
                      {product.category && (
                        <Badge variant="outline" className="text-xs">
                          {product.category.name}
                        </Badge>
                      )}

                      {/* Titre */}
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Description */}
                      {product.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}

                      {/* Rating et temps */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        )}
                        {product.preparationTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{product.preparationTime} min</span>
                          </div>
                        )}
                      </div>

                      {/* Prix */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xl font-bold text-primary">
                          {product.price.toFixed(2)} €
                        </span>
                        <Button size="sm" disabled={!product.isAvailable}>
                          {product.isAvailable ? 'Ajouter' : 'Indisponible'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Contrôles et indicateurs */}
        <div className="mt-6 space-y-4">
          {/* Flèches de navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <Progress
              value={progressPercentage}
              className="h-2 bg-muted"
              style={{
                '--progress-background': 'hsl(var(--primary))',
              } as React.CSSProperties}
            />
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