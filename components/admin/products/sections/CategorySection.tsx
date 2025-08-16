'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderTree, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useProductForm } from '../ProductFormContext';
import { Category } from '@/features/products/domain/schemas/ProductSchemas';

export function CategorySection() {
  const form = useFormContext();
  const { updateField, state } = useProductForm();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/store/categories?activeOnly=true&hierarchy=true');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des catégories');
      }
      
      const result = await response.json();
      setCategories(result.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render categories hierarchically
  const renderCategoryOptions = (categoryList: Category[], depth = 0) => {
    return categoryList.map((category) => {
      const indent = '  '.repeat(depth);
      const prefix = depth > 0 ? `${indent}└─ ` : '';
      
      return (
        <div key={category.id}>
          <SelectItem value={category.id}>
            {prefix}{category.name}
          </SelectItem>
          {category.children && category.children.length > 0 && 
            renderCategoryOptions(category.children, depth + 1)
          }
        </div>
      );
    });
  };

  // Find selected category details
  const findCategoryById = (categoryList: Category[], id: string): Category | null => {
    for (const category of categoryList) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedCategory = state.formData.categoryId 
    ? findCategoryById(categories, state.formData.categoryId)
    : null;

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Catégorie du produit
          </CardTitle>
          <CardDescription>
            Sélectionnez la catégorie dans laquelle classer ce produit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Chargement des catégories...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={fetchCategories}>
                Réessayer
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">
                Aucune catégorie disponible. Créez une catégorie avant d'ajouter des produits.
              </p>
              <Link href="/admin/categories/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une catégorie
                </Button>
              </Link>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Catégorie <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      updateField('categoryId', value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderCategoryOptions(categories)}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choisissez la catégorie qui correspond le mieux à votre produit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Selected Category Details */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Catégorie sélectionnée</CardTitle>
            <CardDescription>
              Détails de la catégorie choisie pour ce produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {selectedCategory.name}
              </Badge>
              {selectedCategory.parent && (
                <>
                  <span className="text-muted-foreground">dans</span>
                  <Badge variant="outline" className="text-sm">
                    {selectedCategory.parent.name}
                  </Badge>
                </>
              )}
            </div>

            {selectedCategory.description && (
              <div className="text-sm text-muted-foreground">
                {selectedCategory.description}
              </div>
            )}

            {/* Category hierarchy path */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Chemin de la catégorie</div>
              <div className="text-sm">
                {selectedCategory.parent && (
                  <>
                    <span>{selectedCategory.parent.name}</span>
                    <span className="mx-2 text-muted-foreground">→</span>
                  </>
                )}
                <span className="font-medium">{selectedCategory.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Gérez vos catégories de produits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/admin/categories">
              <Button variant="outline" size="sm">
                <FolderTree className="mr-2 h-4 w-4" />
                Gérer les catégories
              </Button>
            </Link>
            <Link href="/admin/categories/create">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle catégorie
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}