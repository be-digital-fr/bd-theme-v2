'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Search,
  ArrowLeft,
  Package,
  Plus,
  Minus,
  Check,
  X
} from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';
import { toast } from 'sonner';
import { Product } from '@/features/products/domain/schemas/ProductSchemas';

interface CollectionInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fieldName: 'isFeatured' | 'isPopular' | 'isTrending';
  color: 'default' | 'secondary' | 'destructive' | 'outline';
}

const COLLECTIONS_INFO: Record<string, CollectionInfo> = {
  featured: {
    id: 'featured',
    name: 'Produits mise en avant',
    description: 'Produits recommandés et mis en valeur sur la page d\'accueil',
    icon: <Star className="h-5 w-5" />,
    fieldName: 'isFeatured',
    color: 'default',
  },
  popular: {
    id: 'popular',
    name: 'Produits populaires',
    description: 'Produits les plus commandés et appréciés par les clients',
    icon: <Users className="h-5 w-5" />,
    fieldName: 'isPopular',
    color: 'secondary',
  },
  trending: {
    id: 'trending',
    name: 'Produits tendance',
    description: 'Produits actuellement en vogue et nouveautés populaires',
    icon: <TrendingUp className="h-5 w-5" />,
    fieldName: 'isTrending',
    color: 'outline',
  },
};

export function CollectionManagerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('collection') || 'featured';
  const { setHeader, reset } = usePageHeader();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const collection = COLLECTIONS_INFO[collectionId];

  // Configure header
  useEffect(() => {
    if (!collection) return;

    const productCountText = loading ? 'Chargement...' : `${collectionProducts.length} produit${collectionProducts.length > 1 ? 's' : ''}`;

    setHeader({
      title: `Gérer - ${collection.name}`,
      description: `${collection.description} • ${productCountText}`,
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Collections', href: '/admin/collections' },
        { label: collection.name, href: `/admin/collections/manage?collection=${collectionId}` },
      ],
      actions: [
        {
          id: 'back',
          label: 'Retour aux collections',
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />,
          onClick: () => router.push('/admin/collections'),
        },
      ],
    });

    return () => reset();
  }, [setHeader, reset, collection, collectionId, router, collectionProducts.length, loading]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Load all products
        const allResponse = await fetch('/api/store/products?limit=100');
        const allData = await allResponse.json();
        
        if (allData.success) {
          const products = allData.data.products;
          setAllProducts(products);
          
          // Filter products in collection
          const inCollection = products.filter((product: Product) => 
            product[collection.fieldName] === true
          );
          setCollectionProducts(inCollection);
          
          // Filter available products (not in collection)
          const available = products.filter((product: Product) => 
            !product[collection.fieldName]
          );
          setAvailableProducts(available);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    if (collection) {
      loadProducts();
    }
  }, [collection]);

  // Filter available products by search term
  const filteredAvailableProducts = availableProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add products to collection
  const addToCollection = async (productIds: string[]) => {
    if (productIds.length === 0) return;

    try {
      setSaving(true);
      
      const updates = productIds.map(id => ({
        id,
        [collection.fieldName]: true
      }));

      const response = await fetch('/api/store/products/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update products');
      }

      // Update local state
      const updatedProducts = productIds.map(id => 
        availableProducts.find(p => p.id === id)!
      );
      
      setCollectionProducts(prev => [...prev, ...updatedProducts]);
      setAvailableProducts(prev => 
        prev.filter(p => !productIds.includes(p.id))
      );
      setSelectedProducts(new Set());

      toast.success(`${productIds.length} produit${productIds.length > 1 ? 's' : ''} ajouté${productIds.length > 1 ? 's' : ''} à la collection`);
    } catch (error) {
      console.error('Error adding products to collection:', error);
      toast.error('Erreur lors de l\'ajout des produits');
    } finally {
      setSaving(false);
    }
  };

  // Remove products from collection
  const removeFromCollection = async (productIds: string[]) => {
    if (productIds.length === 0) return;

    try {
      setSaving(true);
      
      const updates = productIds.map(id => ({
        id,
        [collection.fieldName]: false
      }));

      const response = await fetch('/api/store/products/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update products');
      }

      // Update local state
      const removedProducts = productIds.map(id => 
        collectionProducts.find(p => p.id === id)!
      );
      
      setAvailableProducts(prev => [...prev, ...removedProducts]);
      setCollectionProducts(prev => 
        prev.filter(p => !productIds.includes(p.id))
      );

      toast.success(`${productIds.length} produit${productIds.length > 1 ? 's' : ''} retiré${productIds.length > 1 ? 's' : ''} de la collection`);
    } catch (error) {
      console.error('Error removing products from collection:', error);
      toast.error('Erreur lors de la suppression des produits');
    } finally {
      setSaving(false);
    }
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
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

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Collection non trouvée</h2>
          <p className="text-muted-foreground mt-2">
            La collection demandée n'existe pas.
          </p>
          <Button 
            onClick={() => router.push('/admin/collections')}
            className="mt-4"
          >
            Retour aux collections
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products in Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Produits dans la collection
            </CardTitle>
            <CardDescription>
              <span className="font-bold">{collectionProducts.length}</span> produit{collectionProducts.length > 1 ? 's' : ''} actuellement dans cette collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {collectionProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun produit dans cette collection</p>
                <p className="text-sm">Sélectionnez des produits à ajouter depuis la liste de droite</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {collectionProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name} • {product.price}€
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCollection([product.id])}
                      disabled={saving}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Produits disponibles
            </CardTitle>
            <CardDescription>
              Sélectionnez les produits à ajouter à cette collection
            </CardDescription>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {selectedProducts.size > 0 && (
                <Button
                  onClick={() => addToCollection(Array.from(selectedProducts))}
                  disabled={saving}
                >
                  Ajouter ({selectedProducts.size})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredAvailableProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {searchTerm ? 'Aucun produit trouvé' : 'Tous les produits sont déjà dans cette collection'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAvailableProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Checkbox
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                    />
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name} • {product.price}€
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCollection([product.id])}
                      disabled={saving}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}