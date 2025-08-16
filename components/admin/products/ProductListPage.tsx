'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProductList } from './ProductList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';

export function ProductListPage() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Gestion des produits',
      description: 'Gérez votre catalogue de produits : créez, modifiez et organisez vos articles.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Produits', href: '/admin/products' },
      ],
      actions: [
        {
          id: 'create-product',
          label: 'Nouveau produit',
          variant: 'default',
          icon: <Plus className="h-4 w-4" />,
          onClick: () => router.push('/admin/products/create'),
        },
      ],
    });

    // Cleanup on unmount
    return () => reset();
  }, [setHeader, reset, router]);

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Chargement...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}