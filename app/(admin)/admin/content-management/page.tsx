import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-actions';
import { ContentManagementOverview } from '@/components/admin/ContentManagementOverview';

export const metadata: Metadata = {
  title: 'Gestion de contenu | Admin',
  description: 'Gérez le contenu et les paramètres du site',
};

export default async function ContentManagementPage() {
  await requireAdmin();

  return <ContentManagementOverview />;
}