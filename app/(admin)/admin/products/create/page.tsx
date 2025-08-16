import { requireAdmin } from '@/lib/auth-actions';
import { CreateProductPage } from '@/components/admin/products/CreateProductPage';

export default async function CreateProductPageRoute() {
  await requireAdmin();
  return <CreateProductPage />;
}