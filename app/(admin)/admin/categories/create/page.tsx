import { requireAdmin } from '@/lib/auth-actions';
import { CreateCategoryPage } from '@/components/admin/categories/CreateCategoryPage';

export default async function CreateCategoryPageRoute() {
  await requireAdmin();
  return <CreateCategoryPage />;
}