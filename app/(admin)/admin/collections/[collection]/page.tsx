import { requireAdmin } from '@/lib/auth-actions';
import { CollectionManagePage } from '@/components/admin/collections/CollectionManagePage';
import { notFound } from 'next/navigation';

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

const VALID_COLLECTIONS = ['featured', 'popular', 'trending'];

export default async function CollectionPage({ params }: CollectionPageProps) {
  await requireAdmin();
  
  const { collection } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection)) {
    notFound();
  }
  
  return <CollectionManagePage collection={collection} />;
}

export async function generateStaticParams() {
  return VALID_COLLECTIONS.map((collection) => ({
    collection,
  }));
}