import { requireAdmin } from '@/lib/auth-actions';
import { ProductListPage } from '@/components/admin/products/ProductListPage';

export default async function ProductsPage() {
  await requireAdmin();
  return <ProductListPage />;
}