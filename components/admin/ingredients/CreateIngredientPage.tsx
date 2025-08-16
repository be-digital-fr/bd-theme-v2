'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';
import { Save, ArrowLeft, X, Plus } from 'lucide-react';
import { MultilingualStringField } from '@/components/admin/form-builders/field-types/MultilingualStringField';
import { toast } from 'sonner';

const commonAllergens = [
  'Gluten',
  'Lait',
  'Œufs',
  'Arachides',
  'Fruits à coque',
  'Soja',
  'Poissons',
  'Crustacés',
  'Mollusques',
  'Céleri',
  'Moutarde',
  'Graines de sésame',
  'Anhydride sulfureux',
  'Lupin',
];

export function CreateIngredientPage() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();
  const [saving, setSaving] = useState(false);
  const [customAllergen, setCustomAllergen] = useState('');
  
  const form = useForm({
    defaultValues: {
      name: {},
      description: {},
      allergens: [] as string[],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isRemovable: true,
      additionalPrice: 0,
      isActive: true,
      // Configuration multilingue par défaut
      isMultilingual: true,
      supportedLanguages: ['fr', 'en', 'es'],
      defaultLanguage: 'fr',
    }
  });

  // Handle save with useCallback to prevent infinite re-renders
  const handleSave = form.handleSubmit(async (data) => {
    console.log('Form data received:', data);
    
    const nameValues = data.name || {};
    const descriptionValues = data.description || {};
    
    console.log('Name values:', nameValues);
    console.log('Description values:', descriptionValues);
    
    // Validation : au moins le nom en français requis
    if (!nameValues.fr?.trim()) {
      toast.error('Le nom de l\'ingrédient en français est requis');
      return;
    }

    setSaving(true);

    try {
      // Générer un slug à partir du nom français
      const frenchName = nameValues.fr || '';
      console.log('French name:', frenchName);
      
      const slug = frenchName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .trim();
        
      console.log('Generated slug:', slug);

      // Préparer les données pour l'API
      const ingredientData = {
        // Utiliser le français comme valeur principale
        name: frenchName,
        description: descriptionValues.fr || '',
        // Stocker les traductions dans un champ séparé
        nameTranslations: nameValues,
        descriptionTranslations: descriptionValues,
        allergens: data.allergens.map((allergen: string) => {
          // Convertir les allergènes français vers les valeurs enum anglaises
          const allergenMap: Record<string, string> = {
            'Gluten': 'gluten',
            'Lait': 'lactose',
            'Œufs': 'eggs',
            'Poissons': 'fish',
            'Crustacés': 'crustaceans',
            'Mollusques': 'molluscs',
            'Arachides': 'peanuts',
            'Fruits à coque': 'treeNuts',
            'Soja': 'soy',
            'Céleri': 'celery',
            'Moutarde': 'mustard',
            'Graines de sésame': 'sesame',
            'Anhydride sulfureux': 'sulphites',
            'Lupin': 'lupin'
          };
          return allergenMap[allergen] || allergen.toLowerCase();
        }),
        isVegetarian: data.isVegetarian,
        isVegan: data.isVegan,
        isGlutenFree: data.isGlutenFree,
        isRemovable: data.isRemovable,
        additionalPrice: data.additionalPrice,
        isActive: data.isActive,
      };

      console.log('Données envoyées:', JSON.stringify(ingredientData, null, 2));

      const response = await fetch('/api/store/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      toast.success('Ingrédient créé avec succès');
      router.push('/admin/ingredients');
    } catch (error) {
      console.error('Error creating ingredient:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  });

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/admin/ingredients');
  }, [router]);

  // Add allergen
  const addAllergen = (allergen: string) => {
    const currentAllergens = form.getValues('allergens') || [];
    if (allergen && !currentAllergens.includes(allergen)) {
      form.setValue('allergens', [...currentAllergens, allergen]);
    }
  };

  // Remove allergen
  const removeAllergen = (allergen: string) => {
    const currentAllergens = form.getValues('allergens') || [];
    form.setValue('allergens', currentAllergens.filter(a => a !== allergen));
  };

  // Add custom allergen
  const handleAddCustomAllergen = () => {
    const allergen = customAllergen.trim();
    if (allergen) {
      addAllergen(allergen);
      setCustomAllergen('');
    }
  };

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Nouvel ingrédient',
      description: 'Créez un nouvel ingrédient avec ses allergènes et informations nutritionnelles.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Ingrédients', href: '/admin/ingredients' },
        { label: 'Nouvel ingrédient', href: '/admin/ingredients/create' },
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'ingrédient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <MultilingualStringField
              field={{
                name: 'name',
                type: 'string',
                title: 'Nom de l\'ingrédient',
                description: 'Le nom de l\'ingrédient qui apparaîtra dans les recettes',
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
                description: 'Description optionnelle de l\'ingrédient'
              }}
              form={form}
              disabled={saving}
            />

            {/* Options nutritionnelles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVegetarian"
                  checked={form.watch('isVegetarian')}
                  onCheckedChange={(checked) => form.setValue('isVegetarian', checked)}
                  disabled={saving}
                />
                <Label htmlFor="isVegetarian">
                  Végétarien
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVegan"
                  checked={form.watch('isVegan')}
                  onCheckedChange={(checked) => form.setValue('isVegan', checked)}
                  disabled={saving}
                />
                <Label htmlFor="isVegan">
                  Végan
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isGlutenFree"
                  checked={form.watch('isGlutenFree')}
                  onCheckedChange={(checked) => form.setValue('isGlutenFree', checked)}
                  disabled={saving}
                />
                <Label htmlFor="isGlutenFree">
                  Sans gluten
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isRemovable"
                  checked={form.watch('isRemovable')}
                  onCheckedChange={(checked) => form.setValue('isRemovable', checked)}
                  disabled={saving}
                />
                <Label htmlFor="isRemovable">
                  Peut être retiré
                </Label>
              </div>
            </div>

            {/* Prix supplémentaire */}
            <div className="space-y-2">
              <Label htmlFor="additionalPrice">
                Prix supplémentaire (€)
              </Label>
              <Input
                id="additionalPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.watch('additionalPrice')}
                onChange={(e) => form.setValue('additionalPrice', parseFloat(e.target.value) || 0)}
                disabled={saving}
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={form.watch('isActive')}
                onCheckedChange={(checked) => form.setValue('isActive', checked)}
                disabled={saving}
              />
              <Label htmlFor="isActive">
                Ingrédient actif
              </Label>
            </div>
          </div>

          {/* Allergens */}
          <div className="space-y-4">
            <Label>Allergènes</Label>
            
            {/* Selected allergens */}
            {form.watch('allergens').length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                {form.watch('allergens').map((allergen) => (
                  <Badge key={allergen} variant="destructive" className="pr-1">
                    {allergen}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeAllergen(allergen)}
                      disabled={saving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Common allergens */}
            <div className="space-y-2">
              <Label className="text-sm">Allergènes courants</Label>
              <div className="flex flex-wrap gap-2">
                {commonAllergens.map((allergen) => (
                  <Button
                    key={allergen}
                    variant={form.watch('allergens').includes(allergen) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addAllergen(allergen)}
                    disabled={saving || form.watch('allergens').includes(allergen)}
                  >
                    {allergen}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom allergen */}
            <div className="space-y-2">
              <Label className="text-sm">Ajouter un allergène personnalisé</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de l'allergène..."
                  value={customAllergen}
                  onChange={(e) => setCustomAllergen(e.target.value)}
                  disabled={saving}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAllergen();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomAllergen}
                  disabled={saving || !customAllergen.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}