'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaginationStore } from '@/stores/usePaginationStore';
import { PaginationControls } from '@/components/admin/shared/PaginationControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Package, 
  Users, 
  BarChart3,
  Settings
} from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  productCount: number;
  fieldName: 'isFeatured' | 'isPopular' | 'isTrending';
  color: 'default' | 'secondary' | 'destructive' | 'outline';
}

const SPECIAL_COLLECTIONS: Collection[] = [
  {
    id: 'featured',
    name: 'Produits mise en avant',
    description: 'Produits recommandés et mis en valeur sur la page d\'accueil',
    icon: <Star className="h-5 w-5" />,
    isActive: true,
    productCount: 0,
    fieldName: 'isFeatured',
    color: 'default',
  },
  {
    id: 'popular',
    name: 'Produits populaires',
    description: 'Produits les plus commandés et appréciés par les clients',
    icon: <Users className="h-5 w-5" />,
    isActive: true,
    productCount: 0,
    fieldName: 'isPopular',
    color: 'secondary',
  },
  {
    id: 'trending',
    name: 'Produits tendance',
    description: 'Produits actuellement en vogue et nouveautés populaires',
    icon: <TrendingUp className="h-5 w-5" />,
    isActive: true,
    productCount: 0,
    fieldName: 'isTrending',
    color: 'outline',
  },
];

export function CollectionsPage() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();
  const [collections, setCollections] = useState<Collection[]>(SPECIAL_COLLECTIONS);
  const [loading, setLoading] = useState(true);
  const { setTotalItems, getPaginationParams, reset: resetPagination } = usePaginationStore();
  
  // Initialize pagination
  useEffect(() => {
    resetPagination(10);
  }, [resetPagination]);

  const { page, limit } = getPaginationParams();

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Collections spéciales',
      description: 'Gérez les collections de produits pour organiser votre catalogue par thème marketing.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Collections', href: '/admin/collections' },
      ],
      actions: [],
    });

    return () => reset();
  }, [setHeader, reset]);

  // Load product counts for each collection
  useEffect(() => {
    const loadProductCounts = async () => {
      try {
        setLoading(true);
        
        const counts = await Promise.all([
          // Featured products
          fetch(`/api/store/products?isFeatured=true&limit=${limit}&page=${page}`).then(res => res.json()),
          // Popular products  
          fetch(`/api/store/products?isPopular=true&limit=${limit}&page=${page}`).then(res => res.json()),
          // Trending products
          fetch(`/api/store/products?isTrending=true&limit=${limit}&page=${page}`).then(res => res.json()),
        ]);

        setCollections(prev => prev.map((collection, index) => ({
          ...collection,
          productCount: counts[index]?.data?.total || counts[index]?.total || 0,
        })));
        
        // Set total items for pagination (sum of all collections)
        const totalItems = counts.reduce((acc, count) => acc + (count?.data?.total || count?.total || 0), 0);
        setTotalItems(totalItems);
      } catch (error) {
        console.error('Error loading product counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductCounts();
  }, [page, limit, setTotalItems]);

  // Toggle collection active status
  const toggleCollection = async (collectionId: string, isActive: boolean) => {
    try {
      // In a real implementation, you might want to store collection settings
      // For now, we'll just update the UI state
      setCollections(prev => 
        prev.map(collection => 
          collection.id === collectionId 
            ? { ...collection, isActive: !isActive }
            : collection
        )
      );
      
      toast.success(
        isActive 
          ? 'Collection désactivée' 
          : 'Collection activée'
      );
    } catch (error) {
      console.error('Error toggling collection:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  // Navigate to manage products in collection
  const manageCollection = (collection: Collection) => {
    router.push(`/admin/collections/manage?collection=${collection.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className={`relative ${!collection.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {collection.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <Badge variant={collection.color} className="mt-1">
                      {loading ? '...' : <><span className="font-bold">{collection.productCount}</span> produits</>}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={collection.isActive}
                  onCheckedChange={() => toggleCollection(collection.id, collection.isActive)}
                />
              </div>
              <CardDescription>{collection.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>
                  {loading 
                    ? 'Chargement...' 
                    : <><span className="font-bold">{collection.productCount}</span> produit{collection.productCount > 1 ? 's' : ''} dans cette collection</>
                  }
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => manageCollection(collection)}
                  disabled={!collection.isActive}
                >
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Comment utiliser les collections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-semibold text-base">Mise en avant</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mettez en valeur vos <strong>plats signature</strong>, nouveautés et promotions spéciales sur la page d'accueil.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-base">Populaires</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Marquez vos <strong>best-sellers</strong> et plats les plus appréciés pour guider les nouveaux clients.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-base">Tendance</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identifiez les <strong>nouveautés</strong>, plats saisonniers et créations du chef qui font sensation.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">💡 Astuce Marketing</p>
                  <p className="text-sm text-blue-800">
                    Utilisez ces collections pour créer des <strong>sections dédiées</strong> sur votre site et augmenter la visibilité de vos produits phares.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <PaginationControls showPageSizeSelector={false} />
    </div>
  );
}

