'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Star, 
  Users, 
  TrendingUp, 
  Search, 
  ArrowLeft, 
  Save,
  Package,
  Filter,
  CheckCircle,
  Circle
} from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';
import { toast } from 'sonner';
import { SentryFormErrorCapture } from '@/lib/sentry-form-errors';

interface Product {
  id: string;
  title: string;
  shortDescription?: string;
  imageUrl?: string;
  price: number;
  isAvailable: boolean;
  category?: { name: string };
  isFeatured?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
}

interface CollectionConfig {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fieldName: 'isFeatured' | 'isPopular' | 'isTrending';
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  featured: {
    name: 'Produits mise en avant',
    description: 'Produits recommandés et mis en valeur sur la page d\'accueil',
    icon: <Star className="h-5 w-5" />,
    color: 'bg-yellow-500',
    fieldName: 'isFeatured',
  },
  popular: {
    name: 'Produits populaires', 
    description: 'Produits les plus commandés et appréciés par les clients',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-blue-500',
    fieldName: 'isPopular',
  },
  trending: {
    name: 'Produits tendance',
    description: 'Produits actuellement en vogue et nouveautés populaires',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-green-500',
    fieldName: 'isTrending',
  },
};

interface CollectionManagePageProps {
  collection: string;
}

export function CollectionManagePage({ collection }: CollectionManagePageProps) {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const config = COLLECTIONS[collection];

  // Configure header
  useEffect(() => {
    if (!config) {
      return;
    }
    setHeader({
      title: config.name,
      description: `Sélectionnez les produits à inclure dans la collection "${config.name}".`,
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Collections', href: '/admin/collections' },
        { label: config.name, href: `/admin/collections/${collection}` },
      ],
      actions: [
        {
          id: 'back',
          label: 'Retour',
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />,
          onClick: () => router.push('/admin/collections'),
        },
        {
          id: 'save',
          label: saving ? 'Enregistrement...' : 'Enregistrer',
          variant: 'default',
          icon: <Save className="h-4 w-4" />,
          onClick: handleSave,
          disabled: saving,
        },
      ],
    });

    return () => reset();
  }, [setHeader, reset, config, collection, router, saving]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/store/products?limit=100');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des produits');
        }

        const data = await response.json();
        setProducts(data.products || []);
        
        // Initialize selected products based on current collection status
        const selected = new Set<string>();
        data.products?.forEach((product: Product) => {
          if (product[config.fieldName]) {
            selected.add(product.id);
          }
        });
        setSelectedProducts(selected);
        
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    if (config) {
      loadProducts();
    }
  }, [config]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (saving) return;
    
    setSaving(true);
    
    try {
      const updates = products.map(product => ({
        id: product.id,
        [config.fieldName]: selectedProducts.has(product.id),
      }));

      const response = await fetch('/api/store/products/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || 'Erreur lors de la mise à jour');
        
        // Capturer l'erreur avec Sentry
        SentryFormErrorCapture.captureFormError(error, {
          formType: 'update',
          entityType: 'collection',
          entityId: collection,
          formData: { updates, selectedCount: selectedProducts.size }
        });
        
        throw error;
      }

      // Capturer le succès pour monitoring
      SentryFormErrorCapture.captureFormSuccess({
        formType: 'update',
        entityType: 'collection',
        entityId: collection
      });

      toast.success(`Collection "${config.name}" mise à jour avec succès`);
      
      // Update products state
      setProducts(prev => prev.map(product => ({
        ...product,
        [config.fieldName]: selectedProducts.has(product.id),
      })));
      
    } catch (error) {
      console.error('Error saving collection:', error);
      
      // Capturer l'erreur si elle n'a pas déjà été capturée
      if (error instanceof Error && !error.message.includes('Erreur lors de la mise à jour')) {
        SentryFormErrorCapture.captureFormError(error, {
          formType: 'update',
          entityType: 'collection',
          entityId: collection,
          formData: { updates, selectedCount: selectedProducts.size }
        });
      }
      
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }, [saving, products, selectedProducts, config]);

  // Early return if config is invalid - after all hooks
  if (!config) {
    return <div>Collection non trouvée</div>;
  }

  // Toggle product selection
  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Select all filtered products
  const selectAll = () => {
    const filteredProductIds = filteredProducts.map(p => p.id);
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      filteredProductIds.forEach(id => newSet.add(id));
      return newSet;
    });
  };

  // Deselect all filtered products
  const deselectAll = () => {
    const filteredProductIds = new Set(filteredProducts.map(p => p.id));
    setSelectedProducts(prev => {
      const newSet = new Set();
      prev.forEach(id => {
        if (!filteredProductIds.has(id)) {
          newSet.add(id);
        }
      });
      return newSet;
    });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !showOnlySelected || selectedProducts.has(product.id);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-48">
              <div className="text-center space-y-2">
                <Package className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Chargement des produits...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.color}/10`}>
              {config.icon}
            </div>
            <div>
              <CardTitle>{config.name}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background">
                {selectedProducts.size} produit{selectedProducts.size > 1 ? 's' : ''} sélectionné{selectedProducts.size > 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="text-muted-foreground">
              sur {products.length} produit{products.length > 1 ? 's' : ''} au total
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-only-selected"
                  checked={showOnlySelected}
                  onCheckedChange={setShowOnlySelected}
                />
                <label htmlFor="show-only-selected" className="text-sm">
                  Afficher seulement les sélectionnés
                </label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Tout sélectionner
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Tout désélectionner
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`relative cursor-pointer transition-all ${
              selectedProducts.has(product.id) 
                ? 'ring-2 ring-primary shadow-md' 
                : 'hover:shadow-md'
            }`}
            onClick={() => toggleProduct(product.id)}
          >
            <CardContent className="p-4">
              {/* Selection indicator */}
              <div className="absolute top-2 right-2">
                {selectedProducts.has(product.id) ? (
                  <CheckCircle className="h-5 w-5 text-primary fill-current" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Product Image */}
              {product.imageUrl && (
                <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm leading-tight line-clamp-2">
                  {product.title}
                </h3>
                
                {product.shortDescription && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.shortDescription}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {product.price.toFixed(2)} €
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <Badge 
                  variant={product.isAvailable ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {product.isAvailable ? 'Disponible' : 'Indisponible'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Aucun produit ne correspond à votre recherche.'
                  : showOnlySelected 
                    ? 'Aucun produit sélectionné.'
                    : 'Aucun produit disponible.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}