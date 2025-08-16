import { requireAdmin } from '@/lib/auth-actions';
import { CategoryListPage } from '@/components/admin/categories/CategoryListPage';

export default async function CategoriesPage() {
  await requireAdmin();
  return <CategoryListPage />;
}