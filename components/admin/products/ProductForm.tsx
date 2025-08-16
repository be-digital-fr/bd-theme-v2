'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useProductForm } from './ProductFormContext';
import { CreateProductSchema } from '@/features/products/domain/schemas/ProductSchemas';

// Import sections
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ImagesSection } from './sections/ImagesSection';
import { CategorySection } from './sections/CategorySection';
import { IngredientsSection } from './sections/IngredientsSection';
import { ExtrasSection } from './sections/ExtrasSection';
import { PricingSection } from './sections/PricingSection';
import { AdvancedSection } from './sections/AdvancedSection';

interface ProductFormTab {
  id: string;
  label: string;
  component: React.ComponentType;
  required?: boolean;
}

const tabs: ProductFormTab[] = [
  { id: 'basic', label: 'Informations', component: BasicInfoSection, required: true },
  { id: 'images', label: 'Images', component: ImagesSection, required: true },
  { id: 'category', label: 'Catégorie', component: CategorySection, required: true },
  { id: 'ingredients', label: 'Ingrédients', component: IngredientsSection },
  { id: 'extras', label: 'Extras', component: ExtrasSection },
  { id: 'pricing', label: 'Prix & Stock', component: PricingSection, required: true },
  { id: 'advanced', label: 'Avancé', component: AdvancedSection },
];

export function ProductForm() {
  const { 
    state, 
    setErrors, 
    resetToOriginal, 
    hasFieldError 
  } = useProductForm();

  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: state.formData,
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState: { errors, isValid } } = form;

  // Sync form data with context
  useEffect(() => {
    reset(state.formData);
  }, [state.formData, reset]);

  // Update validation state in context
  useEffect(() => {
    const errorEntries = Object.entries(errors).map(([field, error]) => [field, error?.message || '']);
    setErrors(Object.fromEntries(errorEntries));
  }, [errors, setErrors]);

  // Get error count per tab
  const getTabErrorCount = useCallback((tabId: string) => {
    const tabFieldPrefixes = {
      basic: ['title', 'shortDescription', 'longDescription', 'preparationTime'],
      images: ['imageUrl'],
      category: ['categoryId'],
      ingredients: ['ingredients'],
      extras: ['extras'],
      pricing: ['price', 'stockQuantity'],
      advanced: ['uberEatsId', 'deliverooId', 'promotionBadge'],
    };

    const fields = tabFieldPrefixes[tabId as keyof typeof tabFieldPrefixes] || [];
    return fields.filter(field => hasFieldError(field)).length;
  }, [hasFieldError]);


  const handleReset = () => {
    resetToOriginal();
    reset();
    toast.info('Formulaire réinitialisé');
  };


  return (
    <div className="space-y-6">
      {/* Status indicators */}
      <div className="flex items-center gap-2 mb-6">
        {state.hasChanges && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Modifications non sauvegardées
          </Badge>
        )}
        
        {state.lastSaved && (
          <Badge variant="outline">
            Sauvegardé à {state.lastSaved.toLocaleTimeString()}
          </Badge>
        )}
      </div>

      {/* Validation Errors Alert */}
      {!state.isValid && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Veuillez corriger les erreurs dans le formulaire avant de sauvegarder.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  {tabs.map((tab) => {
                    const errorCount = getTabErrorCount(tab.id);
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className={cn(
                          "relative",
                          errorCount > 0 && "text-red-600"
                        )}
                      >
                        {tab.label}
                        {tab.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                        {errorCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                          >
                            {errorCount}
                          </Badge>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {tabs.map((tab) => {
                  const TabComponent = tab.component;
                  return (
                    <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                      <TabComponent />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>

    </div>
  );
}