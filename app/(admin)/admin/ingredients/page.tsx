import { requireAdmin } from '@/lib/auth-actions';
import { IngredientListPage } from '@/components/admin/ingredients/IngredientListPage';

export default async function IngredientsPage() {
  await requireAdmin();
  return <IngredientListPage />;
}