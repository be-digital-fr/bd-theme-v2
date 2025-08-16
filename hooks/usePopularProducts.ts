import { useQuery } from '@tanstack/react-query';

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
  isTrending?: boolean;
}

interface PopularProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}

interface UsePopularProductsOptions {
  limit?: number;
  enabled?: boolean;
}

async function fetchPopularProducts(limit: number = 12): Promise<Product[]> {
  const response = await fetch(`/api/store/products?isPopular=true&limit=${limit}&sort=popular`);
  
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des produits populaires');
  }
  
  const data: PopularProductsResponse = await response.json();
  
  if (!data.success) {
    throw new Error('Erreur dans la réponse API');
  }
  
  return data.data.products;
}

export function usePopularProducts(options: UsePopularProductsOptions = {}) {
  const { limit = 12, enabled = true } = options;
  
  return useQuery({
    queryKey: ['popular-products', limit],
    queryFn: () => fetchPopularProducts(limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook pour récupérer tous les types de produits en vedette
export function useFeaturedProducts(options: UsePopularProductsOptions = {}) {
  const { limit = 12, enabled = true } = options;
  
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      const response = await fetch(`/api/store/products?featured=true&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits en vedette');
      }
      
      const data: PopularProductsResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Erreur dans la réponse API');
      }
      
      return data.data.products;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Hook pour récupérer les produits tendance
export function useTrendingProducts(options: UsePopularProductsOptions = {}) {
  const { limit = 12, enabled = true } = options;
  
  return useQuery({
    queryKey: ['trending-products', limit],
    queryFn: async () => {
      const response = await fetch(`/api/store/products?isTrending=true&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits tendance');
      }
      
      const data: PopularProductsResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Erreur dans la réponse API');
      }
      
      return data.data.products;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}