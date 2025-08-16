'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Plus, 
  Edit,
  Eye,
  Trash2,
  Package,
  Loader2,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { toast } from 'sonner';

import { Product } from '@/features/products/domain/schemas/ProductSchemas';
import { ProductListSkeleton } from './ProductListSkeleton';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/store/products?limit=50');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      // Handle different response structures
      if (result.success && result.data) {
        const products = result.data.products || [];
        console.log('Products loaded:', products.length);
        console.log('First product image URL:', products[0]?.imageUrl);
        setProducts(products);
      } else if (result.products) {
        console.log('Direct products:', result.products.length);
        setProducts(result.products);
      } else {
        setProducts([]);
        console.error('Unexpected response structure:', result);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.shortDescription && product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/store/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }

      // Remove from local state
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchProducts}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Catalogue des produits
              </CardTitle>
              <CardDescription>
                {products.length} produit{products.length > 1 ? 's' : ''} dans votre catalogue
              </CardDescription>
            </div>
            
   
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              {products.length === 0 ? (
                <div className="space-y-4">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Aucun produit</h3>
                    <p className="text-muted-foreground">
                      Votre catalogue est vide.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">
                    Aucun produit ne correspond à votre recherche.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              {/* Scroll indicator */}
              <div className="flex justify-center py-2 text-xs text-muted-foreground border-b bg-muted/30">
                <span className="flex items-center gap-1">
                  ← Faites défiler horizontalement pour voir plus de colonnes →
                </span>
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex-shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.log('Image load error:', product.imageUrl);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                              onLoad={() => console.log('Image loaded:', product.imageUrl)}
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.title}</div>
                          {product.shortDescription && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.shortDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        {product.isFeatured && (
                          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Mise en avant</span>
                          </Badge>
                        )}
                        {product.isPopular && (
                          <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                            <Users className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Populaire</span>
                          </Badge>
                        )}
                        {product.isTrending && (
                          <Badge variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Tendance</span>
                          </Badge>
                        )}
                        {!product.isFeatured && !product.isPopular && !product.isTrending && (
                          <span className="text-muted-foreground text-sm">Aucune</span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {product.category ? (
                        <Badge variant="outline">{product.category.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Non classé</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-medium">{product.price.toFixed(2)} €</span>
                    </TableCell>
                    
                    <TableCell>
                      {product.stockQuantity === 0 ? (
                        <Badge variant="secondary">Illimité</Badge>
                      ) : product.stockQuantity && product.stockQuantity < 10 ? (
                        <Badge variant="destructive">{product.stockQuantity} restant</Badge>
                      ) : (
                        <Badge variant="default">{product.stockQuantity} en stock</Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                        {product.isAvailable ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}