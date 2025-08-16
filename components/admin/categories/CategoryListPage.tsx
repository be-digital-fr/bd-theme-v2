'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryList } from './CategoryList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePageHeader } from '@/components/admin/layout/DashboardHeader';

export function CategoryListPage() {
  const router = useRouter();
  const { setHeader, reset } = usePageHeader();

  // Configure header
  useEffect(() => {
    setHeader({
      title: 'Gestion des catégories',
      description: 'Organisez votre catalogue avec des catégories hiérarchiques.',
      breadcrumbs: [
        { label: 'Administration', href: '/admin' },
        { label: 'Gestion du store', href: '/admin/store' },
        { label: 'Catégories', href: '/admin/categories' },
      ],
      actions: [
        {
          id: 'create-category',
          label: 'Nouvelle catégorie',
          variant: 'default',
          icon: <Plus className="h-4 w-4" />,
          onClick: () => router.push('/admin/categories/create'),
        },
      ],
    });

    // Cleanup on unmount
    return () => reset();
  }, [setHeader, reset, router]);

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Chargement...</div>}>
        <CategoryList />
      </Suspense>
    </div>
  );
}