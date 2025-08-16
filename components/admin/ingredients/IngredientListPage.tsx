'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { IngredientList } from './IngredientList';
import { CreateIngredientDialog } from './CreateIngredientDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';

export function IngredientListPage() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for custom event to open dialog
  useEffect(() => {
    const handleOpenDialog = () => setCreateDialogOpen(true);
    window.addEventListener('open-create-ingredient-dialog', handleOpenDialog);
    return () => window.removeEventListener('open-create-ingredient-dialog', handleOpenDialog);
  }, []);

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Gestion des ingrédients',
      description: 'Gérez les ingrédients utilisés dans vos produits avec allergènes et informations nutritionnelles.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Ingrédients', href: '/admin/ingredients' },
      ],
      actions: [
        {
          id: 'create-ingredient',
          label: 'Nouvel ingrédient',
          variant: 'default',
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setCreateDialogOpen(true),
        },
      ],
    });

    // Cleanup on unmount
    return () => reset();
  }, [setHeader, reset, router]);

  const handleIngredientCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Chargement...</div>}>
        <IngredientList key={refreshKey} />
      </Suspense>
      
      <CreateIngredientDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleIngredientCreated}
      />
    </div>
  );
}