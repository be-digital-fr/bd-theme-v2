'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormProvider, useProductForm } from './ProductFormContext';
import { ProductForm } from './ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';

function CreateProductContent() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();
  const { 
    state, 
    resetToOriginal, 
    getFormattedData, 
    setSaving, 
    markSaved, 
    setErrors 
  } = useProductForm();

  // Handle save with useCallback to prevent infinite re-renders
  const handleSave = useCallback(async () => {
    setSaving(true);

    try {
      const formattedData = getFormattedData();
      
      const response = await fetch('/api/store/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du produit');
      }

      const result = await response.json();
      
      markSaved();
      // Redirect to product list
      router.push(`/admin/products`);

    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error
    } finally {
      setSaving(false);
    }
  }, [setSaving, getFormattedData, markSaved, router]);

  // Handle back navigation with useCallback
  const handleBack = useCallback(() => {
    if (state.hasChanges) {
      if (confirm('Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?')) {
        router.push('/admin/products');
      }
    } else {
      router.push('/admin/products');
    }
  }, [state.hasChanges, router]);

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Créer un nouveau produit',
      description: 'Ajoutez un nouveau produit à votre catalogue avec toutes ses informations.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Produits', href: '/admin/products' },
        { label: 'Nouveau produit', href: '/admin/products/create' },
      ],
      actions: [
        {
          id: 'back',
          label: 'Retour à la liste',
          variant: 'outline',
          icon: <ArrowLeft className="h-4 w-4" />,
          onClick: handleBack,
        },
        {
          id: 'reset',
          label: 'Réinitialiser',
          variant: 'outline',
          icon: <RotateCcw className="h-4 w-4" />,
          onClick: resetToOriginal,
          disabled: !state.hasChanges || state.isSaving,
        },
        {
          id: 'save',
          label: state.isSaving ? 'Création...' : 'Créer le produit',
          variant: 'default',
          icon: <Save className="h-4 w-4" />,
          onClick: handleSave,
          disabled: !state.isValid || state.isSaving,
          loading: state.isSaving,
        },
      ],
    });

    // Cleanup on unmount
    return () => reset();
  }, [setHeader, reset, state.hasChanges, state.isSaving, state.isValid, resetToOriginal, handleSave, handleBack]);

  return (
    <div className="space-y-6">
      <ProductForm />
    </div>
  );
}

export function CreateProductPage() {
  return (
    <ProductFormProvider isCreateMode={true}>
      <CreateProductContent />
    </ProductFormProvider>
  );
}