'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';
import { Save, ArrowLeft } from 'lucide-react';
import { Category } from '@/features/products/domain/entities/Category';
import { MultilingualStringField } from '@/components/admin/form-builders/field-types/MultilingualStringField';
import { toast } from 'sonner';
import { captureCategoryFormError, SentryFormErrorCapture } from '@/lib/sentry-form-errors';

export function CreateCategoryPage() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();
  const [saving, setSaving] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  
  const form = useForm({
    defaultValues: {
      name: {},
      description: {},
      parentId: null,
      displayOrder: 1,
      isActive: true,
      // Configuration multilingue par défaut
      isMultilingual: true,
      supportedLanguages: ['fr', 'en', 'es'],
      defaultLanguage: 'fr',
    }
  });

  // Load parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await fetch('/api/store/categories?activeOnly=true&hierarchy=true');
        if (response.ok) {
          const data = await response.json();
          setParentCategories(data.success ? data.data || [] : []);
        }
      } catch (error) {
        console.error('Error loading parent categories:', error);
      }
    };

    fetchParentCategories();
  }, []);

  // Handle save with useCallback to prevent infinite re-renders
  const handleSave = form.handleSubmit(async (data) => {
    const nameValues = data.name || {};
    const descriptionValues = data.description || {};
    
    // Validation : au moins le nom en français requis
    if (!nameValues.fr?.trim()) {
      const validationError = new Error('Le nom de la catégorie en français est requis');
      SentryFormErrorCapture.captureValidationError([
        { field: 'name.fr', message: 'Nom en français requis', value: nameValues.fr }
      ], {
        formType: 'create',
        entityType: 'category',
        formData: data
      });
      toast.error('Le nom de la catégorie en français est requis');
      return;
    }

    setSaving(true);

    try {
      // Préparer les données pour l'API
      const categoryData = {
        // Utiliser le français comme valeur principale
        name: nameValues.fr,
        description: descriptionValues.fr || '',
        // Stocker les traductions dans un champ séparé
        nameTranslations: nameValues,
        descriptionTranslations: descriptionValues,
        parentId: data.parentId || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      };

      const response = await fetch('/api/store/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || 'Erreur lors de la création');
        
        // Capturer l'erreur avec Sentry
        captureCategoryFormError(error, 'create', undefined, categoryData);
        
        throw error;
      }

      // Capturer le succès pour monitoring
      SentryFormErrorCapture.captureFormSuccess({
        formType: 'create',
        entityType: 'category'
      });

      toast.success('Catégorie créée avec succès');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      
      // Capturer l'erreur si elle n'a pas déjà été capturée
      if (error instanceof Error && !error.message.includes('Erreur lors de la création')) {
        captureCategoryFormError(error, 'create', undefined, categoryData);
      }
      
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  });

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/admin/categories');
  }, [router]);

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Nouvelle catégorie',
      description: 'Créez une nouvelle catégorie pour organiser vos produits.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Catégories', href: '/admin/categories' },
        { label: 'Nouvelle catégorie', href: '/admin/categories/create' },
      ],
      actions: [
        {
          id: 'back',
          label: 'Retour',
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />,
          onClick: handleBack,
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
  }, [setHeader, reset, handleSave, handleBack, saving]);

  // Render parent categories recursively for select
  const renderCategoryOptions = (categories: Category[], level: number = 0): JSX.Element[] => {
    const options: JSX.Element[] = [];
    
    categories.forEach(category => {
      const indent = '─'.repeat(level);
      options.push(
        <SelectItem key={category.id} value={category.id}>
          {level > 0 && `${indent} `}{category.name}
        </SelectItem>
      );
      
      if (category.children && category.children.length > 0) {
        options.push(...renderCategoryOptions(category.children, level + 1));
      }
    });
    
    return options;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de la catégorie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <MultilingualStringField
              field={{
                name: 'name',
                type: 'string',
                title: 'Nom de la catégorie',
                description: 'Le nom de la catégorie qui apparaîtra dans le menu',
                validation: { required: true }
              }}
              form={form}
              disabled={saving}
            />

            <MultilingualStringField
              field={{
                name: 'description',
                type: 'text',
                title: 'Description',
                description: 'Description optionnelle de la catégorie'
              }}
              form={form}
              disabled={saving}
            />

            <div className="space-y-2">
              <Label htmlFor="displayOrder">
                Ordre d'affichage
              </Label>
              <Input
                id="displayOrder"
                type="number"
                min="1"
                value={form.watch('displayOrder')}
                onChange={(e) => form.setValue('displayOrder', parseInt(e.target.value) || 1)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <Label htmlFor="parentId">
              Catégorie parente (optionnel)
            </Label>
            <Select
              value={form.watch('parentId') || 'none'}
              onValueChange={(value) => form.setValue('parentId', value === 'none' ? null : value)}
              disabled={saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie parente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune (catégorie racine)</SelectItem>
                {renderCategoryOptions(parentCategories)}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={(checked) => form.setValue('isActive', checked)}
              disabled={saving}
            />
            <Label htmlFor="isActive">
              Catégorie active
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}