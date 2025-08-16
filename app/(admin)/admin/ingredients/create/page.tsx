import { requireAdmin } from '@/lib/auth-actions';
import { CreateIngredientPage } from '@/components/admin/ingredients/CreateIngredientPage';

export default async function CreateIngredientPageRoute() {
  await requireAdmin();
  return <CreateIngredientPage />;
}