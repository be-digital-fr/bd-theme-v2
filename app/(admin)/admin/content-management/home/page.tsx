import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-actions';
import { HomeContentPage } from '@/components/admin/home-content/HomeContentPage';

export const metadata: Metadata = {
  title: 'Contenu de la page d\'accueil | Administration',
  description: 'Gérez le contenu et l\'apparence de votre page d\'accueil',
};

export default async function AdminHomeContentPage() {
  await requireAdmin();

  return <HomeContentPage />;
}