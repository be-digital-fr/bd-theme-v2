import { requireAdmin } from '@/lib/auth-actions';
import { CollectionsPage } from '@/components/admin/collections/CollectionsPage';

export default async function Collections() {
  await requireAdmin();
  return <CollectionsPage />;
}