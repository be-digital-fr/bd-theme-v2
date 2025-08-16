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
  FolderTree,
} from 'lucide-react';
// Temporary interface for Category
interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder?: number;
  children?: Category[];
  createdAt: Date;
  updatedAt: Date;
}
import { SentryFormErrorCapture } from '@/lib/sentry-form-errors';
import { toast } from 'sonner';

interface CategoryListProps {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function CategoryList({ 
  searchTerm = '', 
  sortBy = 'name', 
  sortOrder = 'asc' 
}: CategoryListProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTotalItems, getPaginationParams, reset } = usePaginationStore();
  
  // Initialize pagination
  useEffect(() => {
    reset(10);
  }, [reset]);

  const { page, limit } = getPaginationParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          hierarchy: 'true',
          page: page.toString(),
          limit: limit.toString(),
          ...(searchTerm && { search: searchTerm }),
          ...(sortBy && { sortBy }),
          ...(sortOrder && { sortOrder }),
        });

        const response = await fetch(`/api/store/categories?${params}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data.success ? data.data || [] : []);
        setTotalItems(data.total || 0);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchTerm, sortBy, sortOrder, page, limit, setTotalItems]);

  // Toggle category active status
  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/store/categories/${categoryId}`, {
        method: 'PATCH',
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
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, isActive: !currentStatus }
            : cat
        )
      );
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/store/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || 'Erreur lors de la suppression');
        
        // Capturer l'erreur avec Sentry
        SentryFormErrorCapture.captureFormError(error, {
          formType: 'delete',
          entityType: 'category',
          entityId: categoryId
        });
        
        throw error;
      }

      // Capturer le succès pour monitoring
      SentryFormErrorCapture.captureFormSuccess({
        formType: 'delete',
        entityType: 'category',
        entityId: categoryId
      });

      // Remove from list
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // Capturer l'erreur si elle n'a pas déjà été capturée
      if (error instanceof Error && !error.message.includes('Erreur lors de la suppression')) {
        SentryFormErrorCapture.captureFormError(error, {
          formType: 'delete',
          entityType: 'category',
          entityId: categoryId
        });
      }
      
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  // Render hierarchical categories
  const renderCategory = (category: Category, level: number = 0) => {
    const indent = level * 24; // 24px per level

    return (
      <>
        <TableRow key={category.id}>
          <TableCell>
            <div className="flex items-center gap-2" style={{ paddingLeft: `${indent}px` }}>
              {level > 0 && (
                <div className="text-muted-foreground">
                  └─
                </div>
              )}
              <FolderTree className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{category.name}</span>
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <div className="text-sm text-muted-foreground max-w-xs truncate">
              {category.description || 'Aucune description'}
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={category.isActive ? 'default' : 'secondary'}>
              {category.isActive ? 'Actif' : 'Inactif'}
            </Badge>
          </TableCell>
          <TableCell className="text-center hidden sm:table-cell">
            {category.displayOrder}
          </TableCell>
          <TableCell className="text-center hidden lg:table-cell">
            {category.children?.length || 0}
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
                  onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/categories/${category.id}/subcategories/create`)}
                >
                  <FolderTree className="mr-2 h-4 w-4" />
                  Ajouter sous-catégorie
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                >
                  {category.isActive ? (
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
                  onClick={() => deleteCategory(category.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        
        {/* Render children recursively */}
        {category.children?.map(child => renderCategory(child, level + 1))}
      </>
    );
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
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Nom</TableHead>
                  <TableHead className="min-w-[250px] hidden md:table-cell">Description</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="text-center min-w-[80px] hidden sm:table-cell">Ordre</TableHead>
                  <TableHead className="text-center min-w-[120px] hidden lg:table-cell">Sous-catégories</TableHead>
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
                    <TableCell>
                      <div className="h-6 bg-muted animate-pulse rounded w-16" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-4 bg-muted animate-pulse rounded w-8 mx-auto" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="h-4 bg-muted animate-pulse rounded w-8 mx-auto" />
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
          <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Nom</TableHead>
              <TableHead className="min-w-[250px] hidden md:table-cell">Description</TableHead>
              <TableHead className="min-w-[100px]">Statut</TableHead>
              <TableHead className="text-center min-w-[80px] hidden sm:table-cell">Ordre</TableHead>
              <TableHead className="text-center min-w-[120px] hidden lg:table-cell">Sous-catégories</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <FolderTree className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Aucune catégorie trouvée pour cette recherche' : 'Aucune catégorie configurée'}
                    </p>
                    {!searchTerm && (
                      <Button 
                        variant="outline" 
                        onClick={() => router.push('/admin/categories/create')}
                      >
                        Créer la première catégorie
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map(category => renderCategory(category))
            )}
          </TableBody>
          </Table>
        </div>
      </div>

      <PaginationControls />
    </div>
  );
}