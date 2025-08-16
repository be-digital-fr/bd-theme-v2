import { requireAdmin } from '@/lib/auth-actions';
import { CollectionManagerPage } from '@/components/admin/collections/CollectionManagerPage';

export default async function CollectionManagerPageRoute() {
  await requireAdmin();
  return <CollectionManagerPage />;
}