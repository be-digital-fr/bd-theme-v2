'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaginationStore } from '@/stores/usePaginationStore';
import { PaginationControls } from '@/components/admin/shared/PaginationControls';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChefHat,
  AlertTriangle,
} from 'lucide-react';
import { Ingredient } from '@/features/products/domain/entities/Ingredient';

interface IngredientListProps {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function IngredientList({ 
  searchTerm = '', 
  sortBy = 'name', 
  sortOrder = 'asc' 
}: IngredientListProps) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTotalItems, getPaginationParams, reset } = usePaginationStore();
  
  // Initialize pagination
  useEffect(() => {
    reset(10);
  }, [reset]);

  const { page, limit } = getPaginationParams();

  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(searchTerm && { search: searchTerm }),
          ...(sortBy && { sortBy }),
          ...(sortOrder && { sortOrder }),
        });

        const response = await fetch(`/api/store/ingredients?${params}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setIngredients(data.success ? data.data || [] : []);
        setTotalItems(data.total || 0);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [searchTerm, sortBy, sortOrder, page, limit, setTotalItems]);

  // Toggle ingredient active status
  const toggleIngredientStatus = async (ingredientId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/store/ingredients/${ingredientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Refresh the list
      setIngredients(prev => 
        prev.map(ingredient => 
          ingredient.id === ingredientId 
            ? { ...ingredient, isActive: !currentStatus }
            : ingredient
        )
      );
    } catch (error) {
      console.error('Error toggling ingredient status:', error);
    }
  };

  // Delete ingredient
  const deleteIngredient = async (ingredientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/store/ingredients/${ingredientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Remove from list
      setIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientId));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  // Format allergens for display
  const formatAllergens = (allergens: string[]) => {
    if (!allergens || allergens.length === 0) return null;
    
    return allergens.map(allergen => (
      <Badge key={allergen} variant="destructive" className="mr-1 mb-1">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {allergen}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
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
                  <TableHead className="min-w-[200px]">Nom</TableHead>
                  <TableHead className="min-w-[250px] hidden md:table-cell">Description</TableHead>
                  <TableHead className="min-w-[150px] hidden sm:table-cell">Allergènes</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Prix add.</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Restrictions</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-4 bg-muted animate-pulse rounded w-16" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-muted animate-pulse rounded w-16" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-muted animate-pulse rounded w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 p-4">
        <div className="flex items-center gap-2 text-destructive">
          <span className="font-medium">Erreur de chargement</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
              <TableHead className="min-w-[200px]">Nom</TableHead>
              <TableHead className="min-w-[250px] hidden md:table-cell">Description</TableHead>
              <TableHead className="min-w-[200px] hidden lg:table-cell">Allergènes</TableHead>
              <TableHead className="min-w-[100px]">Statut</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <ChefHat className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Aucun ingrédient trouvé pour cette recherche' : 'Aucun ingrédient configuré'}
                    </p>
                    {!searchTerm && (
                      <Button 
                        variant="outline" 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-create-ingredient-dialog'))}
                      >
                        Créer le premier ingrédient
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{ingredient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {ingredient.description || 'Aucune description'}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {formatAllergens(ingredient.allergens) || (
                        <span className="text-muted-foreground text-sm">Aucun</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ingredient.isActive ? 'default' : 'secondary'}>
                      {ingredient.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/ingredients/${ingredient.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleIngredientStatus(ingredient.id, ingredient.isActive)}
                        >
                          {ingredient.isActive ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteIngredient(ingredient.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </div>
      </div>

      <PaginationControls />
    </div>
  );
}