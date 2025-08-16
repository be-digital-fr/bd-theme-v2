'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { MultilingualStringField } from '@/components/admin/form-builders/field-types/MultilingualStringField';
import { captureIngredientFormError, SentryFormErrorCapture } from '@/lib/sentry-form-errors';

interface CreateIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const COMMON_ALLERGENS = [
  'Gluten',
  'Œufs',
  'Lait',
  'Fruits à coque',
  'Arachides',
  'Soja',
  'Poisson',
  'Crustacés',
  'Mollusques',
  'Céleri',
  'Moutarde',
  'Graines de sésame',
  'Anhydride sulfureux et sulfites',
  'Lupin',
];

export function CreateIngredientDialog({ open, onOpenChange, onSuccess }: CreateIngredientDialogProps) {
  const form = useForm({
    defaultValues: {
      name: {},
      description: {},
      allergens: [] as string[],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      // Configuration multilingue par défaut
      isMultilingual: true,
      supportedLanguages: ['fr', 'en', 'es'],
      defaultLanguage: 'fr',
    }
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    form.reset({
      name: {},
      description: {},
      allergens: [],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isMultilingual: true,
      supportedLanguages: ['fr', 'en', 'es'],
      defaultLanguage: 'fr',
    });
  };

  const handleAllergenToggle = (allergen: string) => {
    const currentAllergens = form.getValues('allergens') || [];
    const newAllergens = currentAllergens.includes(allergen)
      ? currentAllergens.filter(a => a !== allergen)
      : [...currentAllergens, allergen];
    form.setValue('allergens', newAllergens);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    const nameValues = data.name || {};
    const descriptionValues = data.description || {};
    
    // Validation : au moins le nom en français requis
    if (!nameValues.fr?.trim()) {
      SentryFormErrorCapture.captureValidationError([
        { field: 'name.fr', message: 'Nom en français requis', value: nameValues.fr }
      ], {
        formType: 'create',
        entityType: 'ingredient',
        formData: data
      });
      toast.error('Le nom de l\'ingrédient en français est requis');
      return;
    }

    try {
      setLoading(true);

      // Préparer les données pour l'API
      const apiData = {
        // Utiliser le français comme valeur principale
        name: nameValues.fr,
        description: descriptionValues.fr || '',
        // Stocker les traductions dans un champ séparé
        nameTranslations: nameValues,
        descriptionTranslations: descriptionValues,
        allergens: data.allergens,
        isVegetarian: data.isVegetarian,
        isVegan: data.isVegan,
        isGlutenFree: data.isGlutenFree,
      };

      const response = await fetch('/api/store/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || 'Erreur lors de la création');
        
        // Capturer l'erreur avec Sentry
        captureIngredientFormError(error, 'create', undefined, apiData);
        
        throw error;
      }

      // Capturer le succès pour monitoring
      SentryFormErrorCapture.captureFormSuccess({
        formType: 'create',
        entityType: 'ingredient'
      });
      
      toast.success('Ingrédient créé avec succès');
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating ingredient:', error);
      
      // Capturer l'erreur si elle n'a pas déjà été capturée
      if (error instanceof Error && !error.message.includes('Erreur lors de la création')) {
        captureIngredientFormError(error, 'create', undefined, apiData);
      }
      
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel ingrédient</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel ingrédient à votre catalogue avec ses propriétés nutritionnelles et allergènes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <MultilingualStringField
              field={{
                name: 'name',
                type: 'string',
                title: 'Nom de l\'ingrédient',
                description: 'Le nom de l\'ingrédient qui apparaîtra dans le menu',
                validation: { required: true }
              }}
              form={form}
            />

            <MultilingualStringField
              field={{
                name: 'description',
                type: 'text',
                title: 'Description',
                description: 'Décrivez l\'ingrédient, sa provenance, ses caractéristiques'
              }}
              form={form}
            />
          </div>

          {/* Propriétés nutritionnelles */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Propriétés nutritionnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVegetarian"
                  checked={form.watch('isVegetarian')}
                  onCheckedChange={(checked) => form.setValue('isVegetarian', !!checked)}
                />
                <Label htmlFor="isVegetarian" className="text-sm">
                  🥛 Végétarien
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVegan"
                  checked={form.watch('isVegan')}
                  onCheckedChange={(checked) => form.setValue('isVegan', !!checked)}
                />
                <Label htmlFor="isVegan" className="text-sm">
                  🌱 Végan
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isGlutenFree"
                  checked={form.watch('isGlutenFree')}
                  onCheckedChange={(checked) => form.setValue('isGlutenFree', !!checked)}
                />
                <Label htmlFor="isGlutenFree" className="text-sm">
                  🌾 Sans gluten
                </Label>
              </div>
            </div>
          </div>

          {/* Allergènes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Allergènes</Label>
              {form.watch('allergens').length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => form.setValue('allergens', [])}
                >
                  Tout déselectionner
                </Button>
              )}
            </div>

            {/* Allergènes sélectionnés */}
            {form.watch('allergens').length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.watch('allergens').map(allergen => (
                  <Badge key={allergen} variant="destructive" className="cursor-pointer">
                    {allergen}
                    <X 
                      className="h-3 w-3 ml-1" 
                      onClick={() => handleAllergenToggle(allergen)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Liste des allergènes disponibles */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {COMMON_ALLERGENS.map(allergen => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergen-${allergen}`}
                    checked={form.watch('allergens').includes(allergen)}
                    onCheckedChange={() => handleAllergenToggle(allergen)}
                  />
                  <Label 
                    htmlFor={`allergen-${allergen}`} 
                    className="text-sm cursor-pointer"
                  >
                    {allergen}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer l\'ingrédient'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}